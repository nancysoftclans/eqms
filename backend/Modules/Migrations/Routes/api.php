<?php

use Illuminate\Http\Request;

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

// Route::middleware('auth:api')->get('/migrations', function (Request $request) {
//     return $request->user();
// });
use  Modules\Migrations\Http\Controllers\MigrationsController;

Route::group(['middleware' => ['auth:api'], 'prefix' => 'migrations'], function()
{
    Route::post('migrateRegionData', [MigrationsController::class,'migrateRegionData']); 
    Route::post('uploadExcelSheetForMDListing', [MigrationsController::class,'uploadExcelSheetForMedsListing']);
    Route::post('uploadExcelSheetForHumanMedsBlueBook', [MigrationsController::class,'uploadExcelSheetForHumanMedsBlueBook']);
    Route::post('uploadExcelSheetForHumanMedsBlueBookManufacturers', [MigrationsController::class,'uploadExcelSheetForHumanMedsBlueBookManufacturers']);
    Route::post('migrateBluebooktoRegister', [MigrationsController::class,'migrateBluebooktoRegister']);
    Route::post('uploadExcelSheetForVetinaryMedicinesRegister', [MigrationsController::class,'uploadExcelSheetForVetinaryMedicinesRegister']);
    Route::post('transferVetRegister', [MigrationsController::class,'transferVetRegister']);
    Route::post('uploadExcelSheetForATCVetCodes', [MigrationsController::class,'uploadExcelSheetForATCVetCodes']);
    Route::post('remapParentsAtcCodes', [MigrationsController::class,'remapParentsAtcCodes']);
    Route::post('remapSystemTrackingNumbers', [MigrationsController::class,'remapSystemTrackingNumbers']);
    Route::post('moveApplicationFromScreeningToUniversalRegistration', [MigrationsController::class,'moveApplicationFromScreeningToUniversalRegistration']);

    
    Route::post('remapDatesVetSpeciesFromMigratedExcel', [MigrationsController::class,'remapDatesVetSpeciesFromMigratedExcel']);
    Route::post('uploadExcelSheetForFacilityNewDatabase', [MigrationsController::class,'uploadExcelSheetForFacilityNewDatabase']);
    Route::post('remapBOTloactionData', [MigrationsController::class,'remapBOTloactionData']);
    
    
});