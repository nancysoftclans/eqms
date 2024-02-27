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
use Modules\Rmu\Http\Controllers\RmuController;

Route::group(['prefix' => 'rmu','middleware' => ['auth:api', 'web']], function() {
    Route::get('getRMUReceivedSubmissions', [RmuController::class, 'getRMUReceivedSubmissions']);
    Route::post('saveRMUReceivingBaseDetails', [RmuController::class, 'saveRMUReceivingBaseDetails']);
    Route::get('prepareNewRMUReceivingStage', [RmuController::class, 'prepareNewRMUReceivingStage']);
    Route::get('getRMUSubmissionActions', [RmuController::class, 'getRMUSubmissionActions']);
    Route::get('getAdministrativeSubmissions', [RmuController::class, 'getAdministrativeSubmissions']);
    Route::post('saveResponse', [RmuController::class, 'saveResponse']);
    Route::get('getRMUApplicationMoreDetails', [RmuController::class, 'getRMUApplicationMoreDetails']);
    Route::post('saveResponseApproval', [RmuController::class, 'saveResponseApproval']);
    Route::get('getAdministrativeSubmissionsRegister', [RmuController::class, 'getAdministrativeSubmissionsRegister']);

});
