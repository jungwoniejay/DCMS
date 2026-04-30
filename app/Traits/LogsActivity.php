<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Jenssegers\Agent\Agent;

trait LogsActivity
{
    /**
     * Log an activity for the current user
     */
    protected function logActivity(
        string $action,
        ?string $description = null,
        ?string $actionType = null,
        ?string $modelType = null,
        ?int $modelId = null,
        ?array $properties = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        bool $isSuspicious = false,
        ?string $suspicionReason = null
    ): ActivityLog {
        $agent = new Agent();
        
        return ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'action_type' => $actionType,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'description' => $description,
            'properties' => $properties ? json_encode($properties) : null,
            'old_values' => $oldValues ? json_encode($oldValues) : null,
            'new_values' => $newValues ? json_encode($newValues) : null,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'browser' => $agent->browser(),
            'os' => $agent->platform(),
            'device_type' => $agent->isMobile() ? 'mobile' : ($agent->isTablet() ? 'tablet' : 'desktop'),
            'country' => $this->getCountryFromIp(Request::ip()),
            'city' => $this->getCityFromIp(Request::ip()),
            'is_suspicious' => $isSuspicious,
            'suspicion_reason' => $suspicionReason,
        ]);
    }

    /**
     * Log a login activity
     */
    protected function logLogin(?string $suspicionReason = null): void
    {
        $this->logActivity(
            'login',
            'User logged in',
            'authentication',
            null,
            null,
            null,
            null,
            null,
            $suspicionReason !== null,
            $suspicionReason
        );
    }

    /**
     * Log a logout activity
     */
    protected function logLogout(): void
    {
        $this->logActivity(
            'logout',
            'User logged out',
            'authentication',
            null,
            null,
            null,
            null,
            null,
            false,
            null
        );
    }

    /**
     * Log a failed login attempt
     */
    protected function logFailedLogin(string $email, ?string $reason = null): void
    {
        $this->logActivity(
            'failed_login',
            "Failed login attempt for email: {$email}",
            'authentication',
            null,
            null,
            ['email' => $email],
            null,
            null,
            true,
            $reason ?? 'Failed login attempt'
        );
    }

    /**
     * Log a create action
     */
    protected function logCreate(string $modelType, $model, ?string $description = null): void
    {
        $this->logActivity(
            'create',
            $description ?? "Created {$modelType} #{$model->getKey()}",
            strtolower(class_basename($modelType)),
            $modelType,
            $model->getKey(),
            null,
            null,
            $model->toArray(),
            false,
            null
        );
    }

    /**
     * Log an update action
     */
    protected function logUpdate(string $modelType, $model, array $oldValues, array $newValues, ?string $description = null): void
    {
        $this->logActivity(
            'update',
            $description ?? "Updated {$modelType} #{$model->getKey()}",
            strtolower(class_basename($modelType)),
            $modelType,
            $model->getKey(),
            null,
            $oldValues,
            $newValues,
            false,
            null
        );
    }

    /**
     * Log a delete action
     */
    protected function logDelete(string $modelType, $model, ?string $description = null): void
    {
        $this->logActivity(
            'delete',
            $description ?? "Deleted {$modelType} #{$model->getKey()}",
            strtolower(class_basename($modelType)),
            $modelType,
            $model->getKey(),
            $model->toArray(),
            null,
            null,
            false,
            null
        );
    }

    /**
     * Log a view action
     */
    protected function logView(string $modelType, $model, ?string $description = null): void
    {
        $this->logActivity(
            'view',
            $description ?? "Viewed {$modelType} #{$model->getKey()}",
            strtolower(class_basename($modelType)),
            $modelType,
            $model->getKey(),
            null,
            null,
            null,
            false,
            null
        );
    }

    /**
     * Log an export action
     */
    protected function logExport(string $type, ?string $description = null): void
    {
        $this->logActivity(
            'export',
            $description ?? "Exported {$type}",
            'export',
            null,
            null,
            ['type' => $type],
            null,
            null,
            false,
            null
        );
    }

    /**
     * Log a suspicious activity
     */
    protected function logSuspicious(string $action, string $reason, ?array $properties = null): void
    {
        $this->logActivity(
            $action,
            "Suspicious activity: {$reason}",
            'security',
            null,
            null,
            $properties,
            null,
            null,
            true,
            $reason
        );
    }

    /**
     * Check for suspicious login patterns
     */
    protected function checkSuspiciousLogin(string $email): ?string
    {
        $ip = Request::ip();
        
        // Check for multiple failed logins from same IP
        $failedLogins = ActivityLog::where('action', 'failed_login')
            ->where('ip_address', $ip)
            ->where('created_at', '>=', now()->subMinutes(15))
            ->count();
        
        if ($failedLogins >= 5) {
            return "Multiple failed login attempts ({$failedLogins}) from IP {$ip} in the last 15 minutes";
        }
        
        // Check for logins from different countries within short time
        $recentLogins = ActivityLog::where('user_id', Auth::id() ?: null)
            ->where('action', 'login')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();
        
        if ($recentLogins->count() >= 2) {
            $countries = $recentLogins->pluck('country')->unique();
            if ($countries->count() > 1) {
                return "Login from different country (previous logins from: " . $countries->join(', ') . ")";
            }
        }
        
        return null;
    }

    /**
     * Get country from IP (simplified - in production use a proper GeoIP service)
     */
    private function getCountryFromIp(?string $ip): ?string
    {
        // This is a simplified version. In production, use a proper GeoIP service
        // like maxmind/geoip2 or ipinfo/geoip
        if (!$ip) return null;
        
        // Check if it's a local/private IP
        if (in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
            return 'Local';
        }
        
        // For demo purposes, return null
        // In production, integrate with a GeoIP service
        return null;
    }

    /**
     * Get city from IP (simplified - in production use a proper GeoIP service)
     */
    private function getCityFromIp(?string $ip): ?string
    {
        // This is a simplified version. In production use a proper GeoIP service
        if (!$ip) return null;
        
        if (in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
            return 'Local';
        }
        
        return null;
    }
}