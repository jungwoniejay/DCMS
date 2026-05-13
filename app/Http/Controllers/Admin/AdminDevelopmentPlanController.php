<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DevelopmentPlan;
use App\Models\Child;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDevelopmentPlanController extends Controller
{
    use LogsActivity;
    public function index($childId)
    {
        $child = Child::findOrFail($childId);
        $plans = DevelopmentPlan::where('child_id', $childId)
            ->with('creator')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/DevelopmentPlans', [
            'child' => $child,
            'plans' => $plans,
        ]);
    }

    public function store(Request $request, $childId)
    {
        $validated = $request->validate([
            'plan_type'        => 'required|in:cognitive,physical,social,emotional,language',
            'current_status'   => 'required|string',
            'goals'            => 'required|string',
            'activities'       => 'required|string',
            'resources_needed' => 'nullable|string',
            'target_date'      => 'nullable|date',
        ]);

        $plan = DevelopmentPlan::create([
            'child_id'         => $childId,
            'plan_type'        => $validated['plan_type'],
            'current_status'   => $validated['current_status'],
            'goals'            => $validated['goals'],
            'activities'       => $validated['activities'],
            'resources_needed' => $validated['resources_needed'] ?? null,
            'target_date'      => $validated['target_date'] ?? null,
            'status'           => 'active',
            'created_by'       => auth()->id(),
        ]);

        // Notify parent
        $child = Child::findOrFail($childId);
        if ($child->guardian_id) {
            \App\Models\Notification::send(
                $child->guardian_id,
                'development_plan_added',
                '📋 New Development Plan Created',
                "A new {$validated['plan_type']} development plan has been created for {$child->first_name}. Goal: {$validated['goals']}"
            );
        }

        $this->logActivity('create', "Created development plan for child #{$childId}", 'development_plan', DevelopmentPlan::class, $plan->id);
        return back()->with('success', 'Development plan created successfully!');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'progress_notes' => 'nullable|string',
            'status'         => 'required|in:active,completed,on_hold',
        ]);

        $plan = DevelopmentPlan::findOrFail($id);
        $plan->update($validated);
        // Notify parent if completed
        if ($validated['status'] === 'completed') {
            $child = $plan->child;
            if ($child?->guardian_id) {
                \App\Models\Notification::send(
                    $child->guardian_id,
                    'development_plan_completed',
                    '✅ Development Plan Completed!',
                    "Great news! The {$plan->plan_type} development plan for {$child->first_name} has been marked as completed."
                );
            }
        }
        $this->logActivity('update', "Updated development plan #{$id}", 'development_plan', DevelopmentPlan::class, $id);
        return back()->with('success', 'Development plan updated successfully!');
    }

    public function destroy($id)
    {
        $plan = DevelopmentPlan::findOrFail($id);
        $this->logActivity('delete', "Deleted development plan #{$id}", 'development_plan', DevelopmentPlan::class, $id);
        $plan->delete();
        return back()->with('success', 'Development plan deleted successfully!');
    }
}
