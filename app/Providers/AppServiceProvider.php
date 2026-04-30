<?php

namespace App\Providers;

use App\Models\Child;
use App\Models\CheckupAppointment;
use App\Models\DevelopmentPlan;
use App\Models\EnrollmentRequest;
use App\Policies\AppointmentPolicy;
use App\Policies\ChildPolicy;
use App\Policies\DevelopmentPlanPolicy;
use App\Policies\EnrollmentPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends AuthServiceProvider
{
    protected $policies = [
        Child::class             => ChildPolicy::class,
        EnrollmentRequest::class => EnrollmentPolicy::class,
        CheckupAppointment::class => AppointmentPolicy::class,
        DevelopmentPlan::class   => DevelopmentPlanPolicy::class,
    ];

    public function register(): void {}

    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('be-admin', fn($user) => $user->role === 'admin');
        Gate::define('be-parent', fn($user) => $user->role === 'parent');
    }
}
