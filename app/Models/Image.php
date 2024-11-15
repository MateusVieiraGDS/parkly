<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'pathname',
    ];

    protected function pathname(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => !empty($value)? Storage::disk('do')->url($value) : ''
        );
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
