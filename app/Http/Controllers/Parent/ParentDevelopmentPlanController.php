<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\DevelopmentPlan;
use Inertia\Inertia;

class ParentDevelopmentPlanController extends Controller
{
    public function index($childId)
    {
        $child = Child::findOrFail($childId);
        
        // Verify parent owns this child
        if ($child->guardian_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }
        
        $plans = DevelopmentPlan::where('child_id', $childId)
            ->with('creator')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('parent/DevelopmentPlans', [
            'child' => $child,
            'plans' => $plans,
        ]);
    }
}
