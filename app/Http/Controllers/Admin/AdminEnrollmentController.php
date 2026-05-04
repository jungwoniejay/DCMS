<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EnrollmentRequest;
use App\Models\Child;
use App\Models\FatherProfile;
use App\Models\MotherProfile;
use App\Models\Guardian;
use App\Models\EmergencyContact;
use App\Models\Notification;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminEnrollmentController extends Controller
{
    use LogsActivity;
    public function index()
    {
        $requests = EnrollmentRequest::with(['parent', 'reviewer'])
            ->orderByRaw("CASE WHEN status = 'Pending' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $stats = [
            'pending'  => EnrollmentRequest::where('status', 'Pending')->count(),
            'approved' => EnrollmentRequest::where('status', 'Approved')->count(),
            'rejected' => EnrollmentRequest::where('status', 'Rejected')->count(),
        ];

        return Inertia::render('admin/Enrollments', [
            'requests' => $requests,
            'stats'    => $stats,
        ]);
    }

    public function approve($id)
    {
        $enrollment = EnrollmentRequest::findOrFail($id);

        if ($enrollment->status !== 'Pending') {
            return back()->with('error', 'This request has already been processed.');
        }

        \DB::beginTransaction();
        try {

        // Create child
        $child = Child::create([
            'guardian_id'         => $enrollment->parent_id,
            'last_name'           => $enrollment->child_last_name,
            'first_name'          => $enrollment->child_first_name,
            'middle_name'         => $enrollment->child_middle_name,
            'sex'                 => $enrollment->child_sex,
            'birthdate'           => $enrollment->child_birthdate,
            'age'                 => $enrollment->child_age,
            'address'             => $enrollment->child_address,
            'first_language'      => $enrollment->child_first_language,
            'second_language'     => $enrollment->child_second_language,
            'profile_picture'     => $enrollment->child_photo,
            'registration_status' => 'Approved',
            'accomplished_by'     => $enrollment->parent->name ?? null,
            'reviewed_by'         => auth()->user()->name,
            'reviewed_at'         => now(),
        ]);

        // Family profile
        $child->familyProfile()->create([
            'purok_zone' => $enrollment->purok_zone,
        ]);

        // Father profile from father_data JSON
        $father = $enrollment->father_data ?? [];
        if (!empty($father['first_name']) || !empty($father['last_name'])) {
            FatherProfile::create([
                'child_id'              => $child->id,
                'first_name'            => $father['first_name'] ?? '',
                'last_name'             => $father['last_name'] ?? '',
                'middle_initial'        => $father['middle_name'] ?? null,
                'date_of_birth'         => $father['birthdate'] ?? null,
                'age'                   => $father['age'] ?? null,
                'civil_status'          => $father['civil_status'] ?? null,
                'district'              => $father['district'] ?? null,
                'purok_zone'            => $father['purok'] ?? null,
                'mother_tongue'         => $father['mother_tongue'] ?? null,
                'other_dialects'        => $father['other_dialects'] ?? null,
                'educational_attainment'=> $father['education'] ?? null,
                'occupational_status'   => $father['occupation'] ?? null,
            ]);
        }

        // Mother profile from mother_data JSON
        $mother = $enrollment->mother_data ?? [];
        if (!empty($mother['first_name']) || !empty($mother['last_name'])) {
            MotherProfile::create([
                'child_id'              => $child->id,
                'first_name'            => $mother['first_name'] ?? '',
                'last_name'             => $mother['last_name'] ?? '',
                'middle_initial'        => $mother['middle_name'] ?? null,
                'date_of_birth'         => $mother['birthdate'] ?? null,
                'age'                   => $mother['age'] ?? null,
                'civil_status'          => $mother['civil_status'] ?? null,
                'district'              => $mother['district'] ?? null,
                'purok_zone'            => $mother['purok'] ?? null,
                'mother_tongue'         => $mother['mother_tongue'] ?? null,
                'other_dialects'        => $mother['other_dialects'] ?? null,
                'educational_attainment'=> $mother['education'] ?? null,
                'occupational_status'   => $mother['occupation'] ?? null,
                'pregnant'              => $mother['pregnant'] ?? null,
                'age_interest_daycare'  => $mother['daycare_age_interest'] ?? null,
            ]);
        }

        // Guardian
        if (!empty($enrollment->guardian_contact) || !empty($enrollment->guardian_name)) {
            $allowedRelationships = ['Father', 'Mother', 'Guardian', 'Other'];
            $relationship = in_array($enrollment->guardian_relationship, $allowedRelationships)
                ? $enrollment->guardian_relationship
                : 'Guardian';
            Guardian::create([
                'child_id'     => $child->id,
                'name'         => $enrollment->guardian_name ?? $enrollment->parent->name ?? '',
                'relationship' => $relationship,
                'email'        => $enrollment->guardian_email ?? null,
                'mobile_phone' => $enrollment->guardian_contact ?? null,
            ]);
        }

        // Emergency contact
        if (!empty($enrollment->emergency_contact_name)) {
            EmergencyContact::create([
                'child_id'     => $child->id,
                'name'         => $enrollment->emergency_contact_name,
                'relationship' => $enrollment->emergency_contact_name,
                'home_phone'   => $enrollment->emergency_home ?? null,
                'work_phone'   => $enrollment->emergency_work ?? null,
                'mobile_phone' => $enrollment->emergency_contact_phone ?? null,
            ]);
        }

        $enrollment->update([
            'status'      => 'Approved',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'child_id'    => $child->id,
        ]);

        Notification::send(
            $enrollment->parent_id,
            'enrollment_approved',
            '🎉 Enrollment Approved!',
            "Your enrollment request for {$enrollment->child_first_name} {$enrollment->child_last_name} has been approved.",
            ['child_id' => $child->id, 'child_name' => "{$enrollment->child_first_name} {$enrollment->child_last_name}"]
        );

        try {
            $this->logActivity('update', "Approved enrollment for {$enrollment->child_first_name} {$enrollment->child_last_name}", 'enrollment', EnrollmentRequest::class, $enrollment->id);
        } catch (\Exception $e) {
            \Log::warning('logActivity failed: ' . $e->getMessage());
        }

        \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Enrollment approve failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to approve enrollment: ' . $e->getMessage());
        }

        return redirect()->route('admin.enrollments')->with('success', 'Enrollment approved! Parent has been notified.');
    }

    public function clearPending()
    {
        $count = EnrollmentRequest::where('status', 'Pending')->count();
        EnrollmentRequest::where('status', 'Pending')->delete();

        $this->logActivity('delete', "Cleared {$count} pending enrollment request(s)", 'enrollment', EnrollmentRequest::class, null);

        return back()->with('success', "{$count} pending enrollment request(s) cleared.");
    }

    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $enrollmentRequest = EnrollmentRequest::findOrFail($id);
        $this->authorize('reject', $enrollmentRequest);

        if ($enrollmentRequest->status !== 'Pending') {
            return back()->with('error', 'This request has already been processed.');
        }

        $enrollmentRequest->update([
            'status'           => 'Rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'reviewed_by'      => auth()->id(),
            'reviewed_at'      => now(),
        ]);

        // Notify parent
        Notification::send(
            $enrollmentRequest->parent_id,
            'enrollment_rejected',
            '❌ Enrollment Not Approved',
            "Your enrollment request for {$enrollmentRequest->child_first_name} {$enrollmentRequest->child_last_name} was not approved. Reason: {$validated['rejection_reason']}",
            ['child_name' => "{$enrollmentRequest->child_first_name} {$enrollmentRequest->child_last_name}", 'reason' => $validated['rejection_reason']]
        );

        $this->logActivity('update', "Rejected enrollment for {$enrollmentRequest->child_first_name} {$enrollmentRequest->child_last_name}", 'enrollment', EnrollmentRequest::class, $enrollmentRequest->id);

        return back()->with('success', 'Enrollment rejected. Parent has been notified.');
    }
}
