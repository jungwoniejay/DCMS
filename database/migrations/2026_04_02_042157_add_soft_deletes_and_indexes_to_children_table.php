<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('children', function (Blueprint $table) {
            $table->softDeletes();
            $table->index('registration_status');
            $table->index('guardian_id');
            $table->index('sex');
        });
    }

    public function down(): void
    {
        Schema::table('children', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropIndex(['registration_status']);
            $table->dropIndex(['guardian_id']);
            $table->dropIndex(['sex']);
        });
    }
};
