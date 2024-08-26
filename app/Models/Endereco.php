<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Endereco extends Model
{
    use HasFactory;
    
    protected $table = 'enderecos';

    protected $hidden = [
        'deleted_at'
    ];

    protected $fillable = [
        'rua',
        'numero',
        'bairro',
        'city_id',
        'state_id',
        'complemento',
        'cep',
        'membro_id'
    ];

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }
}
