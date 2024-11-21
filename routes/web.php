<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\Dashboard\DashHomeController;
use App\Http\Controllers\Dashboard\MembersController;
use App\Http\Controllers\ParkConfigController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketPaymentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    //redireciona para o dashboard
    return Inertia::render('Home');
});



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [DashHomeController::class, 'index'])->name('index');

        Route::resource('saidas', TicketPaymentController::class);

        Route::resource('mensalistas', ClientController::class)->only([
            'index', 'store', 'update', 'destroy'
        ]);
        Route::post('mensalistas/{clientId}/add-car', [ClientController::class, 'addCars'])->name('mensalistas.addCars');
        Route::get('mensalistas/get-cars', [ClientController::class, 'getCars'])->name('mensalistas.getCars');
        Route::delete('mensalistas/{clientId}/remove-car/{carId}', [ClientController::class, 'removeCar'])->name('mensalistas.removeCar');

        Route::get('carros', [CarController::class, 'index'])->name('carros.index');
        Route::post('carros', [CarController::class, 'store'])->name('carros.store');

        Route::resource('configuracoes', ParkConfigController::class)->except(['create', 'show']);
        Route::post('configuracoes/{id}/activate', [ParkConfigController::class, 'activate'])->name('configuracoes.activate');
    });
    
    
});

Route::get('/teste', function () {
    $files = Storage::disk('s3')->allFiles('random');
    dd($files);
});

require __DIR__.'/auth.php';
