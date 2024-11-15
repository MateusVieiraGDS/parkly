<?php

use App\Http\Controllers\CheckinController;
use Illuminate\Support\Facades\Route;

Route::post('/checkin', [CheckinController::class, "checkin"]);
Route::post('/checkout', [CheckinController::class, "checkout"]);