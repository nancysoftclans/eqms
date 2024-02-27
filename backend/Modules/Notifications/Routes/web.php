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

use Modules\Notifications\Http\Controllers\NotificationsController;
Route::group(['prefix' => 'notifications','middleware' => ['web']], function() {
    Route::post('saveGroupNotificationsData', [NotificationsController::class, 'saveGroupNotificationsData']);
    Route::post('saveReplyNotificationsData', [NotificationsController::class, 'saveReplyNotificationsData']);
    Route::post('sendExcelToBD', [NotificationsController::class, 'sendExcelToBD']);
});


Route::group(['prefix' => 'notifications','middleware' => ['auth:api', 'web']], function(){
//Route::post('saveGroupNotificationsData', [NotificationsController::class, 'saveGroupNotificationsData']);
Route::get('getNotificationFromTable', [NotificationsController::class, 'getNotificationFromTable']);
Route::post('deleteNotificationRecord',[NotificationsController::class,'deleteNotificationRecord']);
Route::get('getUserNotificationFromTable',[NotificationsController::class,'getUserNotificationFromTable']);
Route::get('getModuleNotificationFromTable',[NotificationsController::class,'getModuleNotificationFromTable']);
Route::post('updateInboxNotification', [NotificationsController::class, 'updateInboxNotification']);
Route::post('updateModuleNotification', [NotificationsController::class, 'updateModuleNotification']);
Route::post('markAllNotifications', [NotificationsController::class, 'markAllNotifications']);
Route::post('SendTraderNotificationEmail', [NotificationsController::class, 'SendTraderNotificationEmail']);
Route::get('GetTraderEmailNotifications', [NotificationsController::class, 'GetTraderEmailNotifications']);
Route::post('DeleteTraderNotificationMail', [NotificationsController::class, 'DeleteTraderNotificationMail']);
Route::get('submitPlannedActivities', [NotificationsController::class, 'submitPlannedActivities']);
});