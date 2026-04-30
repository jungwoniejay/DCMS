<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Province;
use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/settings/Locations', [
            'provinces' => Province::withCount('cities')->orderBy('name')->get(),
            'cities'    => City::with('province')->orderBy('name')->get(),
        ]);
    }

    // Province CRUD
    public function storeProvince(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:provinces,name']);
        Province::create(['name' => $request->name]);
        return back()->with('success', 'Province added successfully!');
    }

    public function updateProvince(Request $request, Province $province)
    {
        $request->validate(['name' => 'required|string|max:255|unique:provinces,name,' . $province->id]);
        $province->update(['name' => $request->name]);
        return back()->with('success', 'Province updated successfully!');
    }

    public function destroyProvince(Province $province)
    {
        $province->delete();
        return back()->with('success', 'Province deleted successfully!');
    }

    // City CRUD
    public function storeCity(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
        ]);
        City::create($request->only('name', 'province_id'));
        return back()->with('success', 'City/Municipality added successfully!');
    }

    public function updateCity(Request $request, City $city)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
        ]);
        $city->update($request->only('name', 'province_id'));
        return back()->with('success', 'City/Municipality updated successfully!');
    }

    public function destroyCity(City $city)
    {
        $city->delete();
        return back()->with('success', 'City/Municipality deleted successfully!');
    }

    // API endpoint for getting cities by province
    public function citiesByProvince(Province $province)
    {
        return response()->json($province->cities()->orderBy('name')->get());
    }
}
