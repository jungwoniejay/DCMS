<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class EnrollmentRequest extends Model
{
    protected $appends = ['child_photo_url'];

    protected $fillable = [
        'parent_id',
        'child_last_name',
        'child_first_name',
        'child_middle_name',
        'child_photo',
        'child_sex',
        'child_birthdate',
        'child_age',
        'child_address',
        'child_first_language',
        'child_second_language',
        'purok_zone',
        'father_name',
        'father_occupation',
        'mother_name',
        'mother_occupation',
        'guardian_contact',
        'emergency_contact_name',
        'emergency_contact_phone',
        'status',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
        'child_id',
    ];

    protected $casts = [
        'child_birthdate' => 'date',
        'reviewed_at' => 'datetime',
    ];

    public function getChildPhotoUrlAttribute(): ?string
    {
        if (!$this->child_photo) return null;
        return Storage::url($this->child_photo);
    }

    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function child()
    {
        return $this->belongsTo(Child::class);
    }
}
