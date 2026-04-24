<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\AdminController;

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Logged-in user routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);

    // Job routes
    Route::get('/jobs', [JobController::class, 'index']);
    Route::post('/jobs', [JobController::class, 'store']);
    Route::post('/jobs/{id}/accept', [JobController::class, 'accept']);
    Route::post('/jobs/{id}/complete', [JobController::class, 'complete']);

    // My jobs routes
    Route::get('/my-posted-jobs', [JobController::class, 'myPostedJobs']);
    Route::get('/my-accepted-jobs', [JobController::class, 'myAcceptedJobs']);
});

// Admin-only routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/jobs', [AdminController::class, 'jobs']);
    Route::delete('/jobs/{id}', [AdminController::class, 'deleteJob']);

    // Admin updates user password and points
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);

    // Audio Submit 
    Route::post('/jobs/{id}/submit', [JobController::class, 'submit']);
});