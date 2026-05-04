<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\EnrollmentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParentEnrollmentController extends Controller
{
    public function create()
    {
        return Inertia::render('parent/EnrollChild', [
            'puroks' => \App\Models\Purok::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'child_last_name'          => 'required|string|max:255',
            'child_first_name'         => 'required|string|max:255',
            'child_middle_name'        => 'nullable|string|max:255',
            'child_sex'                => 'required|in:Male,Female',
            'child_birthdate'          => 'required|date',
            'child_age'                => 'required|integer|min:0|max:10',
            'child_address'            => 'required|string',
            'child_first_language'     => 'required|string|max:255',
            'child_second_language'    => 'nullable|string|max:255',
            'purok_zone'               => 'required|string|max:255',
            'guardian_name'            => 'nullable|string|max:255',
            'guardian_relationship'    => 'nullable|string|max:255',
            'guardian_email'           => 'nullable|email|max:255',
            'guardian_contact'         => 'nullable|string|max:255',
            'emergency_contact_name'   => 'nullable|string|max:255',
            'emergency_contact_phone'  => 'nullable|string|max:255',
            'emergency_home'           => 'nullable|string|max:255',
            'emergency_work'           => 'nullable|string|max:255',
            'accomplished_by'          => 'nullable|string|max:255',
            'accomplished_date'        => 'nullable|date',
            'reviewed_by_name'         => 'nullable|string|max:255',
            'reviewed_date'            => 'nullable|date',
            'father_name'              => 'nullable|string|max:255',
            'father_occupation'        => 'nullable|string|max:255',
            'mother_name'              => 'nullable|string|max:255',
            'mother_occupation'        => 'nullable|string|max:255',
            'father_data'              => 'nullable|string',
            'mother_data'              => 'nullable|string',
            'family_data'              => 'nullable|string',
            'child_photo'              => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('child_photo')) {
            $validated['child_photo'] = $request->file('child_photo')->store('enrollment_photos', 'public');
        }

        foreach (['father_data', 'mother_data', 'family_data'] as $key) {
            if (isset($validated[$key]) && is_string($validated[$key])) {
                $validated[$key] = json_decode($validated[$key], true);
            }
        }

        $validated['parent_id'] = auth()->id();
        $validated['status']    = 'Pending';

        EnrollmentRequest::create($validated);

        return redirect()->route('parent.enrollment.index')->with('success', 'Enrollment request submitted successfully! Waiting for admin approval.');
    }

    public function index()
    {
        $requests = EnrollmentRequest::where('parent_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('parent/EnrollmentRequests', [
            'requests' => $requests,
            'puroks'   => \App\Models\Purok::orderBy('name')->pluck('name'),
        ]);
    }
}
