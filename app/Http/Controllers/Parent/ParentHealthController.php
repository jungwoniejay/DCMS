<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ParentHealthController extends Controller
{
    public function index()
    {
        $parentId = auth()->id();

        $healthData = Child::where('guardian_id', $parentId)
            ->with(['childDetails', 'healthAssessment'])
            ->get()
            ->map(function ($child) {
                $medicalAssessment = DB::table('medical_assessments')
                    ->join('health_assessments', 'medical_assessments.health_assessment_id', '=', 'health_assessments.id')
                    ->where('health_assessments.child_id', $child->id)
                    ->orderBy('medical_assessments.created_at', 'desc')
                    ->first();

                $healthProblems = DB::table('health_problems')
                    ->join('health_assessments', 'health_problems.health_assessment_id', '=', 'health_assessments.id')
                    ->where('health_assessments.child_id', $child->id)
                    ->get();

                $medications = DB::table('medications')
                    ->join('health_assessments', 'medications.health_assessment_id', '=', 'health_assessments.id')
                    ->where('health_assessments.child_id', $child->id)
                    ->get();

                $appointments = DB::table('checkup_appointments')
                    ->where('child_id', $child->id)
                    ->orderBy('created_at', 'desc')
                    ->get();

                // Vaccinations: prefer clinical medical_assessments, fall back to parent-submitted child_details
                $parentVaccinations = $child->childDetails?->vaccinations ?? [];
                $vaccinations = [
                    'bcg'     => $medicalAssessment?->bcg_status     ?? ($parentVaccinations['BCG']        ?? ($parentVaccinations['bcg']     ?? 'Unknown')),
                    'dpt'     => $medicalAssessment?->dpt_status     ?? ($parentVaccinations['DPT']        ?? ($parentVaccinations['dpt']     ?? 'Unknown')),
                    'polio'   => $medicalAssessment?->polio_status   ?? ($parentVaccinations['Oral Polio'] ?? ($parentVaccinations['polio']   ?? 'Unknown')),
                    'hepa_b'  => $medicalAssessment?->hepa_b_status  ?? ($parentVaccinations['Hepa B']     ?? ($parentVaccinations['hepa_b']  ?? 'Unknown')),
                    'measles' => $medicalAssessment?->measles_status ?? ($parentVaccinations['Measles']    ?? ($parentVaccinations['measles'] ?? 'Unknown')),
                    'mmr'     => $medicalAssessment?->mmr_status     ?? 'Unknown',
                ];

                $nextVaccine = $this->calculateNextVaccine($child->age, $vaccinations);

                return [
                    'child_id'              => $child->id,
                    'child_name'            => "{$child->first_name} {$child->last_name}",
                    'age'                   => $child->age,
                    'vaccinations'          => $vaccinations,
                    'next_vaccine'          => $nextVaccine,
                    'emergency_alert'       => $medicalAssessment?->requires_emergency_action ?? false,
                    'emergency_description' => $medicalAssessment?->emergency_action_description ?? null,
                    'health_problems'       => $healthProblems,
                    'medications'           => $medications,
                    'appointments'          => $appointments,
                    'last_checkup'          => $child->healthAssessment?->last_checkup_date,
                    'hospital'              => $child->healthAssessment?->hospital_center_name,
                ];
            });

        return Inertia::render('parent/Health', [
            'healthData' => $healthData,
        ]);
    }

    private function calculateNextVaccine(int $ageYears, array $vaccinations): string
    {
        $ageMonths = $ageYears * 12;
        if (($vaccinations['bcg']     ?? 'Unknown') !== 'Yes') return 'BCG - Overdue';
        if (($vaccinations['dpt']     ?? 'Unknown') !== 'Yes' && $ageMonths >= 2) return 'DPT - Due';
        if (($vaccinations['polio']   ?? 'Unknown') !== 'Yes' && $ageMonths >= 2) return 'Polio - Due';
        if (($vaccinations['hepa_b']  ?? 'Unknown') !== 'Yes' && $ageMonths >= 2) return 'Hepa B - Due';
        if (($vaccinations['measles'] ?? 'Unknown') !== 'Yes' && $ageMonths >= 9) return 'Measles - Due';
        return 'Up to date ✓';
    }
}
