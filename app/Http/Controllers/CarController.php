<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarController extends Controller
{
    public function index()
    {
        $cars = Car::with('apiPlate')->paginate(15);

        return Inertia::render('Dashboard/carros/index', [
            'cars' => $cars,
            'successMessage' => session('success'), // Para mensagens de sucesso
        ]);
    }

    public function store(Request $request)
    {
        // Validação dos dados
        $validated = $request->validate([
            'plate' => 'required|string|max:255|unique:cars,plate',
            'name' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1886|max:' . (date('Y') + 1),
            'color' => 'nullable|string|max:255',
        ]);

        // Criação do carro
        Car::create($validated);

        // Redireciona de volta com uma mensagem de sucesso
        return redirect()->route('dashboard.carros.index')->with('success', 'Carro cadastrado com sucesso.');
    }
}
