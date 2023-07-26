<?php

use App\Http\Controllers\API\Auth\ForgotPasswordController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\FrontEnd\OrderController;
use App\Http\Controllers\Auth\VerifyEmailController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


Route::get('/', function () {
    return view('layouts.app');
});

Route::get('/view-invoice/{order_id}', [OrderController::class, 'View_Invoice']);
Route::get('/invoice/download/{order_id}', [OrderController::class, 'Download_Invoice']);

Route::get('/reset-password/{token}',[ForgotPasswordController::class, 'viewForgotPassword'])->middleware(['signed'])->name('password.reset');
