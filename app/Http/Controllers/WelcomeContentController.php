<?php

namespace App\Http\Controllers;

use App\Models\WelcomeContent;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WelcomeContentController extends Controller
{
    public function index()
    {
        $contents = WelcomeContent::all()->keyBy('key');
        return Inertia::render('admin/WelcomeContent', [
            'contents' => $contents
        ]);
    }

    public function update(Request $request)
    {
        $allowedKeys = [
            'hero_title', 'hero_subtitle', 'hero_description',
            'about_title', 'about_description',
            'services_title', 'services_description',
            'contact_title', 'contact_description',
            'footer_text',
        ];

        $validated = $request->validate([
            'contents' => 'required|array',
            'contents.*.key' => ['required', 'string', Rule::in($allowedKeys)],
            'contents.*.value' => 'required|string|max:5000',
        ]);

        foreach ($validated['contents'] as $content) {
            WelcomeContent::updateOrCreate(
                ['key' => $content['key']],
                ['value' => $content['value'], 'type' => 'text']
            );
        }

        return redirect()->back()->with('success', 'Welcome page content updated successfully');
    }
}
