<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    /**
     * Indicates if the model should be timestamped.
     * Activity logs are immutable, so we only use created_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'action',
        'action_type',
        'model_type',
        'model_id',
        'description',
        'properties',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'browser',
        'os',
        'device_type',
        'country',
        'city',
        'is_suspicious',
        'suspicion_reason',
        'created_at',
    ];

    protected $casts = [
        'is_suspicious' => 'boolean',
        'properties' => 'array',
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Get the user who performed the action
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter by suspicious activity
     */
    public function scopeSuspicious($query)
    {
        return $query->where('is_suspicious', true);
    }

    /**
     * Scope to filter by user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by date range
     */
    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope to filter by action type
     */
    public function scopeOfAction($query, $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope to filter by action category
     */
    public function scopeOfActionType($query, $actionType)
    {
        return $query->where('action_type', $actionType);
    }

    /**
     * Get formatted device information
     */
    public function getDeviceInfoAttribute(): string
    {
        $info = [];
        if ($this->browser) {
            $info[] = $this->browser;
        }
        if ($this->os) {
            $info[] = $this->os;
        }
        if ($this->device_type) {
            $info[] = ucfirst($this->device_type);
        }
        return implode(' | ', $info) ?: 'Unknown';
    }

    /**
     * Get formatted location information
     */
    public function getLocationInfoAttribute(): string
    {
        $location = [];
        if ($this->city) {
            $location[] = $this->city;
        }
        if ($this->country) {
            $location[] = $this->country;
        }
        return implode(', ', $location) ?: 'Unknown';
    }

    /**
     * Get icon for action type
     */
    public function getActionIconAttribute(): string
    {
        $icons = [
            'login' => 'log-in',
            'logout' => 'log-out',
            'create' => 'plus',
            'update' => 'edit',
            'delete' => 'trash',
            'view' => 'eye',
            'export' => 'download',
            'failed_login' => 'alert-circle',
        ];
        
        return $icons[$this->action] ?? 'activity';
    }

    /**
     * Get color for action type
     */
    public function getActionColorAttribute(): string
    {
        $colors = [
            'login' => 'green',
            'logout' => 'gray',
            'create' => 'blue',
            'update' => 'yellow',
            'delete' => 'red',
            'view' => 'gray',
            'export' => 'purple',
            'failed_login' => 'orange',
        ];
        
        return $colors[$this->action] ?? 'gray';
    }
}