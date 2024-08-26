<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Casamento extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'casamentos';

    protected $hidden = [
        'deleted_at'
    ];

    protected $fillable = [
        'data_casamento',
        'file_cert_casamento',
        'membro_conjuge_1',
        'membro_conjuge_2'
    ];
}
