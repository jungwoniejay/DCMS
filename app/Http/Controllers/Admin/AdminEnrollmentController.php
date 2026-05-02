<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EnrollmentRequest;
use App\Models\Child;
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
        $request = EnrollmentRequest::findOrFail($id);
        $this->authorize('approve', $request);

        if ($request->status !== 'Pending') {
            return back()->with('error', 'This request has already been processed.');
        }

        $child = Child::create([
            'guardian_id'         => $request->parent_id,
            'last_name'           => $request->child_last_name,
            'first_name'          => $request->child_first_name,
            'middle_name'         => $request->child_middle_name,
            'sex'                 => $request->child_sex,
            'birthdate'           => $request->child_birthdate,
            'age'                 => $request->child_age,
            'address'             => $request->child_address,
            'first_language'      => $request->child_first_language,
            'second_language'     => $request->child_second_language,
            'profile_picture'     => $request->child_photo,
            'registration_status' => 'Approved',
            'accomplished_by'     => $request->parent->name,
            'reviewed_by'         => auth()->user()->name,
            'reviewed_at'         => now(),
        ]);

        $child->familyProfile()->create(['purok_zone' => $request->purok_zone]);

        $request->update([
            'status'      => 'Approved',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'child_id'    => $child->id,
        ]);

        // Notify parent
        Notification::send(
            $request->parent_id,
            'enrollment_approved',
            '🎉 Enrollment Approved!',
            "Your enrollment request for {$request->child_first_name} {$request->child_last_name} has been approved. Your child has been added to the system.",
            ['child_id' => $child->id, 'child_name' => "{$request->child_first_name} {$request->child_last_name}"]
        );

        $this->logActivity('update', "Approved enrollment for {$request->child_first_name} {$request->child_last_name}", 'enrollment', EnrollmentRequest::class, $request->id);

        return back()->with('success', 'Enrollment approved! Parent has been notified.');
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
