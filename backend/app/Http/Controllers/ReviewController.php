<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request, $jobId)
    {
        $request->validate([
            'stars' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $job = Job::findOrFail($jobId);

        if ($job->client_id !== Auth::id()) {
            return response()->json(['message' => 'Only the client can review this job.'], 403);
        }

        if ($job->status !== 'completed') {
            return response()->json(['message' => 'Only completed jobs can be reviewed.'], 400);
        }

        if (!$job->engineer_id) {
            return response()->json(['message' => 'No engineer assigned.'], 400);
        }

        $review = Review::create([
            'job_id' => $job->id,
            'reviewer_id' => Auth::id(),
            'engineer_id' => $job->engineer_id,
            'stars' => $request->stars,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $review,
        ]);
    }
}