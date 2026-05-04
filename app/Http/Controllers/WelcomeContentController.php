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
            'feature_1_title', 'feature_1_description',
            'feature_2_title', 'feature_2_description',
            'feature_3_title', 'feature_3_description',
            'footer_tagline', 'footer_address', 'footer_phone',
            'footer_email', 'footer_hours', 'footer_copyright',
            'privacy_overview', 'privacy_data_collection',
            'cookie_essential_name', 'cookie_essential_purpose', 'cookie_essential_duration',
            'cookie_analytics_name', 'cookie_analytics_purpose', 'cookie_analytics_duration',
            'cookie_optional_name', 'cookie_optional_purpose', 'cookie_optional_duration',
            'privacy_terms',
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
