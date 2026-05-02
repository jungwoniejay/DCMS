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
        $childrenIds = Child::where('guardian_id', $parentId)->pluck('id');
        
        $healthData = Child::whereIn('id', $childrenIds)
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
                
                $nextVaccine = $this->calculateNextVaccine($child->age, $medicalAssessment);
                
                return [
                    'child_id' => $child->id,
                    'child_name' => "{$child->first_name} {$child->last_name}",
                    'age' => $child->age,
                    'vaccinations' => [
                        'bcg' => $medicalAssessment?->bcg_status ?? 'Unknown',
                        'dpt' => $medicalAssessment?->dpt_status ?? 'Unknown',
                        'polio' => $medicalAssessment?->polio_status ?? 'Unknown',
                        'hepa_b' => $medicalAssessment?->hepa_b_status ?? 'Unknown',
                        'measles' => $medicalAssessment?->measles_status ?? 'Unknown',
                        'mmr' => $medicalAssessment?->mmr_status ?? 'Unknown',
                    ],
                    'next_vaccine' => $nextVaccine,
                    'emergency_alert' => $medicalAssessment?->requires_emergency_action ?? false,
                    'emergency_description' => $medicalAssessment?->emergency_action_description ?? null,
                    'health_problems' => $healthProblems,
                    'medications' => $medications,
                    'appointments' => $appointments,
                ];
            });
        
        return Inertia::render('parent/Health', [
            'healthData' => $healthData,
        ]);
    }
    
    private function calculateNextVaccine($ageYears, $medicalAssessment)
    {
        if (!$medicalAssessment) return 'BCG - Overdue';
        
        $ageMonths = $ageYears * 12;
        
        if ($medicalAssessment->bcg_status !== 'Yes') return 'BCG - Overdue';
        if ($medicalAssessment->dpt_status !== 'Yes' && $ageMonths >= 2) return 'DPT - Due';
        if ($medicalAssessment->polio_status !== 'Yes' && $ageMonths >= 2) return 'Polio - Due';
        if ($medicalAssessment->hepa_b_status !== 'Yes' && $ageMonths >= 2) return 'Hepa B - Due';
        if ($medicalAssessment->measles_status !== 'Yes' && $ageMonths >= 9) return 'Measles - Due';
        
        return 'Up to date';
    }
}
