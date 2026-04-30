<?php

namespace App\Policies;

use App\Models\DevelopmentPlan;
use App\Models\User;

class DevelopmentPlanPolicy
{
    public function view(User $user, DevelopmentPlan $plan): bool
    {
        if ($user->role === 'admin') return true;
        return $plan->child->guardian_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user): bool
    {
        return $user->role === 'admin';
    }
}
