<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\CheckupAppointment;
use App\Models\Child;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParentAppointmentController extends Controller
{
    public function index()
    {
        $appointments = CheckupAppointment::where('requested_by', auth()->id())
            ->with('child')
            ->orderBy('created_at', 'desc')
            ->get();

        $children = Child::where('guardian_id', auth()->id())->get(['id', 'first_name', 'last_name']);

        return Inertia::render('parent/Appointments', [
            'appointments' => $appointments,
            'children' => $children,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'child_id' => 'required|exists:children,id',
            'appointment_type' => 'required|in:checkup,vaccination,nutrition_assessment',
            'parent_notes' => 'nullable|string|max:1000',
        ]);

        // Ensure the child belongs to the authenticated parent
        $child = Child::where('id', $validated['child_id'])
            ->where('guardian_id', auth()->id())
            ->firstOrFail();

        CheckupAppointment::create([
            'child_id' => $validated['child_id'],
            'requested_by' => auth()->id(),
            'appointment_type' => $validated['appointment_type'],
            'parent_notes' => $validated['parent_notes'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Appointment request submitted successfully!');
    }
}
