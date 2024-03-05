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

// Route::prefix('productregistration')->group(function() {
//     Route::get('/', 'ProductRegistrationController@index');
// });
use Modules\ProductRegistration\Http\Controllers\ProductRegistrationController;

Route::group(['prefix' => 'productregistration','middleware' => ['auth:api', 'web']], function() {
    Route::post('/saveNewProductReceivingBaseDetails', [ProductRegistrationController::class, 'saveNewProductReceivingBaseDetails']);
    Route::post('saveRenAltProductReceivingBaseDetails', [ProductRegistrationController::class, 'saveRenAltProductReceivingBaseDetails']);
    Route::post('/onSaveProductOtherDetails', [ProductRegistrationController::class, 'onSaveProductOtherDetails']);
    Route::post('/onSaveProductinformation', [ProductRegistrationController::class, 'onSaveProductinformation']);
    Route::post('saveApplicationInvoicingDetails', [ProductRegistrationController::class, 'saveApplicationInvoicingDetails']);
    Route::get('/applications', [ProductRegistrationController::class, 'getProductApplications']);
    Route::get('/getElementCosts', [ProductRegistrationController::class, 'getElementCosts']);
    Route::get('/getManagerEvaluationApplications', [ProductRegistrationController::class, 'getManagerEvaluationApplications']);
    Route::get('/getManagerProductDataAmmendApps', [ProductRegistrationController::class, 'getManagerProductDataAmmendApps']);
    Route::get('/getManagerAuditingApplications', [ProductRegistrationController::class, 'getManagerAuditingApplications']);
    Route::get('/getGrantingDecisionApplications', [ProductRegistrationController::class, 'getGrantingDecisionApplications']);
    Route::get('/getApplicationUploadedDocs', [ProductRegistrationController::class, 'getApplicationUploadedDocs']);
    Route::get('/getApplicationUploadedDocs', [ProductRegistrationController::class, 'getApplicationUploadedDocs']);
    Route::get('/prepareNewProductReceivingStage', [ProductRegistrationController::class, 'prepareNewProductReceivingStage']);
    Route::get('/prepareNewProductAmmendMentReceivingStage', [ProductRegistrationController::class, 'prepareNewProductAmmendMentReceivingStage']);
    Route::get('/prepareOnlineProductReceivingStage', [ProductRegistrationController::class, 'prepareOnlineProductReceivingStage']);
    Route::get('/prepareProductsInvoicingStage', [ProductRegistrationController::class, 'prepareProductsInvoicingStage']);
    Route::get('/prepareNewProductPaymentStage', [ProductRegistrationController::class, 'prepareNewProductPaymentStage']);
    Route::get('/prepareProductsRegMeetingStage', [ProductRegistrationController::class, 'prepareProductsRegMeetingStage']);
    Route::post('/saveTCMeetingDetails', [ProductRegistrationController::class, 'saveTCMeetingDetails']);
    Route::post('/saveUpload', [ProductRegistrationController::class, 'saveUpload']);
    Route::post('/saveSample', [ProductRegistrationController::class, 'saveSample']);
    Route::post('/uploadApplicationFile', [ProductRegistrationController::class, 'uploadApplicationFile']);
    Route::post('/onDeleteProductOtherDetails', [ProductRegistrationController::class, 'onDeleteProductOtherDetails']);
    Route::post('/deleteUploadedProductImages', [ProductRegistrationController::class, 'deleteUploadedProductImages']);
    Route::post('/saveManufacturerDetails', [ProductRegistrationController::class, 'saveManufacturerDetails']);
    Route::post('/saveProductGmpApplicationDetails', [ProductRegistrationController::class, 'saveProductGmpApplicationDetails']);
    Route::post('/saveProductRegistrationComments', [ProductRegistrationController::class, 'saveProductRegistrationComments']);


    //products other details


    Route::get('/onLoadproductNutrients', [ProductRegistrationController::class, 'onLoadproductNutrients']);
    Route::get('/onLoadOnlineproductNutrients', [ProductRegistrationController::class, 'onLoadOnlineproductNutrients']);
    Route::get('/onLoadproductIngredients', [ProductRegistrationController::class, 'onLoadproductIngredients']);
    Route::get('/onLoadproductPackagingDetails', [ProductRegistrationController::class, 'onLoadproductPackagingDetails']);
    Route::get('/onLoadManufacturersDetails', [ProductRegistrationController::class, 'onLoadManufacturersDetails']);
    Route::get('/onLoadManufacturingSitesDetails', [ProductRegistrationController::class, 'onLoadManufacturingSitesDetails']);
    Route::get('/onLoadManufacturingDetails', [ProductRegistrationController::class, 'onLoadManufacturingDetails']);
    Route::get('/onLoadproductManufacturer', [ProductRegistrationController::class, 'onLoadproductManufacturer']);
    Route::get('/onLoadproductApiManufacturer', [ProductRegistrationController::class, 'onLoadproductApiManufacturer']);
    Route::get('/onLoadproductGmpInspectionDetailsStr', [ProductRegistrationController::class, 'onLoadproductGmpInspectionDetailsStr']);
    Route::get('/getGMPproductLinesDetails', [ProductRegistrationController::class, 'getGMPproductLinesDetails']);
    Route::get('/getProductActiveIngredients', [ProductRegistrationController::class, 'getProductActiveIngredients']);
    Route::get('/onLoadgmpInspectionApplicationsDetails', [ProductRegistrationController::class, 'onLoadgmpInspectionApplicationsDetails']);
    Route::get('onLoadProductsSampledetails', [ProductRegistrationController::class, 'onLoadProductsSampledetails']);
    Route::get('getTcMeetingParticipants', [ProductRegistrationController::class, 'getTcMeetingParticipants']);
Route::get('getProductRegistrationMeetingApplications', [ProductRegistrationController::class, 'getProductRegistrationMeetingApplications']);
    Route::get('getProductTcReviewMeetingApplications', [ProductRegistrationController::class, 'getProductTcReviewMeetingApplications']);
    Route::get('getProductApprovalApplications', [ProductRegistrationController::class, 'getProductApprovalApplications']);
    Route::get('getProductApprovalApplicationsNonTc', [ProductRegistrationController::class, 'getProductApprovalApplicationsNonTc']);
    Route::get('getproductregistrationAppsApproval', [ProductRegistrationController::class, 'getproductregistrationAppsApproval']);
    Route::get('getProductApplicationMoreDetails', [ProductRegistrationController::class, 'getProductApplicationMoreDetails']);
    Route::get('getEValuationComments', [ProductRegistrationController::class, 'getEValuationComments']);
    Route::get('getAuditingComments', [ProductRegistrationController::class, 'getAuditingComments']);
    Route::get('getOnlineApplications', [ProductRegistrationController::class, 'getOnlineApplications']);
    Route::get('onLoadOnlineproductIngredients', [ProductRegistrationController::class, 'onLoadOnlineproductIngredients']);
    Route::get('onLoadOnlineproductPackagingDetails', [ProductRegistrationController::class, 'onLoadOnlineproductPackagingDetails']);
    Route::get('onLoadOnlineproductManufacturer', [ProductRegistrationController::class, 'onLoadOnlineproductManufacturer']);
    Route::get('onLoadOnlineproductApiManufacturer', [ProductRegistrationController::class, 'onLoadOnlineproductApiManufacturer']);
    Route::get('onLoadOnlinegmpInspectionApplicationsDetails', [ProductRegistrationController::class, 'onLoadOnlinegmpInspectionApplicationsDetails']);
    Route::get('getRegisteredProductsAppsDetails', [ProductRegistrationController::class, 'getRegisteredProductsAppsDetails']);
    Route::get('getProductSampleDetails', [ProductRegistrationController::class, 'getProductSampleDetails']);
    Route::post('savedocumentssubmissionrecommendation', [ProductRegistrationController::class, 'savedocumentssubmissionrecommendation']);
    Route::get('onRegisteredProductsSearchdetails', [ProductRegistrationController::class, 'onRegisteredProductsSearchdetails']);
    Route::get('onRegisteredProductsSearchdetails', [ProductRegistrationController::class, 'onRegisteredProductsSearchdetails']);
    Route::post('saveOnlineProductRegistrationReceiving', [ProductRegistrationController::class, 'saveOnlineProductRegistrationReceiving']);
    Route::get('prepareProductsUniformStage', [ProductRegistrationController::class, 'prepareProductsUniformStage']);
    Route::get('getCertificateChangesRequests', [ProductRegistrationController::class, 'getCertificateChangesRequests']);
    Route::post('updateCertificateChangeRequestDecision', [ProductRegistrationController::class, 'updateCertificateChangeRequestDecision']);
    Route::get('getManagerCertificateReleaseApplications', [ProductRegistrationController::class, 'getManagerCertificateReleaseApplications']);
    Route::get('ExportMeetingReport', [ProductRegistrationController::class, 'ExportMeetingReport']);
    Route::post('saveProductDataAmmendmentRequest', [ProductRegistrationController::class, 'saveProductDataAmmendmentRequest']);
    Route::get('getProductAppealApprovalApplications', [ProductRegistrationController::class, 'getProductAppealApprovalApplications']);
    Route::get('getAllProductsAppsDetails', [ProductRegistrationController::class, 'getAllProductsAppsDetails']);
    Route::post('saveProductEditionBaseDetails', [ProductRegistrationController::class, 'saveProductEditionBaseDetails']);
    Route::get('getCertificateConfirmationApplications', [ProductRegistrationController::class, 'getCertificateConfirmationApplications']);
    Route::post('closeApprovalDecisionConfirmationEntry', [ProductRegistrationController::class, 'closeApprovalDecisionConfirmationEntry']);
    Route::post('handleManagerCertificateConfirmationRelease', [ProductRegistrationController::class, 'handleManagerCertificateConfirmationRelease']);
    Route::post('saveRejectionAppealResponseRecommendationDetails', [ProductRegistrationController::class, 'saveRejectionAppealResponseRecommendationDetails']);
    Route::get('getApplicationRejectionAppealResponses', [ProductRegistrationController::class, 'getApplicationRejectionAppealResponses']);
    Route::post('checkRejectionAppealResponseRecommendation', [ProductRegistrationController::class, 'checkRejectionAppealResponseRecommendation']);
    Route::get('getProductApplicationDetailsTag', [ProductRegistrationController::class, 'getProductApplicationDetailsTag']);
    Route::get('getStageProductsApplications', [ProductRegistrationController::class, 'getStageProductsApplications']);
    Route::get('getApprovedProductsApplications', [ProductRegistrationController::class, 'getApprovedProductsApplications']);
    Route::post('onSaveProductScreeningDecision', [ProductRegistrationController::class, 'onSaveProductScreeningDecision']);
    Route::post('saveApplicationChecklistDetails', [ProductRegistrationController::class, 'saveApplicationChecklistDetails']);
    Route::get('getApprovedScreeningProductsApplications', [ProductRegistrationController::class, 'getApprovedScreeningProductsApplications']);
    Route::post('saveNewProductRegistrationBaseDetails', [ProductRegistrationController::class, 'saveNewProductRegistrationBaseDetails']);
    Route::get('getApprovedProductsRegApplications', [ProductRegistrationController::class, 'getApprovedProductsRegApplications']);
    Route::get('onLoadGmpInspectionInOtherCountries', [ProductRegistrationController::class, 'onLoadGmpInspectionInOtherCountries']);
    Route::get('getMeetingStageApplications', [ProductRegistrationController::class, 'getMeetingStageApplications']);
    Route::post('saveExemptionProductsDetails', [ProductRegistrationController::class, 'saveExemptionProductsDetails']);
    Route::get('getExemptionProductsList', [ProductRegistrationController::class, 'getExemptionProductsList']);
    Route::get('getExemptionProductsIngredientsList', [ProductRegistrationController::class, 'getExemptionProductsIngredientsList']);
    Route::post('onDeleteExemptionProduct', [ProductRegistrationController::class, 'onDeleteExemptionProduct']);
    Route::get('onLoadExemptionPrescriberDetails', [ProductRegistrationController::class, 'onLoadExemptionPrescriberDetails']);
    Route::post('approveExemptionProduct', [ProductRegistrationController::class, 'approveExemptionProduct']);
    Route::get('checkExemptionProductListProcessed', [ProductRegistrationController::class, 'checkExemptionProductListProcessed']);
    Route::post('onSaveListing', [ProductRegistrationController::class, 'onSaveListing']);
    Route::get('getListedDevices', [ProductRegistrationController::class, 'getListedDevices']);
    Route::get('loadMdAssessmentHistory', [ProductRegistrationController::class, 'loadMdAssessmentHistory']);
    Route::get('getMDAssessmentAnswers', [ProductRegistrationController::class, 'getMDAssessmentAnswers']);
    //Route::post('approveExemptionProduct', [ProductRegistrationController::class, 'approveExemptionProduct']);
    Route::get('getRegisterapplications', [ProductRegistrationController::class, 'getRegisterapplications']);
    Route::get('getMdExcemptedDevices', [ProductRegistrationController::class, 'getMdExcemptedDevices']);
    //portal data infor
    Route::get('getProductPortalApplicationMoreDetails', [ProductRegistrationController::class, 'getProductPortalApplicationMoreDetails']);
    Route::get('onLoadportalproductIngredients', [ProductRegistrationController::class, 'onLoadportalproductIngredients']);
    Route::get('onLoadportalproductPackagingDetails', [ProductRegistrationController::class, 'onLoadportalproductPackagingDetails']);
    Route::get('onLoadportalproductManufacturer', [ProductRegistrationController::class, 'onLoadportalproductManufacturer']);
    Route::get('onLoadportalproductApiManufacturer', [ProductRegistrationController::class, 'onLoadportalproductApiManufacturer']);
    Route::get('getVetProductRegisterapplications', [ProductRegistrationController::class, 'getVetProductRegisterapplications']);
    Route::get('getApprovedFacilities', [ProductRegistrationController::class, 'getApprovedFacilities']);
    Route::get('prepareExemptionsProductId', [ProductRegistrationController::class, 'prepareExemptionsProductId']);
    Route::get('onLoadPortalExemptionPrescriberDetails', [ProductRegistrationController::class, 'onLoadPortalExemptionPrescriberDetails']);
    Route::get('onLoadPortalExemptionPatientDetails', [ProductRegistrationController::class, 'onLoadPortalExemptionPatientDetails']);
    Route::post('onCosmeticsSaveListing', [ProductRegistrationController::class, 'onCosmeticsSaveListing']);
    Route::get('getListedCosmetics', [ProductRegistrationController::class, 'getListedCosmetics']);
    Route::post('removeProductFromRegister', [ProductRegistrationController::class, 'removeProductFromRegister']);
    Route::get('getDeletedRegisterapplications', [ProductRegistrationController::class, 'getDeletedRegisterapplications']);
    Route::post('saveRejectionReasons', [ProductRegistrationController::class, 'saveRejectionReasons']);
    Route::post('reistateProductToRegister', [ProductRegistrationController::class, 'reistateProductToRegister']);
});
