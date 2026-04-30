<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ParentMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || auth()->user()->role !== 'parent') {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                abort(403, 'Access denied.');
            }
            return redirect()->route('welcome')->with('error', 'Access denied.');
        }

        return $next($request);
    }
}
