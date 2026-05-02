<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminChildrenController;
use App\Http\Controllers\Admin\AdminParentsController;
use App\Http\Controllers\Admin\AdminHealthController;
use App\Http\Controllers\Admin\AdminNutritionController;
use App\Http\Controllers\Admin\AdminLogisticsController;
use App\Http\Controllers\Admin\AdminExperiencesController;
use App\Http\Controllers\Admin\AdminReportsController;
use App\Http\Controllers\Admin\AdminSystemController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\WelcomeContentController;
use App\Models\WelcomeContent;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Welcome Page
Route::get('/', function () {
    $contents = WelcomeContent::all()->keyBy('key');
    return Inertia::render('welcome', ['contents' => $contents]);
})->name('welcome');

Route::get('/privacy-policy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy-policy');

// Debug endpoint - remove after fixing
Route::get('/debug-storage', function () {
    $publicPath = storage_path('app/public');
    $privatePath = storage_path('app/private');
    $appPath = storage_path('app');

    return response()->json([
        'files_in_public'       => scandir($publicPath) ?: [],
        'files_in_private'      => file_exists($privatePath) ? scandir($privatePath) : 'no private dir',
        'files_in_app'          => scandir($appPath) ?: [],
        'enrollment_in_public'  => file_exists($publicPath.'/enrollment_photos') ? scandir($publicPath.'/enrollment_photos') : 'NOT FOUND',
        'enrollment_in_private' => file_exists($privatePath.'/enrollment_photos') ? scandir($privatePath.'/enrollment_photos') : 'NOT FOUND',
        'latest_db_photo'       => \App\Models\EnrollmentRequest::whereNotNull('child_photo')->latest()->value('child_photo') ?? 'none in DB',
        'disk_default'          => config('filesystems.default'),
        'disk_public_root'      => config('filesystems.disks.public.root'),
    ]);
});

// Serve uploaded files directly via Laravel (works on Railway without symlinks)
Route::get('/storage/{path}', function (string $path) {
    // Try multiple possible storage locations
    $possiblePaths = [
        storage_path('app/public/' . $path),
        '/app/storage/app/public/' . $path,
        base_path('storage/app/public/' . $path),
    ];

    foreach ($possiblePaths as $fullPath) {
        if (file_exists($fullPath)) {
            return response()->file($fullPath);
        }
    }

    \Log::error('Storage 404', [
        'path' => $path,
        'tried' => $possiblePaths,
        'storage_path' => storage_path(),
        'base_path' => base_path(),
    ]);
    abort(404);
})->where('path', '.*')->name('storage.serve');

