<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    // Create a new job with one audio file
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'reward' => 'required|integer|min:1',
            'deadline' => 'required|date|after_or_equal:today',
            'audio' => 'required|file|mimes:mp3,wav|max:102400',
        ]);

        $path = null;

        if ($request->hasFile('audio')) {
            $path = $request->file('audio')->store('jobs', 'public');
        }

        return Job::create([
            'title' => $request->title,
            'description' => $request->description,
            'reward' => $request->reward,
            'client_id' => Auth::id(),
            'audio_path' => $path,
            'status' => 'open',
            'deadline' => $request->deadline,
        ]);
    }

    // Delete a job only if the logged-in user owns it and it is still open
    public function destroy($id)
    {
        $job = Job::findOrFail($id);

        if ($job->client_id !== Auth::id()) {
            return response()->json([
                'message' => 'Not authorized',
            ], 403);
        }

        $deadlinePassed = $job->deadline && now()->toDateString() > $job->deadline;

        if ($job->status !== 'open' && !$deadlinePassed) {
            return response()->json([
                'message' => 'You can only delete accepted jobs after the deadline has passed',
            ], 400);
        }

        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully',
        ]);
    }

    // Accept a job
    public function accept($id)
    {
        $job = Job::findOrFail($id);

        if ($job->client_id === Auth::id()) {
            return response()->json([
                'message' => 'You cannot accept your own job.',
            ], 403);
        }

        if ($job->status !== 'open') {
            return response()->json([
                'message' => 'This job is no longer available.',
            ], 400);
        }

        $job->engineer_id = Auth::id();
        $job->status = 'in_progress';
        $job->save();

        return response()->json($job);
    }

    // Complete job and transfer points from client to engineer
    public function complete($id)
    {
        $job = Job::with(['client', 'engineer'])->findOrFail($id);

        if ($job->client_id !== Auth::id()) {
            return response()->json([
                'message' => 'Only the client can complete this job.',
            ], 403);
        }

        if ($job->status !== 'in_progress') {
            return response()->json([
                'message' => 'Only in-progress jobs can be completed.',
            ], 400);
        }

        if (!$job->engineer) {
            return response()->json([
                'message' => 'No engineer assigned to this job.',
            ], 400);
        }

        if ($job->client->points < $job->reward) {
            return response()->json([
                'message' => 'Client does not have enough points.',
            ], 400);
        }

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
            ->with('engineer:id,name,email', 'review')
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

    // Engineer submits completed audio file
    public function submit($id, Request $request)
    {
        $job = Job::findOrFail($id);

        if ($job->engineer_id !== Auth::id()) {
            return response()->json([
                'message' => 'Not authorized',
            ], 403);
        }

        if ($job->status !== 'in_progress') {
            return response()->json([
                'message' => 'Job not in progress',
            ], 400);
        }

        $request->validate([
            'audio' => 'required|file|mimes:mp3,wav|max:102400',
        ]);

        $path = $request->file('audio')->store('submissions', 'public');

        $job->submission_path = $path;
        $job->save();

        return response()->json([
            'message' => 'Audio submitted',
            'job' => $job,
        ]);
    }

    // Extend job deadline
    // Only the client who posted the job can extend it

    public function extendDeadline(Request $request, int $id)
    {
        $job = Job::findOrFail($id);

        // Only job owner can extend deadline
        if ($job->client_id !== Auth::id()) {
            return response()->json([
                'message' => 'Not authorized',
            ], 403);
        }

        // Completed jobs should not be extended
        if ($job->status === 'completed') {
            return response()->json([
                'message' => 'Completed jobs cannot be extended',
            ], 400);
        }

        // Validate new deadline
        $request->validate([
            'deadline' => 'required|date|after:today',
        ]);

        $job->deadline = $request->deadline;
        $job->save();

        return response()->json([
            'message' => 'Deadline extended successfully',
            'job' => $job,
        ]);
    }
}
