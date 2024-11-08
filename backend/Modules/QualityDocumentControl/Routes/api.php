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
use Modules\QualityDocumentControlController\Http\Controllers\QualityDocumentControlController;

Route::middleware('auth:api')->get('/qualitydocumentcontrol', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'qualitydocumentcontrol','middleware' => ['auth:api']], function() {
    Route::post('uploadMultipleFiles', [DocumentManagementController::class, 'uploadMultipleFiles']);
});







