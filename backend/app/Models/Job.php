<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Job extends Model
{
    protected $fillable = [
        'title',
        'description',
        'reward',
        'client_id',
        'engineer_id',
        'status',
    ];

    // 👇 The user who created the job
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    // 👇 The user who takes the job
    public function engineer()
    {
        return $this->belongsTo(User::class, 'engineer_id');
    }
}