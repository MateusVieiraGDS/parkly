<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Consagracao extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'consagracoes';

    protected $hidden = [
        'deleted_at'
    ];

    protected $fillable = [
        'data_consagracao',
        'ministerio',
        'membro_id',
        'cargo_id',
        'file_cert_consagracao'
    ];
}
