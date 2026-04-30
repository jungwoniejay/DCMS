<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MotherProfile extends Model
{
    protected $fillable = [
        'child_id', 'last_name', 'first_name', 'middle_initial', 'date_of_birth',
        'age', 'civil_status', 'district', 'purok_zone', 'mother_tongue',
        'other_dialects', 'educational_attainment', 'occupational_status',
        'pregnant', 'age_interest_daycare'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'pregnant' => 'boolean',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }
}
