<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\DevelopmentPlan;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ParentChildDevelopmentController extends Controller
{
    public function index()
    {
        $parentId = auth()->id();

        $children = Child::where('guardian_id', $parentId)
            ->where('registration_status', 'Approved')
            ->get();

        $developmentData = $children->map(function ($child) {
            // Growth history (all nutrition records sorted by date)
            $growthHistory = DB::table('nutrition_records')
                ->where('child_id', $child->id)
                ->whereNotNull('assessment_date')
                ->orderBy('assessment_date', 'asc')
                ->get(['assessment_date', 'height_first', 'weight_first', 'nutritional_status_result']);

            // Behavioral observations grouped by month
            $observations = DB::table('child_observations')
                ->where('child_id', $child->id)
                ->orderBy('created_at', 'asc')
                ->get(['behavior_name', 'observation_count', 'comment', 'created_at']);

            $observationsByMonth = $observations->groupBy(function ($obs) {
                return \Carbon\Carbon::parse($obs->created_at)->format('Y-m');
            })->map(function ($group, $month) {
                $scoreMap = ['1st' => 1, '2nd' => 2, '3rd' => 3, '4th' => 4];
                $avgScore = $group->avg(fn($o) => $scoreMap[$o->observation_count] ?? 1);
                return [
                    'month'       => $month,
                    'label'       => \Carbon\Carbon::parse($month . '-01')->format('M Y'),
                    'avg_score'   => round($avgScore, 2),
                    'count'       => $group->count(),
                    'behaviors'   => $group->pluck('behavior_name')->unique()->values(),
                ];
            })->values();

            // Development plans summary
            $plans = DevelopmentPlan::where('child_id', $child->id)
                ->orderBy('created_at', 'desc')
                ->get(['plan_type', 'status', 'target_date', 'progress_notes', 'created_at']);

            $planSummary = [
                'total'       => $plans->count(),
                'completed'   => $plans->where('status', 'completed')->count(),
                'in_progress' => $plans->where('status', 'in_progress')->count(),
                'pending'     => $plans->where('status', 'pending')->count(),
                'recent'      => $plans->take(3)->map(fn($p) => [
                    'plan_type'      => $p->plan_type,
                    'status'         => $p->status,
                    'target_date'    => $p->target_date,
                    'progress_notes' => $p->progress_notes,
                ]),
            ];

            return [
                'child_id'         => $child->id,
                'child_name'       => "{$child->first_name} {$child->last_name}",
                'age'              => $child->age,
                'sex'              => $child->sex,
                'birthdate'        => $child->birthdate,
                'growth_history'   => $growthHistory->map(fn($r) => [
                    'date'   => $r->assessment_date,
                    'height' => (float) $r->height_first,
                    'weight' => (float) $r->weight_first,
                    'status' => $r->nutritional_status_result,
                ]),
                'observations'     => $observationsByMonth,
                'plan_summary'     => $planSummary,
            ];
        });

        return Inertia::render('parent/ChildDevelopment', [
            'developmentData' => $developmentData,
        ]);
    }
}
