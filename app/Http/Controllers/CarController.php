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
            'cars' => $cars
        ]);
    }
}
