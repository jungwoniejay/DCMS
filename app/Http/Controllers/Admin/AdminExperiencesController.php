<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChildDetail;
use App\Models\PriorExperience;
use App\Models\PerformanceInput;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminExperiencesController extends Controller
{
    public function index()
    {
        try {
            $priorSchooling   = $this->getPriorSchooling();
            $socialInteraction = $this->getSocialInteraction();
            $homeLearning     = $this->getHomeLearning();
        } catch (\Exception $e) {
            \Log::error('AdminExperiencesController error: ' . $e->getMessage());
            $priorSchooling    = (object)['nursery' => 0, 'kindergarten' => 0, 'preparatory' => 0];
            $socialInteraction = (object)['with_older_siblings' => 0, 'with_younger_siblings' => 0, 'with_neighbors' => 0];
            $homeLearning      = collect();
        }

        return Inertia::render('admin/Development', [
            'prior_schooling'    => $priorSchooling,
            'social_interaction' => $socialInteraction,
            'home_learning'      => $homeLearning,
        ]);
    }

    private function getPriorSchooling()
    {
        return ChildDetail::select(
            DB::raw("SUM(CASE WHEN prior_experiences::text ILIKE '%Nursery%' THEN 1 ELSE 0 END) as nursery"),
            DB::raw("SUM(CASE WHEN prior_experiences::text ILIKE '%Kindergarten%' THEN 1 ELSE 0 END) as kindergarten"),
            DB::raw("SUM(CASE WHEN prior_experiences::text ILIKE '%Preparatory%' THEN 1 ELSE 0 END) as preparatory")
        )->first();
    }

    private function getSocialInteraction()
    {
        return ChildDetail::select(
            DB::raw("SUM(CASE WHEN plays_older_siblings IN ('Always','Sometimes') THEN 1 ELSE 0 END) as with_older_siblings"),
            DB::raw("SUM(CASE WHEN plays_younger_siblings IN ('Always','Sometimes') THEN 1 ELSE 0 END) as with_younger_siblings"),
            DB::raw("SUM(CASE WHEN plays_neighbors IN ('Always','Sometimes') THEN 1 ELSE 0 END) as with_neighbors")
        )->first();
    }

    private function getHomeLearning()
    {
        $rows = ChildDetail::whereNotNull('learns_at_home_with')->pluck('learns_at_home_with');

        $counts = [];
        foreach ($rows as $val) {
            $items = is_array($val)
                ? $val
                : (json_decode($val, true) ?? array_map('trim', explode(',', $val)));
            foreach ((array) $items as $item) {
                $item = trim((string) $item);
                if ($item) $counts[$item] = ($counts[$item] ?? 0) + 1;
            }
        }

        return collect($counts)->map(fn($count, $key) => [
            'learns_at_home_with' => $key,
            'count'               => $count,
        ])->values();
    }

    public function kindergarten()
    {
        $kindergarten = PriorExperience::with('child')
            ->whereNotNull('kindergarten_type')
            ->paginate(15);

        return Inertia::render('admin/experiences/Kindergarten', ['kindergarten' => $kindergarten]);
    }

    public function preparatory()
    {
        $preparatory = PriorExperience::with('child')
            ->whereNotNull('preparatory_type')
            ->paginate(15);

        return Inertia::render('admin/experiences/Preparatory', ['preparatory' => $preparatory]);
    }

    public function siblings()
    {
        $siblings = PerformanceInput::with('child')
            ->where(function ($query) {
                $query->whereNotNull('play_older_siblings')
                      ->orWhereNotNull('play_younger_siblings');
            })
            ->paginate(15);

        return Inertia::render('admin/experiences/Siblings', ['siblings' => $siblings]);
    }

    public function social()
    {
        $social = PerformanceInput::with('child')
            ->whereNotNull('play_neighbors')
            ->paginate(15);

        return Inertia::render('admin/experiences/Social', ['social' => $social]);
    }

    public function homeLearning()
    {
        $homeLearning = PerformanceInput::with('child')
            ->whereNotNull('learns_at_home_with')
            ->paginate(15);

        return Inertia::render('admin/experiences/HomeLearning', ['homeLearning' => $homeLearning]);
    }
}
