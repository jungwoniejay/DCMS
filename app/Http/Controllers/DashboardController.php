<?php

namespace App\Http\Controllers;

use App\Models\Child;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_children' => Child::count(),
            'pending_registrations' => Child::where('registration_status', 'Pending')->count(),
            'approved_registrations' => Child::where('registration_status', 'Approved')->count(),
            'male_children' => Child::where('sex', 'Male')->count(),
            'female_children' => Child::where('sex', 'Female')->count(),
        ];

        $recentChildren = Child::with(['guardians', 'fatherProfile', 'motherProfile'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentChildren' => $recentChildren
        ]);
    }
}
