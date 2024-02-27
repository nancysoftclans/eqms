<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\commonController;
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
Route::post('cloneSingleWorkflow', [commonController::class, 'cloneSingleWorkflow']);
Route::post('cloneFormByCategoryForAllTypes', [commonController::class, 'cloneFormByCategoryForAllTypes']);
Route::post('cloneSingleFormToAnother', [commonController::class, 'cloneSingleFormToAnother']);
Route::post('submitJointOperationActivities', [commonController::class, 'submitJointOperationActivities']);
Route::get('getPlannedActivities', [commonController::class, 'getPlannedActivities']);
Route::get('submitPlannedActivities', [commonController::class, 'submitPlannedActivities']);
Route::get('Initiate', [commonController::class, 'Initiate']);
Route::post('callback', [commonController::class, 'callback']);
Route::get('getTransactionDetails', [commonController::class, 'getTransactionDetails']);
Route::get('test', [commonController::class, 'test']);
Route::get('manualDMSInitialiation', [commonController::class, 'manualDMSInitialiation']);

Route::get('cleanDitrictsDuplicates', [commonController::class, 'cleanDitrictsDuplicates']);

//MOBILE APIS
Route::get('getInspectionApplications', [commonController::class, 'getInspectionApplications']);
Route::get('getRiskBasedInspectionApplication', [commonController::class, 'getRiskBasedInspectionApplication']);
Route::post('saveRiskBasedInspectionDetails', [commonController::class, 'saveRiskBasedInspectionDetails']);
Route::post('saveApplicationChecklistDetails', [commonController::class, 'saveApplicationChecklistDetails']);
Route::post('saveNewInspectionPremisePersonnel', [commonController::class, 'saveNewInspectionPremisePersonnel']);
Route::post('savePremisePersonnelInspectionDetails', [commonController::class, 'savePremisePersonnelInspectionDetails']);
Route::post('saveNewGMPKeyPersonnel', [commonController::class, 'saveNewGMPKeyPersonnel']);
Route::post('saveGMPPersonnelInspectionDetails', [commonController::class, 'saveGMPPersonnelInspectionDetails']);
Route::post('onLoadApplicationDocumentsUploads', [commonController::class, 'onLoadApplicationDocumentsUploads']);
Route::post('saveInspectionRecommendation', [commonController::class, 'saveInspectionRecommendation']);
Route::get('getPMSApplicationDetails', [commonController::class, 'getPMSApplicationDetails']);
Route::post('saveSampleDetails', [commonController::class, 'saveSampleDetails']);
Route::post('saveAltenativeSampleDetails', [commonController::class, 'saveAltenativeSampleDetails']);
Route::get('getConfigParamFromTable', [commonController::class, 'getConfigParamFromTable']);
Route::get('getPOEInspectionApplication', [commonController::class, 'getPOEInspectionApplication']);
Route::post('submitInspectionDetails', [commonController::class, 'submitInspectionDetails']);
Route::get('getUserDetails', [commonController::class, 'getUserDetails']);
Route::get('getWorkflowActions', [commonController::class, 'getWorkflowActions']);
Route::post('printMobileLog', [commonController::class, 'printMobileLog']);


// protected?
Route::group(['middleware' => ['auth:api']], function() {
   Route::post('emmptyTraTable', [commonController::class, 'emmptyTraTable']);
   Route::post('updateListingApproval', [commonController::class, 'updateListingApproval']);
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});




