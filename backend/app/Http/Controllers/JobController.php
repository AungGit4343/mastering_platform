<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobController extends Controller
{
    public function index()
    {
        return Job::all();
    }

    public function store(Request $request)
    {
        return Job::create([
            'title' => $request->title,
            'description' => $request->description,
            'reward' => $request->reward,
            'client_id' => Auth::id(),
        ]);
    }

    public function accept($id)
    {
        $job = Job::findOrFail($id);
        $job->engineer_id = Auth::id();
        $job->status = 'in_progress';
        $job->save();

        return $job;
    }

    public function complete($id)
    {
        $job = Job::findOrFail($id);

        $engineer = $job->engineer;
        $client = $job->client;

        $engineer->points += $job->reward;
        $client->points -= $job->reward;

        $engineer->save();
        $client->save();

        $job->status = 'completed';
        $job->save();

        return $job;
    }
}