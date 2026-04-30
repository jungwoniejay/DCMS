<?php

namespace App\Http\Controllers;

use App\Models\Child;
use App\Models\HealthAssessment;
use App\Models\HealthProblem;
use App\Models\Medication;
use App\Models\MedicalAssessment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function store(Request $request, Child $child)
    {
        $validated = $request->validate([
            'hospital_center_name' => 'nullable|string|max:255',
            'hospital_center_address' => 'nullable|string|max:255',
            'last_checkup_date' => 'nullable|date',
            'general_notes' => 'nullable|string',
            'health_problems' => 'nullable|array',
            'medications' => 'nullable|array',
            'medical_assessment' => 'nullable|array',
        ]);

        DB::transaction(function () use ($child, $validated) {
            $healthAssessment = $child->healthAssessment()->updateOrCreate(
                ['child_id' => $child->id],
                [
                    'hospital_center_name' => $validated['hospital_center_name'] ?? null,
                    'hospital_center_address' => $validated['hospital_center_address'] ?? null,
                    'last_checkup_date' => $validated['last_checkup_date'] ?? null,
                    'general_notes' => $validated['general_notes'] ?? null,
                ]
            );

            if (isset($validated['health_problems'])) {
                $healthAssessment->healthProblems()->updateOrCreate(
                    ['health_assessment_id' => $healthAssessment->id],
                    $validated['health_problems']
                );
            }

            if (isset($validated['medications'])) {
                $healthAssessment->medications()->delete();
                foreach ($validated['medications'] as $medication) {
                    $healthAssessment->medications()->create($medication);
                }
            }

            if (isset($validated['medical_assessment'])) {
                $healthAssessment->medicalAssessment()->updateOrCreate(
                    ['health_assessment_id' => $healthAssessment->id],
                    $validated['medical_assessment']
                );
            }
        });

        return redirect()->back()->with('success', 'Health assessment saved successfully');
    }
}
