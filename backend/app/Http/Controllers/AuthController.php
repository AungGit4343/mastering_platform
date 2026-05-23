<?php

namespace App\Http\Controllers;

// Import required classes
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // REGISTER USER
    public function register(Request $request)
    {
        // Validate all registration fields
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',

            // Required profile information
            'about' => 'required|string|max:1000',
            'education' => 'required|string|max:1000',
            'experience' => 'required|string|max:1000',
        ]);

        // Create user only after validation passes
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),

            // Reward new users with points to encourage engagement
            'points' => 100,
            'is_admin' => false,

            // Save required profile details
            'about' => $request->about,
            'education' => $request->education,
            'experience' => $request->experience,
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ]);
    }

    // LOGIN USER
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

    //EDIT USER PROFILE
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Validate editable user fields
        $request->validate([
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6|confirmed',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',

            // Required profile fields
            'about' => 'required|string|max:1000',
            'education' => 'required|string|max:1000',
            'experience' => 'required|string|max:1000',
        ]);

        // Username/name is intentionally locked
        $user->email = $request->email;

        // Update required profile details
        $user->about = $request->about;
        $user->education = $request->education;
        $user->experience = $request->experience;

        // Update password only if user entered one
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // Upload profile photo if selected
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('profiles', 'public');
            $user->profile_photo = $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    // GET CURRENT USER (AUTH)
    public function me(Request $request)
    {
        // Return authenticated user info
        return response()->json($request->user());
    }
}
