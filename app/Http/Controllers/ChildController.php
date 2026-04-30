<?php

namespace App\Http\Controllers;

use App\Models\Child;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChildController extends Controller
{
    public function index()
    {
        $children = Child::with(['guardians', 'fatherProfile', 'motherProfile'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Children/Index', [
            'children' => $children
        ]);
    }

    public function create()
    {
        return Inertia::render('Children/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'sex' => 'required|in:Male,Female',
            'birthdate' => 'required|date',
            'age' => 'required|integer',
            'address' => 'required|string',
            'first_language' => 'required|string|max:255',
            'second_language' => 'nullable|string|max:255',
            'accomplished_by' => 'nullable|string|max:255',
        ]);

        $child = Child::create($validated);

        if ($request->has('guardians')) {
            foreach ($request->guardians as $guardian) {
                $child->guardians()->create($guardian);
            }
        }

        if ($request->has('emergency_contacts')) {
            foreach ($request->emergency_contacts as $contact) {
                $child->emergencyContacts()->create($contact);
            }
        }

        return redirect()->route('children.show', $child)->with('success', 'Child registered successfully!');
    }

    public function show(Child $child)
    {
        $child->load([
            'guardians', 'emergencyContacts', 'fatherProfile', 'motherProfile',
            'familyProfile', 'childDetails', 'siblings', 'priorExperience',
            'performanceInput', 'logistics'
        ]);

        return Inertia::render('Children/Show', [
            'child' => $child
        ]);
    }

    public function edit(Child $child)
    {
        $child->load([
            'guardians', 'emergencyContacts', 'fatherProfile', 'motherProfile',
            'familyProfile', 'childDetails', 'siblings', 'priorExperience',
            'performanceInput', 'logistics'
        ]);

        return Inertia::render('Children/Edit', [
            'child' => $child
        ]);
    }

    public function update(Request $request, Child $child)
    {
        $validated = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'sex' => 'required|in:Male,Female',
            'birthdate' => 'required|date',
            'age' => 'required|integer',
            'address' => 'required|string',
            'first_language' => 'required|string|max:255',
            'second_language' => 'nullable|string|max:255',
        ]);

        $child->update($validated);

        return redirect()->route('children.show', $child)->with('success', 'Child updated successfully!');
    }

    public function destroy(Child $child)
    {
        $child->delete();
        return redirect()->route('children.index')->with('success', 'Child deleted successfully!');
    }
}
