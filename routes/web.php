<?php

use App\Http\Controllers\Dashboard\DashHomeController;
use App\Http\Controllers\Dashboard\MembersController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketPaymentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    //redireciona para o dashboard
    return redirect()->route('dashboard.index');
});



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [DashHomeController::class, 'index'])->name('index');

        Route::resource('saidas', TicketPaymentController::class);
    });
    
    
});

Route::get('/teste', function () {
    $files = Storage::disk('s3')->allFiles('random');
    dd($files);
});

require __DIR__.'/auth.php';
