<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ParentInvolvementRequest;
use App\Models\Child;
use App\Models\ParentInvolvement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParentInvolvementController extends Controller
{
    public function show($childId)
    {
        $child = Child::with(['parentInvolvement'])->findOrFail($childId);
        
        return Inertia::render('admin/children/parent-involvement/Show', [
            'child' => $child,
            'parentInvolvement' => $child->parentInvolvement,
        ]);
    }

    public function edit($childId)
    {
        $child = Child::with(['parentInvolvement', 'guardians', 'fatherProfile', 'motherProfile'])->findOrFail($childId);

        // Build prefill from existing enrollment data
        $guardian = $child->guardians->first();
        $father   = $child->fatherProfile;
        $mother   = $child->motherProfile;

        $prefill = [
            'parent_name'         => $guardian?->name
                                  ?? ($father ? trim($father->first_name . ' ' . $father->last_name) : null)
                                  ?? ($mother ? trim($mother->first_name . ' ' . $mother->last_name) : null)
                                  ?? '',
            'parent_relationship' => $guardian?->relationship ?? '',
            'parent_contact'      => $guardian?->mobile_phone ?? '',
            'parent_email'        => $guardian?->email ?? '',
        ];

        return Inertia::render('admin/children/parent-involvement/Edit', [
            'child'             => $child,
            'parentInvolvement' => $child->parentInvolvement,
            'prefill'           => $prefill,
        ]);
    }

    public function store(ParentInvolvementRequest $request, $childId)
    {
        $child = Child::findOrFail($childId);
        
        // Check if record already exists - update instead of creating duplicate
        $parentInvolvement = ParentInvolvement::where('child_id', $childId)->first();
        
        if ($parentInvolvement) {
            return $this->update($request, $childId);
        }
        
        $validated = $request->validated();
        
        ParentInvolvement::create([
            'child_id' => $childId,
            'user_id' => auth()->id(),
            'parent_name' => $validated['parent_name'] ?? null,
            'parent_relationship' => $validated['parent_relationship'] ?? null,
            'parent_contact' => $validated['parent_contact'] ?? null,
            'parent_email' => $validated['parent_email'] ?? null,
            'support_roles' => $validated['support_roles'] ?? null,
            'additional_notes' => $validated['additional_notes'] ?? null,
        ]);
        
        return redirect()->route('admin.children.parent-involvement.show', $childId)
            ->with('success', 'Parent involvement information saved successfully!');
    }

    public function update(ParentInvolvementRequest $request, $childId)
    {
        $child = Child::findOrFail($childId);
        
        $parentInvolvement = ParentInvolvement::where('child_id', $childId)->firstOrFail();
        
        $validated = $request->validated();
        
        $parentInvolvement->update([
            'parent_name' => $validated['parent_name'] ?? null,
            'parent_relationship' => $validated['parent_relationship'] ?? null,
            'parent_contact' => $validated['parent_contact'] ?? null,
            'parent_email' => $validated['parent_email'] ?? null,
            'support_roles' => $validated['support_roles'] ?? null,
            'additional_notes' => $validated['additional_notes'] ?? null,
        ]);
        
        return redirect()->route('admin.children.parent-involvement.show', $childId)
            ->with('success', 'Parent involvement information updated successfully!');
    }

    public function destroy($childId)
    {
        $parentInvolvement = ParentInvolvement::where('child_id', $childId)->first();
        
        if ($parentInvolvement) {
            $parentInvolvement->delete();
        }
        
        return redirect()->route('admin.children.show', $childId)
            ->with('success', 'Parent involvement information deleted successfully!');
    }
}