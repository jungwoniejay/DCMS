<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Child extends Model
{
    use SoftDeletes;

    protected $appends = ['profile_picture_url'];

    protected $fillable = [
        'guardian_id', 'last_name', 'first_name', 'middle_name', 'sex', 'profile_picture',
        'birthdate', 'age', 'classroom', 'address', 'first_language', 'second_language',
        'registration_status', 'accomplished_by', 'reviewed_by', 'reviewed_at',
    ];

    protected $casts = [
        'birthdate'   => 'date',
        'reviewed_at' => 'datetime',
        'deleted_at'  => 'datetime',
    ];

    public function getProfilePictureUrlAttribute(): ?string
    {
        if (!$this->profile_picture) return null;
        return asset('storage/' . $this->profile_picture);
    }

    public function guardian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guardian_id');
    }

    public function guardians(): HasMany
    {
        return $this->hasMany(Guardian::class);
    }

    public function emergencyContacts(): HasMany
    {
        return $this->hasMany(EmergencyContact::class);
    }

    public function fatherProfile(): HasOne
    {
        return $this->hasOne(FatherProfile::class);
    }

    public function motherProfile(): HasOne
    {
        return $this->hasOne(MotherProfile::class);
    }

    public function familyProfile(): HasOne
    {
        return $this->hasOne(FamilyProfile::class);
    }

    public function childDetails(): HasOne
    {
        return $this->hasOne(ChildDetail::class);
    }

    public function siblings(): HasMany
    {
        return $this->hasMany(Sibling::class);
    }

    public function priorExperience(): HasOne
    {
        return $this->hasOne(PriorExperience::class);
    }

    public function performanceInput(): HasOne
    {
        return $this->hasOne(PerformanceInput::class);
    }

    public function logistics(): HasOne
    {
        return $this->hasOne(Logistics::class);
    }

    public function healthAssessment(): HasOne
    {
        return $this->hasOne(HealthAssessment::class);
    }

    public function nutritionRecord(): HasOne
    {
        return $this->hasOne(NutritionRecord::class);
    }

    public function feedingProfile(): HasOne
    {
        return $this->hasOne(FeedingProfile::class);
    }

    public function childCareInformation(): HasOne
    {
        return $this->hasOne(ChildCareInformation::class);
    }

    public function childObservations(): HasMany
    {
        return $this->hasMany(ChildObservation::class);
    }

    public function parentInvolvement(): HasOne
    {
        return $this->hasOne(ParentInvolvement::class);
    }
}
