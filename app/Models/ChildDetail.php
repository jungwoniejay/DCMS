<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChildDetail extends Model
{
    protected $fillable = [
        'child_id', 'birth_order', 'registered', 'born_at',
        'mother_tongue', 'other_dialects', 'height_cm', 'weight_kg',
        'eccd_card', 'mother_child_book', 'vaccinations',
        'physical_deformity', 'problems_with', 'left_handed',
        'siblings', 'prior_experiences', 'learns_at_home_with',
        'plays_older_siblings', 'plays_younger_siblings', 'plays_neighbors',
        'meal_before_school', 'food_normally_eaten', 'has_baon',
        'travel_time_dcc', 'travel_mode_dcc', 'travel_time_ncdc', 'travel_mode_ncdc',
        'transport_type', 'goes_to_school_with',
    ];

    protected $casts = [
        'eccd_card'           => 'boolean',
        'mother_child_book'   => 'boolean',
        'vaccinations'        => 'array',
        'physical_deformity'  => 'array',
        'problems_with'       => 'array',
        'siblings'            => 'array',
        'prior_experiences'   => 'array',
        'learns_at_home_with' => 'array',
        'food_normally_eaten' => 'array',
        'transport_type'      => 'array',
        'goes_to_school_with' => 'array',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }
}
