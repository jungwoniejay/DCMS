<?php

namespace App\Http\Controllers;

use App\Models\Child;
use Illuminate\Http\Request;

class FamilyProfileController extends Controller
{
    public function store(Request $request, Child $child)
    {
        $validated = $request->validate([
            'ownership' => 'required|in:Owned,Rented,With Parents,With Relatives',
            'materials' => 'required|in:Nipa,Wood,Concrete,Make Shift',
            'one_room' => 'boolean',
            'multiple_rooms' => 'boolean',
            'has_toilet' => 'boolean',
            'has_bedroom' => 'boolean',
            'has_dining' => 'boolean',
            'has_sala' => 'boolean',
            'has_kitchen' => 'boolean',
            'open_play_area' => 'boolean',
            'running_water' => 'boolean',
            'electricity' => 'boolean',
            'aircon' => 'boolean',
            'mobile_phone' => 'boolean',
            'computer' => 'boolean',
            'internet' => 'boolean',
            'cd_dvd' => 'boolean',
            'tv' => 'boolean',
            'radio' => 'boolean',
            'magazines' => 'boolean',
            'books' => 'boolean',
            'newspapers' => 'boolean',
            'storybooks' => 'boolean',
            'board_games' => 'boolean',
            'puzzles' => 'boolean',
            'pets' => 'boolean',
            'toys' => 'boolean',
            'immediate_family' => 'nullable|array',
            'relatives' => 'nullable|array',
            'non_relatives' => 'nullable|array',
        ]);

        $child->familyProfile()->updateOrCreate(['child_id' => $child->id], $validated);

        return back()->with('success', 'Family profile saved successfully!');
    }
}
