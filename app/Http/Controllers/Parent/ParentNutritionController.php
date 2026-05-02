<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ParentNutritionController extends Controller
{
    public function index()
    {
        $parentId = auth()->id();
        $childrenIds = Child::where('guardian_id', $parentId)->pluck('id');
        
        $nutritionData = Child::whereIn('id', $childrenIds)
            ->get()
            ->map(function ($child) {
                $nutritionHistory = DB::table('nutrition_records')
                    ->where('child_id', $child->id)
                    ->orderBy('assessment_date', 'desc')
                    ->get();
                
                $latestNutrition = $nutritionHistory->first();
                
                $feedingProfile = DB::table('feeding_profiles')
                    ->where('child_id', $child->id)
                    ->first();
                
                return [
                    'child_id' => $child->id,
                    'child_name' => "{$child->first_name} {$child->last_name}",
                    'age' => $child->age,
                    'sex' => $child->sex,
                    'current_status' => $latestNutrition?->nutritional_status_result ?? 'Not assessed',
                    'current_height' => $latestNutrition?->height_first ?? null,
                    'current_weight' => $latestNutrition?->weight_first ?? null,
                    'last_measured' => $latestNutrition?->assessment_date ?? null,
                    'history' => $nutritionHistory->map(fn($record) => [
                        'date' => $record->assessment_date,
                        'height' => $record->height_first,
                        'weight' => $record->weight_first,
                        'status' => $record->nutritional_status_result,
                    ]),
                    'food_allergies' => $feedingProfile?->food_allergies ?? null,
                    'eating_habits' => $feedingProfile?->eating_habits ?? null,
                ];
            });
        
        return Inertia::render('parent/Nutrition', [
            'nutritionData' => $nutritionData,
        ]);
    }
}
