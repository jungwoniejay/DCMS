<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ParentMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            \Log::warning('ParentMiddleware: not authenticated', ['session_id' => session()->getId(), 'url' => $request->url()]);
            return redirect()->route('login');
        }
        if (auth()->user()->role !== 'parent') {
            \Log::warning('ParentMiddleware: wrong role', ['role' => auth()->user()->role, 'url' => $request->url()]);
            return redirect()->route('welcome');
        }
        return $next($request);
    }
}
