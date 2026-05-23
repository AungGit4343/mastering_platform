<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // Admin dashboard statistics
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_jobs' => Job::count(),
            'completed_jobs' => Job::where('status', 'completed')->count(),
            'open_jobs' => Job::where('status', 'open')->count(),
            'total_points' => User::sum('points'),
        ]);
    }

    // Get all users for admin user management page
    public function users()
    {
        return response()->json(
            User::where('is_admin', false) //exclude admins
                ->select('id', 'name', 'email', 'points', 'is_admin', 'created_at')
                ->get()
        );
    }

    // Get all jobs with client and engineer details
    public function jobs()
    {
        return response()->json(
            Job::with(['client:id,name,email', 'engineer:id,name,email'])->get()
        );
    }

    // Delete a job from admin panel
    public function deleteJob($id)
    {
        $job = Job::findOrFail($id);
        $job->delete();

        return response()->json(['message' => 'Job deleted']);
    }

    // Update user password and points from admin panel
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Reset password only if admin entered a new password
        if ($request->filled('password')) {
            $request->validate([
                'password' => 'min:6|confirmed',
            ]);

            $user->password = Hash::make($request->password);
        }

        $user = User::findOrFail($id);

        //Prevent Updating Admin
        if ($user->is_admin) {
            return response()->json([
                'message' => 'You cannot modify admin users.'
            ], 403);
        }

        // Add or subtract user points
        if ($request->has('points_change')) {
            $user->points += (int) $request->points_change;

            // Prevent negative points
            if ($user->points < 0) {
                $user->points = 0;
            }
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }

    // Delete a user from admin panel

    public function deleteUser($id)
    {
        $admin = auth()->user();

        // Only admin can delete users
        if (!$admin || !$admin->is_admin) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // Prevent admin deleting themselves
        if ($admin->id == $id) {
            return response()->json([
                'message' => 'You cannot delete your own admin account'
            ], 400);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Optional: delete jobs created by this user or accepted by this user
        Job::where('client_id', $user->id)
            ->orWhere('engineer_id', $user->id)
            ->delete();

        // Delete user completely
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}
