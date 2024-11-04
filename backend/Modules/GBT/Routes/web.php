<?php

use Modules\GBT\Http\Controllers\GBTController;
use Modules\AuditManagement\Http\Controllers\AuditManagementController;
//use Illuminate\Support\Facades\Route;
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

// Route::prefix('gbt')->group(function() {
//     Route::get('/', 'GBTController@index');
// });





Route::group(['prefix' => 'gbt', 'middleware' => ['auth:api', 'web']], function() {
    
    // Route::post('saveAuditType',[GBTController::class,'saveAuditType']);
    // Route::get('getAuditTypesMetadata',[GBTController::class, 'getAuditTypeMetaData']);
    // Route::post('saveAuditTypeMetaData', [GBTController::class, 'saveAuditTypeMetaData']);
    // Route::post('saveNewAuditPlanDetails', [GBTController::class, 'saveNewAuditPlanDetails']);
    // Route::post('saveAuditFinding', [GBtController::class, 'saveAuditFinding']);
    // Route::get('getAuditTypes',[GBTController::class,'getAuditTypes']);
    // Route::get('getAuditManagementDetails',[GBTController::class,'getAuditManagementDetails']);
    // Route::get('getAuditFindings', [GBTController::class, 'getAuditFindings']);
    // Route::get('prepapreAuditApplicationReceiving', [GBTController::class, 'prepapreAuditApplicationReceiving']);
    
    // Route::get('/getAuditTypeMetaData',[AuditManagementController::class, 'getAuditTypeMetaData'])


    Route::get('index',[GBTController::class, 'index']);
   
});



