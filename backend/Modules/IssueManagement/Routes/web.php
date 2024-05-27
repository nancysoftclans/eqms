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
    Route::post('saveNewReceivingBaseDetails', [IssueManagementController::class, 'saveNewReceivingBaseDetails']);
    Route::get('getIssueManagementDetails', [IssueManagementController::class, 'getIssueManagementDetails']);
    Route::get('getIssueManagementDetailsById', [IssueManagementController::class, 'getIssueManagementDetailsById']);
    Route::get('getIssueProcessDetails', [IssueManagementController::class, 'getIssueProcessDetails']);
});
