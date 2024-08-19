<?php

//use Illuminate\Http\Request;

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
use Modules\AuditManagement\Http\Controllers\AuditManagementController;
Route::middleware('auth:api')->get('/auditmanagement', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'auditmanagement','middleware' => ['auth:api']], function() {
    // Route::post('uploadMultipleFiles', [DocumentManagementController::class, 'uploadMultipleFiles']);
});


