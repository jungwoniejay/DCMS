<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\NutritionRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NutritionFormController extends Controller
{
    public function edit(int $childId)
    {
        $child = Child::where('id', $childId)
            ->where('guardian_id', auth()->id())
            ->firstOrFail();

        $record = NutritionRecord::where('child_id', $childId)->latest()->first();

        return Inertia::render('parent/NutritionForm', [
            'child'  => $child,
            'record' => $record,
        ]);
    }

    public function store(Request $request, int $childId)
    {
        Child::where('id', $childId)
            ->where('guardian_id', auth()->id())
            ->firstOrFail();

        $data = $request->validate([
            'height_first'             => 'nullable|numeric',
            'height_second'            => 'nullable|numeric',
            'weight_first'             => 'nullable|numeric',
            'weight_second'            => 'nullable|numeric',
            'nutritional_status_result'=> 'nullable|string|max:255',
            'date_first'               => 'nullable|date',
            'date_second'              => 'nullable|date',
            'food_allergies'           => 'nullable|string',
            'usual_food'               => 'nullable|string',
            'eating_habit'             => 'nullable|string',
            'uses_bottle'              => 'nullable|string',
            'bottle_frequency'         => 'nullable|string',
            'breakfast_time'           => 'nullable|string',
            'lunch_time'               => 'nullable|string',
        ]);

        $data['child_id'] = $childId;

        NutritionRecord::updateOrCreate(['child_id' => $childId], $data);

        return redirect()->route('parent.children.show', $childId)
            ->with('success', 'Nutrition record saved.');
    }
}
