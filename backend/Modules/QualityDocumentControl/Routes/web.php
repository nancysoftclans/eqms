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

// Route::prefix('qualitydocumentcontrol')->group(function() {
//     Route::get('/', 'QualityDocumentControlController@index');
// });

use Modules\QualityDocumentControlController\Http\Controllers\QualityDocumentControlController;


Route::group(['prefix' => 'qualitydocumentcontrol', 'middleware' => ['web']], function() {
 
    Route::post('resumableuploadApplicationDocumentFile', [QualityDocumentControlController::class, 'uploadLargeFiles']);
    // Route::post('uploadMultipleFiles', [QualityDocumentControlController::class, 'uploadMultipleFiles']);
    Route::get('downloadsopTemplate', [QualityDocumentControlController::class, 'downloadsopTemplate']);
    Route::get('downloadFormFormat', [QualityDocumentControlController::class, 'downloadFormFormat']);
    Route::get('downloadlogdatabasesTemplate', [QualityDocumentControlController::class, 'downloadlogdatabasesTemplate']);

});

Route::group(['prefix' => 'qualitydocumentcontrol','middleware' => ['auth:api', 'web']], function() {

    Route::post('saveDocDefinationrequirement', [QualityDocumentControlController::class, 'saveDocDefinationrequirement']);
    Route::get('prepareDocumentCreationReceivingStage', [QualityDocumentControlController::class, 'prepareDocumentCreationReceivingStage']);
    Route::get('getDocumentsSubTypes', [QualityDocumentControlController::class, 'getDocumentsSubTypes']);
    Route::get('navigatorMoveFolder', [QualityDocumentControlController::class, 'navigatorMoveFolder']);
    Route::get('getdocdefinationrequirementDetails', [QualityDocumentControlController::class, 'getdocdefinationrequirementDetails']);
    Route::get('getlivedocumentDetails', [QualityDocumentControlController::class, 'getlivedocumentDetails']);
    Route::get('getdoctypesDetails', [QualityDocumentControlController::class, 'getdoctypesDetails']);
    Route::get('getNavigatorDetails', [QualityDocumentControlController::class, 'getNavigatorDetails']);
    Route::get('docdefinationrequirementfilterdetails', [QualityDocumentControlController::class, 'docdefinationrequirementfilterdetails']);
   Route::get('prepapreDocumentApplicationReceiving', [QualityDocumentControlController::class, 'prepapreDocumentApplicationReceiving']);
    Route::get('prepapreNewQmsRecord', [QualityDocumentControlController::class, 'prepapreNewQmsRecord']);
    Route::get('prepapreDocumentApplicationScreening', [QualityDocumentControlController::class, 'prepapreDocumentApplicationScreening']);
    Route::get('getSOPMasterListDetails', [QualityDocumentControlController::class, 'getSOPMasterListDetails']);
    Route::post('validateDocumentAppReceivingDetails', [QualityDocumentControlController::class, 'validateDocumentAppReceivingDetails']);
    Route::post('validateAuditAppReceivingDetails', [QualityDocumentControlController::class, 'validateAuditAppReceivingDetails']);
    Route::post('getDocumentArchive', [QualityDocumentControlController::class, 'getDocumentArchive']);
    Route::post('saveDocumentRecommendationComments', [QualityDocumentControlController::class, 'saveDocumentRecommendationComments']);
    Route::post('saveDocumentApplicationApprovalDetails', [QualityDocumentControlController::class, 'saveDocumentApplicationApprovalDetails']); 
    Route::post('deleteDocumentRecord', [QualityDocumentControlController::class, 'deleteDocumentRecord']); 
    Route::post('dmsUpdateAccountPassword', [QualityDocumentControlController::class, 'dmsUpdateAccountPassword']);
    Route::get('getArchivedDocdDetails', [QualityDocumentControlController::class, 'getArchivedDocdDetails']);
    Route::get('getqmsrequirementDetails', [QualityDocumentControlController::class, 'getqmsrequirementDetails']);
   

    });