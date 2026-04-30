<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CheckupAppointment;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAppointmentController extends Controller
{
    use LogsActivity;
    public function index()
    {
        $appointments = CheckupAppointment::with(['child', 'requestedBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/Appointments', [
            'appointments' => $appointments,
        ]);
    }

    public function schedule(Request $request, $id)
    {
        $validated = $request->validate([
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'required',
            'location' => 'required|string',
            'admin_notes' => 'nullable|string',
        ]);

        $appointment = CheckupAppointment::findOrFail($id);
        $this->authorize('schedule', $appointment);
        $appointment->update([
            'scheduled_date' => $validated['scheduled_date'],
            'scheduled_time' => $validated['scheduled_time'],
            'location'       => $validated['location'],
            'admin_notes'    => $validated['admin_notes'],
            'status'         => 'scheduled',
            'scheduled_by'   => auth()->id(),
        ]);
        $this->logActivity('update', "Scheduled appointment #{$id}", 'appointment', CheckupAppointment::class, $id);
        return back()->with('success', 'Appointment scheduled successfully!');
    }

    public function complete($id)
    {
        $appointment = CheckupAppointment::findOrFail($id);
        $this->authorize('complete', $appointment);
        $appointment->update(['status' => 'completed', 'completed_at' => now()]);
        $this->logActivity('update', "Completed appointment #{$id}", 'appointment', CheckupAppointment::class, $id);
        return back()->with('success', 'Appointment marked as completed!');
    }

    public function cancel($id)
    {
        $appointment = CheckupAppointment::findOrFail($id);
        $this->authorize('cancel', $appointment);
        $appointment->update(['status' => 'cancelled']);
        $this->logActivity('update', "Cancelled appointment #{$id}", 'appointment', CheckupAppointment::class, $id);
        return back()->with('success', 'Appointment cancelled!');
    }
}
