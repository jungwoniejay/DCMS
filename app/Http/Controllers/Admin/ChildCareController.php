<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChildCareInformationRequest;
use App\Models\Child;
use App\Models\ChildCareInformation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChildCareController extends Controller
{
    public function show($childId)
    {
        $child = Child::with(['childCareInformation'])->findOrFail($childId);
        
        return Inertia::render('admin/children/care/Show', [
            'child' => $child,
            'careInfo' => $child->childCareInformation,
        ]);
    }

    public function edit($childId)
    {
        $child = Child::with(['childCareInformation'])->findOrFail($childId);
        
        return Inertia::render('admin/children/care/Edit', [
            'child' => $child,
            'careInfo' => $child->childCareInformation,
        ]);
    }

    public function store(ChildCareInformationRequest $request, $childId)
    {
        $child = Child::findOrFail($childId);
        
        // Check if record already exists - update instead of creating duplicate
        $careInfo = ChildCareInformation::where('child_id', $childId)->first();
        
        if ($careInfo) {
            return $this->update($request, $childId);
        }
        
        $validated = $request->validated();
        
        ChildCareInformation::create([
            'child_id' => $childId,
            'user_id' => auth()->id(),
            'feeding_food_selection' => $validated['feeding_food_selection'] ?? null,
            'feeding_appetite' => $validated['feeding_appetite'] ?? null,
            'feeding_custom' => $validated['feeding_custom'] ?? null,
            'sleeping_duration' => $validated['sleeping_duration'] ?? null,
            'sleeping_quality' => $validated['sleeping_quality'] ?? null,
            'sleeping_custom' => $validated['sleeping_custom'] ?? null,
            'bathing_frequency' => $validated['bathing_frequency'] ?? null,
            'bathing_assistance' => $validated['bathing_assistance'] ?? null,
            'bathing_custom' => $validated['bathing_custom'] ?? null,
            'toileting_frequency' => $validated['toileting_frequency'] ?? null,
            'toileting_assistance' => $validated['toileting_assistance'] ?? null,
            'toileting_custom' => $validated['toileting_custom'] ?? null,
        ]);
        
        return redirect()->route('admin.children.care.show', $childId)
            ->with('success', 'Child care information saved successfully!');
    }

    public function update(ChildCareInformationRequest $request, $childId)
    {
        $child = Child::findOrFail($childId);
        
        $careInfo = ChildCareInformation::where('child_id', $childId)->firstOrFail();
        
        $validated = $request->validated();
        
        $careInfo->update([
            'feeding_food_selection' => $validated['feeding_food_selection'] ?? null,
            'feeding_appetite' => $validated['feeding_appetite'] ?? null,
            'feeding_custom' => $validated['feeding_custom'] ?? null,
            'sleeping_duration' => $validated['sleeping_duration'] ?? null,
            'sleeping_quality' => $validated['sleeping_quality'] ?? null,
            'sleeping_custom' => $validated['sleeping_custom'] ?? null,
            'bathing_frequency' => $validated['bathing_frequency'] ?? null,
            'bathing_assistance' => $validated['bathing_assistance'] ?? null,
            'bathing_custom' => $validated['bathing_custom'] ?? null,
            'toileting_frequency' => $validated['toileting_frequency'] ?? null,
            'toileting_assistance' => $validated['toileting_assistance'] ?? null,
            'toileting_custom' => $validated['toileting_custom'] ?? null,
        ]);
        
        return redirect()->route('admin.children.care.show', $childId)
            ->with('success', 'Child care information updated successfully!');
    }

    public function destroy($childId)
    {
        $careInfo = ChildCareInformation::where('child_id', $childId)->first();
        
        if ($careInfo) {
            $careInfo->delete();
        }
        
        return redirect()->route('admin.children.show', $childId)
            ->with('success', 'Child care information deleted successfully!');
    }
}