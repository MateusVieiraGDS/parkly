<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Telefone extends Model
{
    use HasFactory;
    
    protected $table = 'telefones';

    protected $hidden = [
        'deleted_at'
    ];

    protected $fillable = [
        'numero',
        'tipo',
        'membro_id'
    ];
}
