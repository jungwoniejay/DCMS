<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollment_requests', function (Blueprint $table) {
            $table->json('child_profile_data')->nullable()->after('family_data');
            $table->json('health_data')->nullable()->after('child_profile_data');
            $table->json('nutrition_data')->nullable()->after('health_data');
        });
    }

    public function down(): void
    {
        Schema::table('enrollment_requests', function (Blueprint $table) {
            $table->dropColumn(['child_profile_data', 'health_data', 'nutrition_data']);
        });
    }
};
