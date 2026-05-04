<?php

namespace Database\Seeders;

use App\Models\WelcomeContent;
use Illuminate\Database\Seeder;

class WelcomeContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            ['key' => 'hero_title',       'value' => 'Barangay Child Development Data Management System', 'type' => 'text'],
            ['key' => 'hero_subtitle',    'value' => 'Digitizing Child Development Center forms for better data management', 'type' => 'text'],
            ['key' => 'feature_1_title',       'value' => 'Child Registration', 'type' => 'text'],
            ['key' => 'feature_1_description', 'value' => 'Complete child profile management with guardian information', 'type' => 'text'],
            ['key' => 'feature_2_title',       'value' => 'Health Tracking', 'type' => 'text'],
            ['key' => 'feature_2_description', 'value' => 'Comprehensive health assessments and medical records', 'type' => 'text'],
            ['key' => 'feature_3_title',       'value' => 'Nutrition Monitoring', 'type' => 'text'],
            ['key' => 'feature_3_description', 'value' => 'Track growth, nutrition status, and feeding habits', 'type' => 'text'],
            // Footer
            ['key' => 'footer_tagline',   'value' => 'Barangay Child Development Data Management System — digitizing CDC records for better child care.', 'type' => 'text'],
            ['key' => 'footer_address',   'value' => 'Barangay 2, Hinoba-an, Negros Occidental', 'type' => 'text'],
            ['key' => 'footer_phone',     'value' => '', 'type' => 'text'],
            ['key' => 'footer_email',     'value' => '', 'type' => 'text'],
            ['key' => 'footer_hours',     'value' => 'Monday - Friday, 8:00 AM - 5:00 PM', 'type' => 'text'],
            ['key' => 'footer_copyright', 'value' => '© ' . date('Y') . ' KidCare Hinoba-an. All rights reserved.', 'type' => 'text'],
            // Privacy Policy
            ['key' => 'privacy_overview', 'value' => 'KidCare Hinoba-an (Barangay Child Development Data Management System) is committed to protecting the personal information of children, parents, and guardians registered in our system. This Privacy Policy applies to all users of the platform, including administrators, parents, and guardians. By using our system, you agree to the collection and use of information in accordance with this policy.', 'type' => 'text'],
            ['key' => 'privacy_data_collection', 'value' => 'We collect the following types of information to provide our services: child information (name, birthdate, sex, address, languages spoken), parent/guardian information (names, contact details, occupations), health records (vaccinations, medical assessments, health conditions), nutrition data (height, weight, nutritional status measurements), family profile (home ownership, utilities, household composition), and account credentials (email address and encrypted password).', 'type' => 'text'],
            ['key' => 'privacy_terms', 'value' => 'By using KidCare Hinoba-an, you agree to provide accurate and truthful information during registration, not share your account credentials with unauthorized persons, use the system only for its intended purpose, and notify the administrator of any unauthorized account access. The barangay reserves the right to update these terms at any time. Continued use of the system after any changes constitutes acceptance of the new terms.', 'type' => 'text'],
            // Cookie Policy Table
            ['key' => 'cookie_essential_name',     'value' => 'brgy2dms_session', 'type' => 'text'],
            ['key' => 'cookie_essential_purpose',  'value' => 'Maintains your login session and authentication state across page requests', 'type' => 'text'],
            ['key' => 'cookie_essential_duration', 'value' => '2 hours', 'type' => 'text'],
            ['key' => 'cookie_analytics_name',     'value' => 'analytics_cookies', 'type' => 'text'],
            ['key' => 'cookie_analytics_purpose',  'value' => 'Helps us understand how users interact with the system so we can improve performance and usability', 'type' => 'text'],
            ['key' => 'cookie_analytics_duration', 'value' => '30 days', 'type' => 'text'],
            ['key' => 'cookie_optional_name',      'value' => 'optional_cookies', 'type' => 'text'],
            ['key' => 'cookie_optional_purpose',   'value' => 'Used for personalization features and enhanced user experience settings', 'type' => 'text'],
            ['key' => 'cookie_optional_duration',  'value' => '30 days', 'type' => 'text'],
        ];

        foreach ($contents as $content) {
            WelcomeContent::updateOrCreate(
                ['key' => $content['key']],
                ['value' => $content['value'], 'type' => $content['type']]
            );
        }
    }
}
