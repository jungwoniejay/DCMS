<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PriorExperience;
use App\Models\PerformanceInput;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminExperiencesController extends Controller
{
    public function index()
    {
        $developmentData = [
            'prior_schooling' => $this->getPriorSchooling(),
            'social_interaction' => $this->getSocialInteraction(),
            'home_learning' => $this->getHomeLearning(),
        ];
        
        return Inertia::render('admin/Development', $developmentData);
    }
    
    private function getPriorSchooling()
    {
        return PriorExperience::select(
            DB::raw('SUM(CASE WHEN nursery_type IS NOT NULL THEN 1 ELSE 0 END) as nursery'),
            DB::raw('SUM(CASE WHEN kindergarten_type IS NOT NULL THEN 1 ELSE 0 END) as kindergarten'),
            DB::raw('SUM(CASE WHEN preparatory_type IS NOT NULL THEN 1 ELSE 0 END) as preparatory')
        )->first();
    }
    
    private function getSocialInteraction()
    {
        return PerformanceInput::select(
            DB::raw('SUM(CASE WHEN play_older_siblings IS NOT NULL THEN 1 ELSE 0 END) as with_older_siblings'),
            DB::raw('SUM(CASE WHEN play_younger_siblings IS NOT NULL THEN 1 ELSE 0 END) as with_younger_siblings'),
            DB::raw('SUM(CASE WHEN play_neighbors IS NOT NULL THEN 1 ELSE 0 END) as with_neighbors')
        )->first();
    }
    
    private function getHomeLearning()
    {
        return PerformanceInput::select('learns_at_home_with', DB::raw('count(*) as count'))
            ->whereNotNull('learns_at_home_with')
            ->groupBy('learns_at_home_with')
            ->get();
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
            ->where(function($query) {
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
