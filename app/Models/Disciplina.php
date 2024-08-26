<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disciplina extends Model
{
    use HasFactory;
    
    protected $table = 'disciplinas';

    protected $hidden = [
        'deleted_at'
    ];

    protected $fillable = [
        'dataExpiracao',
        'descricao',
        'membro_id'
    ];
}
