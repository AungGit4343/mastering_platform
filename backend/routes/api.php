<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum', )->group(function () {
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/jobs', [JobController::class, 'index']);
    Route::post('/jobs', [JobController::class, 'store']);
    Route::post('/jobs/{id}/accept', [JobController::class, 'accept']);
    Route::post('/jobs/{id}/complete', [JobController::class, 'complete']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/jobs', [AdminController::class, 'jobs']);
    Route::delete('/jobs/{id}', [AdminController::class, 'deleteJob']);
});