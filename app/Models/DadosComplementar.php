<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DadosComplementar extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'dados_complementares';

    protected $hidden = [
        'deleted_at'
    ];

    protected $fillable = [
        'nome_pai',
        'nome_mae',
        'ministerio_anterior',
        'membro_id'
    ];
}
