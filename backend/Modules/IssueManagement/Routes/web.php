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
    // Route::post('submitIssueManagementApplication', [IssueManagementController::class, 'submitIssueManagementApplication']);
    Route::get('getIssueManagementDetails', [IssueManagementController::class, 'getIssueManagementDetails']);
    Route::get('getIssueManagementDetailsById/{active_application_id}', [IssueManagementController::class, 'getIssueManagementDetailsById']);
    Route::get('getIssueProcessDetails', [IssueManagementController::class, 'getIssueProcessDetails']);
    Route::resource('issue_status_groups', 'IssueStatusGroupsController');
    Route::resource('issue_types', 'IssueTypeController');
    Route::resource('issue_action_plans', 'IssueManagementActionPlanController');
    Route::get('getIssueManagementDocuments', [IssueManagementController::class, 'getIssueManagementDocuments']);
    Route::post('saveIssueManagementDocuments', [IssueManagementController::class, 'saveIssueManagementDocuments']);
    Route::get('getIssueManagementRelatedIssues', [IssueManagementController::class, 'getIssueManagementRelatedIssues']);
    Route::post('saveIssueManagementRelatedIssues', [IssueManagementController::class, 'saveIssueManagementRelatedIssues']);
    Route::get('getIssueManagementAudits', [IssueManagementController::class, 'getIssueManagementAudits']);
    Route::post('saveIssueManagementAudits', [IssueManagementController::class, 'saveIssueManagementAudits']);
    Route::get('getIssueManagementOrganisationalAreas', [IssueManagementController::class, 'getIssueManagementOrganisationalAreas']);
    Route::post('saveIssueManagementOrganisationalAreas', [IssueManagementController::class, 'saveIssueManagementOrganisationalAreas']);
    Route::get('getActivity', [IssueManagementController::class, 'getActivity']);
    Route::get('generateIssueReport', [IssueManagementController::class, 'generateIssueReport']);
});
