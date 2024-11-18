<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\UploadTrait;
use App\Jobs\PlateRecognitionJob;
use App\Models\ApiPlate;
use App\Models\Image;
use App\Models\Ticket;
use App\Models\TicketPayment;
use App\Services\ApiPlateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CheckinController extends Controller
{
    use UploadTrait;

    /**
     * Realiza o check-in (entrada) no estacionamento.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkin(Request $request)
    {
        // Validação da requisição: pelo menos 'plate' ou 'image' deve ser fornecido
        $validator = Validator::make($request->all(), [
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        if (!$request->hasFile('image')) {
            return response()->json(['error' => 'Você deve fornecer a imagem do veículo com a placa visivel.'], 422);
        }

        $plate = $request->input('plate');
        $imagePath = null;
        $apiPlate = null;

        $uploadedImage = $request->file('image');
        $imagePath = $this->upload($uploadedImage, 'vehicle_images');
        $image = Image::create(['pathname' => $imagePath]);

        // Criação do ticket
        $ticket = Ticket::create([
            'valor_hora' => 10.00,
            'image_id' => $imagePath ? $image->id : null,
        ]);

        if($imagePath)
            PlateRecognitionJob::dispatch($ticket->id, $imagePath);

        // Formata o horário de entrada (created_at) no padrão brasileiro
        $createdAtFormatted = $ticket->created_at->format('d/m/Y H:i');
        
        return response()->json([
            'ticket_code' => Crypt::encrypt($ticket->id),
            'ticket_number' => $ticket->id,
            'entry_time' => $createdAtFormatted,
        ], 201);
    }
    
    /**
     * Realiza o check-out (entrada) no estacionamento.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkout(Request $request)
    {
        //verifica se recebeu o parametro data contendo o conteúdo criptografado e tenta descriptografar para recuperar o ticket\
        if(!$request->has('data'))
            return response()->json([
                "success" => false,
                "message" => "",
            ], 400);
        try {
            $ticketId = Crypt::decrypt($request->input('data'));
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "",
            ], 400);
        }
        $ticket = Ticket::findOrFail($ticketId);

        //verifica se o ticket possui pagamento atraves do relacionmento payment, se tiver recusa o checkout
        if(!$ticket->payment)
            return response()->json([
                "success" => false,
                "message" => "Esse ticket está em aberto... por favor dirija-se á um dos caixas.",
            ], 422);

        $ticket->update(['saida' => now()]);

        //retorna 200 para abrir a cancela e coloca o carimbo de dia e hora no campo saida
        return response()->json([
            "success" => true,
            "message" => "Agradeçemos sua visita, boa viagem!",
        ], 200);

    }
}
