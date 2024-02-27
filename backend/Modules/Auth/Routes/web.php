<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use Modules\Auth\Http\Controllers\AuthController;

Route::post('login',[AuthController::class,'login'])->name('login');
Route::post('recoverForgotPassword',[AuthController::class,'recoverForgotPassword']);
Route::post('saveNewPassword',[AuthController::class,'passwordResetHandler']);

// Authenticated routes
Route::group(['prefix' => 'auth','middleware' => ['auth:api', 'web']], function() {
    Route::post('logout',[AuthController::class,'logout']);
    Route::post('createAccount',[AuthController::class,'createAccount']);

});
