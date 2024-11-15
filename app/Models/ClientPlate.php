<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientPlate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'api_plate_id',
        'client_id',
    ];

    public function apiPlate()
    {
        return $this->belongsTo(ApiPlate::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
