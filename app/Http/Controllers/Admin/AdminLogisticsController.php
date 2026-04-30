<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Logistics;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminLogisticsController extends Controller
{
    public function index()
    {
        $logisticsData = [
            'transportation_modes' => $this->getTransportationModes(),
            'travel_times' => $this->getTravelTimeAnalysis(),
            'accompaniment' => $this->getAccompanimentData(),
            'meal_security' => $this->getMealSecurity(),
        ];
        
        return Inertia::render('admin/Logistics', $logisticsData);
    }
    
    private function getTransportationModes()
    {
        return Logistics::select(
            'travel_mode_dcc',
            DB::raw('count(*) as count'),
            DB::raw('avg(travel_time_dcc_mins) as avg_time')
        )
        ->whereNotNull('travel_mode_dcc')
        ->groupBy('travel_mode_dcc')
        ->get();
    }
    
    private function getTravelTimeAnalysis()
    {
        return [
            'average_dcc' => Logistics::whereNotNull('travel_time_dcc_mins')->avg('travel_time_dcc_mins'),
            'average_ncdc' => Logistics::whereNotNull('travel_time_ncdc_mins')->avg('travel_time_ncdc_mins'),
        ];
    }
    
    private function getAccompanimentData()
    {
        return Logistics::select('goes_to_school_with', DB::raw('count(*) as count'))
            ->whereNotNull('goes_to_school_with')
            ->groupBy('goes_to_school_with')
            ->get();
    }
    
    private function getMealSecurity()
    {
        return [
            'has_meal' => Logistics::where('has_meal_before_school', true)->count(),
            'no_meal' => Logistics::where('has_meal_before_school', false)->count(),
            'has_baon' => Logistics::where('has_baon', true)->count(),
            'no_baon' => Logistics::where('has_baon', false)->count(),
        ];
    }

    public function travelTime()
    {
        $analysis = [
            'average_travel_time_dcc' => Logistics::whereNotNull('travel_time_dcc_mins')->avg('travel_time_dcc_mins'),
            'average_travel_time_ncdc' => Logistics::whereNotNull('travel_time_ncdc_mins')->avg('travel_time_ncdc_mins'),
            'travel_mode_distribution' => Logistics::select('travel_mode_dcc', DB::raw('count(*) as count'))
                ->whereNotNull('travel_mode_dcc')
                ->groupBy('travel_mode_dcc')
                ->get()
                ->pluck('count', 'travel_mode_dcc')
                ->toArray(),
        ];
        
        return Inertia::render('admin/logistics/TravelTime', ['analysis' => $analysis]);
    }

    public function accompaniment()
    {
        $accompaniment = Logistics::select('goes_to_school_with', DB::raw('count(*) as count'))
            ->whereNotNull('goes_to_school_with')
            ->groupBy('goes_to_school_with')
            ->get();
        
        return Inertia::render('admin/logistics/Accompaniment', ['accompaniment' => $accompaniment]);
    }

    public function mealPatterns()
    {
        $patterns = [
            'has_meal_before_school' => Logistics::where('has_meal_before_school', true)->count(),
            'no_meal_before_school' => Logistics::where('has_meal_before_school', false)->count(),
            'food_types' => Logistics::select('food_normally_eaten', DB::raw('count(*) as count'))
                ->whereNotNull('food_normally_eaten')
                ->groupBy('food_normally_eaten')
                ->get()
                ->pluck('count', 'food_normally_eaten')
                ->toArray(),
        ];
        
        return Inertia::render('admin/logistics/MealPatterns', ['patterns' => $patterns]);
    }

    public function baonAnalysis()
    {
        $analysis = [
            'has_baon' => Logistics::where('has_baon', true)->count(),
            'no_baon' => Logistics::where('has_baon', false)->count(),
        ];
        
        return Inertia::render('admin/logistics/BaonAnalysis', ['analysis' => $analysis]);
    }
}
