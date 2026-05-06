<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\EnrollmentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParentEnrollmentController extends Controller
{
    public function create()
    {
        return Inertia::render('parent/EnrollChild', [
            'puroks' => \App\Models\Purok::orderBy('name')->pluck('name'),
            'cities' => \App\Models\City::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'child_last_name'          => 'required|string|max:255',
            'child_first_name'         => 'required|string|max:255',
            'child_middle_name'        => 'nullable|string|max:255',
            'child_sex'                => 'required|in:Male,Female',
            'child_birthdate'          => 'required|date',
            'child_age'                => 'required|integer|min:0|max:20',
            'child_address'            => 'required|string',
            'child_first_language'     => 'required|string|max:255',
            'child_second_language'    => 'nullable|string|max:255',
            'purok_zone'               => 'required|string|max:255',
            'guardian_name'            => 'nullable|string|max:255',
            'guardian_relationship'    => 'nullable|string|max:255',
            'guardian_email'           => 'nullable|email|max:255',
            'guardian_contact'         => 'nullable|string|max:255',
            'emergency_contact_name'   => 'nullable|string|max:255',
            'emergency_contact_phone'  => 'nullable|string|max:255',
            'emergency_home'           => 'nullable|string|max:255',
            'emergency_work'           => 'nullable|string|max:255',
            'child_photo'              => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('child_photo')) {
            $validated['child_photo'] = $request->file('child_photo')->store('enrollment_photos', 'public');
        }

        // Pack father fields into father_data JSON
        $validated['father_data'] = array_filter([
            'last_name'        => $request->father_last_name,
            'first_name'       => $request->father_first_name,
            'middle_name'      => $request->father_middle_name,
            'birthdate'        => $request->father_birthdate,
            'age'              => $request->father_age,
            'civil_status'     => $request->father_civil_status,
            'district'         => $request->father_district,
            'purok'            => $request->father_purok,
            'mother_tongue'    => $request->father_mother_tongue,
            'other_dialects'   => $request->father_other_dialects,
            'education'        => $request->father_education,
            'occupation_status'=> $request->father_occupation_status,
            'occupation'       => $request->father_occupation,
            'contact_home'     => $request->father_contact_home,
            'contact_work'     => $request->father_contact_work,
        ]);

        // Pack mother fields into mother_data JSON
        $validated['mother_data'] = array_filter([
            'last_name'           => $request->mother_last_name,
            'first_name'          => $request->mother_first_name,
            'middle_name'         => $request->mother_middle_name,
            'birthdate'           => $request->mother_birthdate,
            'age'                 => $request->mother_age,
            'pregnant'            => $request->mother_pregnant,
            'civil_status'        => $request->mother_civil_status,
            'district'            => $request->mother_district,
            'purok'               => $request->mother_purok,
            'mother_tongue'       => $request->mother_mother_tongue,
            'other_dialects'      => $request->mother_other_dialects,
            'education'           => $request->mother_education,
            'occupation_status'   => $request->mother_occupation_status,
            'occupation'          => $request->mother_occupation,
            'contact_home'        => $request->mother_contact_home,
            'contact_work'        => $request->mother_contact_work,
            'daycare_age_interest'=> $request->mother_daycare_age_interest,
        ]);

        // Pack family fields into family_data JSON
        $validated['family_data'] = array_filter([
            'home_ownership'        => $request->home_ownership,
            'home_material'         => $request->home_material,
            'home_nature'           => $request->home_nature,
            'home_utilities'        => $request->home_utilities,
            'home_learning'         => $request->home_learning,
            'home_household_members'=> $request->home_household_members,
            'monthly_income'        => $request->monthly_income,
            'no_of_siblings'        => $request->no_of_siblings,
        ]);

        // Pack Form 2 child profile into child_profile_data JSON
        $validated['child_profile_data'] = array_filter([
            'birth_order'          => $request->birth_order,
            'registered'           => $request->registered,
            'born_at'              => $request->born_at,
            'mother_tongue'        => $request->child2_mother_tongue,
            'other_dialects'       => $request->other_dialects,
            'height_cm'            => $request->height_cm,
            'weight_kg'            => $request->weight_kg,
            'eccd_card'            => $request->eccd_card,
            'mother_child_book'    => $request->mother_child_book,
            'vaccinations'         => $request->vaccinations,
            'physical_deformity'   => $request->physical_deformity,
            'problems_with'        => $request->problems_with,
            'left_handed'          => $request->left_handed,
            'siblings'             => $request->siblings,
            'prior_experiences'    => $request->prior_experiences,
            'learns_at_home_with'  => $request->learns_at_home_with,
            'plays_older_siblings' => $request->plays_older_siblings,
            'plays_younger_siblings'=> $request->plays_younger_siblings,
            'plays_neighbors'      => $request->plays_neighbors,
            'meal_before_school'   => $request->meal_before_school,
            'food_normally_eaten'  => $request->food_normally_eaten,
            'has_baon'             => $request->has_baon,
            'travel_time_dcc'      => $request->travel_time_dcc,
            'travel_mode_dcc'      => $request->travel_mode_dcc,
            'travel_time_ncdc'     => $request->travel_time_ncdc,
            'travel_mode_ncdc'     => $request->travel_mode_ncdc,
            'transport_type'       => $request->transport_type,
            'goes_to_school_with'  => $request->goes_to_school_with,
        ]);

        // Pack Form 2 health into health_data JSON
        $validated['health_data'] = array_filter([
            'routine_hospital'      => $request->routine_hospital,
            'routine_address'       => $request->routine_address,
            'routine_phone'         => $request->routine_phone,
            'last_checkup_date'     => $request->last_checkup_date,
            'last_checkup_hospital' => $request->last_checkup_hospital,
            'health_problems'       => $request->health_problems,
            'takes_medication'      => $request->takes_medication,
            'medication_description'=> $request->medication_description,
            'special_treatment'     => $request->special_treatment,
            'treatment_type'        => $request->treatment_type,
            'serious_accident'      => $request->serious_accident,
            'accident_description'  => $request->accident_description,
            'immunizations'         => $request->immunizations,
            'on_medication'         => $request->on_medication,
            'medication_nature'     => $request->medication_nature,
        ]);

        // Pack Form 3 nutrition into nutrition_data JSON
        $validated['nutrition_data'] = array_filter([
            'height_1'             => $request->height_1,
            'height_2'             => $request->height_2,
            'weight_1'             => $request->weight_1,
            'weight_2'             => $request->weight_2,
            'nutritional_status_1' => $request->nutritional_status_1,
            'nutritional_status_2' => $request->nutritional_status_2,
            'date_1'               => $request->date_1,
            'date_2'               => $request->date_2,
            'food_allergies'       => $request->food_allergies,
            'usual_food'           => $request->usual_food,
            'eating_habit'         => $request->eating_habit,
            'uses_bottle'          => $request->uses_bottle,
            'bottle_frequency'     => $request->bottle_frequency,
            'breakfast_time'       => $request->breakfast_time,
            'lunch_time'           => $request->lunch_time,
        ]);

        $validated['parent_id'] = auth()->id();
        $validated['status']    = 'Pending';

        EnrollmentRequest::create($validated);

        return redirect()->route('parent.children.index')->with('success', 'Enrollment request submitted successfully! Waiting for admin approval.');
    }

    public function index()
    {
        $requests = EnrollmentRequest::where('parent_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('parent/EnrollmentRequests', [
            'requests' => $requests,
            'puroks'   => \App\Models\Purok::orderBy('name')->pluck('name'),
        ]);
    }
}
