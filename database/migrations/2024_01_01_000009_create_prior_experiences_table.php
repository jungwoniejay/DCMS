<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prior_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained()->onDelete('cascade');
            $table->enum('nursery_type', ['Private Pre-School', 'Private Day Care', 'Public Pre-School', 'Public Day Care', 'Church Based', 'Home Based', 'Others', 'None'])->nullable();
            $table->enum('kindergarten_type', ['Private Pre-School', 'Private Day Care', 'Public Pre-School', 'Public Day Care', 'Church Based', 'Home Based', 'Others', 'None'])->nullable();
            $table->enum('preparatory_type', ['Private Pre-School', 'Private Day Care', 'Public Pre-School', 'Public Day Care', 'Church Based', 'Home Based', 'Others', 'None'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prior_experiences');
    }
};
