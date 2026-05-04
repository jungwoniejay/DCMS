<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\HealthAssessment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HealthAssessmentController extends Controller
{
    public function edit(int $childId)
    {
        $child = Child::where('id', $childId)
            ->where('parent_id', auth()->id())
            ->firstOrFail();

        $assessment = HealthAssessment::where('child_id', $childId)->first();

        return Inertia::render('parent/HealthAssessment', [
            'child'      => $child,
            'assessment' => $assessment,
        ]);
    }

    public function store(Request $request, int $childId)
    {
        Child::where('id', $childId)
            ->where('parent_id', auth()->id())
            ->firstOrFail();

        $data = $request->validate([
            'routine_hospital'       => 'nullable|string|max:255',
            'routine_address'        => 'nullable|string|max:255',
            'routine_phone'          => 'nullable|string|max:255',
            'last_checkup_date'      => 'nullable|date',
            'last_checkup_hospital'  => 'nullable|string|max:255',
            'health_problems'        => 'nullable|array',
            'takes_medication'       => 'nullable|string',
            'medication_description' => 'nullable|string',
            'special_treatment'      => 'nullable|string',
            'treatment_type'         => 'nullable|string',
            'serious_accident'       => 'nullable|string',
            'accident_description'   => 'nullable|string',
            'immunizations'          => 'nullable|array',
            'on_medication'          => 'nullable|string',
            'medication_nature'      => 'nullable|string',
        ]);

        $data['child_id'] = $childId;

        HealthAssessment::updateOrCreate(['child_id' => $childId], $data);

        return redirect()->route('parent.children.show', $childId)
            ->with('success', 'Health assessment saved.');
    }
}
