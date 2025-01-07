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
use Modules\Dashboard\Http\Controllers\DashboardController;
// Route::prefix('dashboard')->group(function() {
//     Route::get('/', 'DashboardController@index');
// });
Route::group(['prefix' => 'dashboard','middleware' => ['auth:api', 'web']], function() {
    Route::get('getInTrayItems', [DashboardController::class, 'getInTrayItems']);
    Route::get('getOutTrayItems', [DashboardController::class, 'getOutTrayItems']);
    Route::get('getSystemGuidelines', [DashboardController::class, 'getSystemGuidelines']);
    Route::post('saveDashCommonData', [DashboardController::class, 'saveDashCommonData']);
    Route::get('getDispatchedCorrespondence', [DashboardController::class, 'getDispatchedCorrespondence']);
    Route::get('getCorrespondence', [DashboardController::class, 'getCorrespondence']);
    Route::post('dispatchCorrespondence', [DashboardController::class, 'dispatchCorrespondence']);
    Route::get('getExternalUserInTrayItems', 'DashboardController@getExternalUserInTrayItems');
    Route::get('getOnlineApplicationDashboard', 'DashboardController@getOnlineApplicationDashboard');
    Route::get('getQeuriedApplications', 'DashboardController@getQeuriedApplications');
    Route::get('getUserAnalysis', [DashboardController::class, 'getUserAnalysis']);
    Route::get('getUserStats', [DashboardController::class, 'getUserStats']);
    Route::get('getDocumentAnalysis', [DashboardController::class, 'getDocumentAnalysis']);
    Route::get('getTopTaskClearers', [DashboardController::class, 'getTopTaskClearers']);
    Route::get('getTopClearers', [DashboardController::class, 'getTopClearers']);
    Route::get('getDocumentStatistics', [DashboardController::class, 'getDocumentStatistics']);
    Route::get('getDashboardStats', [DashboardController::class, 'getDashboardStats']);

    
});
