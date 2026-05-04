<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollment_requests', function (Blueprint $table) {
            $table->string('guardian_name')->nullable()->after('purok_zone');
            $table->string('guardian_relationship')->nullable()->after('guardian_name');
            $table->string('guardian_email')->nullable()->after('guardian_relationship');
            $table->string('emergency_home')->nullable()->after('emergency_contact_phone');
            $table->string('emergency_work')->nullable()->after('emergency_home');
            $table->string('accomplished_by')->nullable()->after('emergency_work');
            $table->date('accomplished_date')->nullable()->after('accomplished_by');
            $table->string('reviewed_by_name')->nullable()->after('accomplished_date');
            $table->date('reviewed_date')->nullable()->after('reviewed_by_name');
            $table->json('father_data')->nullable()->after('reviewed_date');
            $table->json('mother_data')->nullable()->after('father_data');
            $table->json('family_data')->nullable()->after('mother_data');
        });
    }

    public function down(): void
    {
        Schema::table('enrollment_requests', function (Blueprint $table) {
            $table->dropColumn([
                'guardian_name','guardian_relationship','guardian_email',
                'emergency_home','emergency_work',
                'accomplished_by','accomplished_date','reviewed_by_name','reviewed_date',
                'father_data','mother_data','family_data',
            ]);
        });
    }
};