// Admin Routes (Protected)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/stats', [AdminDashboardController::class, 'stats'])->name('dashboard.stats');
    
    // Child Management (Consolidated)
    Route::get('children', [AdminChildrenController::class, 'index'])->name('children.index');
    Route::get('children/create', [AdminChildrenController::class, 'create'])->name('children.create');
    Route::post('children', [AdminChildrenController::class, 'store'])->name('children.store');
    Route::get('children/{id}', [AdminChildrenController::class, 'show'])->name('children.show');
    Route::get('children/{id}/edit', [AdminChildrenController::class, 'edit'])->name('children.edit');
    Route::put('children/{id}', [AdminChildrenController::class, 'update'])->name('children.update');
    Route::post('children/{id}', [AdminChildrenController::class, 'update'])->name('children.update.post');
    Route::delete('children/{id}', [AdminChildrenController::class, 'destroy'])->name('children.destroy');
    Route::post('children/{id}/approve', [AdminChildrenController::class, 'approve'])->name('children.approve');
    Route::post('children/{id}/reject', [AdminChildrenController::class, 'reject'])->name('children.reject');
    Route::post('children/{id}/restore', [AdminChildrenController::class, 'restore'])->name('children.restore');
    
    // Household & Family (Consolidated)
    Route::get('households', [AdminParentsController::class, 'households'])->name('households');
    Route::get('fathers', [AdminParentsController::class, 'fathers'])->name('fathers');
    Route::get('mothers', [AdminParentsController::class, 'mothers'])->name('mothers');
    Route::get('guardians', [AdminParentsController::class, 'guardians'])->name('guardians');
    Route::get('emergency-contacts', [AdminParentsController::class, 'emergencyContacts'])->name('emergency-contacts');
    Route::get('parents/analytics', [AdminParentsController::class, 'analytics'])->name('parents.analytics');
    
    // Health Intelligence (Consolidated)
    Route::get('health', [AdminHealthController::class, 'index'])->name('health');
    Route::get('health/vaccinations', [AdminHealthController::class, 'vaccinations'])->name('health.vaccinations');
    Route::get('health/conditions', [AdminHealthController::class, 'conditions'])->name('health.conditions');
    Route::get('health/emergency-plans', [AdminHealthController::class, 'emergencyPlans'])->name('health.emergency-plans');
    Route::get('health/reports', [AdminHealthController::class, 'reports'])->name('health.reports');
    
    // Nutrition Monitoring (Consolidated)
    Route::get('nutrition', [AdminNutritionController::class, 'index'])->name('nutrition');
    Route::get('nutrition/summary', [AdminNutritionController::class, 'summary'])->name('nutrition.summary');
    Route::get('nutrition/feeding', [AdminNutritionController::class, 'feeding'])->name('nutrition.feeding');
    Route::get('nutrition/allergies', [AdminNutritionController::class, 'allergies'])->name('nutrition.allergies');
    Route::get('nutrition/growth-charts', [AdminNutritionController::class, 'growthCharts'])->name('nutrition.growth-charts');
    
    // Logistics & Access (Consolidated)
    Route::get('logistics', [AdminLogisticsController::class, 'index'])->name('logistics');
    Route::get('logistics/travel-time', [AdminLogisticsController::class, 'travelTime'])->name('logistics.travel-time');
    Route::get('logistics/accompaniment', [AdminLogisticsController::class, 'accompaniment'])->name('logistics.accompaniment');
    Route::get('logistics/meal-patterns', [AdminLogisticsController::class, 'mealPatterns'])->name('logistics.meal-patterns');
    Route::get('logistics/baon-analysis', [AdminLogisticsController::class, 'baonAnalysis'])->name('logistics.baon-analysis');
    
    // Developmental Background (Consolidated)
    Route::get('development', [AdminExperiencesController::class, 'index'])->name('development');
    Route::get('development/kindergarten', [AdminExperiencesController::class, 'kindergarten'])->name('development.kindergarten');
    Route::get('development/preparatory', [AdminExperiencesController::class, 'preparatory'])->name('development.preparatory');
    Route::get('development/siblings', [AdminExperiencesController::class, 'siblings'])->name('development.siblings');
    Route::get('development/social', [AdminExperiencesController::class, 'social'])->name('development.social');
    Route::get('development/home-learning', [AdminExperiencesController::class, 'homeLearning'])->name('development.home-learning');
    
    // Reports & Analytics
    Route::get('reports', [AdminReportsController::class, 'index'])->name('reports');
    Route::get('reports/export/{type}', [AdminReportsController::class, 'export'])->name('reports.export');
    
    // System Administration
    Route::get('system', [AdminSystemController::class, 'index'])->name('system');
    Route::post('system/users', [AdminSystemController::class, 'createUser'])->name('system.users.create');
    Route::put('system/users/{id}', [AdminSystemController::class, 'updateUser'])->name('system.users.update');
    Route::delete('system/users/{id}', [AdminSystemController::class, 'deleteUser'])->name('system.users.delete');
    Route::post('system/export', [AdminSystemController::class, 'exportDatabase'])->name('system.export');
    Route::post('system/clear-cache', [AdminSystemController::class, 'clearCache'])->name('system.clear-cache');
    Route::post('system/barangay-settings', [AdminSystemController::class, 'saveBarangaySettings'])->name('system.barangay-settings');

    // Activity Monitoring & Anomaly Detection
    Route::get('activity-monitoring', [ActivityLogController::class, 'index'])->name('activity-monitoring');
    Route::get('activity-monitoring/{id}', [ActivityLogController::class, 'show'])->name('activity-monitoring.show');
    Route::post('activity-monitoring/export', [ActivityLogController::class, 'export'])->name('activity-monitoring.export');

    // Settings - Puroks
    Route::get('settings/puroks', [\App\Http\Controllers\Admin\PurokController::class, 'index'])->name('settings.puroks');
    Route::post('settings/puroks', [\App\Http\Controllers\Admin\PurokController::class, 'store'])->name('settings.puroks.store');
    Route::put('settings/puroks/{purok}', [\App\Http\Controllers\Admin\PurokController::class, 'update'])->name('settings.puroks.update');
    Route::delete('settings/puroks/{purok}', [\App\Http\Controllers\Admin\PurokController::class, 'destroy'])->name('settings.puroks.destroy');
    Route::post('settings/puroks/seed', [\App\Http\Controllers\Admin\PurokController::class, 'seed'])->name('settings.puroks.seed');

    // Settings - Locations
    Route::get('settings/locations', [\App\Http\Controllers\Admin\LocationController::class, 'index'])->name('settings.locations');
    Route::post('settings/provinces', [\App\Http\Controllers\Admin\LocationController::class, 'storeProvince'])->name('settings.provinces.store');
    Route::put('settings/provinces/{province}', [\App\Http\Controllers\Admin\LocationController::class, 'updateProvince'])->name('settings.provinces.update');
    Route::delete('settings/provinces/{province}', [\App\Http\Controllers\Admin\LocationController::class, 'destroyProvince'])->name('settings.provinces.destroy');
    Route::post('settings/cities', [\App\Http\Controllers\Admin\LocationController::class, 'storeCity'])->name('settings.cities.store');
    Route::put('settings/cities/{city}', [\App\Http\Controllers\Admin\LocationController::class, 'updateCity'])->name('settings.cities.update');
    Route::delete('settings/cities/{city}', [\App\Http\Controllers\Admin\LocationController::class, 'destroyCity'])->name('settings.cities.destroy');
    Route::get('settings/provinces/{province}/cities', [\App\Http\Controllers\Admin\LocationController::class, 'citiesByProvince'])->name('settings.provinces.cities');
    
    // Welcome Page Content Management
    Route::get('welcome-content', [WelcomeContentController::class, 'index'])->name('welcome-content');
    Route::post('welcome-content', [WelcomeContentController::class, 'update'])->name('welcome-content.update');
    
    // Enrollment Management
    Route::get('enrollments', [\App\Http\Controllers\Admin\AdminEnrollmentController::class, 'index'])->name('enrollments');
    Route::post('enrollments/{id}/approve', [\App\Http\Controllers\Admin\AdminEnrollmentController::class, 'approve'])->name('enrollments.approve');
    Route::post('enrollments/{id}/reject', [\App\Http\Controllers\Admin\AdminEnrollmentController::class, 'reject'])->name('enrollments.reject');
    Route::delete('enrollments/pending', [\App\Http\Controllers\Admin\AdminEnrollmentController::class, 'clearPending'])->name('enrollments.clear-pending');
    
    // Appointment Management
    Route::get('appointments', [\App\Http\Controllers\Admin\AdminAppointmentController::class, 'index'])->name('appointments');
    Route::post('appointments/{id}/schedule', [\App\Http\Controllers\Admin\AdminAppointmentController::class, 'schedule'])->name('appointments.schedule');
    Route::post('appointments/{id}/complete', [\App\Http\Controllers\Admin\AdminAppointmentController::class, 'complete'])->name('appointments.complete');
    Route::post('appointments/{id}/cancel', [\App\Http\Controllers\Admin\AdminAppointmentController::class, 'cancel'])->name('appointments.cancel');
    
    // Development Plans
    Route::get('children/{childId}/development-plans', [\App\Http\Controllers\Admin\AdminDevelopmentPlanController::class, 'index'])->name('development-plans');
    Route::post('children/{childId}/development-plans', [\App\Http\Controllers\Admin\AdminDevelopmentPlanController::class, 'store'])->name('development-plans.store');
    Route::put('development-plans/{id}', [\App\Http\Controllers\Admin\AdminDevelopmentPlanController::class, 'update'])->name('development-plans.update');
    Route::delete('development-plans/{id}', [\App\Http\Controllers\Admin\AdminDevelopmentPlanController::class, 'destroy'])->name('development-plans.destroy');
    
    // Growth Data Management
    Route::get('children/{childId}/growth-data', [\App\Http\Controllers\Admin\AdminGrowthDataController::class, 'show'])->name('growth-data');
    Route::post('children/{childId}/growth-data', [\App\Http\Controllers\Admin\AdminGrowthDataController::class, 'store'])->name('growth-data.store');
    
    // Child Care Information
    Route::get('children/{childId}/care', [\App\Http\Controllers\Admin\ChildCareController::class, 'show'])->name('children.care.show');
    Route::get('children/{childId}/care/edit', [\App\Http\Controllers\Admin\ChildCareController::class, 'edit'])->name('children.care.edit');
    Route::post('children/{childId}/care', [\App\Http\Controllers\Admin\ChildCareController::class, 'store'])->name('children.care.store');
    Route::put('children/{childId}/care', [\App\Http\Controllers\Admin\ChildCareController::class, 'update'])->name('children.care.update');
    Route::delete('children/{childId}/care', [\App\Http\Controllers\Admin\ChildCareController::class, 'destroy'])->name('children.care.destroy');
    
    // Child Observations
    Route::get('children/{childId}/observations', [\App\Http\Controllers\Admin\ObservationController::class, 'index'])->name('children.observations.index');
    Route::get('children/{childId}/observations/create', [\App\Http\Controllers\Admin\ObservationController::class, 'create'])->name('children.observations.create');
    Route::post('children/{childId}/observations', [\App\Http\Controllers\Admin\ObservationController::class, 'store'])->name('children.observations.store');
    Route::get('children/{childId}/observations/{observationId}', [\App\Http\Controllers\Admin\ObservationController::class, 'show'])->name('children.observations.show');
    Route::get('children/{childId}/observations/{observationId}/edit', [\App\Http\Controllers\Admin\ObservationController::class, 'edit'])->name('children.observations.edit');
    Route::put('children/{childId}/observations/{observationId}', [\App\Http\Controllers\Admin\ObservationController::class, 'update'])->name('children.observations.update');
    Route::delete('children/{childId}/observations/{observationId}', [\App\Http\Controllers\Admin\ObservationController::class, 'destroy'])->name('children.observations.destroy');
    
    // Parent Involvement
    Route::get('children/{childId}/parent-involvement', [\App\Http\Controllers\Admin\ParentInvolvementController::class, 'show'])->name('children.parent-involvement.show');
    Route::get('children/{childId}/parent-involvement/edit', [\App\Http\Controllers\Admin\ParentInvolvementController::class, 'edit'])->name('children.parent-involvement.edit');
    Route::post('children/{childId}/parent-involvement', [\App\Http\Controllers\Admin\ParentInvolvementController::class, 'store'])->name('children.parent-involvement.store');
    Route::put('children/{childId}/parent-involvement', [\App\Http\Controllers\Admin\ParentInvolvementController::class, 'update'])->name('children.parent-involvement.update');
    Route::delete('children/{childId}/parent-involvement', [\App\Http\Controllers\Admin\ParentInvolvementController::class, 'destroy'])->name('children.parent-involvement.destroy');
});

