<?php

namespace App\Http\Controllers;

use App\Models\Child;
use Illuminate\Http\Request;

class ChildDetailController extends Controller
{
    public function store(Request $request, Child $child)
    {
        $validated = $request->validate([
            'birth_order' => 'nullable|integer',
            'registered' => 'boolean',
            'born_at' => 'nullable|in:Hospital,Health Center,Home',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'eccd_card' => 'boolean',
            'mother_child_book' => 'boolean',
            'other_documents' => 'nullable|string',
            'bcg' => 'nullable|in:Yes,No,Don\'t Know',
            'dpt' => 'nullable|in:Yes,No,Don\'t Know',
            'oral_polio' => 'nullable|in:Yes,No,Don\'t Know',
            'hepa_b' => 'nullable|in:Yes,No,Don\'t Know',
            'measles' => 'nullable|in:Yes,No,Don\'t Know',
            'hare_lip' => 'boolean',
            'cross_eyed' => 'boolean',
            'deaf' => 'boolean',
            'blind' => 'boolean',
            'disabled_leg' => 'boolean',
            'disabled_arm' => 'boolean',
            'finger_toe_deformity' => 'boolean',
            'behavior_problems' => 'boolean',
            'speaking_problems' => 'boolean',
            'hearing_problems' => 'boolean',
            'vision_problems' => 'boolean',
            'left_handed' => 'boolean',
        ]);

        $child->childDetails()->updateOrCreate(['child_id' => $child->id], $validated);

        if ($request->has('siblings')) {
            $child->siblings()->delete();
            foreach ($request->siblings as $sibling) {
                $child->siblings()->create($sibling);
            }
        }

        if ($request->has('prior_experience')) {
            $child->priorExperience()->updateOrCreate(
                ['child_id' => $child->id],
                $request->prior_experience
            );
        }

        if ($request->has('performance_input')) {
            $child->performanceInput()->updateOrCreate(
                ['child_id' => $child->id],
                $request->performance_input
            );
        }

        if ($request->has('logistics')) {
            $child->logistics()->updateOrCreate(
                ['child_id' => $child->id],
                $request->logistics
            );
        }

        return back()->with('success', 'Child details saved successfully!');
    }
}
