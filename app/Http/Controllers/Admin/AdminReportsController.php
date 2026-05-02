<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\FamilyProfile;
use App\Models\HealthAssessment;
use App\Models\MedicalAssessment;
use App\Models\NutritionRecord;
use App\Models\Logistics;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminReportsController extends Controller
{
    public function index()
    {
        $reports = [
            'overview' => $this->getOverviewReport(),
            'demographics' => $this->getDemographicsReport(),
            'health_summary' => $this->getHealthSummaryReport(),
            'nutrition_summary' => $this->getNutritionSummaryReport(),
        ];
        
        return Inertia::render('admin/Reports', ['reports' => $reports]);
    }
    
    private function getOverviewReport()
    {
        return [
            'total_children' => Child::count(),
            'total_families' => FamilyProfile::count(),
            'total_health_assessments' => HealthAssessment::count(),
            'total_nutrition_records' => NutritionRecord::count(),
            'registration_by_month' => Child::select(
                DB::raw("to_char(created_at, 'YYYY-MM') as month"),
                DB::raw('count(*) as count')
            )
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($item) => ['month' => $item->month, 'count' => (int) $item->count])
            ->values()
            ->toArray(),
        ];
    }
    
    private function getDemographicsReport()
    {
        return [
            'gender_distribution' => Child::select('sex', DB::raw('count(*) as count'))
                ->groupBy('sex')
                ->get()
                ->pluck('count', 'sex')
                ->toArray(),
            'age_distribution' => $this->getAgeDistribution(),
            'zone_distribution' => FamilyProfile::select('purok_zone', DB::raw('count(*) as count'))
                ->whereNotNull('purok_zone')
                ->groupBy('purok_zone')
                ->get()
                ->pluck('count', 'purok_zone')
                ->toArray(),
        ];
    }
    
    private function getHealthSummaryReport()
    {
        return [
            'vaccination_rates' => $this->getVaccinationRates(),
            'health_conditions' => $this->getHealthConditionsSummary(),
            'emergency_cases' => MedicalAssessment::whereNotNull('emergency_action_conditions')->count(),
        ];
    }
    
    private function getNutritionSummaryReport()
    {
        return [
            'status_distribution' => NutritionRecord::select('nutritional_status_result', DB::raw('count(*) as count'))
                ->whereNotNull('nutritional_status_result')
                ->groupBy('nutritional_status_result')
                ->get()
                ->pluck('count', 'nutritional_status_result')
                ->toArray(),
            'average_height' => NutritionRecord::whereNotNull('height_first')->avg('height_first'),
            'average_weight' => NutritionRecord::whereNotNull('weight_first')->avg('weight_first'),
        ];
    }
    
    private function getAgeDistribution()
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
    
    private function getVaccinationRates()
    {
        $total = MedicalAssessment::count();
        $vaccines = ['dpt_date', 'bcg_date', 'polio_date', 'mmr_date', 'hepa_b_date', 'measles_date'];
        $rates = [];
        
        foreach ($vaccines as $vaccine) {
            $completed = MedicalAssessment::whereNotNull($vaccine)->count();
            $rates[str_replace('_date', '', $vaccine)] = $total > 0 ? round(($completed / $total) * 100, 1) : 0;
        }
        
        return $rates;
    }
    
    private function getHealthConditionsSummary()
    {
        $result = DB::table('health_problems')
            ->select(
                DB::raw('SUM(CASE WHEN allergies = 1 THEN 1 ELSE 0 END) as allergies'),
                DB::raw('SUM(CASE WHEN asthma = 1 THEN 1 ELSE 0 END) as asthma'),
                DB::raw('SUM(CASE WHEN diabetes = 1 THEN 1 ELSE 0 END) as diabetes'),
                DB::raw('SUM(CASE WHEN ears = 1 THEN 1 ELSE 0 END) as ears'),
                DB::raw('SUM(CASE WHEN eyes = 1 THEN 1 ELSE 0 END) as eyes')
            )
            ->first();

        if (!$result) return [];

        return [
            'Allergies'  => (int) $result->allergies,
            'Asthma'     => (int) $result->asthma,
            'Diabetes'   => (int) $result->diabetes,
            'Ear Issues' => (int) $result->ears,
            'Eye Issues' => (int) $result->eyes,
        ];
    }
    
    public function export($type)
    {
        $allowedTypes = ['children', 'health', 'nutrition'];
        if (!in_array($type, $allowedTypes)) {
            return back()->with('error', 'Invalid export type');
        }

        switch ($type) {
            case 'children': return $this->exportChildren();
            case 'health':   return $this->exportHealth();
            case 'nutrition': return $this->exportNutrition();
        }
    }

    private function sanitizeCsvField(?string $value): string
    {
        if ($value === null) return '';
        // Prevent CSV injection by prefixing dangerous characters
        if (in_array(substr($value, 0, 1), ['=', '+', '-', '@', "\t", "\r"])) {
            $value = "'" . $value;
        }
        return $value;
    }
    
    private function exportChildren()
    {
        $children = Child::with(['fatherProfile', 'motherProfile', 'familyProfile'])->get();

        $csv = "Last Name,First Name,Middle Name,Sex,Age,Birthdate,Address,Zone,Status\n";
        foreach ($children as $child) {
            $csv .= implode(',', array_map(fn($v) => '"' . $this->sanitizeCsvField($v) . '"', [
                $child->last_name, $child->first_name, $child->middle_name,
                $child->sex, (string) $child->age, (string) $child->birthdate,
                $child->address, $child->familyProfile?->purok_zone, $child->registration_status,
            ])) . "\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="children_report.csv"');
    }

    private function exportHealth()
    {
        $assessments = HealthAssessment::with(['child', 'medicalAssessment'])->get();

        $csv = "Child Name,Hospital,Last Checkup,BCG,DPT,Polio,Hepa B,Measles,MMR\n";
        foreach ($assessments as $assessment) {
            $medical = $assessment->medicalAssessment;
            $csv .= implode(',', array_map(fn($v) => '"' . $this->sanitizeCsvField($v) . '"', [
                $assessment->child->first_name . ' ' . $assessment->child->last_name,
                $assessment->hospital_center_name, (string) $assessment->last_checkup_date,
                $medical?->bcg_status, $medical?->dpt_status, $medical?->polio_status,
                $medical?->hepa_b_status, $medical?->measles_status, $medical?->mmr_status,
            ])) . "\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="health_report.csv"');
    }

    private function exportNutrition()
    {
        $records = NutritionRecord::with('child')->get();

        $csv = "Child Name,Date,Height,Weight,Nutritional Status\n";
        foreach ($records as $record) {
            $csv .= implode(',', array_map(fn($v) => '"' . $this->sanitizeCsvField($v) . '"', [
                $record->child->first_name . ' ' . $record->child->last_name,
                (string) $record->date_first, (string) $record->height_first,
                (string) $record->weight_first, $record->nutritional_status_result,
            ])) . "\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="nutrition_report.csv"');
    }
}
