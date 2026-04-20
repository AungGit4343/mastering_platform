<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Job;
use Illuminate\Http\Request;

class AdminController extends Controller
{
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

    public function users()
    {
        return response()->json(User::select('id', 'name', 'email', 'points', 'is_admin', 'created_at')->get());
    }

    public function jobs()
    {
        return response()->json(
            Job::with(['client:id,name,email', 'engineer:id,name,email'])->get()
        );
    }

    public function deleteJob($id)
    {
        $job = Job::findOrFail($id);
        $job->delete();

        return response()->json(['message' => 'Job deleted']);
    }
}