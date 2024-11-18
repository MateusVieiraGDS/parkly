<?php

namespace App\Jobs;

use App\Jobs\FetchPlateDataJob;
use App\Services\ApiPlateService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Exception;

class PlateRecognitionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $ticketId;
    protected $imagePath;

    // Número máximo de tentativas
    public $tries = 5;

    public function __construct($ticketId, $imagePath)
    {
        $this->ticketId = $ticketId;
        $this->imagePath = $imagePath;
    }

    public function handle()
    {
        //try {
            // Faz o reconhecimento da placa usando Ollama
            /* $responsePlate = ApiPlateService::sendImageToOllama($this->imagePath); */
            $responsePlate = ApiPlateService::detectLicensePlate($this->imagePath);
            
            if ($responsePlate) {
                // Dispara o próximo Job para consultar a API e atualizar o ticket
                FetchPlateDataJob::dispatch($this->ticketId, $responsePlate);
            } else {
                Log::warning("Reconhecimento de placa falhou para o ticket ID {$this->ticketId}");
                throw new Exception("Reconhecimento de placa falhou para o ticket ID {$this->ticketId}");
            }
        /* } catch (Exception $e) {
            Log::error("Erro no reconhecimento da placa: " . $e->getMessage());
            // Lança a exceção para permitir que o Job seja re-tentado
            throw $e;
        } */
    }
}
