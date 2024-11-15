<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApiPlate extends Model
{
    use HasFactory;

    protected $fillable = [
        'plate',
        'data',
    ];

    protected $casts = [
        'data' => 'json',
    ];

    public function clientPlates()
    {
        return $this->hasMany(ClientPlate::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
