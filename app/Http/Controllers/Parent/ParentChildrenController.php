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
            ->with(['familyProfile', 'fatherProfile', 'motherProfile', 'healthAssessment', 'emergencyContacts', 'logistics'])
            ->get()
            ->map(function ($child) {
                $latestNutrition = DB::table('nutrition_records')
                    ->where('child_id', $child->id)
                    ->orderBy('date_taken', 'desc')
                    ->first();

                $vaccinations = DB::table('medical_assessments')
                    ->where('child_id', $child->id)
                    ->orderBy('created_at', 'desc')
                    ->first();

                $latestMedical = DB::table('medical_assessments')
                    ->where('child_id', $child->id)
                    ->orderBy('created_at', 'desc')
                    ->first();

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
                    'emergency_alert'      => $latestMedical?->requires_emergency_action ?? false,
                    'emergency_description'=> $latestMedical?->emergency_action_description ?? null,
                    'nutritional_status'   => $latestNutrition?->nutritional_status ?? 'Not assessed',
                    'height'               => $latestNutrition?->height ?? null,
                    'weight'               => $latestNutrition?->weight ?? null,
                    'vaccinations'         => [
                        'bcg'     => $vaccinations?->bcg_status ?? 'Unknown',
                        'dpt'     => $vaccinations?->dpt_status ?? 'Unknown',
                        'polio'   => $vaccinations?->polio_status ?? 'Unknown',
                        'hepa_b'  => $vaccinations?->hepa_b_status ?? 'Unknown',
                        'measles' => $vaccinations?->measles_status ?? 'Unknown',
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
            ->orderBy('date_taken', 'desc')
            ->get();

        $medicalAssessment = DB::table('medical_assessments')
            ->where('child_id', $id)
            ->orderBy('created_at', 'desc')
            ->first();

        $healthProblems = DB::table('health_problems')
            ->where('child_id', $id)
            ->get();

        $medications = DB::table('medications')
            ->where('child_id', $id)
            ->get();

        return Inertia::render('parent/ChildDetail', [
            'child'            => array_merge($child->toArray(), ['profile_picture' => $child->profile_picture]),
            'nutritionHistory' => $nutritionHistory,
            'medicalAssessment'=> $medicalAssessment,
            'healthProblems'   => $healthProblems,
            'medications'      => $medications,
        ]);
    }
}
