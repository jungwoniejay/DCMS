<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('child_details', function (Blueprint $table) {
            $table->string('mother_tongue')->nullable();
            $table->string('other_dialects')->nullable();
            $table->decimal('height_cm', 5, 2)->nullable();
            $table->decimal('weight_kg', 5, 2)->nullable();
            $table->json('vaccinations')->nullable();
            $table->json('physical_deformity')->nullable();
            $table->json('problems_with')->nullable();
            $table->json('siblings')->nullable();
            $table->json('prior_experiences')->nullable();
            $table->json('learns_at_home_with')->nullable();
            $table->string('plays_older_siblings')->nullable();
            $table->string('plays_younger_siblings')->nullable();
            $table->string('plays_neighbors')->nullable();
            $table->string('meal_before_school')->nullable();
            $table->json('food_normally_eaten')->nullable();
            $table->string('has_baon')->nullable();
            $table->string('travel_time_dcc')->nullable();
            $table->string('travel_mode_dcc')->nullable();
            $table->string('travel_time_ncdc')->nullable();
            $table->string('travel_mode_ncdc')->nullable();
            $table->json('transport_type')->nullable();
            $table->json('goes_to_school_with')->nullable();
        });

        Schema::table('health_assessments', function (Blueprint $table) {
            $table->string('routine_hospital')->nullable();
            $table->string('routine_address')->nullable();
            $table->string('routine_phone')->nullable();
            $table->string('last_checkup_hospital')->nullable();
            $table->json('health_problems')->nullable();
            $table->string('takes_medication')->nullable();
            $table->text('medication_description')->nullable();
            $table->string('special_treatment')->nullable();
            $table->string('treatment_type')->nullable();
            $table->string('serious_accident')->nullable();
            $table->text('accident_description')->nullable();
            $table->json('immunizations')->nullable();
            $table->string('on_medication')->nullable();
            $table->string('medication_nature')->nullable();
        });

        Schema::table('nutrition_records', function (Blueprint $table) {
            $table->decimal('height_1', 5, 2)->nullable();
            $table->decimal('height_2', 5, 2)->nullable();
            $table->decimal('weight_1', 5, 2)->nullable();
            $table->decimal('weight_2', 5, 2)->nullable();
            $table->string('nutritional_status_1')->nullable();
            $table->string('nutritional_status_2')->nullable();
            $table->date('date_1')->nullable();
            $table->date('date_2')->nullable();
            $table->text('food_allergies')->nullable();
            $table->text('usual_food')->nullable();
            $table->text('eating_habit')->nullable();
            $table->string('uses_bottle')->nullable();
            $table->string('bottle_frequency')->nullable();
            $table->string('breakfast_time')->nullable();
            $table->string('lunch_time')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('child_details', function (Blueprint $table) {
            $table->dropColumn([
                'mother_tongue','other_dialects','height_cm','weight_kg',
                'vaccinations','physical_deformity','problems_with','siblings',
                'prior_experiences','learns_at_home_with','plays_older_siblings',
                'plays_younger_siblings','plays_neighbors','meal_before_school',
                'food_normally_eaten','has_baon','travel_time_dcc','travel_mode_dcc',
                'travel_time_ncdc','travel_mode_ncdc','transport_type','goes_to_school_with',
            ]);
        });

        Schema::table('health_assessments', function (Blueprint $table) {
            $table->dropColumn([
                'routine_hospital','routine_address','routine_phone','last_checkup_hospital',
                'health_problems','takes_medication','medication_description',
                'special_treatment','treatment_type','serious_accident','accident_description',
                'immunizations','on_medication','medication_nature',
            ]);
        });

        Schema::table('nutrition_records', function (Blueprint $table) {
            $table->dropColumn([
                'height_1','height_2','weight_1','weight_2',
                'nutritional_status_1','nutritional_status_2','date_1','date_2',
                'food_allergies','usual_food','eating_habit',
                'uses_bottle','bottle_frequency','breakfast_time','lunch_time',
            ]);
        });
    }
};
