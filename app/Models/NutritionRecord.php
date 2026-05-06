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
        'height_first', 'height_second',
        'weight_first', 'weight_second',
        'date_first', 'date_second',
        'nutritional_status_result',
        'officer_name', 'officer_position',
        'assessment_date',
        'food_allergies', 'usual_food', 'eating_habit',
        'uses_bottle', 'bottle_frequency',
        'breakfast_time', 'lunch_time',
    ];

    protected $casts = [
        'height_first'  => 'decimal:2', 'height_second'  => 'decimal:2',
        'weight_first'  => 'decimal:2', 'weight_second'  => 'decimal:2',
        'date_first'    => 'date',      'date_second'    => 'date',
        'assessment_date' => 'date',
    ];

    public function child()
    {
        return $this->belongsTo(Child::class);
    }
}
