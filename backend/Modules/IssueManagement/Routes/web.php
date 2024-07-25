<?php
use Illuminate\Support\Facades\Route;
use Modules\IssueManagement\Http\Controllers\IssueManagementController;

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

Route::group(['prefix' => 'issuemanagement', 'middleware' => ['web']], function () {
    Route::post('saveIssueDetails', [IssueManagementController::class, 'saveIssueDetails']);
    Route::post('submitIssueManagementApplication', [IssueManagementController::class, 'submitIssueManagementApplication']);
    Route::get('getIssueManagementDetails', [IssueManagementController::class, 'getIssueManagementDetails']);
    Route::get('getIssueManagementDetailsById/{active_application_id}', [IssueManagementController::class, 'getIssueManagementDetailsById']);
    Route::get('getIssueProcessDetails', [IssueManagementController::class, 'getIssueProcessDetails']);
    Route::post('saveIssueQualityReviewDetails', [IssueManagementController::class, 'saveIssueQualityReviewDetails']);
    Route::post('saveIssueRCADetails', [IssueManagementController::class, 'saveIssueRCADetails']);
});
