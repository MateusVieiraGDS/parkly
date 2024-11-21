<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator; // Importar a classe Validator

class IntegrationDataController extends Controller
{
    public function getTickets(Request $request)
    {
        // Definir as regras de validação
        $rules = [
            'date' => 'required|date',
        ];

        // Definir mensagens de erro personalizadas (opcional)
        $messages = [
            'date.required' => 'O campo data é obrigatório.',
            'date.date' => 'O campo data deve ser uma data válida.',
        ];

        // Criar uma instância de Validator
        $validator = Validator::make($request->all(), $rules, $messages);

        // Verificar se a validação falhou
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422); // Código de status 422 Unprocessable Entity
        }

        // Obter a data fornecida
        $date = $request->input('date');

        try {
            // Converter a string de data para um objeto Carbon e definir o final do dia
            $parsedDate = Carbon::parse($date)->endOfDay();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Formato de data inválido'], 400);
        }

        // Calcular o intervalo de 7 dias até a data fornecida (inclusive)
        $startDate = $parsedDate->copy()->subDays(6)->startOfDay(); // 6 dias antes + dia atual = 7 dias
        $endDate = $parsedDate->copy(); // Inclui até o final do dia fornecido

        // Consultar os tickets no intervalo de datas
        $tickets = Ticket::with(['payment', 'client', 'image', 'car'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('id', 'desc')
            ->get();

        if ($tickets->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum ticket encontrado nos últimos 7 dias até a data fornecida.'
            ], 200);
        }

        // Retornar os tickets
        return response()->json([
            'tickets' => $tickets
        ], 200);
    }




    /**
     * Método para obter tickets para segurança.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTicketsForSecurity(Request $request)
    {
        // 1. Definir as regras de validação
        $rules = [
            'date' => 'required|date',
        ];

        // 2. Definir mensagens de erro personalizadas (opcional)
        $messages = [
            'date.required' => 'O campo data é obrigatório.',
            'date.date' => 'O campo data deve ser uma data válida.',
        ];

        // 3. Criar uma instância de Validator
        $validator = Validator::make($request->all(), $rules, $messages);

        // 4. Verificar se a validação falhou
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422); // 422 Unprocessable Entity
        }

        // 5. Obter a data fornecida
        $date = $request->input('date');

        try {
            // Converter a string de data para um objeto Carbon e definir o final do dia
            $parsedDate = Carbon::parse($date)->endOfDay();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Formato de data inválido.'], 400); // 400 Bad Request
        }

        // 6. Calcular o intervalo de 7 dias até a data fornecida (inclusive)
        $startDate = $parsedDate->copy()->subDays(6)->startOfDay(); // 6 dias antes + dia atual = 7 dias
        $endDate = $parsedDate->copy(); // Inclui até o final do dia fornecido

        // 7. Consultar os tickets no intervalo de datas com car_id não nulo
        $tickets = Ticket::with(['car' => function ($query) {
                // Selecionar apenas os campos necessários do carro
                $query->select('id', 'plate');
            }])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('car_id') // Apenas tickets com carro
            ->orderBy('id', 'desc')
            ->get(['id', 'created_at', 'saida', 'car_id']); // Selecionar apenas os campos necessários

        // 8. Verificar se há tickets encontrados
        if ($tickets->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum ticket encontrado nos últimos 7 dias até a data fornecida.'
            ], 200); // 200 OK
        }

        // 9. Retornar os tickets
        return response()->json([
            'tickets' => $tickets
        ], 200); // 200 OK
    }
}
