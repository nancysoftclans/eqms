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
use Modules\OpenOffice\Http\Controllers\OpenOfficeController;

Route::group(['prefix' => 'openoffice','middleware' => ['auth:api', 'web']], function() {
    Route::get('/', [OpenOfficeController::class, 'index']);
   //products
   Route::get('getProductsApplicationColumns', [OpenOfficeController::class, 'getProductsApplicationColumns']);
   Route::get('getPoeApplicationDetails', [OpenOfficeController::class, 'getPoeApplicationDetails']);
   Route::get('getProductIngredients', [OpenOfficeController::class, 'getProductIngredients']);
   Route::get('getProductNutrients', [OpenOfficeController::class, 'getProductNutrients']);
   Route::get('getProductPackaging', [OpenOfficeController::class, 'getProductPackaging']);
   Route::get('getproductimage', [OpenOfficeController::class, 'getproductimage']);
   Route::get('getManInfo', [OpenOfficeController::class, 'getManInfo']);
   Route::get('getInspectionInfo', [OpenOfficeController::class, 'getInspectionInfo']);
   Route::get('getSampleInfo', [OpenOfficeController::class, 'getSampleInfo']);
   //premise
   Route::get('getPremiseApplicationColumns', [OpenOfficeController::class, 'getPremiseApplicationColumns']);
   Route::get('getPremisebsnInfo', [OpenOfficeController::class, 'getPremisebsnInfo']);
   Route::get('getPremisePersonnelInfo', [OpenOfficeController::class, 'getPremisePersonnelInfo']);
      //gmp
   Route::get('getGmpSpreadSheet', [OpenOfficeController::class, 'getGmpSpreadSheet']);
   Route::get('getgmpmanblock', [OpenOfficeController::class, 'getgmpmanblock']);
   Route::get('getGmpManLine', [OpenOfficeController::class, 'getGmpManLine']);
   Route::get('getGmpManSite', [OpenOfficeController::class, 'getGmpManSite']);
   Route::get('getGmpBsnDetails', [OpenOfficeController::class, 'getGmpBsnDetails']);
   //import export
   Route::get('getIESpreadSheet', [OpenOfficeController::class, 'getIESpreadSheet']);
   Route::get('getIEproducts', [OpenOfficeController::class, 'getIEproducts']);
   Route::get('getIESections', [OpenOfficeController::class, 'getIESections']);
   Route::get('getIEPermitSpreadSheet', [OpenOfficeController::class, 'getIEPermitSpreadSheet']);
   //Clinical trial
   Route::get('getClinicalTrialsSpreadsheet', [OpenOfficeController::class, 'getClinicalTrialsSpreadsheet']);
   Route::get('getClinicalTrialsStudySite', [OpenOfficeController::class, 'getClinicalTrialsStudySite']);
   Route::get('getClinicalTrialsInvestigators', [OpenOfficeController::class, 'getClinicalTrialsInvestigators']);
   Route::get('getClinicalTrialsIMPProducts', [OpenOfficeController::class, 'getClinicalTrialsIMPProducts']);
    //product notification
   Route::get('getDeviceNotificationSpreadsheet', [OpenOfficeController::class, 'getDeviceNotificationSpreadsheet']);
   //promtion and advertisement
   Route::get('getPromAdvertSpreadsheet', [OpenOfficeController::class, 'getPromAdvertSpreadsheet']);
   Route::get('getProductPaticulars', [OpenOfficeController::class, 'getProductPaticulars']);
   Route::get('getPromotionMaterialDetails', [OpenOfficeController::class, 'getPromotionMaterialDetails']);
    //disposal product
    Route::get('getDisposalSpreadsheetColumns', [OpenOfficeController::class, 'getDisposalSpreadsheetColumns']);
    Route::get('getdisposalproductdetails', [OpenOfficeController::class, 'getdisposalproductdetails']);

    Route::get('getSubmissionEnquiriesCounter', [OpenOfficeController::class, 'getSubmissionEnquiriesCounter']);
    Route::get('getSubmissionEnquiriesApplications', [OpenOfficeController::class, 'getSubmissionEnquiriesApplications']);
    Route::get('getOnlineSubmissionStatuses', [OpenOfficeController::class, 'getOnlineSubmissionStatuses']);

    Route::get('getUploadedDocumentPerApplication', [OpenOfficeController::class, 'getUploadedDocumentPerApplication']);

    //survelliance
    Route::get('getSurvellianceSpreadsheetApplications', [OpenOfficeController::class, 'getSurvellianceSpreadsheetApplications']);
    Route::get('getSurvellianceSampleandProductDetails', [OpenOfficeController::class, 'getSurvellianceSampleandProductDetails']);
    Route::get('getSampleDetails', [OpenOfficeController::class, 'getSampleDetails']);
    Route::get('getSurvellianceSampleSpreadsheetApplications', [OpenOfficeController::class, 'getSurvellianceSampleSpreadsheetApplications']);
    
    Route::post('assignUsertoEnquiryApplication', [OpenOfficeController::class, 'assignUsertoEnquiryApplication']);
    Route::get('getGMPInspectionTeam', [OpenOfficeController::class, 'getGMPInspectionTeam']);
    Route::get('OpenOfficeController', [OpenOfficeController::class, 'OpenOfficeController']);
    Route::get('getProductManufacturers', [OpenOfficeController::class, 'getProductManufacturers']);
    //excell export
    Route::post('exportall', [OpenOfficeController::class, 'exportall']);
    //Route::get('exportData', [OpenOfficeController::class, 'exportData']);

    Route::get('getProductsReport', [OpenOfficeController::class, 'getProductsReport']);
    Route::get('getEnquiries', [OpenOfficeController::class, 'getEnquiries']);
    Route::get('test', [OpenOfficeController::class, 'test']);
    Route::get('getAdrApplicationColumns', [OpenOfficeController::class, 'getAdrApplicationColumns']);
    Route::get('getAdrSuspectedDrugInfo', [OpenOfficeController::class, 'getAdrSuspectedDrugInfo']);
    Route::get('getMirApplicationColumns', [OpenOfficeController::class, 'getMirApplicationColumns']);
    Route::get('getMirMedicalInforHistory', [OpenOfficeController::class, 'getMirMedicalInforHistory']);
    Route::get('getEnforcementApplicationColumns', [OpenOfficeController::class, 'getEnforcementApplicationColumns']);
    Route::get('getSuspectedOffenceDetails', [OpenOfficeController::class, 'getSuspectedOffenceDetails']);
    //poe
    Route::get('getPOESpreadSheet', [OpenOfficeController::class, 'getPOESpreadSheet']);
    Route::get('getAdvancedCustomerApplicationColumns', [OpenOfficeController::class, 'getAdvancedCustomerApplicationColumns']);
    Route::get('getRmuApplicationColumns', [OpenOfficeController::class, 'getRmuApplicationColumns']);
    Route::get('getRmuResponsesInfor', [OpenOfficeController::class, 'getRmuResponsesInfor']);
    Route::get('getPsurApplicationColumns', [OpenOfficeController::class, 'getPsurApplicationColumns']);
});