// Parent Dashboard (Protected)
Route::middleware(['auth', 'parent'])->prefix('parent')->name('parent.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Parent\ParentDashboardController::class, 'index'])->name('dashboard');
    Route::get('my-children', [\App\Http\Controllers\Parent\ParentChildrenController::class, 'index'])->name('children.index');
    Route::get('my-children/{id}', [\App\Http\Controllers\Parent\ParentChildrenController::class, 'show'])->name('children.show');
    Route::get('health', [\App\Http\Controllers\Parent\ParentHealthController::class, 'index'])->name('health');
    Route::get('nutrition', [\App\Http\Controllers\Parent\ParentNutritionController::class, 'index'])->name('nutrition');
    Route::get('enroll', [\App\Http\Controllers\Parent\ParentEnrollmentController::class, 'create'])->name('enroll.create');
    Route::post('enroll', [\App\Http\Controllers\Parent\ParentEnrollmentController::class, 'store'])->name('enroll.store');
    Route::get('enrollment-requests', [\App\Http\Controllers\Parent\ParentEnrollmentController::class, 'index'])->name('enrollment.index');
    
    // Appointment Requests
    Route::post('appointments', [\App\Http\Controllers\Parent\ParentAppointmentController::class, 'store'])->name('appointments.store');
    Route::get('appointments', [\App\Http\Controllers\Parent\ParentAppointmentController::class, 'index'])->name('appointments.index');

    // Notifications
    Route::get('notifications', [\App\Http\Controllers\Parent\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('notifications/unread-count', [\App\Http\Controllers\Parent\NotificationController::class, 'unreadCount'])->name('notifications.unread');
    Route::post('notifications/{id}/read', [\App\Http\Controllers\Parent\NotificationController::class, 'markRead'])->name('notifications.read');
    Route::post('notifications/read-all', [\App\Http\Controllers\Parent\NotificationController::class, 'markAllRead'])->name('notifications.read-all');
    
    // View Development Plans
    Route::get('children/{childId}/development-plans', [\App\Http\Controllers\Parent\ParentDevelopmentPlanController::class, 'index'])->name('development-plans');
});

// Catch-all redirect for authenticated users
Route::middleware(['auth'])->get('dashboard', function () {
    if (auth()->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('parent.dashboard');
})->name('dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
