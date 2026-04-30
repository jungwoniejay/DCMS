<?php

namespace App\Http\Controllers;

use App\Models\Child;
use Illuminate\Http\Request;

class ParentProfileController extends Controller
{
    public function storeFather(Request $request, Child $child)
    {
        $validated = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_initial' => 'nullable|string|max:10',
            'date_of_birth' => 'required|date',
            'age' => 'required|integer',
            'civil_status' => 'required|in:Single,Married,Separated,Widower,Live-in',
            'district' => 'nullable|string|max:255',
            'purok_zone' => 'nullable|string|max:255',
            'mother_tongue' => 'nullable|in:Tagalog,Visayan,Ilocano,Bicolnon,Others',
            'other_dialects' => 'nullable|string',
            'educational_attainment' => 'nullable|in:Elementary,High School,College,Tech-Voc,Masteral,Doctoral',
            'occupational_status' => 'nullable|in:Employed,Unemployed,Retired,OFW,Others',
        ]);

        $child->fatherProfile()->updateOrCreate(['child_id' => $child->id], $validated);

        return back()->with('success', 'Father profile saved successfully!');
    }

    public function storeMother(Request $request, Child $child)
    {
        $validated = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_initial' => 'nullable|string|max:10',
            'date_of_birth' => 'required|date',
            'age' => 'required|integer',
            'civil_status' => 'required|in:Single,Married,Separated,Widow,Live-in',
            'district' => 'nullable|string|max:255',
            'purok_zone' => 'nullable|string|max:255',
            'mother_tongue' => 'nullable|in:Tagalog,Visayan,Ilocano,Bicolnon,Others',
            'other_dialects' => 'nullable|string',
            'educational_attainment' => 'nullable|in:Elementary,High School,College,Tech-Voc,Masteral,Doctoral',
            'occupational_status' => 'nullable|in:Employed,Unemployed,Retired,OFW,Others',
            'pregnant' => 'boolean',
            'age_interest_daycare' => 'nullable|in:Below 1yr,1yr,2yr,3yr,4yr',
        ]);

        $child->motherProfile()->updateOrCreate(['child_id' => $child->id], $validated);

        return back()->with('success', 'Mother profile saved successfully!');
    }
}
