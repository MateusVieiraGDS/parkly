<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'telefone',
        'cpf',
    ];

    public function cars()
    {
        return $this->belongsToMany(Car::class, 'client_car')->withPivot('id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
