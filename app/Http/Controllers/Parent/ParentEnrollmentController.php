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
            'child_last_name' => 'required|string|max:255',
            'child_first_name' => 'required|string|max:255',
            'child_middle_name' => 'nullable|string|max:255',
            'child_sex' => 'required|in:Male,Female',
            'child_birthdate' => 'required|date',
            'child_age' => 'required|integer|min:0|max:10',
            'child_address' => 'required|string',
            'child_first_language' => 'required|string|max:255',
            'child_second_language' => 'nullable|string|max:255',
            'purok_zone' => 'required|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'father_occupation' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'mother_occupation' => 'nullable|string|max:255',
            'guardian_contact' => 'required|string|max:255',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:255',
        ]);

        $validated['parent_id'] = auth()->id();
        $validated['status'] = 'Pending';

        EnrollmentRequest::create($validated);

        return redirect()->route('parent.dashboard')->with('success', 'Enrollment request submitted successfully! Waiting for admin approval.');
    }

    public function index()
    {
        $requests = EnrollmentRequest::where('parent_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('parent/EnrollmentRequests', [
            'requests' => $requests,
        ]);
    }
}
