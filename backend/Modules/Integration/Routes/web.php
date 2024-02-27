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
use Modules\Integration\Http\Controllers\IntegrationController;
Route::group(['middleware' => ['auth:api', 'web'], 'prefix' => 'integration'], function()
{
    Route::get('postSignRequest', [IntegrationController::class, 'postSignRequest']);
});

Route::group(['middleware' => ['web'], 'prefix' => 'integration'], function()
{
    Route::get('generateUploadableE2BFile', [IntegrationController::class, 'generateUploadableE2BFile']);
});

