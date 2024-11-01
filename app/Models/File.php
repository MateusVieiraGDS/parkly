<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'pathname',
        'mime',
        'size'
    ];    

    protected function pathname(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->pathname ? Storage::url($this->pathname) : null,
        );
    }
}
