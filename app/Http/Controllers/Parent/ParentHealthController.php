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
                $healthData        = $child->healthAssessment;
                $immunizations     = [];
                if ($healthData && !empty($healthData->general_notes)) {
                    // general_notes may store immunization JSON — skip, use child_details instead
                }

                // Also check enrollment_requests for immunizations (dates = administered)
                $enrollmentImmunizations = [];
                $enrollment = \DB::table('enrollment_requests')
                    ->where('parent_id', $child->guardian_id)
                    ->where('child_id', $child->id)
                    ->orderBy('created_at', 'desc')
                    ->first();
                if ($enrollment && !empty($enrollment->health_data)) {
                    $hd = is_string($enrollment->health_data) ? json_decode($enrollment->health_data, true) : (array)$enrollment->health_data;
                    $enrollmentImmunizations = $hd['immunizations'] ?? [];
                }

                // Helper: resolve status from multiple sources
                $resolve = function(array $keys) use ($medicalAssessment, $parentVaccinations, $enrollmentImmunizations): string {
                    // 1. Clinical assessment (admin-recorded)
                    foreach ($keys as $k) {
                        $col = strtolower(str_replace(' ', '_', $k)) . '_status';
                        if ($medicalAssessment && isset($medicalAssessment->$col) && $medicalAssessment->$col !== null) {
                            return $medicalAssessment->$col;
                        }
                    }
                    // 2. Parent-submitted Yes/No from child_details.vaccinations
                    foreach ($keys as $k) {
                        if (isset($parentVaccinations[$k])) return $parentVaccinations[$k];
                        if (isset($parentVaccinations[strtolower($k)])) return $parentVaccinations[strtolower($k)];
                        if (isset($parentVaccinations[strtoupper($k)])) return $parentVaccinations[strtoupper($k)];
                    }
                    // 3. Enrollment immunizations (date present = Yes)
                    foreach ($keys as $k) {
                        if (!empty($enrollmentImmunizations[$k])) return 'Yes';
                        if (!empty($enrollmentImmunizations[strtoupper($k)])) return 'Yes';
                    }
                    return 'Unknown';
                };

                $vaccinations = [
                    'bcg'     => $resolve(['BCG', 'bcg']),
                    'dpt'     => $resolve(['DPT', 'dpt']),
                    'polio'   => $resolve(['Polio', 'Oral Polio', 'polio', 'POLIO']),
                    'hepa_b'  => $resolve(['Hepa B', 'hepa_b', 'HEPA_B', 'Hepa_B']),
                    'measles' => $resolve(['Measles', 'measles', 'MEASLES']),
                    'mmr'     => $resolve(['MMR', 'mmr']),
                ];

                $nextVaccine = $this->calculateNextVaccine($child->age, $vaccinations);

                return [
                    'child_id'              => $child->id,
                    'child_name'            => "{$child->first_name} {$child->last_name}",
                    'age'                   => $child->age,
                    'vaccinations'          => $vaccinations,
                    'next_vaccine'          => $nextVaccine,
                    'emergency_alert'       => !empty($medicalAssessment?->emergency_action_conditions),
                    'emergency_description'  => $medicalAssessment?->emergency_action_conditions ?? null,
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
