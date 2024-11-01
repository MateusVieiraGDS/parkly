<?php

use App\Http\Controllers\Dashboard\DashHomeController;
use App\Http\Controllers\Dashboard\MembersController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [DashHomeController::class, 'index'])->name('index');

        Route::get('/membros', [MembersController::class, 'index'])->name('membros.index');

        Route::get('/membros/novo', [MembersController::class, 'create'])->name('membros.create');
        Route::get('/membros/editar/{id}', [MembersController::class, 'edit'])->name('membros.edit');
        
        Route::put('/membros/editar/updateContact/{id}', [MembersController::class, 'updateContact'])->name('membros.updateContact');
        Route::post('/membros/novo', [MembersController::class, 'NewMember'])->name('membros.insert');
    });
});


Route::get('/teste', function () {
    $files = Storage::disk('s3')->allFiles('random');
    dd($files);
});

require __DIR__.'/auth.php';
