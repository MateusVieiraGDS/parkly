<?php

namespace App\Jobs;

use App\Models\ApiPlate;
use App\Models\Cars;
use App\Models\Ticket;
use App\Services\ApiPlateService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class FetchPlateDataJob/*  implements ShouldQueue */
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $ticketId;
    protected $plate;

    public function __construct($ticketId, $plate)
    {
        $this->ticketId = $ticketId;
        $this->plate = Str::upper($plate);
    }

    public function handle()
    {
        try {
            // Verifica se a placa já existe na tabela 'api_plates'
            $apiPlate = ApiPlate::where('plate', $this->plate)->first();
            if (!$apiPlate || $apiPlate->data == null) {
                $plate_data = ApiPlateService::fetchPlateData($this->plate);                

                $apiPlate = ApiPlate::create([
                    'plate' => $this->plate,
                    'data' => $plate_data === false ? null : $plate_data,
                ]);
            }

            $car = Cars::firstOrCreate([
                'plate' => $this->plate,
            ]);
            $car->fillFromApiResponse($apiPlate->id, $apiPlate->data);
            $car->save();

            Ticket::where('id', $this->ticketId)->update(['car_id' => $car->id]);
        } catch (\Exception $e) {
            Log::error("Erro na consulta da placa: " . $e->getMessage());
        }
    }
}
