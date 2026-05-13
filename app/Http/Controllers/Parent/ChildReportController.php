<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\DevelopmentPlan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class ChildReportController extends Controller
{
    public function download(int $childId)
    {
        $child = Child::where('id', $childId)
            ->where('guardian_id', auth()->id())
            ->firstOrFail();

        $growth = DB::table('nutrition_records')
            ->where('child_id', $childId)
            ->whereNotNull('assessment_date')
            ->orderBy('assessment_date', 'asc')
            ->get();

        $observations = DB::table('child_observations')
            ->where('child_id', $childId)
            ->orderBy('created_at', 'asc')
            ->get();

        $plans = DevelopmentPlan::where('child_id', $childId)
            ->orderBy('created_at', 'desc')
            ->get();

        $appointments = DB::table('checkup_appointments')
            ->where('child_id', $childId)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        $barangay = \App\Models\BarangaySetting::allKeyed();

        $pdf = Pdf::loadView('reports.child-progress', compact(
            'child', 'growth', 'observations', 'plans', 'appointments', 'barangay'
        ))->setPaper('a4', 'portrait');

        $filename = 'child-report-' . str($child->first_name)->slug() . '-' . now()->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }
}
