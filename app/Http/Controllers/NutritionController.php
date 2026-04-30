<?php

namespace App\Http\Controllers;

use App\Models\Child;
use App\Models\NutritionRecord;
use App\Models\FeedingProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NutritionController extends Controller
{
    public function store(Request $request, Child $child)
    {
        $validated = $request->validate([
            'nutrition_record' => 'nullable|array',
            'feeding_profile' => 'nullable|array',
        ]);

        DB::transaction(function () use ($child, $validated) {
            if (isset($validated['nutrition_record'])) {
                $child->nutritionRecord()->updateOrCreate(
                    ['child_id' => $child->id],
                    $validated['nutrition_record']
                );
            }

            if (isset($validated['feeding_profile'])) {
                $child->feedingProfile()->updateOrCreate(
                    ['child_id' => $child->id],
                    $validated['feeding_profile']
                );
            }
        });

        return redirect()->back()->with('success', 'Nutrition information saved successfully');
    }
}
