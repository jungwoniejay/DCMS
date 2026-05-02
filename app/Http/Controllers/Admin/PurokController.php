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

    public function seed()
    {
        $puroks = [
            'Asia | Purok 1', 'Asia | Purok 2', 'Asia | Purok Centro', 'Asia | Purok Riverside',
            'Bacuyangan | Purok 1', 'Bacuyangan | Purok 2', 'Bacuyangan | Zone 1', 'Bacuyangan | Zone 2',
            'Barangay I (Poblacion) | Zone 1', 'Barangay I (Poblacion) | Zone 2', 'Barangay I (Poblacion) | Zone 3', 'Barangay I (Poblacion) | Purok Proper',
            'Barangay II (Poblacion) | Zone 1', 'Barangay II (Poblacion) | Zone 2', 'Barangay II (Poblacion) | Purok Market Area',
            'Bulwangan | Purok 1', 'Bulwangan | Purok 2', 'Bulwangan | Purok Hillside',
            'Culipapa | Purok 1', 'Culipapa | Purok 2', 'Culipapa | Purok Coastal',
            'Daug | Purok 1', 'Daug | Purok 2', 'Daug | Zone Proper',
            'Damutan | Purok 1', 'Damutan | Purok 2', 'Damutan | Purok Interior',
            'Pook | Purok 1', 'Pook | Purok 2', 'Pook | Zone 1',
            'Talacagay | Purok 1', 'Talacagay | Purok 2', 'Talacagay | Purok Proper',
            'Tuyom | Purok 1', 'Tuyom | Purok 2', 'Tuyom | Purok Riverside',
        ];

        $added = 0;
        foreach ($puroks as $name) {
            if (!Purok::where('name', $name)->exists()) {
                Purok::create(['name' => $name]);
                $added++;
            }
        }

        return back()->with('success', "Default puroks seeded! {$added} new purok(s) added.");
    }

    public function destroy(Purok $purok)
    {
        $purok->delete();
        return back()->with('success', 'Purok deleted successfully!');
    }
}
