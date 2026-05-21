<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\User;
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

    // Leaderboard using Bayesian weighted rating
    // Shows engineers ranked fairly by rating
    public function leaderboard()
    {
        $m = 3; // minimum review threshold

        // Global average rating across all reviews
        $C = Review::avg('stars') ?? 0;

        $engineers = User::whereHas('receivedReviews')
            ->withCount([
                'receivedReviews as completed_jobs'
            ])
            ->withAvg('receivedReviews as average_rating', 'stars')
            ->get()
            ->map(function ($user) use ($m, $C) {
                $R = $user->average_rating ?? 0;
                $v = $user->completed_jobs ?? 0;

                // Bayesian weighted rating formula
                $bayesianRating = ($v / ($v + $m)) * $R + ($m / ($v + $m)) * $C;

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'completed_jobs' => $v,
                    'average_rating' => round($R, 2),
                    'bayesian_rating' => round($bayesianRating, 2),
                ];
            })
            ->sortByDesc('bayesian_rating')
            ->values();

        return response()->json($engineers);
    }


    // Public engineer profile
    // Shows safe public information only

    public function publicProfile(int $id)
    {
        $user = User::withCount([
            'receivedReviews as completed_jobs'
        ])
            ->withAvg('receivedReviews as average_rating', 'stars')
            ->with([
                'receivedReviews' => function ($query) {
                    $query->with('reviewer:id,name')
                        ->select(
                            'id',
                            'job_id',
                            'reviewer_id',
                            'engineer_id',
                            'stars',
                            'comment',
                            'created_at'
                        )
                        ->latest();
                }
            ])
            ->findOrFail($id);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'completed_jobs' => $user->completed_jobs,
            'average_rating' => round($user->average_rating ?? 0, 2),
            'reviews' => $user->receivedReviews,
            'about' => $user->about,
            'education' => $user->education,
            'experience' => $user->experience,
            'profile_photo' => $user->profile_photo,
        ]);
    }
}
