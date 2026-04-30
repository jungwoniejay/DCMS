<?php

namespace App\Policies;

use App\Models\Child;
use App\Models\User;

class ChildPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'parent']);
    }

    public function view(User $user, Child $child): bool
    {
        if ($user->role === 'admin') return true;
        return $child->guardian_id === $user->id;
    }

    public function update(User $user, Child $child): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Child $child): bool
    {
        return $user->role === 'admin';
    }

    public function restore(User $user, Child $child): bool
    {
        return $user->role === 'admin';
    }
}
