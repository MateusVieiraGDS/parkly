<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParkConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'vagas',
        'valor_hora',
        'abertura',
        'fechamento',
        'is_active',
    ];

    protected $casts = [
        'abertura' => 'datetime:H:i',
        'fechamento' => 'datetime:H:i',
        'is_active' => 'boolean',
        'valor_hora' => 'float',
    ];
}
