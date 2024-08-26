<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class UploadFile extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'files';

    protected $hidden = ['id'];

    protected $fillable = [
        'pathname',
        'mime',
        'size',
    ];

    protected function pathname(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => !empty($value)? Storage::url($value) : ''
        );
    }
}
