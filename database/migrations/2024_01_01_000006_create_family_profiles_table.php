<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('family_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained()->onDelete('cascade');
            $table->string('purok_zone')->nullable();
            $table->enum('home_ownership', ['Owned', 'Rented', 'With Parents', 'With Relatives'])->nullable();
            $table->enum('home_materials', ['Nipa', 'Wood', 'Concrete', 'Make Shift'])->nullable();
            $table->boolean('one_room')->default(false);
            $table->boolean('multiple_rooms')->default(false);
            $table->boolean('has_toilet')->default(false);
            $table->boolean('has_bedroom')->default(false);
            $table->boolean('has_dining')->default(false);
            $table->boolean('has_sala')->default(false);
            $table->boolean('has_kitchen')->default(false);
            $table->boolean('open_play_area')->default(false);
            $table->boolean('running_water')->default(false);
            $table->boolean('electricity')->default(false);
            $table->boolean('aircon')->default(false);
            $table->boolean('mobile_phone')->default(false);
            $table->boolean('computer')->default(false);
            $table->boolean('internet')->default(false);
            $table->boolean('cd_dvd')->default(false);
            $table->boolean('tv')->default(false);
            $table->boolean('radio')->default(false);
            $table->boolean('magazines')->default(false);
            $table->boolean('books')->default(false);
            $table->boolean('newspapers')->default(false);
            $table->boolean('storybooks')->default(false);
            $table->boolean('board_games')->default(false);
            $table->boolean('puzzles')->default(false);
            $table->boolean('pets')->default(false);
            $table->boolean('toys')->default(false);
            $table->json('immediate_family')->nullable();
            $table->json('relatives')->nullable();
            $table->json('non_relatives')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_profiles');
    }
};
