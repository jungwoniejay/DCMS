<?php

namespace App\Policies;

use App\Models\CheckupAppointment;
use App\Models\User;

class AppointmentPolicy
{
    public function view(User $user, CheckupAppointment $appointment): bool
    {
        return $user->role === 'admin' || $appointment->requested_by === $user->id;
    }

    public function schedule(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function complete(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function cancel(User $user, CheckupAppointment $appointment): bool
    {
        return $user->role === 'admin' || $appointment->requested_by === $user->id;
    }
}
