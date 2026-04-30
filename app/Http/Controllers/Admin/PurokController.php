<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purok;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurokController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/settings/Puroks', [
            'puroks' => Purok::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:puroks,name']);
        Purok::create(['name' => $request->name]);
        return back()->with('success', 'Purok added successfully!');
    }

    public function update(Request $request, Purok $purok)
    {
        $request->validate(['name' => 'required|string|max:255|unique:puroks,name,' . $purok->id]);
        $purok->update(['name' => $request->name]);
        return back()->with('success', 'Purok updated successfully!');
    }

    public function destroy(Purok $purok)
    {
        $purok->delete();
        return back()->with('success', 'Purok deleted successfully!');
    }
}
