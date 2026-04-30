<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barangay_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Seed default values
        $defaults = [
            ['key' => 'barangay_name',    'value' => 'Barangay 2'],
            ['key' => 'city_municipality','value' => 'Manila'],
            ['key' => 'province',         'value' => 'Metro Manila'],
            ['key' => 'cdc_name',         'value' => 'Child Development Center'],
            ['key' => 'contact_phone',    'value' => ''],
            ['key' => 'contact_email',    'value' => ''],
            ['key' => 'contact_address',  'value' => ''],
            ['key' => 'office_hours',     'value' => 'Monday - Friday, 8:00 AM - 5:00 PM'],
            ['key' => 'system_name',      'value' => 'Brgy2DMS'],
        ];

        foreach ($defaults as $setting) {
            DB::table('barangay_settings')->insert(array_merge($setting, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('barangay_settings');
    }
};
