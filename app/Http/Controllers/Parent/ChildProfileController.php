<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\ChildDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChildProfileController extends Controller
{
    public function edit(int $childId)
    {
        $child = Child::where('id', $childId)
            ->where('guardian_id', auth()->id())
            ->firstOrFail();

        $detail = ChildDetail::where('child_id', $childId)->first();

        return Inertia::render('parent/ChildProfile', [
            'child'  => $child,
            'detail' => $detail,
        ]);
    }

    public function store(Request $request, int $childId)
    {
        $child = Child::where('id', $childId)
            ->where('guardian_id', auth()->id())
            ->firstOrFail();

        $data = $request->validate([
            'birth_order'            => 'nullable|integer',
            'registered'             => 'nullable|string',
            'born_at'                => 'nullable|string',
            'mother_tongue'          => 'nullable|string',
            'other_dialects'         => 'nullable|string',
            'height_cm'              => 'nullable|numeric',
            'weight_kg'              => 'nullable|numeric',
            'eccd_card'              => 'nullable|boolean',
            'mother_child_book'      => 'nullable|boolean',
            'vaccinations'           => 'nullable|array',
            'physical_deformity'     => 'nullable|array',
            'problems_with'          => 'nullable|array',
            'left_handed'            => 'nullable|string',
            'siblings'               => 'nullable|array',
            'prior_experiences'      => 'nullable|array',
            'learns_at_home_with'    => 'nullable|array',
            'plays_older_siblings'   => 'nullable|string',
            'plays_younger_siblings' => 'nullable|string',
            'plays_neighbors'        => 'nullable|string',
            'meal_before_school'     => 'nullable|string',
            'food_normally_eaten'    => 'nullable|array',
            'has_baon'               => 'nullable|string',
            'travel_time_dcc'        => 'nullable|string',
            'travel_mode_dcc'        => 'nullable|string',
            'travel_time_ncdc'       => 'nullable|string',
            'travel_mode_ncdc'       => 'nullable|string',
            'transport_type'         => 'nullable|array',
            'goes_to_school_with'    => 'nullable|array',
        ]);

        $data['child_id'] = $childId;

        ChildDetail::updateOrCreate(['child_id' => $childId], $data);

        return redirect()->route('parent.children.show', $childId)
            ->with('success', 'Child profile saved.');
    }
}
