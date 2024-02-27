<?php

use Illuminate\Support\Facades\Route;

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

use App\Http\Controllers\init;
use App\Http\Controllers\commonController;

Route::get('/', [init::class, 'launch']);
Route::get('prepareApplicationTCMeetingSchedulingStage', [commonController::class, 'prepareApplicationTCMeetingSchedulingStage']);
Route::get('getApplicationApprovalDetails', [commonController::class, 'getApplicationApprovalDetails']);
Route::get('testDMS', [commonController::class, 'testDMS']);
Route::get('getCSRFToken', [commonController::class, 'getCSRFToken']);
Route::get('testEmail', [init::class, 'testEmail']);

//general functions

Route::group(['prefix' => 'common','middleware' => ['auth:api', 'web']], function() {
	Route::get('getApplicationChecklistQueries', [commonController::class, 'getApplicationChecklistQueries']);
	Route::post('saveChecklistApplicationQuery', [commonController::class, 'saveChecklistApplicationQuery']);
	Route::post('closeApplicationQuery', [commonController::class, 'closeApplicationQuery']);
	Route::post('saveUnstructuredApplicationQuery', [commonController::class, 'saveUnstructuredApplicationQuery']);
	Route::get('getTcMeetingParticipants', [commonController::class, 'getTcMeetingParticipants']);
	Route::post('syncTcMeetingParticipants', [commonController::class, 'syncTcMeetingParticipants']);
	Route::post('saveRecommendationDetails', [commonController::class, 'saveRecommendationDetails']);
	Route::get('getmeetingSchedulesLogs', [commonController::class, 'getmeetingSchedulesLogs']);
	Route::post('updateMeetingAttendance', [commonController::class, 'updateMeetingAttendance']);
	Route::get('getRcRecommendationLogs', [commonController::class, 'getRcRecommendationLogs']);
	Route::get('getApplicationRecommendationLogs', [commonController::class, 'getApplicationRecommendationLogs']);
	Route::get('getApplicationApprovalDetails', [commonController::class, 'getApplicationApprovalDetails']);
	Route::post('saveApplicationApprovalDetails', [commonController::class, 'saveApplicationApprovalDetails']);
	Route::get('getTcMeetingAgendas', [commonController::class, 'getTcMeetingAgendas']);
	Route::get('getApplicationVariationRequests', [commonController::class, 'getApplicationVariationRequests']);
	Route::post('saveCommonData', [commonController::class, 'saveCommonData']);
	Route::post('deleteCommonRecord', [commonController::class, 'deleteCommonRecord']);
	Route::post('saveApplicationWithdrawalReasons', [commonController::class, 'saveApplicationWithdrawalReasons']);
	Route::post('saveApplicationSuspensionReasons', [commonController::class, 'saveApplicationSuspensionReasons']);
	Route::get('getApplicationWithdrawalReasons', [commonController::class, 'getApplicationWithdrawalReasons']);
	Route::get('getApplicationSuspensionReasons', [commonController::class, 'getApplicationSuspensionReasons']);
	Route::get('refreshCounters', [commonController::class, 'refreshCounters']);
	Route::post('saveMeetingMembersRecommendationDetails', [commonController::class, 'saveMeetingMembersRecommendationDetails']);
	Route::get('getVariationRecommendationComment', [commonController::class, 'getVariationRecommendationComment']);
	Route::post('saveVariationFieldApproval', [commonController::class, 'saveVariationFieldApproval']);
	Route::post('saveTCMeetingDetails', [commonController::class, 'saveTCMeetingDetails']);
	Route::get('syncTcMeetingParticipants', [commonController::class, 'syncTcMeetingParticipants']);
	Route::get('prepareRegMeetingStage', [commonController::class, 'prepareRegMeetingStage']);
	Route::get('getAllApplicationQueries', [commonController::class, 'getAllApplicationQueries']);
	Route::get('validateApplicationChecklistDetails', [commonController::class, 'validateApplicationChecklistDetails']);
	Route::get('checkApplicationChecklistDetails', [commonController::class, 'checkApplicationChecklistDetails']);
	Route::get('getImporPermitApplicationApprovalDetails', [commonController::class, 'getImporPermitApplicationApprovalDetails']);
	Route::post('saveApplicationApprovalDetails', [commonController::class, 'saveApplicationApprovalDetails']);
	Route::get('checkReviewREcommendationDEtails', [commonController::class, 'checkReviewREcommendationDEtails']);
	Route::get('getPermitReleaseRecommendationDetails', [commonController::class, 'getPermitReleaseRecommendationDetails']);
	Route::get('getApplicationPaymentDetails', [commonController::class, 'getApplicationPaymentDetails']);
	Route::get('getCaseDecisionsLogs', [commonController::class, 'getCaseDecisionsLogs']);
	Route::post('addChecklistItemsQueries', [commonController::class, 'updateChecklistItemsQueries']);
	Route::post('emmptyTraTable', [commonController::class, 'emmptyTraTable']);
	Route::post('syncTcMeetingGroupParticipants', [commonController::class, 'syncTcMeetingGroupParticipants']);
	Route::get('autoGenerateChecklistBasedQueries', [commonController::class, 'autoGenerateChecklistBasedQueries']);
	

});


Route::get('getApplicationunstructuredqueries', [commonController::class, 'getApplicationunstructuredqueries']);
Route::group(['prefix' => 'configurations','middleware' => ['auth:api', 'web']], function() {
    Route::get('checkApplicationRespondedUnclosedQueries', [commonController::class, 'checkApplicationRespondedUnclosedQueries']);
    Route::get('checkPrecheckingrecommendation', [commonController::class, 'checkPrecheckingrecommendation']);
});

Route::get('backendCall', [commonController::class, 'testApi']);