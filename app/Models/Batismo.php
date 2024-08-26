<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Batismo extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'batismos';

    protected $hidden = [
        'deleted_at'
    ];

    protected $fillable = [
        'data_batismo',
        'ministerio',
        'file_cert_batismo',
        'membro_id'
    ];
}
