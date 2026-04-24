<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JobController extends Controller
{
    // Browse jobs page: show only open jobs from other users
    public function index()
    {
        return Job::where('status', 'open')
            ->where('client_id', '!=', Auth::id())
            ->with('client:id,name,email')
            ->latest()
            ->get();
    }

    // Create a new job
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'reward' => 'required|integer|min:1',
            'audio' => 'required|file|mimes:mp3,wav|max:10240'
        ]);

        return Job::create([
            'title' => $request->title,
            'description' => $request->description,
            'reward' => $request->reward,
            'client_id' => Auth::id(),
            'audio_path' => $path,
            'status' => 'open',
        ]);
    }

    // Accept a job
    public function accept($id)
    {
        $job = Job::findOrFail($id);

        // User cannot accept their own posted job
        if ($job->client_id === Auth::id()) {
            return response()->json([
                'message' => 'You cannot accept your own job.'
            ], 403);
        }

        // Only open jobs can be accepted
        if ($job->status !== 'open') {
            return response()->json([
                'message' => 'This job is no longer available.'
            ], 400);
        }

        $job->engineer_id = Auth::id();
        $job->status = 'in_progress';
        $job->save();

        return response()->json($job);
    }

    // Complete job and transfer points
    public function complete($id)
    {
        $job = Job::with(['client', 'engineer'])->findOrFail($id);

        // Only client can complete their posted job
        if ($job->client_id !== Auth::id()) {
            return response()->json([
                'message' => 'Only the client can complete this job.'
            ], 403);
        }

        // Only in-progress jobs can be completed
        if ($job->status !== 'in_progress') {
            return response()->json([
                'message' => 'Only in-progress jobs can be completed.'
            ], 400);
        }

        // Job must have an engineer
        if (!$job->engineer) {
            return response()->json([
                'message' => 'No engineer assigned to this job.'
            ], 400);
        }

        // Client must have enough points
        if ($job->client->points < $job->reward) {
            return response()->json([
                'message' => 'Client does not have enough points.'
            ], 400);
        }

        // Safe database transaction for point transfer
        DB::transaction(function () use ($job) {
            $job->client->points -= $job->reward;
            $job->engineer->points += $job->reward;

            $job->client->save();
            $job->engineer->save();

            $job->status = 'completed';
            $job->save();
        });

        return response()->json([
            'message' => 'Job completed and points transferred.',
            'job' => $job,
        ]);
    }

    // Jobs posted by logged-in user
    public function myPostedJobs()
    {
        return Job::where('client_id', Auth::id())
            ->with('engineer:id,name,email')
            ->latest()
            ->get();
    }

    // Jobs accepted by logged-in user
    public function myAcceptedJobs()
    {
        return Job::where('engineer_id', Auth::id())
            ->with('client:id,name,email')
            ->latest()
            ->get();
    }

    //Audio File Submission
    public function submit($id, Request $request)
{
        $job = Job::findOrFail($id);

        if ($job->engineer_id !== auth()->id()) {
            return response()->json(['message' => 'Not authorized'], 403);
        }

        if ($job->status !== 'in_progress') {
            return response()->json(['message' => 'Job not in progress'], 400);
        }

        $request->validate([
            'audio' => 'required|file|mimes:mp3,wav|max:10240'
        ]);

        $path = $request->file('audio')->store('submissions', 'public');

        $job->submission_path = $path;
        $job->save();

        return response()->json([
            'message' => 'Audio submitted',
            'job' => $job
        ]);
    }
}