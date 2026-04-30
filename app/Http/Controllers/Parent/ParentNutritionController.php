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
                    ->orderBy('date_taken', 'desc')
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
                    'current_status' => $latestNutrition?->nutritional_status ?? 'Not assessed',
                    'current_height' => $latestNutrition?->height ?? null,
                    'current_weight' => $latestNutrition?->weight ?? null,
                    'last_measured' => $latestNutrition?->date_taken ?? null,
                    'history' => $nutritionHistory->map(fn($record) => [
                        'date' => $record->date_taken,
                        'height' => $record->height,
                        'weight' => $record->weight,
                        'status' => $record->nutritional_status,
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
