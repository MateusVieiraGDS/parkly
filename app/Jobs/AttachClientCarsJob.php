<?php

namespace App\Jobs;

use App\Models\Car;
use App\Models\Ticket;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AttachClientCarsJob implements ShouldQueue
{
    use Queueable;

    protected $ticketId;

    public function __construct($ticketId)
    {
        $this->ticketId = $ticketId;
    }

    public function handle()
    {
        try {
            $ticket = Ticket::findOrFail($this->ticketId);
            if($ticket->car_id){
                $car = Car::findOrFail($ticket->car_id);
                $client = $car->clients()->first();

                $ticket->client_id = $client->id;
                $ticket->save();
            }
            
        } catch (\Exception $e) {
            Log::error("Erro ao anexar comprovante ao cliente: " . $e->getMessage());
        }
    }
}
