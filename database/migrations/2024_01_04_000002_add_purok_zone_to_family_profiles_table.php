<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('family_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('family_profiles', 'purok_zone')) {
                $table->string('purok_zone')->nullable()->after('ownership');
            }
        });
    }

    public function down(): void
    {
        Schema::table('family_profiles', function (Blueprint $table) {
            $table->dropColumn('purok_zone');
        });
    }
};
