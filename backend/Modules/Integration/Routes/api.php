<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

use Modules\Integration\Http\Controllers\IntegrationController;
Route::group(['middleware' => ['auth:api'], 'prefix' => 'integration'], function()
{
    Route::post('signCallback', [IntegrationController::class, 'signCallback']);
    Route::post('generateUploadableE2BFile', [IntegrationController::class, 'generateUploadableE2BFile']);
});