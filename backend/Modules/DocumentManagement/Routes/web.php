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

// Route::prefix('documentmanagement')->group(function() {
//     Route::get('/', 'DocumentManagementController@index');
// });
use Modules\DocumentManagement\Http\Controllers\DocumentManagementController;
use Modules\DocumentManagement\Http\Controllers\DmsConfigurationsController;


//non json routes
Route::group(['prefix' => 'documentmanagement', 'middleware' => ['web']], function() {
    Route::post('uploadApplicationDocumentFile', [DocumentManagementController::class, 'uploadApplicationDocumentFile']);
    Route::post('uploadunstructureddocumentuploads', [DocumentManagementController::class, 'uploadunstructureddocumentuploads']);
    Route::post('resumableuploadApplicationDocumentFile', [DocumentManagementController::class, 'uploadLargeFiles']);
    // Route::post('uploadMultipleFiles', [DocumentManagementController::class, 'uploadMultipleFiles']);

    Route::post('importExcelFile', [DocumentManagementController::class, 'importExcelFile']);
    Route::post('saveHeaderFooter', [DocumentManagementController::class, 'saveHeaderFooter']);
    Route::get('getHeaderFooterImages', [DocumentManagementController::class, 'getHeaderFooterImages']);

});

//json routes
Route::group(['prefix' => 'documentmanagement','middleware' => ['auth:api', 'web']], function() {
Route::post('saveDocumentRepositoryStructure', [DmsConfigurationsController::class, 'saveDocumentRepositoryStructure']);
    Route::post('saveDocumentRepositoryRootFolder', [DmsConfigurationsController::class, 'saveDocumentRepositoryRootFolder']);
    Route::post('saveDMSSiteDefinationDetails', [DmsConfigurationsController::class, 'saveDMSSiteDefinationDetails']);
    Route::post('saveDMSSectionDefinationDetails', [DmsConfigurationsController::class, 'saveDMSSectionDefinationDetails']);
    Route::post('saveDMSSecModulesDefinationDetails', [DmsConfigurationsController::class, 'saveDMSSecModulesDefinationDetails']);
    Route::post('saveDMSSecSubModulesDefinationDetails', [DmsConfigurationsController::class, 'saveDMSSecSubModulesDefinationDetails']);
    Route::post('saveDMSModulesDocTypeDefinationDetails', [DmsConfigurationsController::class, 'saveDMSModulesDocTypeDefinationDetails']);
    Route::post('saveDMSNoStructuredDocDefinationDetails', [DmsConfigurationsController::class, 'saveDMSNoStructuredDocDefinationDetails']);
    
    Route::post('uploadProductImages', [DocumentManagementController::class, 'uploadProductImages']);
    Route::post('saveDocDefinationrequirement', [DocumentManagementController::class, 'saveDocDefinationrequirement']);
    Route::post('onApplicationDocumentDelete', [DocumentManagementController::class, 'onApplicationDocumentDelete']);
    Route::post('onDeleteProductImages', [DocumentManagementController::class, 'onDeleteProductImages']);
    Route::post('onDeleteNonStructureApplicationDocument', [DocumentManagementController::class, 'onDeleteNonStructureApplicationDocument']);
    
    Route::get('getDocumentsTypes', [DmsConfigurationsController::class, 'getDocumentsTypes']);
    Route::get('prepareDocumentCreationReceivingStage', [DmsConfigurationsController::class, 'prepareDocumentCreationReceivingStage']);
    Route::get('getDocumentsSubTypes', [DmsConfigurationsController::class, 'getDocumentsSubTypes']);
    Route::get('navigatorMoveFolder', [DmsConfigurationsController::class, 'navigatorMoveFolder']);
    Route::get('getParameterstableSchema', [DmsConfigurationsController::class, 'getParameterstableSchema']);
    Route::get('getdocdefinationrequirementDetails', [DmsConfigurationsController::class, 'getdocdefinationrequirementDetails']);
    Route::get('getlivedocumentDetails', [DmsConfigurationsController::class, 'getlivedocumentDetails']);
    Route::get('getdoctypesDetails', [DmsConfigurationsController::class, 'getdoctypesDetails']);
    Route::get('getNavigatorDetails', [DmsConfigurationsController::class, 'getNavigatorDetails']);
    Route::get('docdefinationrequirementfilterdetails', [DmsConfigurationsController::class, 'docdefinationrequirementfilterdetails']);
    Route::get('getdocumentreposirotystructureDetails', [DmsConfigurationsController::class, 'getdocumentreposirotystructureDetails']);
    Route::get('getdocumentsectionsrepstructure', [DmsConfigurationsController::class, 'getdocumentsectionsrepstructure']);
    Route::get('getRepositoryrootfolderDetails', [DmsConfigurationsController::class, 'getRepositoryrootfolderDetails']);
    Route::get('dmsAuthentication', [DmsConfigurationsController::class, 'dmsAuthentication']);
    Route::get('prepapreDocumentApplicationReceiving', [DocumentManagementController::class, 'prepapreDocumentApplicationReceiving']);
    Route::get('prepapreDocumentApplicationScreening', [DocumentManagementController::class, 'prepapreDocumentApplicationScreening']);
    Route::get('getDMSSiteDefinationDetails', [DmsConfigurationsController::class, 'getDMSSiteDefinationDetails']);
    Route::get('getDMSSectionsDefinationDetails', [DmsConfigurationsController::class, 'getDMSSectionsDefinationDetails']);
    Route::get('getDMSSectionsModulesDefinationDetails', [DmsConfigurationsController::class, 'getDMSSectionsModulesDefinationDetails']);
    Route::get('getDMSSectionsSubModulesDefinationDetails', [DmsConfigurationsController::class, 'getDMSSectionsSubModulesDefinationDetails']);
    Route::get('getDMSModulesDocumentTypesDefinationDetails', [DmsConfigurationsController::class, 'getDMSModulesDocumentTypesDefinationDetails']);
    Route::get('getSOPMasterListDetails', [DmsConfigurationsController::class, 'getSOPMasterListDetails']);
    Route::get('getnonStructuredDocumentsDefination', [DmsConfigurationsController::class, 'getnonStructuredDocumentsDefination']);
    Route::get('getDmsParamFromModel', [DmsConfigurationsController::class, 'getDmsParamFromModel']);
    Route::get('onLoadApplicationDocumentsUploads', [DocumentManagementController::class, 'onLoadApplicationDocumentsUploads']);
    Route::get('onLoadProductImagesUploads', [DocumentManagementController::class, 'onLoadProductImagesUploads']);
    Route::get('onLoadApplicationDocumentsRequirements', [DocumentManagementController::class, 'onLoadApplicationDocumentsRequirements']);
    Route::get('getApplicationDocumentDownloadurl', [DocumentManagementController::class, 'getApplicationDocumentDownloadurl']);
    Route::get('getApplicationDocumentPreviousVersions', [DocumentManagementController::class, 'getApplicationDocumentPreviousVersions']);
    Route::get('getProcessApplicableDocTypes', [DocumentManagementController::class, 'getProcessApplicableDocTypes']);
    Route::get('getProcessApplicableDocRequirements', [DocumentManagementController::class, 'getProcessApplicableDocRequirements']);
    Route::get('onLoadApplicationDocumentsUploadsPortal', [DocumentManagementController::class, 'onLoadApplicationDocumentsUploadsPortal']);
    Route::get('LoadAllApplicationUploadedDocuments', [DocumentManagementController::class, 'LoadAllApplicationUploadedDocuments']);
    Route::get('onLoadOnlineProductImagesUploads', [DocumentManagementController::class, 'onLoadOnlineProductImagesUploads']);
    Route::get('onLoadUnstructureApplicationDocumentsUploads', [DocumentManagementController::class, 'onLoadUnstructureApplicationDocumentsUploads']);
    Route::post('validateDocumentAppReceivingDetails', [DocumentManagementController::class, 'validateDocumentAppReceivingDetails']);
    Route::post('getDocumentArchive', [DocumentManagementController::class, 'getDocumentArchive']);
    Route::post('saveDocumentRecommendationComments', [DocumentManagementController::class, 'saveDocumentRecommendationComments']);
    Route::post('saveDocumentApplicationRecommendationDetails', [DocumentManagementController::class, 'saveDocumentApplicationRecommendationDetails']); 
    Route::post('dmsUpdateAccountPassword', [DmsConfigurationsController::class, 'dmsUpdateAccountPassword']);
    Route::get('getArchivedDocdDetails', [DmsConfigurationsController::class, 'getArchivedDocdDetails']);

    });


