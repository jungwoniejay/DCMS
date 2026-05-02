<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\FatherProfile;
use App\Models\MotherProfile;
use App\Models\Guardian;
use App\Models\FamilyProfile;
use App\Models\HealthAssessment;
use App\Models\MedicalAssessment;
use App\Models\NutritionRecord;
use App\Models\FeedingProfile;
use App\Models\Logistics;
use App\Models\PriorExperience;
use App\Traits\DbCompatible;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    use DbCompatible;
    public function index()
    {
        $currentYear = now()->year;
        
        $stats = [
            'total_children' => Child::whereYear('created_at', $currentYear)->count(),
            'gender_distribution' => Child::select('sex', DB::raw('count(*) as count'))
                ->groupBy('sex')
                ->get()
                ->pluck('count', 'sex')
                ->toArray(),
            'age_groups' => $this->getAgeGroupDistribution(),
            'registration_status' => Child::select('registration_status', DB::raw('count(*) as count'))
                ->groupBy('registration_status')
                ->get()
                ->pluck('count', 'registration_status')
                ->toArray(),
            'nutritional_status' => NutritionRecord::select('nutritional_status_result', DB::raw('count(*) as count'))
                ->whereNotNull('nutritional_status_result')
                ->groupBy('nutritional_status_result')
                ->get()
                ->pluck('count', 'nutritional_status_result')
                ->toArray(),
            'vaccination_completion' => $this->getVaccinationCompletion(),
            'recent_enrollments' => Child::orderBy('created_at', 'desc')->limit(10)->get(['id', 'first_name', 'last_name', 'sex', 'age', 'registration_status', 'created_at']),
            'health_alerts' => $this->getHealthAlerts(),
            'purok_distribution' => FamilyProfile::select('purok_zone', DB::raw('count(*) as count'))
                ->whereNotNull('purok_zone')
                ->groupBy('purok_zone')
                ->get()
                ->pluck('count', 'purok_zone')
                ->toArray(),
            'monthly_enrollment_trend' => $this->getMonthlyEnrollmentTrend(),
        ];

        return Inertia::render('admin/Dashboard', ['stats' => $stats]);
    }

    private function getAgeGroupDistribution()
    {
        $children = Child::whereNotNull('birthdate')->get();
        $groups = ['0-2' => 0, '3-4' => 0, '5-6' => 0, '7+' => 0];
        
        foreach ($children as $child) {
            $age = now()->diffInYears($child->birthdate);
            if ($age <= 2) $groups['0-2']++;
            elseif ($age <= 4) $groups['3-4']++;
            elseif ($age <= 6) $groups['5-6']++;
            else $groups['7+']++;
        }
        
        return $groups;
    }

    private function getVaccinationCompletion()
    {
        $vaccines = ['dpt_date', 'bcg_date', 'polio_date', 'mmr_date', 'hepa_b_date', 'measles_date'];
        $completion = [];
        
        foreach ($vaccines as $vaccine) {
            $completion[str_replace('_date', '', $vaccine)] = MedicalAssessment::whereNotNull($vaccine)->count();
        }
        
        return $completion;
    }

    private function getHealthAlerts()
    {
        return MedicalAssessment::where(function($query) {
            $query->where('allergy_status', 'Abnormal')
                  ->orWhere('asthma_status', 'Abnormal')
                  ->orWhere('cardiac_status', 'Abnormal')
                  ->orWhere('respiratory_status', 'Abnormal');
        })
        ->with('healthAssessment.child')
        ->limit(10)
        ->get();
    }

    private function getMonthlyEnrollmentTrend()
    {
        return Child::select(
            $this->yearMonthExpr('created_at'),
            DB::raw('count(*) as count')
        )
        ->whereYear('created_at', now()->year)
        ->groupBy('month')
        ->orderBy('month')
        ->get()
        ->map(fn($item) => [
            'month' => date('M Y', strtotime($item->month . '-01')),
            'count' => (int) $item->count,
        ])
        ->toArray();
    }

    public function stats()
    {
        return response()->json([
            'total_children' => Child::count(),
            'pending_approvals' => Child::whereNull('reviewed_by')->count(),
            'recent_enrollments' => Child::where('created_at', '>=', now()->subDays(30))->count(),
            'total_fathers' => FatherProfile::count(),
            'total_mothers' => MotherProfile::count(),
            'total_guardians' => Guardian::count(),
            'total_families' => FamilyProfile::count(),
            'health_assessments' => HealthAssessment::count(),
            'emergency_plans' => MedicalAssessment::whereNotNull('emergency_action_conditions')->count(),
            'nutrition_records' => NutritionRecord::count(),
            'logistics_records' => Logistics::count(),
        ]);
    }
}
