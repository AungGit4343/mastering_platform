<?php

namespace App\Http\Controllers;

// Import required classes
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // =========================
    // REGISTER USER
    // =========================
    public function register(Request $request)
    {
        // Validate input fields
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed', // password_confirmation required
        ]);

        // Create new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'points' => 0,
            'is_admin' => false, // default user
        ]);

        // Return created user
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ]);
    }


    // =========================
    // LOGIN USER
    // =========================
    public function login(Request $request)
    {
        // Validate login input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // Check credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Generate API token using Laravel Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return token + user data (IMPORTANT for frontend)
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'points' => $user->points,
                'is_admin' => $user->is_admin,
            ],
        ]);
    }


    // =========================
    // GET CURRENT USER (AUTH)
    // =========================
    public function me(Request $request)
    {
        // Return authenticated user info
        return response()->json($request->user());
    }
}