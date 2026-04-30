<?php

namespace Database\Seeders;

use App\Models\WelcomeContent;
use Illuminate\Database\Seeder;

class WelcomeContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            ['key' => 'hero_title', 'value' => 'Barangay Child Development Data Management System', 'type' => 'text'],
            ['key' => 'hero_subtitle', 'value' => 'Digitizing Child Development Center forms for better data management', 'type' => 'text'],
            ['key' => 'feature_1_title', 'value' => 'Child Registration', 'type' => 'text'],
            ['key' => 'feature_1_description', 'value' => 'Complete child profile management with guardian information', 'type' => 'text'],
            ['key' => 'feature_2_title', 'value' => 'Health Tracking', 'type' => 'text'],
            ['key' => 'feature_2_description', 'value' => 'Comprehensive health assessments and medical records', 'type' => 'text'],
            ['key' => 'feature_3_title', 'value' => 'Nutrition Monitoring', 'type' => 'text'],
            ['key' => 'feature_3_description', 'value' => 'Track growth, nutrition status, and feeding habits', 'type' => 'text'],
        ];

        foreach ($contents as $content) {
            WelcomeContent::updateOrCreate(
                ['key' => $content['key']],
                ['value' => $content['value'], 'type' => $content['type']]
            );
        }
    }
}
