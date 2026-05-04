<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NutritionRecord extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'child_id',
        'height_1', 'height_2', 'weight_1', 'weight_2',
        'nutritional_status_1', 'nutritional_status_2',
        'date_1', 'date_2',
        'food_allergies', 'usual_food', 'eating_habit',
        'uses_bottle', 'bottle_frequency',
        'breakfast_time', 'lunch_time',
    ];

    protected $casts = [
        'height_1' => 'decimal:2', 'height_2' => 'decimal:2',
        'weight_1' => 'decimal:2', 'weight_2' => 'decimal:2',
        'date_1'   => 'date',      'date_2'   => 'date',
    ];

    public function child()
    {
        return $this->belongsTo(Child::class);
    }
}
