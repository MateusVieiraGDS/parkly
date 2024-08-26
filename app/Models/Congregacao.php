<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Congregacao extends Model
{
    use HasFactory;

    protected $table = 'congregacoes';

    protected $hidden = [
        'deleted_at'
    ];

    protected $fillable = [
        'nome',
        'rua',
        'numero',
        'bairro',
        'cidade',
        'uf',
        'complemento',
        'cep',
        'dirigente_user_id',
    ];
}
