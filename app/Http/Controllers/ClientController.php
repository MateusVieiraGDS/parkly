<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::with("cars")->paginate(17);

        return Inertia::render('Dashboard/mensalistas/index')
            ->with('clients', $clients);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'telefone' => 'required|string|max:20',
            'cpf' => 'required|string|max:14|unique:clients,cpf',
        ]);

        try {
            Client::create($request->only('name', 'telefone', 'cpf'));
            return redirect()->route('dashboard.mensalistas.index')->with('success', 'Cliente cadastrado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Erro ao cadastrar o cliente.']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $mensalista)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'telefone' => 'required|string|max:20',
            'cpf' => 'required|string|max:14|unique:clients,cpf,' . $mensalista,
        ]);

        try {
            $client = Client::findOrFail($mensalista);
            $client->update($request->only('name', 'telefone', 'cpf'));

            return response()->json(['success' => 'Cliente atualizado com sucesso!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar o cliente.'], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */ 
    public function destroy(string $id)
    {
        //dd($id);
       /*  try { */
            $client = Client::findOrFail($id);
            $client->cars()->detach();
            $client->delete();
/* 
            return redirect()->route('dashboard.mensalistas.index')->with('success', 'Cliente excluído com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Erro ao excluir o cliente.']);
        } */
    }

    /**
     * Adiciona um carro ao cliente.
     */
    public function addCars(Request $request, string $clientId)
    {
        $request->validate([
            'carId' => 'required|exists:cars,id',
        ]);

        try {
            $client = Client::findOrFail($clientId);
            $carId = $request->input('carId');
            $car = Car::findOrFail($carId);

            // Verificar se o carro já pertence a outro cliente
            if ($car->clients()->exists()) {
                return response()->json(['error' => 'Este carro já está associado a outro cliente.'], 400);
            }

            // Associar o carro ao cliente
            $client->cars()->attach($carId);

            return response()->json(['success' => 'Carro adicionado ao cliente com sucesso!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao adicionar o carro ao cliente.'], 500);
        }
    }

    /**
     * Retorna todos os carros que não pertencem a nenhum cliente.
     */
    public function getCars()
    {
        //try {
            $cars = Car::doesntHave('clients')->get();
            return response()->json($cars);
        //} catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao buscar carros disponíveis.'], 500);
        //}
    }

    /**
     * Remove um carro associado ao cliente.
     */
    public function removeCar(string $clientId, string $carId)
    {
        try {
            $client = Client::findOrFail($clientId);
            $car = Car::findOrFail($carId);

            // Verifica se o carro está associado ao cliente
            if (!$client->cars()->where('car_id', $carId)->exists()) {
                return response()->json(['error' => 'Este carro não está associado a este cliente.'], 400);
            }

            // Remove a associação
            $client->cars()->detach($carId);

            return response()->json(['success' => 'Carro removido do cliente com sucesso!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao remover o carro do cliente.'], 500);
        }
    }
}
