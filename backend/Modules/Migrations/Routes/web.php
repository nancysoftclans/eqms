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

use Illuminate\Database\Events\MigrationEvent;
use Illuminate\Support\Facades\Route;

use  Modules\Migrations\Http\Controllers\MigrationsController;

Route::group(['middleware' => [ 'web'], 'prefix' => 'migrations'], function()
{
    //Routes for human madicines screening
    Route::get('gethmscreeningregister', [MigrationsController::class, 'gethmscreeningregister']);
    Route::get('getListedDevicesregister', [MigrationsController::class, 'getListedDevicesregister']);
    Route::get('migratemdexceptions', [MigrationsController::class, 'migrateMDexceptions']);
    Route::get('test', [MigrationsController::class, 'explodeApplicantDetails']);
    Route::post('saveDirtyData', [MigrationsController::class, 'saveDirtyData']);
    Route::post('saveDirtyDataforResponseToHumanMedsScreening', [MigrationsController::class,'saveDirtyDataforResponseToHumanMedsScreening']);

    Route::get('getresponsetohmscreeningregister', [MigrationsController::class, 'getresponsetohmscreeningregister']);
    Route::post('transferdatatotransactionaltables',[MigrationsController::class, 'transferdatatotransactionaltables']);
    Route::post('transferlistedDevicesdatatotransactionaltables',[MigrationsController::class, 'transferListingdatatotransactionaltables']);
    
    //Route::get('validateDate', [MigrationsController::class,'validateDate']);
   

    //Routes for complementary medicines screening

    Route::get('getcomplementarymedicinesscreeningregister', [MigrationsController::class, 'getcomplementarymedicinesscreeningregister']);

    //Routes for vet medicines screening
    Route::get('getvetinarymedsscreeningregister', [MigrationsController::class, 'getvetinarymedsscreeningregister']);
    Route::post('saveDirtyDataForVetinaryMedicinesScreening', [MigrationsController::class, 'saveDirtyDataForVetinaryMedicinesScreening']);

    //Routes for vet medicines variations
    Route::get('getvetinarymedicinesvariationsregister', [MigrationsController::class, 'getvetinarymedicinesvariationsregister']);
    Route::post('savedirtydataforvetinarymedicinesvariations', [MigrationsController::class, 'savedirtydataforvetinarymedicinesvariations']);

    //Routes for vetinary medicines applications

    Route::get('getvetinarymedicinesapplicationsregister', [MigrationsController::class,'getvetinarymedicinesapplicationsregister']);
    Route::post('savedirtydataforvetinarymedicinesapplications', [MigrationsController::class, 'savedirtydataforvetinarymedicinesapplications']);


    //Routes for complementary medicines applications

    Route::get('getcomplementarymedicinesapplications', [MigrationsController::class, 'getcomplementarymedicinesapplications']);

    Route::post('cleanTables', [MigrationsController::class, 'CleanTables']);
    Route::post('uploadExcelSheetFromMEDRS', [MigrationsController::class, 'uploadExcelSheetFromMEDRS']);
    
});

Route::group(['middleware' => ['web'], 'prefix' => 'migrations'], function(){
    Route::post('uploadExcelSheetForHumanMedsScreening', [MigrationsController::class,'uploadExcelSheetForHumanMedsScreening']);
    Route::post('uploadExcelSheetForMDListing', [MigrationsController::class,'uploadExcelSheetForMedsListing']);
    Route::post('uploadExcelSheetForCompMedsScreening', [MigrationsController::class,'uploadExcelSheetForCompMedsScreening']);
    Route::post('uploadExcelSheetForVetMedsScreening', [MigrationsController::class, 'uploadExcelSheetForVetMedsScreening']);
    Route::post('uploadExcelSheetForResponseToHumanMedsScreening', [MigrationsController::class,'uploadExcelSheetForResponseToHumanMedsScreening']);  
    Route::post('uploadExcelSheetForDrugs', [MigrationsController::class,'uploadExcelSheetForDrugs']); 
    Route::post('uploadExcelSheetForFacilityListBasedOnRiskV1', [MigrationsController::class,'uploadExcelSheetForFacilityListBasedOnRiskV1']); 
    Route::post('uploadatccodes', [MigrationsController::class,'uploadatccodes']);
    
});
// Route::prefix('migrations')->group(function() {
//     Route::get('/', 'MigrationsController@index');
// });
