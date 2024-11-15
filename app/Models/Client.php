<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'telefone',
        'cpf',
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
