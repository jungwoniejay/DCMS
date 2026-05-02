<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyProfile extends Model
{
    protected $fillable = [
        'child_id', 'purok_zone', 'ownership', 'materials', 'one_room', 'multiple_rooms',
        'has_toilet', 'has_bedroom', 'has_dining', 'has_sala', 'has_kitchen',
        'open_play_area', 'running_water', 'electricity', 'aircon', 'mobile_phone',
        'computer', 'internet', 'cd_dvd', 'tv', 'radio', 'magazines', 'books',
        'newspapers', 'storybooks', 'board_games', 'puzzles', 'pets', 'toys',
        'immediate_family', 'relatives', 'non_relatives'
    ];

    protected $casts = [
        'one_room' => 'boolean',
        'multiple_rooms' => 'boolean',
        'has_toilet' => 'boolean',
        'has_bedroom' => 'boolean',
        'has_dining' => 'boolean',
        'has_sala' => 'boolean',
        'has_kitchen' => 'boolean',
        'open_play_area' => 'boolean',
        'running_water' => 'boolean',
        'electricity' => 'boolean',
        'aircon' => 'boolean',
        'mobile_phone' => 'boolean',
        'computer' => 'boolean',
        'internet' => 'boolean',
        'cd_dvd' => 'boolean',
        'tv' => 'boolean',
        'radio' => 'boolean',
        'magazines' => 'boolean',
        'books' => 'boolean',
        'newspapers' => 'boolean',
        'storybooks' => 'boolean',
        'board_games' => 'boolean',
        'puzzles' => 'boolean',
        'pets' => 'boolean',
        'toys' => 'boolean',
        'immediate_family' => 'array',
        'relatives' => 'array',
        'non_relatives' => 'array',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }
}
