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

use Modules\NewReports\Http\Controllers\NewReportsController;
//Route::group(['middleware' => 'web', 'prefix' => 'reports'], function () {
  Route::group(['middleware' => ['web'], 'prefix' => 'newreports'], function(){
//Route::group(['prefix' => 'newreports','middleware' => ['auth:api', 'web']], function() {
    Route::get('getControlledDrugsSubModules', [NewReportsController::class, 'getControlledDrugsSubModules']);
    Route::get('getControlledDrugsPermitType', [NewReportsController::class, 'getControlledDrugsPermitType']);
    Route::get('getPermitType', [NewReportsController::class, 'getPermitType']);
    
   //product routes
   Route::get('getProductSummaryReport', [NewReportsController::class, 'getProductSummaryReport']);
   Route::get('printProductSummaryReport', [NewReportsController::class, 'printProductSummaryReport']);
   Route::get('productDetailedReportPreview', [NewReportsController::class, 'productDetailedReportPreview']);
   Route::get('exportDetailedReport', [NewReportsController::class, 'exportDetailedReport']);
   Route::get('exportProductSummaryReport', [NewReportsController::class, 'exportProductSummaryReport']);
   Route::get('printProductDetailedReport', [NewReportsController::class, 'printProductDetailedReport']);
   Route::get('getProductSummaryCartesianReport', [NewReportsController::class, 'getProductSummaryCartesianReport']);
 //end product routes
    //start premise routes
    Route::get('getPremiseSummaryReport', [NewReportsController::class, 'getPremiseSummaryReport']);
    Route::get('printPremiseSummaryReport', [NewReportsController::class, 'printPremiseSummaryReport']);
    Route::get('premiseDetailedReportPreview', [NewReportsController::class, 'premiseDetailedReportPreview']);
    Route::get('exportPremiseSummaryReport', [NewReportsController::class, 'exportPremiseSummaryReport']);
    Route::get('getPremiseSummaryCartesianReport', [NewReportsController::class, 'getPremiseSummaryCartesianReport']);
  //start import export routes 
  Route::get('getImportExportSummaryReport', [NewReportsController::class, 'getImportExportSummaryReport']);
  Route::get('printImportExportSummaryReport', [NewReportsController::class, 'printImportExportSummaryReport']);
  Route::get('importExportDetailedReportPreview', [NewReportsController::class, 'importExportDetailedReportPreview']);
  Route::get('importExportSummaryReportExport', [NewReportsController::class, 'importExportSummaryReportExport']);
  Route::get('getImportExportSummaryCartesianReport', [NewReportsController::class, 'getImportExportSummaryCartesianReport']);
   //start Gmp report routes 
  Route::get('getGmpSummaryReport', [NewReportsController::class, 'getGmpSummaryReport']);
  Route::get('printGmpSummaryReport', [NewReportsController::class, 'printGmpSummaryReport']);
  Route::get('gmpDetailedReportPreview', [NewReportsController::class, 'gmpDetailedReportPreview']);
  Route::get('gmpSummaryReportExport', [NewReportsController::class, 'gmpSummaryReportExport']);
  Route::get('getGmpSummaryCartesianReport', [NewReportsController::class, 'getGmpSummaryCartesianReport']);
  
    //start Clinical Trial report routes 
    Route::get('getClinicalTrialSummaryReport', [NewReportsController::class, 'getClinicalTrialSummaryReport']);
    Route::get('printClinicalTrialSummaryReport', [NewReportsController::class, 'printClinicalTrialSummaryReport']);
    Route::get('clinicalTrialDetailedReportPreview', [NewReportsController::class, 'clinicalTrialDetailedReportPreview']);
    Route::get('clinicalTrialSummaryReportExport', [NewReportsController::class, 'clinicalTrialSummaryReportExport']);
    Route::get('getClinicalTrialSummaryCartesianReport', [NewReportsController::class, 'getClinicalTrialSummaryCartesianReport']);

    //start Promotion & Advertisement report routes 
    Route::get('getPromotionAdvertisementSummaryReport', [NewReportsController::class, 'getPromotionAdvertisementSummaryReport']);
    Route::get('printPromotionAdvertisementSummaryReport', [NewReportsController::class, 'printPromotionAdvertisementSummaryReport']);
    Route::get('promotionAdvertisementDetailedReportPreview', [NewReportsController::class, 'promotionAdvertisementDetailedReportPreview']);
    Route::get('promotionAdvertisementSummaryReportExport', [NewReportsController::class, 'promotionAdvertisementSummaryReportExport']);
    Route::get('getPromotionAdvertisementSummaryCartesianReport', [NewReportsController::class, 'getPromotionAdvertisementSummaryCartesianReport']);
        //ADR routes
    Route::get('getAdrSummaryReport', [NewReportsController::class, 'getAdrSummaryReport']);
    Route::get('getAdrSummaryCartesianReport', [NewReportsController::class, 'getAdrSummaryCartesianReport']);
    Route::get('printAdrReportSummary', [NewReportsController::class, 'printAdrReportSummary']);
    Route::get('AdrSummaryReportExport', [NewReportsController::class, 'AdrSummaryReportExport']);
    //mir routes
    Route::get('getMirSummaryReport', [NewReportsController::class, 'getMirSummaryReport']);
    Route::get('getMirSummaryCartesianReport', [NewReportsController::class, 'getMirSummaryCartesianReport']);
     //enforcement
    Route::get('getEnforcementSummaryReport', [NewReportsController::class, 'getEnforcementSummaryReport']);
    Route::get('getEnforcementSummaryCartesianReport', [NewReportsController::class, 'getEnforcementSummaryCartesianReport']);
    //surveillance
    Route::get('getSurveillanceSummaryReport', [NewReportsController::class, 'getSurveillanceSummaryReport']);
    Route::get('getSurveillanceSummaryCartesianReport', [NewReportsController::class, 'getSurveillanceSummaryCartesianReport']);
    Route::get('SurveillanceDetailedReportPreview', [NewReportsController::class, 'SurveillanceDetailedReportPreview']);
    Route::get('printSurveillanceSummaryReport', [NewReportsController::class, 'printSurveillanceSummaryReport']);
   
});