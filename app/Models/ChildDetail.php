<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChildDetail extends Model
{
    protected $fillable = [
        'child_id', 'birth_order', 'registered', 'born_at', 'height', 'weight',
        'eccd_card', 'mother_child_book', 'other_documents', 'bcg', 'dpt',
        'oral_polio', 'hepa_b', 'measles', 'hare_lip', 'cross_eyed', 'deaf',
        'blind', 'disabled_leg', 'disabled_arm', 'finger_toe_deformity',
        'behavior_problems', 'speaking_problems', 'hearing_problems',
        'vision_problems', 'left_handed'
    ];

    protected $casts = [
        'registered' => 'boolean',
        'eccd_card' => 'boolean',
        'mother_child_book' => 'boolean',
        'hare_lip' => 'boolean',
        'cross_eyed' => 'boolean',
        'deaf' => 'boolean',
        'blind' => 'boolean',
        'disabled_leg' => 'boolean',
        'disabled_arm' => 'boolean',
        'finger_toe_deformity' => 'boolean',
        'behavior_problems' => 'boolean',
        'speaking_problems' => 'boolean',
        'hearing_problems' => 'boolean',
        'vision_problems' => 'boolean',
        'left_handed' => 'boolean',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }
}
