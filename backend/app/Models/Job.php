<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    // Fields allowed for mass assignment
    protected $fillable = [
        'title',
        'description',
        'reward',
        'client_id',
        'engineer_id',
        'status',
        'audio_path',
        'submission_path'
    ];

    // Job belongs to client/user who posted it
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    // Job belongs to engineer/user who accepted it
    public function engineer()
    {
        return $this->belongsTo(User::class, 'engineer_id');
    }
}