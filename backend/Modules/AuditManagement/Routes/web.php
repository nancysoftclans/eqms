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

use Modules\AuditManagement\Http\Controllers\AuditManagementController;
//use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'auditManagement', 'middleware' => ['auth:api', 'web']], function() {
    
    Route::post('saveAuditType',[AuditManagementController::class,'saveAuditType']);
    Route::get('getAuditTypes',[AuditManagementController::class,'getAuditTypes']);

    Route::get('getAuditTypesMetadata',[AuditManagementController::class, 'getAuditTypeMetaData']);
    Route::post('saveAuditTypeMetaData', [AuditManagementController::class, 'saveAuditTypeMetaData']);
    // Route::get('/getAuditTypeMetaData',[AuditManagementController::class, 'getAuditTypeMetaData'])


    Route::get('index',[AuditManagementController::class, 'index']);
   
});
