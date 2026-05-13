<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Child;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminGrowthDataController extends Controller
{
    public function show($childId)
    {
        $child = Child::findOrFail($childId);
        
        $records = DB::table('nutrition_records')
            ->where('child_id', $childId)
            ->orderBy('assessment_date', 'desc')
            ->get();

        return Inertia::render('admin/AddGrowthData', [
            'child' => $child,
            'records' => $records,
        ]);
    }

    public function store(Request $request, $childId)
    {
        Child::findOrFail($childId);

        $validated = $request->validate([
            'date_taken'          => 'required|date',
            'height'              => 'required|numeric|min:0',
            'weight'              => 'required|numeric|min:0',
            'nutritional_status'  => 'required|string',
        ]);

        DB::table('nutrition_records')->insert([
            'child_id'                 => $childId,
            'assessment_date'          => $validated['date_taken'],
            'height_first'             => $validated['height'],
            'weight_first'             => $validated['weight'],
            'nutritional_status_result'=> $validated['nutritional_status'],
            'created_at'               => now(),
            'updated_at'               => now(),
        ]);

        // Notify parent
        $child = Child::findOrFail($childId);
        if ($child->guardian_id) {
            \App\Models\Notification::send(
                $child->guardian_id,
                'growth_updated',
                '📏 New Growth Record Added',
                "A new measurement has been recorded for {$child->first_name}: Height {$validated['height']}cm, Weight {$validated['weight']}kg, Status: {$validated['nutritional_status']}."
            );
        }

        return back()->with('success', 'Growth measurement added successfully!');
    }
}
