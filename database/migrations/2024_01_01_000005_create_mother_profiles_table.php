<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mother_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained()->onDelete('cascade');
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_initial')->nullable();
            $table->date('date_of_birth');
            $table->integer('age');
            $table->enum('civil_status', ['Single', 'Married', 'Separated', 'Widow', 'Live-in']);
            $table->string('district')->nullable();
            $table->string('purok_zone')->nullable();
            $table->enum('mother_tongue', ['Tagalog', 'Visayan', 'Ilocano', 'Bicolnon', 'Others'])->nullable();
            $table->string('other_dialects')->nullable();
            $table->enum('educational_attainment', ['Elementary', 'High School', 'College', 'Tech-Voc', 'Masteral', 'Doctoral'])->nullable();
            $table->enum('occupational_status', ['Employed', 'Unemployed', 'Retired', 'OFW', 'Others'])->nullable();
            $table->boolean('pregnant')->default(false);
            $table->enum('age_interest_daycare', ['Below 1yr', '1yr', '2yr', '3yr', '4yr'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mother_profiles');
    }
};
