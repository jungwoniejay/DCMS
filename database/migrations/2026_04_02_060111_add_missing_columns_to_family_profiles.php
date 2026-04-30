<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   // In the migration file
public function up()
{
    Schema::table('family_profiles', function (Blueprint $table) {
        if (!Schema::hasColumn('family_profiles', 'purok_zone')) {
            $table->string('purok_zone')->nullable();
        }
        if (!Schema::hasColumn('family_profiles', 'ownership')) {
            $table->string('ownership')->nullable();
        }
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('family_profiles', function (Blueprint $table) {
            //
        });
    }
};
