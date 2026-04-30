<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Logistics extends Model
{
    protected $fillable = [
        'child_id', 'meal_before_school', 'food_normally_eaten', 'has_baon',
        'travel_time_dcc', 'travel_mode_dcc', 'travel_time_ncdc',
        'travel_mode_ncdc', 'public_transportation_options', 'goes_to_school_with'
    ];

    protected $casts = [
        'meal_before_school' => 'boolean',
        'food_normally_eaten' => 'array',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }
}
