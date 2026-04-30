<?php

namespace App\Listeners;

use App\Models\ActivityLog;
use App\Traits\LogsActivity;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Failed;
use Illuminate\Support\Facades\Request;
use Jenssegers\Agent\Agent;

class LogAuthenticatedSession
{
    use LogsActivity;

    /**
     * Handle the login event
     */
    public function handleLogin(Login $event): void
    {
        $user = $event->user;
        $suspicionReason = $this->checkSuspiciousLogin($user->email);
        
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'action_type' => 'authentication',
            'description' => 'User logged in',
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'browser' => (new Agent())->browser(),
            'os' => (new Agent())->platform(),
            'device_type' => (new Agent())->isMobile() ? 'mobile' : ((new Agent())->isTablet() ? 'tablet' : 'desktop'),
            'is_suspicious' => $suspicionReason !== null,
            'suspicion_reason' => $suspicionReason,
        ]);
    }

    /**
     * Handle the logout event
     */
    public function handleLogout(Logout $event): void
    {
        if (!$event->user) return;
        
        ActivityLog::create([
            'user_id' => $event->user->id,
            'action' => 'logout',
            'action_type' => 'authentication',
            'description' => 'User logged out',
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'browser' => (new Agent())->browser(),
            'os' => (new Agent())->platform(),
            'device_type' => (new Agent())->isMobile() ? 'mobile' : ((new Agent())->isTablet() ? 'tablet' : 'desktop'),
            'is_suspicious' => false,
        ]);
    }

    /**
     * Handle the failed login event
     */
    public function handleFailed(Failed $event): void
    {
        // Check for multiple failed attempts
        $ip = Request::ip();
        $failedCount = ActivityLog::where('action', 'failed_login')
            ->where('ip_address', $ip)
            ->where('created_at', '>=', now()->subMinutes(15))
            ->count();
        
        $totalCount = $failedCount + 1;
        $isSuspicious = $failedCount >= 4; // This attempt makes it 5 or more
        $reason = null;
        $email = $event->credentials['email'] ?? 'unknown';
        
        if ($isSuspicious) {
            $reason = "Multiple failed login attempts (" . $totalCount . ") from IP " . $ip . " in the last 15 minutes";
        } elseif ($failedCount > 0) {
            $reason = "Failed login attempt (" . $totalCount . " attempts from this IP)";
        } else {
            $reason = "Failed login attempt";
        }
        
        ActivityLog::create([
            'user_id' => null, // User not authenticated yet
            'action' => 'failed_login',
            'action_type' => 'authentication',
            'description' => 'Failed login attempt for email: ' . $email,
            'properties' => json_encode([
                'email' => $event->credentials['email'] ?? null,
                'ip' => $ip,
            ]),
            'ip_address' => $ip,
            'user_agent' => Request::userAgent(),
            'browser' => (new Agent())->browser(),
            'os' => (new Agent())->platform(),
            'device_type' => (new Agent())->isMobile() ? 'mobile' : ((new Agent())->isTablet() ? 'tablet' : 'desktop'),
            'is_suspicious' => $isSuspicious,
            'suspicion_reason' => $reason,
        ]);
    }
}