<?php

use Modules\Onlineservices\Http\Controllers\OnlineServicesController;
Route::group(['prefix' => 'onlineservices','middleware' => ['auth:api', 'web']], function() {
    Route::post('doDeleteConfigWidgetParam', [OnlineServicesController::class, 'doDeleteConfigWidgetParam']);
    Route::post('saveApplicationstatusactions', [OnlineServicesController::class, 'saveApplicationstatusactions']);
    Route::post('saveOnlineservices', [OnlineServicesController::class, 'saveOnlineservices']);
    Route::post('saveOnlinePortalData', [OnlineServicesController::class, 'saveOnlinePortalData']);
    Route::post('saveUniformOnlinePortalData', [OnlineServicesController::class, 'saveUniformOnlinePortalData']);
    Route::post('saveApplicationstatusactions', [OnlineServicesController::class, 'saveApplicationstatusactions']);
    Route::get('getapplicationstatusactions', [OnlineServicesController::class, 'getapplicationstatusactions']);
    Route::get('getOnlineMenuLevel0', [OnlineServicesController::class, 'getOnlineMenuLevel0']);
    Route::get('getSystemNavigationMenuItems', [OnlineServicesController::class, 'getSystemNavigationMenuItems']);
    Route::get('getOnlinePortalServicesDetails', [OnlineServicesController::class, 'getOnlinePortalServicesDetails']);
    Route::get('getApplicationdocumentdefination', [OnlineServicesController::class, 'getApplicationdocumentdefination']);
    Route::get('getOnlineProcessTransitionsdetails', [OnlineServicesController::class, 'getOnlineProcessTransitionsdetails']);
   
    Route::get('getapplicationstatus', [OnlineServicesController::class, 'getapplicationstatus']);
    Route::get('getApplicationprocessguidelines', [OnlineServicesController::class, 'getApplicationprocessguidelines']);
    Route::post('deleteSystemMenuItem',[OnlineServicesController::class, 'deleteSystemMenuItem']);
    Route::get('getOnlineProcesdetails',[OnlineServicesController::class, 'getOnlineProcesdetails']);
    Route::post('deleteSystemProcess',[OnlineServicesController::class, 'deleteSystemProcess']);
    Route::post('deleteConfigRecord',[OnlineServicesController::class, 'deleteConfigRecord']);
    Route::get('getApplicationTermsConditions',[OnlineServicesController::class, 'getApplicationTermsConditions']);
    Route::get('getProductPortalApplicationMoreDetails',[OnlineServicesController::class, 'getProductPortalApplicationMoreDetails']);
    Route::get('onLoadportalproductIngredients',[OnlineServicesController::class, 'onLoadportalproductIngredients']);
    Route::get('onLoadportalproductPackagingDetails',[OnlineServicesController::class, 'onLoadportalproductPackagingDetails']);
    Route::get('onLoadportalproductManufacturer',[OnlineServicesController::class, 'onLoadportalproductManufacturer']);
    Route::get('onLoadportalproductApiManufacturer',[OnlineServicesController::class, 'onLoadportalproductApiManufacturer']);
    Route::get('onLoadportalproductGmpInspectionDetailsStr',[OnlineServicesController::class, 'onLoadportalproductGmpInspectionDetailsStr']);
    Route::get('onLoadportalGmpInspectionInOtherCountries',[OnlineServicesController::class, 'onLoadportalGmpInspectionInOtherCountries']);
    Route::get('onLoadportalOtherstatesproductregistrations',[OnlineServicesController::class, 'onLoadportalOtherstatesproductregistrations']);
    Route::get('getPortalPremApplicationMoreDetails',[OnlineServicesController::class, 'getPortalPremApplicationMoreDetails']);
    Route::get('getPortalPermitsApplicationMoreDetails',[OnlineServicesController::class, 'getPortalPermitsApplicationMoreDetails']);
    Route::get('getPortalGmpApplicationMoreDetails',[OnlineServicesController::class, 'getPortalGmpApplicationMoreDetails']);
    Route::get('getPortalAppPremisePersonnelDetails',[OnlineServicesController::class, 'getPortalAppPremisePersonnelDetails']);
    Route::get('getPortalPremiseProprietorsDetails',[OnlineServicesController::class, 'getPortalPremiseProprietorsDetails']);
    Route::get('getPortalClinicalTrialApplicationMoreDetails',[OnlineServicesController::class, 'getPortalClinicalTrialApplicationMoreDetails']);
    Route::post('markasPortalMisReceived',[OnlineServicesController::class, 'markasPortalMisReceived']);
    Route::get('getOnlineConfigParamFromTable',[OnlineServicesController::class, 'getOnlineConfigParamFromTable']);
    Route::get('getPortalExemptionProductsList',[OnlineServicesController::class, 'getPortalExemptionProductsList']);
    Route::get('getPortalAnimalMedicinalRequirements',[OnlineServicesController::class, 'getPortalAnimalMedicinalRequirements']);
    Route::get('getPortalExemptionOtherDetails',[OnlineServicesController::class, 'getPortalExemptionOtherDetails']);
    Route::get('syncOnlineApplicationsGeneric',[OnlineServicesController::class, 'syncOnlineApplicationsGeneric']);
});
