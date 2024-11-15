<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketPayment extends Model
{
    use HasFactory;
    protected $table = 'ticket_payments';

    protected $fillable = [
        'ticket_id',
    ];
}
