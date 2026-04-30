<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@brgy2dms.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create Parent User
        User::create([
            'name' => 'Parent User',
            'email' => 'parent@brgy2dms.com',
            'password' => Hash::make('parent123'),
            'role' => 'parent',
            'email_verified_at' => now(),
        ]);
    }
}
