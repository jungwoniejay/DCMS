<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password'  => ['required', 'confirmed', Rules\Password::defaults()],
            'role'      => 'required|in:parent,admin',
            'admin_key' => 'nullable|string',
        ]);

        if ($request->role === 'admin') {
            $validKey = env('ADMIN_REGISTER_KEY', 'Brgy2DMS@AdminKey2024');
            if (trim($request->admin_key) !== trim($validKey)) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'admin_key' => 'Invalid admin registration key.',
                ]);
            }
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role === 'admin' ? 'admin' : 'parent',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return $user->role === 'admin' ? to_route('admin.dashboard') : to_route('parent.dashboard');
    }
}
