<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\FatherProfile;
use App\Models\MotherProfile;
use App\Models\Guardian;
use App\Models\FamilyProfile;
use App\Models\EmergencyContact;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminParentsController extends Controller
{
    public function fathers()
    {
        $fathers = FatherProfile::with('child')->paginate(15);
        return Inertia::render('admin/parents/Fathers', ['fathers' => $fathers]);
    }

    public function mothers()
    {
        $mothers = MotherProfile::with('child')->paginate(15);
        return Inertia::render('admin/parents/Mothers', ['mothers' => $mothers]);
    }

    public function guardians()
    {
        $guardians = Guardian::with('child')->paginate(15);
        return Inertia::render('admin/parents/Guardians', ['guardians' => $guardians]);
    }

    public function households()
    {
        $households = Child::with([
            'fatherProfile',
            'motherProfile',
            'guardians',
            'familyProfile',
            'emergencyContacts',
            'siblings'
        ])->paginate(15);
        
        return Inertia::render('admin/Households', ['households' => $households]);
    }

    public function emergencyContacts()
    {
        $contacts = EmergencyContact::with('child')->paginate(15);
        return Inertia::render('admin/parents/EmergencyContacts', ['contacts' => $contacts]);
    }

    public function analytics()
    {
        $analytics = [
            'father_education' => FatherProfile::select('educational_attainment', DB::raw('count(*) as count'))
                ->whereNotNull('educational_attainment')
                ->groupBy('educational_attainment')
                ->get()
                ->pluck('count', 'educational_attainment')
                ->toArray(),
            'mother_education' => MotherProfile::select('educational_attainment', DB::raw('count(*) as count'))
                ->whereNotNull('educational_attainment')
                ->groupBy('educational_attainment')
                ->get()
                ->pluck('count', 'educational_attainment')
                ->toArray(),
            'father_occupation' => FatherProfile::select('occupational_status', DB::raw('count(*) as count'))
                ->whereNotNull('occupational_status')
                ->groupBy('occupational_status')
                ->get()
                ->pluck('count', 'occupational_status')
                ->toArray(),
            'mother_occupation' => MotherProfile::select('occupational_status', DB::raw('count(*) as count'))
                ->whereNotNull('occupational_status')
                ->groupBy('occupational_status')
                ->get()
                ->pluck('count', 'occupational_status')
                ->toArray(),
        ];
        
        return Inertia::render('admin/parents/Analytics', ['analytics' => $analytics]);
    }
}
