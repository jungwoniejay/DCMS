<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\HealthAssessment;
use App\Models\HealthProblem;
use App\Models\MedicalAssessment;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminHealthController extends Controller
{
    public function index()
    {
        $healthData = [
            'vaccination_coverage' => $this->getVaccinationCoverage(),
            'health_conditions' => $this->getHealthConditionsPrevalence(),
            'emergency_plans' => $this->getEmergencyPlans(),
            'assessments' => HealthAssessment::with('child')->paginate(15),
        ];
        
        return Inertia::render('admin/Health', $healthData);
    }
    
    private function getVaccinationCoverage()
    {
        $vaccines = ['dpt_date', 'bcg_date', 'polio_date', 'mmr_date', 'hepa_b_date', 'measles_date'];
        $coverage = [];
        $total = MedicalAssessment::count();
        
        foreach ($vaccines as $vaccine) {
            $completed = MedicalAssessment::whereNotNull($vaccine)->count();
            $coverage[str_replace('_date', '', $vaccine)] = [
                'completed' => $completed,
                'total' => $total,
                'rate' => $total > 0 ? round(($completed / $total) * 100, 1) : 0
            ];
        }
        
        return $coverage;
    }
    
    private function getHealthConditionsPrevalence()
    {
        $conditions = [];
        $totalChildren = Child::count();
        
        $healthProblems = HealthProblem::select(
            DB::raw('SUM(CASE WHEN allergies = true THEN 1 ELSE 0 END) as allergies'),
            DB::raw('SUM(CASE WHEN asthma = true THEN 1 ELSE 0 END) as asthma'),
            DB::raw('SUM(CASE WHEN diabetes = true THEN 1 ELSE 0 END) as diabetes'),
            DB::raw('SUM(CASE WHEN ears = true THEN 1 ELSE 0 END) as ears'),
            DB::raw('SUM(CASE WHEN eyes = true THEN 1 ELSE 0 END) as eyes')
        )->first();
        
        foreach (['allergies', 'asthma', 'diabetes', 'ears', 'eyes'] as $condition) {
            $count = $healthProblems->$condition ?? 0;
            $conditions[$condition] = [
                'cases' => $count,
                'prevalence' => $totalChildren > 0 ? round(($count / $totalChildren) * 100, 1) : 0
            ];
        }
        
        return $conditions;
    }
    
    private function getEmergencyPlans()
    {
        return MedicalAssessment::with('healthAssessment.child')
            ->whereNotNull('emergency_action_conditions')
            ->limit(10)
            ->get();
    }

    public function vaccinations()
    {
        $vaccinations = MedicalAssessment::with('healthAssessment.child')
            ->whereNotNull('dpt_date')
            ->orWhereNotNull('bcg_date')
            ->orWhereNotNull('polio_date')
            ->orWhereNotNull('mmr_date')
            ->orWhereNotNull('hepa_b_date')
            ->orWhereNotNull('measles_date')
            ->paginate(15);
        
        return Inertia::render('admin/health/Vaccinations', ['vaccinations' => $vaccinations]);
    }

    public function conditions()
    {
        $conditions = HealthProblem::with('healthAssessment.child')
            ->where(function($query) {
                $query->where('allergies', true)
                      ->orWhere('asthma', true)
                      ->orWhere('bleeding', true)
                      ->orWhere('bowels', true)
                      ->orWhere('coughing', true)
                      ->orWhere('diabetes', true)
                      ->orWhere('ears', true)
                      ->orWhere('eyes', true)
                      ->orWhere('other', true);
            })
            ->paginate(15);
        
        return Inertia::render('admin/health/Conditions', ['conditions' => $conditions]);
    }

    public function emergencyPlans()
    {
        $plans = MedicalAssessment::with('healthAssessment.child')
            ->whereNotNull('emergency_action_conditions')
            ->paginate(15);
        
        return Inertia::render('admin/health/EmergencyPlans', ['plans' => $plans]);
    }

    public function reports()
    {
        $reports = [
            'total_assessments' => HealthAssessment::count(),
            'vaccination_summary' => [
                'dpt' => MedicalAssessment::whereNotNull('dpt_date')->count(),
                'bcg' => MedicalAssessment::whereNotNull('bcg_date')->count(),
                'polio' => MedicalAssessment::whereNotNull('polio_date')->count(),
                'mmr' => MedicalAssessment::whereNotNull('mmr_date')->count(),
                'hepa_b' => MedicalAssessment::whereNotNull('hepa_b_date')->count(),
                'measles' => MedicalAssessment::whereNotNull('measles_date')->count(),
            ],
            'health_status_summary' => [
                'normal' => MedicalAssessment::where('allergy_status', 'Normal')->count(),
                'abnormal' => MedicalAssessment::where('allergy_status', 'Abnormal')->count(),
                'not_evaluated' => MedicalAssessment::where('allergy_status', 'Not Evaluated')->count(),
            ],
        ];
        
        return Inertia::render('admin/health/Reports', ['reports' => $reports]);
    }
}
