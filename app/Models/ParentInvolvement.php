<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParentInvolvement extends Model
{
    protected $fillable = [
        'child_id',
        'user_id',
        'parent_name',
        'parent_relationship',
        'parent_contact',
        'parent_email',
        'support_roles',
        'additional_notes',
    ];

    protected $casts = [
        'support_roles' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}