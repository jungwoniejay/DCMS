<?php

namespace App\Policies;

use App\Models\EnrollmentRequest;
use App\Models\User;

class EnrollmentPolicy
{
    public function view(User $user, EnrollmentRequest $enrollment): bool
    {
        return $user->role === 'admin' || $enrollment->parent_id === $user->id;
    }

    public function approve(User $user, EnrollmentRequest $enrollment): bool
    {
        return $user->role === 'admin';
    }

    public function reject(User $user, EnrollmentRequest $enrollment): bool
    {
        return $user->role === 'admin';
    }
}
