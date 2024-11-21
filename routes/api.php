<?php

use App\Http\Controllers\CheckinController;
use App\Http\Controllers\IntegrationDataController;
use App\Http\Middleware\ExternalAccessMiddleware;
use App\Http\Middleware\PublicAccessMiddleware;
use Illuminate\Support\Facades\Route;


Route::middleware([ExternalAccessMiddleware::class])->group(function () {
    Route::post('/checkin', [CheckinController::class, "checkin"]);
    Route::post('/checkout', [CheckinController::class, "checkout"]);
});


Route::middleware([PublicAccessMiddleware::class])->group(function () {
    Route::get('/getTickets', [IntegrationDataController::class, 'getTickets']);
    Route::get('/getTicketsForSecurity', [IntegrationDataController::class, 'getTicketsForSecurity']);
});