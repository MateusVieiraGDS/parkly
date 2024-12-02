<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'valor_hora',
        'car_id',
        'image_id',
        'client_id',
        'saida',
    ];

    protected $casts = [
        'saida' => 'datetime',
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function image()
    {
        return $this->belongsTo(Image::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function payment()
    {
        return $this->hasOne(TicketPayment::class);
    }
}
