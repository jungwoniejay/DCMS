<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NutritionRecord;
use App\Models\FeedingProfile;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminNutritionController extends Controller
{
    public function index()
    {
        $nutritionData = [
            'status_distribution' => $this->getNutritionalStatusDistribution(),
            'average_measurements' => $this->getAverageMeasurements(),
            'food_allergies' => $this->getFoodAllergies(),
            'records' => NutritionRecord::with('child')->paginate(15),
        ];
        
        return Inertia::render('admin/Nutrition', $nutritionData);
    }
    
    private function getNutritionalStatusDistribution()
    {
        return NutritionRecord::select('nutritional_status_result', DB::raw('count(*) as count'))
            ->whereNotNull('nutritional_status_result')
            ->groupBy('nutritional_status_result')
            ->get()
            ->pluck('count', 'nutritional_status_result')
            ->toArray();
    }
    
    private function getAverageMeasurements()
    {
        return [
            'height_first' => NutritionRecord::whereNotNull('height_first')->avg('height_first'),
            'weight_first' => NutritionRecord::whereNotNull('weight_first')->avg('weight_first'),
            'height_second' => NutritionRecord::whereNotNull('height_second')->avg('height_second'),
            'weight_second' => NutritionRecord::whereNotNull('weight_second')->avg('weight_second'),
        ];
    }
    
    private function getFoodAllergies()
    {
        return FeedingProfile::with('child')
            ->whereNotNull('food_allergies')
            ->where('food_allergies', '!=', '')
            ->limit(10)
            ->get();
    }

    public function summary()
    {
        $summary = [
            'status_distribution' => NutritionRecord::select('nutritional_status_result', DB::raw('count(*) as count'))
                ->whereNotNull('nutritional_status_result')
                ->groupBy('nutritional_status_result')
                ->get()
                ->pluck('count', 'nutritional_status_result')
                ->toArray(),
            'average_height_first' => NutritionRecord::whereNotNull('height_first')->avg('height_first'),
            'average_weight_first' => NutritionRecord::whereNotNull('weight_first')->avg('weight_first'),
            'average_height_second' => NutritionRecord::whereNotNull('height_second')->avg('height_second'),
            'average_weight_second' => NutritionRecord::whereNotNull('weight_second')->avg('weight_second'),
            'total_records' => NutritionRecord::count(),
        ];
        
        return Inertia::render('admin/nutrition/Summary', ['summary' => $summary]);
    }

    public function feeding()
    {
        $profiles = FeedingProfile::with('child')->paginate(15);
        return Inertia::render('admin/nutrition/Feeding', ['profiles' => $profiles]);
    }

    public function allergies()
    {
        $allergies = FeedingProfile::with('child')
            ->whereNotNull('food_allergies')
            ->paginate(15);
        
        return Inertia::render('admin/nutrition/Allergies', ['allergies' => $allergies]);
    }

    public function growthCharts()
    {
        $growthData = NutritionRecord::with('child')
            ->whereNotNull('height_first')
            ->whereNotNull('weight_first')
            ->get()
            ->map(function($record) {
                return [
                    'child_name' => $record->child->first_name . ' ' . $record->child->last_name,
                    'height_first' => $record->height_first,
                    'weight_first' => $record->weight_first,
                    'height_second' => $record->height_second,
                    'weight_second' => $record->weight_second,
                    'date_first' => $record->date_first,
                    'date_second' => $record->date_second,
                ];
            });
        
        return Inertia::render('admin/nutrition/GrowthCharts', ['growthData' => $growthData]);
    }
}
