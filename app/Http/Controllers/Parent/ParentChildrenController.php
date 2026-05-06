<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ParentChildrenController extends Controller
{
    public function index()
    {
        $parentId = auth()->id();

        $children = Child::where('guardian_id', $parentId)
            ->with(['familyProfile', 'fatherProfile', 'motherProfile', 'healthAssessment', 'emergencyContacts', 'logistics', 'childDetails'])
            ->get()
            ->map(function ($child) {
                $latestNutrition = DB::table('nutrition_records')
                    ->where('child_id', $child->id)
                    ->orderBy('created_at', 'desc')
                    ->first();

                $vaccinations = DB::table('medical_assessments')
                    ->join('health_assessments', 'medical_assessments.health_assessment_id', '=', 'health_assessments.id')
                    ->where('health_assessments.child_id', $child->id)
                    ->orderBy('medical_assessments.created_at', 'desc')
                    ->first();

                $latestMedical = $vaccinations;

                // Resolve vaccination status from all sources
                $parentVax = $child->childDetails?->vaccinations ?? [];
                $enrollment = DB::table('enrollment_requests')
                    ->where('parent_id', $child->guardian_id)
                    ->where('child_id', $child->id)
                    ->orderBy('created_at', 'desc')
                    ->first();
                $enrollImmunizations = [];
                if ($enrollment && !empty($enrollment->health_data)) {
                    $hd = is_string($enrollment->health_data) ? json_decode($enrollment->health_data, true) : (array)$enrollment->health_data;
                    $enrollImmunizations = $hd['immunizations'] ?? [];
                }

                $resolveVax = function(array $keys) use ($vaccinations, $parentVax, $enrollImmunizations): string {
                    foreach ($keys as $k) {
                        $col = strtolower(str_replace([' ','-'], '_', $k)) . '_status';
                        if ($vaccinations && isset($vaccinations->$col) && $vaccinations->$col !== null) return $vaccinations->$col;
                    }
                    foreach ($keys as $k) {
                        if (!empty($parentVax[$k])) return $parentVax[$k];
                        if (!empty($parentVax[strtolower($k)])) return $parentVax[strtolower($k)];
                        if (!empty($parentVax[strtoupper($k)])) return $parentVax[strtoupper($k)];
                    }
                    foreach ($keys as $k) {
                        if (!empty($enrollImmunizations[$k])) return 'Yes';
                        if (!empty($enrollImmunizations[strtoupper($k)])) return 'Yes';
                    }
                    return 'Unknown';
                };

                return [
                    'id'                   => $child->id,
                    'full_name'            => trim("{$child->first_name} {$child->middle_name} {$child->last_name}"),
                    'first_name'           => $child->first_name,
                    'last_name'            => $child->last_name,
                    'age'                  => $child->age,
                    'sex'                  => $child->sex,
                    'birthdate'            => $child->birthdate?->format('Y-m-d'),
                    'address'              => $child->address,
                    'status'               => $child->registration_status ?? 'Pending',
                    'zone'                 => $child->familyProfile?->purok_zone ?? 'N/A',
                    'profile_picture'      => $child->profile_picture,
                    'emergency_alert'      => !empty($latestMedical?->emergency_action_conditions),
                    'emergency_description' => $latestMedical?->emergency_action_conditions ?? null,
                    'nutritional_status'   => $latestNutrition?->nutritional_status_result ?? 'Not assessed',
                    'height'               => $latestNutrition?->height_first ?? $child->childDetails?->height_cm ?? null,
                    'weight'               => $latestNutrition?->weight_first ?? $child->childDetails?->weight_kg ?? null,
                    'vaccinations'         => [
                        'bcg'     => $resolveVax(['BCG', 'bcg']),
                        'dpt'     => $resolveVax(['DPT', 'dpt']),
                        'polio'   => $resolveVax(['Polio', 'Oral Polio', 'polio', 'POLIO']),
                        'hepa_b'  => $resolveVax(['Hepa B', 'hepa_b', 'HEPA_B']),
                        'measles' => $resolveVax(['Measles', 'measles', 'MEASLES']),
                    ],
                ];
            });

        return Inertia::render('parent/MyChildren', ['children' => $children]);
    }

    public function show($id)
    {
        $parentId = auth()->id();

        // Authorization: parent can only view their own children
        $child = Child::where('guardian_id', $parentId)
            ->where('id', $id)
            ->with([
                'familyProfile', 'fatherProfile', 'motherProfile',
                'healthAssessment', 'emergencyContacts', 'logistics',
                'siblings', 'priorExperience', 'childDetails',
            ])
            ->firstOrFail();

        $nutritionHistory = DB::table('nutrition_records')
            ->where('child_id', $id)
            ->orderBy('assessment_date', 'desc')
            ->get();

        $medicalAssessment = DB::table('medical_assessments')
            ->join('health_assessments', 'medical_assessments.health_assessment_id', '=', 'health_assessments.id')
            ->where('health_assessments.child_id', $id)
            ->orderBy('medical_assessments.created_at', 'desc')
            ->first();

        $healthProblems = DB::table('health_problems')
            ->join('health_assessments', 'health_problems.health_assessment_id', '=', 'health_assessments.id')
            ->where('health_assessments.child_id', $id)
            ->get();

        $medications = DB::table('medications')
            ->join('health_assessments', 'medications.health_assessment_id', '=', 'health_assessments.id')
            ->where('health_assessments.child_id', $id)
            ->get();

        return Inertia::render('parent/ChildDetail', [
            'child'             => array_merge($child->toArray(), ['profile_picture' => $child->profile_picture]),
            'nutritionHistory'  => $nutritionHistory,
            'medicalAssessment' => $medicalAssessment,
            'healthProblems'    => $healthProblems,
            'medications'       => $medications,
            'childDetail'       => $child->childDetails,
            'healthAssessment'  => $child->healthAssessment,
            'nutritionRecord'   => $child->nutritionRecord,
        ]);
    }
}
