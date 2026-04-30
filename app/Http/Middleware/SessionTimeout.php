<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SessionTimeout
{
    // Idle timeout in seconds (30 minutes)
    private const TIMEOUT = 1800;

    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $lastActivity = session('last_activity_time');

            if ($lastActivity && (time() - $lastActivity) > self::TIMEOUT) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                if ($request->expectsJson() || $request->header('X-Inertia')) {
                    return response()->json(['message' => 'Session expired. Please log in again.'], 401);
                }

                return redirect()->route('login')->with('error', 'Your session has expired due to inactivity. Please log in again.');
            }

            session(['last_activity_time' => time()]);
        }

        return $next($request);
    }
}
