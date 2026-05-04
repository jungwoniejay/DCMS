<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\FamilyProfile;
use App\Traits\LogsActivity;
use App\Traits\DbCompatible;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminChildrenController extends Controller
{
    use LogsActivity, DbCompatible;

    public function index(Request $request)
    {
        $query = Child::with(['guardians', 'fatherProfile', 'motherProfile', 'familyProfile', 'healthAssessment', 'nutritionRecord']);

        if ($request->status === 'pending') {
            $query->where('registration_status', 'Pending');
        } elseif ($request->status === 'approved') {
            $query->where('registration_status', 'Approved');
        } elseif ($request->status === 'rejected') {
            $query->where('registration_status', 'Rejected');
        }

        if ($request->gender) {
            $query->where('sex', $request->gender);
        }

        if ($request->age_group) {
            $ageExpr = $this->ageRawExpr('birthdate');
            switch ($request->age_group) {
                case '0-2':
                    $query->whereRaw("{$ageExpr} <= ?", [2]);
                    break;
                case '3-4':
                    $query->whereRaw("{$ageExpr} BETWEEN ? AND ?", [3, 4]);
                    break;
                case '5-6':
                    $query->whereRaw("{$ageExpr} BETWEEN ? AND ?", [5, 6]);
                    break;
            }
        }

        if ($request->zone) {
            $query->whereHas('familyProfile', function ($q) use ($request) {
                $q->where('purok_zone', $request->zone);
            });
        }

        if ($request->classroom) {
            $query->where('classroom', $request->classroom);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%");
            });
        }

        $allowedSortColumns = ['created_at', 'first_name', 'last_name', 'age', 'sex', 'registration_status'];
        $allowedSortDirs    = ['asc', 'desc'];
        $sortBy  = in_array($request->sort_by, $allowedSortColumns) ? $request->sort_by : 'created_at';
        $sortDir = in_array($request->sort_dir, $allowedSortDirs) ? $request->sort_dir : 'desc';
        $query->orderBy($sortBy, $sortDir);

        $children = $query->paginate(15)->through(function ($child) {
            return [
                'id'                  => $child->id,
                'first_name'          => $child->first_name,
                'last_name'           => $child->last_name,
                'age'                 => $child->age,
                'classroom'           => $child->classroom,
                'sex'                 => $child->sex,
                'profile_picture'     => $child->profile_picture,
                'registration_status' => $child->registration_status,
                'family_profile'      => $child->familyProfile ? [
                    'purok_zone' => $child->familyProfile->purok_zone,
                ] : null,
            ];
        });

        $zones = FamilyProfile::select('purok_zone')
            ->whereNotNull('purok_zone')
            ->distinct()
            ->pluck('purok_zone');

        return Inertia::render('admin/children/Index', [
            'children' => $children,
            'filters'  => $request->only(['status', 'gender', 'age_group', 'zone', 'classroom', 'search', 'sort_by', 'sort_dir']),
            'zones'    => $zones,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/children/Create', [
            'puroks' => \App\Models\Purok::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'last_name'              => 'required|string|max:255',
            'first_name'             => 'required|string|max:255',
            'middle_name'            => 'nullable|string|max:255',
            'sex'                    => 'required|in:Male,Female',
            'birthdate'              => 'required|date|before:today',
            'age'                    => 'required|integer|min:0|max:20',
            'address'                => 'required|string|max:500',
            'first_language'         => 'required|string|max:255',
            'second_language'        => 'nullable|string|max:255',
            'registration_status'    => 'required|in:Pending,Approved,Rejected',
            'purok_zone'             => 'nullable|string|max:255',
            'guardian_name'          => 'nullable|string|max:255',
            'guardian_relationship'  => 'nullable|string|max:255',
            'guardian_mobile'        => 'nullable|string|max:20',
            'guardian_email'         => 'nullable|email|max:255',
            'profile_picture'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $picturePath = null;
        if ($request->hasFile('profile_picture')) {
            $picturePath = $request->file('profile_picture')->store('profile_pictures');
        }

        $child = Child::create([
            'last_name'           => $validated['last_name'],
            'first_name'          => $validated['first_name'],
            'middle_name'         => $validated['middle_name'] ?? null,
            'sex'                 => $validated['sex'],
            'birthdate'           => $validated['birthdate'],
            'age'                 => $validated['age'],
            'address'             => $validated['address'],
            'first_language'      => $validated['first_language'],
            'second_language'     => $validated['second_language'] ?? null,
            'registration_status' => $validated['registration_status'],
            'profile_picture'     => $picturePath,
            'reviewed_by'         => auth()->user()->name,
            'reviewed_at'         => now(),
        ]);

        if (!empty($validated['purok_zone'])) {
            $child->familyProfile()->create(['purok_zone' => $validated['purok_zone']]);
        }

        if (!empty($validated['guardian_name'])) {
            $child->guardians()->create([
                'name'         => $validated['guardian_name'],
                'relationship' => $validated['guardian_relationship'] ?? 'Guardian',
                'mobile_phone' => $validated['guardian_mobile'] ?? null,
                'email'        => $validated['guardian_email'] ?? null,
            ]);
        }

        // Save emergency contact
        if ($request->filled('emergency_name')) {
            $child->emergencyContacts()->create([
                'name'         => $request->emergency_name,
                'relationship' => $request->emergency_relationship ?? null,
                'mobile_phone' => $request->emergency_home ?? null,
            ]);
        }

        // Save father profile
        if ($request->has('father')) {
            $f = is_string($request->father) ? json_decode($request->father, true) : $request->father;
            if (!empty($f['first_name'])) {
                $child->fatherProfile()->create([
                    'last_name'              => $f['last_name'] ?? null,
                    'first_name'             => $f['first_name'],
                    'middle_initial'         => $f['middle_initial'] ?? null,
                    'date_of_birth'          => !empty($f['date_of_birth']) ? $f['date_of_birth'] : null,
                    'age'                    => !empty($f['age']) ? (int)$f['age'] : 0,
                    'civil_status'           => $f['civil_status'] ?? 'Married',
                    'district'               => $f['district'] ?? null,
                    'purok_zone'             => $f['purok_zone'] ?? null,
                    'mother_tongue'          => $f['mother_tongue'] ?? null,
                    'other_dialects'         => $f['other_dialects'] ?? null,
                    'educational_attainment' => $f['educational_attainment'] ?? null,
                    'occupational_status'    => $f['occupational_status'] ?? null,
                ]);
            }
        }

        // Save mother profile
        if ($request->has('mother')) {
            $m = is_string($request->mother) ? json_decode($request->mother, true) : $request->mother;
            if (!empty($m['first_name'])) {
                $child->motherProfile()->create([
                    'last_name'              => $m['last_name'] ?? null,
                    'first_name'             => $m['first_name'],
                    'middle_initial'         => $m['middle_initial'] ?? null,
                    'date_of_birth'          => !empty($m['date_of_birth']) ? $m['date_of_birth'] : null,
                    'age'                    => !empty($m['age']) ? (int)$m['age'] : 0,
                    'civil_status'           => $m['civil_status'] ?? 'Married',
                    'district'               => $m['district'] ?? null,
                    'purok_zone'             => $m['purok_zone'] ?? null,
                    'mother_tongue'          => $m['mother_tongue'] ?? null,
                    'other_dialects'         => $m['other_dialects'] ?? null,
                    'educational_attainment' => $m['educational_attainment'] ?? null,
                    'occupational_status'    => $m['occupational_status'] ?? null,
                    'pregnant'               => filter_var($m['pregnant'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'age_interest_daycare'   => $m['age_interest_daycare'] ?? null,
                ]);
            }
        }

        // Save family profile
        if ($request->has('family')) {
            $fam = is_string($request->family) ? json_decode($request->family, true) : $request->family;
            $boolFields = ['one_room','multiple_rooms','has_toilet','has_bedroom','has_dining','has_sala','has_kitchen','open_play_area','running_water','electricity','aircon','mobile_phone','computer','internet','cd_dvd','tv','radio','magazines','books','newspapers','storybooks','board_games','puzzles','pets','toys'];
            $famData = ['purok_zone' => $validated['purok_zone'] ?? null, 'ownership' => $fam['ownership'] ?? null, 'materials' => $fam['materials'] ?? null];
            foreach ($boolFields as $bf) { $famData[$bf] = filter_var($fam[$bf] ?? false, FILTER_VALIDATE_BOOLEAN); }
            if ($child->familyProfile) {
                $child->familyProfile->update($famData);
            } else {
                $child->familyProfile()->create($famData);
            }
        }

        $this->logCreate(Child::class, $child, "Created child record: {$child->first_name} {$child->last_name}");

        return redirect()->route('admin.children.show', $child->id)
            ->with('success', 'Child record created successfully!');
    }

    public function show($id)
    {
        $child = Child::with([
            'guardians', 'emergencyContacts', 'fatherProfile', 'motherProfile',
            'familyProfile', 'childDetails', 'siblings', 'priorExperience',
            'performanceInput', 'logistics', 'healthAssessment.healthProblems',
            'healthAssessment.medications', 'healthAssessment.medicalAssessment',
            'nutritionRecord', 'feedingProfile', 'childCareInformation',
            'childObservations', 'parentInvolvement',
        ])->findOrFail($id);

        $this->logView(Child::class, $child, "Viewed child record: {$child->first_name} {$child->last_name}");

        return Inertia::render('admin/children/Show', ['child' => $child]);
    }

    public function edit($id)
    {
        $child = Child::with([
            'guardians', 'emergencyContacts', 'fatherProfile', 'motherProfile',
            'familyProfile', 'childDetails', 'siblings', 'priorExperience',
            'performanceInput', 'logistics',
        ])->findOrFail($id);

        return Inertia::render('admin/children/Edit', [
            'child'  => $child,
            'puroks' => \App\Models\Purok::orderBy('name')->pluck('name'),
        ]);
    }

    public function update(Request $request, $id)
    {
        $child = Child::findOrFail($id);

        $guardians         = is_string($request->guardians) ? json_decode($request->guardians, true) : ($request->guardians ?? []);
        $emergencyContacts = is_string($request->emergency_contacts) ? json_decode($request->emergency_contacts, true) : ($request->emergency_contacts ?? []);
        $father            = is_string($request->father) ? json_decode($request->father, true) : ($request->father ?? []);
        $mother            = is_string($request->mother) ? json_decode($request->mother, true) : ($request->mother ?? []);
        $family            = is_string($request->family) ? json_decode($request->family, true) : ($request->family ?? []);

        $validated = $request->validate([
            'last_name'           => 'required|string|max:255',
            'first_name'          => 'required|string|max:255',
            'middle_name'         => 'nullable|string|max:255',
            'sex'                 => 'required|in:Male,Female',
            'profile_picture'     => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'birthdate'           => 'required|date|before:today',
            'age'                 => 'required|integer|min:0|max:20',
            'address'             => 'required|string|max:500',
            'first_language'      => 'required|string|max:255',
            'second_language'     => 'nullable|string|max:255',
            'registration_status' => 'nullable|in:Pending,Approved,Rejected,pending,approved,rejected',
        ]);

        if ($request->hasFile('profile_picture')) {
            if ($child->profile_picture && \Storage::exists($child->profile_picture)) {
                \Storage::delete($child->profile_picture);
            }
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures');
        }

        $oldValues = $child->only(['first_name', 'last_name', 'sex', 'birthdate', 'registration_status']);

        $updateData = [
            'last_name'           => $validated['last_name'],
            'first_name'          => $validated['first_name'],
            'middle_name'         => $validated['middle_name'] ?? null,
            'sex'                 => $validated['sex'],
            'birthdate'           => $validated['birthdate'],
            'age'                 => $validated['age'],
            'address'             => $validated['address'],
            'first_language'      => $validated['first_language'],
            'second_language'     => $validated['second_language'] ?? null,
            'registration_status' => $validated['registration_status']
                ? ucfirst(strtolower($validated['registration_status']))
                : null,
        ];

        if (isset($validated['profile_picture'])) {
            $updateData['profile_picture'] = $validated['profile_picture'];
        }

        $child->update($updateData);

        if (!empty($guardians)) {
            foreach ($guardians as $g) {
                if (isset($g['id'])) {
                    \DB::table('guardians')->where('id', $g['id'])->update([
                        'name' => $g['name'] ?? null, 'relationship' => $g['relationship'] ?? null,
                        'email' => $g['email'] ?? null, 'mobile_phone' => $g['mobile_phone'] ?? null,
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        if (!empty($emergencyContacts)) {
            foreach ($emergencyContacts as $c) {
                if (isset($c['id'])) {
                    \DB::table('emergency_contacts')->where('id', $c['id'])->update([
                        'name' => $c['name'] ?? null, 'relationship' => $c['relationship'] ?? null,
                        'mobile_phone' => $c['mobile_phone'] ?? null, 'updated_at' => now(),
                    ]);
                }
            }
        }

        if (!empty($father) && isset($father['id'])) {
            \DB::table('father_profiles')->where('id', $father['id'])->update([
                'first_name' => $father['first_name'] ?? null, 'last_name' => $father['last_name'] ?? null,
                'age' => $father['age'] ?? null, 'occupational_status' => $father['occupational_status'] ?? null,
                'updated_at' => now(),
            ]);
        }

        if (!empty($mother) && isset($mother['id'])) {
            \DB::table('mother_profiles')->where('id', $mother['id'])->update([
                'first_name' => $mother['first_name'] ?? null, 'last_name' => $mother['last_name'] ?? null,
                'age' => $mother['age'] ?? null, 'occupational_status' => $mother['occupational_status'] ?? null,
                'updated_at' => now(),
            ]);
        }

        if (!empty($family) && isset($family['id'])) {
            \DB::table('family_profiles')->where('id', $family['id'])->update([
                'home_ownership' => $family['home_ownership'] ?? null,
                'purok_zone'     => $family['purok_zone'] ?? null,
                'home_materials' => $family['home_materials'] ?? null,
                'electricity'    => $family['electricity'] ?? false,
                'running_water'  => $family['running_water'] ?? false,
                'internet'       => $family['internet'] ?? false,
                'updated_at'     => now(),
            ]);
        }

        $this->logUpdate(Child::class, $child, $oldValues, $updateData, "Updated child record: {$child->first_name} {$child->last_name}");

        return redirect()->route('admin.children.show', $child->id)
            ->with('success', 'Child profile updated successfully!');
    }

    public function destroy($id)
    {
        $child = Child::findOrFail($id);
        $this->logDelete(Child::class, $child, "Soft-deleted child record: {$child->first_name} {$child->last_name}");
        $child->delete();

        return redirect()->route('admin.children.index')
            ->with('success', 'Child record moved to trash. It can be restored if needed.');
    }

    public function restore($id)
    {
        $child = Child::withTrashed()->findOrFail($id);
        $child->restore();
        $this->logActivity('restore', "Restored child record: {$child->first_name} {$child->last_name}", 'child', Child::class, $child->id);

        return back()->with('success', 'Child record restored successfully!');
    }

    public function approve($id)
    {
        $child = Child::findOrFail($id);
        $child->update([
            'registration_status' => 'Approved',
            'reviewed_by'         => auth()->user()->name,
            'reviewed_at'         => now(),
        ]);
        $this->logActivity('update', "Approved child registration: {$child->first_name} {$child->last_name}", 'child', Child::class, $child->id);

        return back()->with('success', 'Child registration approved!');
    }

    public function reject($id)
    {
        $child = Child::findOrFail($id);
        $child->update([
            'registration_status' => 'Rejected',
            'reviewed_by'         => auth()->user()->name,
            'reviewed_at'         => now(),
        ]);
        $this->logActivity('update', "Rejected child registration: {$child->first_name} {$child->last_name}", 'child', Child::class, $child->id);

        return back()->with('success', 'Child registration rejected!');
    }
}
