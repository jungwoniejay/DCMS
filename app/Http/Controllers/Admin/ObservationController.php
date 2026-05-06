<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChildObservationRequest;
use App\Models\Child;
use App\Models\ChildObservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ObservationController extends Controller
{
    public function index($childId)
    {
        $child = Child::findOrFail($childId);
        $observations = ChildObservation::where('child_id', $childId)
            ->orderBy('observation_count')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('admin/children/observations/Index', [
            'child' => $child,
            'observations' => $observations,
        ]);
    }

    public function show($childId, $observationId)
    {
        $child = Child::findOrFail($childId);
        $observation = ChildObservation::where('child_id', $childId)
            ->findOrFail($observationId);
        
        return Inertia::render('admin/children/observations/Show', [
            'child' => $child,
            'observation' => $observation,
        ]);
    }

    public function create($childId)
    {
        return redirect()->route('admin.children.observations.index', $childId);
    }

    public function store(ChildObservationRequest $request, $childId)
    {
        Child::findOrFail($childId);
        $validated = $request->validated();

        ChildObservation::create([
            'child_id'          => $childId,
            'user_id'           => auth()->id(),
            'behavior_name'     => $validated['behavior_name'],
            'observation_count' => $validated['observation_count'],
            'comment'           => $validated['comment'] ?? null,
        ]);

        return redirect()->route('admin.children.observations.index', $childId)
            ->with('success', 'Observation recorded successfully!');
    }

    public function edit($childId, $observationId)
    {
        $child = Child::findOrFail($childId);
        $observation = ChildObservation::where('child_id', $childId)
            ->findOrFail($observationId);
        
        return Inertia::render('admin/children/observations/Edit', [
            'child' => $child,
            'observation' => $observation,
        ]);
    }

    public function update(ChildObservationRequest $request, $childId, $observationId)
    {
        $child = Child::findOrFail($childId);
        $observation = ChildObservation::where('child_id', $childId)
            ->findOrFail($observationId);
        
        $validated = $request->validated();
        
        $observation->update([
            'behavior_name' => $validated['behavior_name'],
            'observation_count' => $validated['observation_count'],
            'comment' => $validated['comment'] ?? null,
        ]);
        
        return redirect()->route('admin.children.observations.index', $childId)
            ->with('success', 'Child observation updated successfully!');
    }

    public function destroy($childId, $observationId)
    {
        $child = Child::findOrFail($childId);
        $observation = ChildObservation::where('child_id', $childId)
            ->findOrFail($observationId);
        
        $observation->delete();
        
        return redirect()->route('admin.children.observations.index', $childId)
            ->with('success', 'Child observation deleted successfully!');
    }
}