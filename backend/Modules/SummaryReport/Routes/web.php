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

// Route::prefix('summaryreport')->group(function() {
//     Route::get('/', 'SummaryReportController@index');
// });
use Modules\SummaryReport\Http\Controllers\SummaryReportController;
use Modules\Reports\Http\Controllers\ReportsController;

    Route::get('getPDF',[SummaryReportController::class,'getPDF']);

Route::group(['prefix' => 'summaryreport','middleware' => ['auth:api', 'web']], function() {
    Route::get('getEnquiries',[SummaryReportController::class,'getEnquiries']);
    Route::get('getOnlineSubmissionStatuses',[SummaryReportController::class,'getOnlineSubmissionStatuses']);
    Route::get('getCommonParamFromTable',[SummaryReportController::class,'getCommonParamFromTable']);
    Route::get('getSubmissionEnquiriesApplications',[SummaryReportController::class,'getSubmissionEnquiriesApplications']);
    Route::get('getOnlineAppsSubmissionCounter',[SummaryReportController::class,'getOnlineAppsSubmissionCounter']);
    Route::get('getScheduledTcMeetingDetails',[SummaryReportController::class,'getScheduledTcMeetingDetails']);
    Route::get('getHFDConsumptionLog',[SummaryReportController::class,'getHFDConsumptionLog']);
    
    // Route::get('getSummaryReports', [SummaryReportController::class, 'getSummaryReports']);
    // Route::get('GetChartProductApplications', [SummaryReportController::class, 'GetChartProductApplications']);
    // Route::get('getGridRevenueReport', [SummaryReportController::class, 'getGridRevenueReport']);
    // Route::get('getChatRevenueReport', [SummaryReportController::class, 'getChatRevenueReport']);
    // Route::get('exportPaymentDetails', [SummaryReportController::class, 'exportPaymentDetails']);
    // Route::get('getUploadedDocs', [SummaryReportController::class, 'getUploadedDocumentDetails']);
    // Route::get('getAgeAnalysis', [SummaryReportController::class, 'getAgeAnalysis']);
    // Route::get('exportSummaryAgeAnalysis', [SummaryReportController::class, 'exportSummaryAgeAnalysis']);
    // Route::get('getRevenueSummaryReports', [SummaryReportController::class, 'getRevenueSummaryReports']);
    // Route::get('getDailyFinanceTrans', [SummaryReportController::class, 'getDailyFinanceTrans']);
    // Route::get('getGLCodedRevenueReport', [SummaryReportController::class, 'getGLCodedRevenueReport']);
    // Route::get('getPaymentReversalsSummaryReports', [SummaryReportController::class, 'getPaymentReversalsSummaryReports']);
    // Route::get('ExportGLCodedReport', [SummaryReportController::class, 'ExportGLCodedReport']);
    // Route::get('exportDailyTransactions', [SummaryReportController::class, 'exportDailyTransactions']);
    // Route::get('printRevenueSummaryReport', [SummaryReportController::class, 'printRevenueSummaryReport']);
    // Route::get('printGlSummaryReport', [SummaryReportController::class, 'printGlSummaryReport']);
    // Route::get('getProductRegistrationCartesianReport', [SummaryReportController::class, 'getProductRegistrationCartesianReport']);
    // Route::get('getProductGridRegistrationReport', [SummaryReportController::class, 'getProductGridRegistrationReport']);
    // Route::get('getProductRegistrationAgeAnalysisReport', [SummaryReportController::class, 'getProductRegistrationAgeAnalysisReport']);
    // Route::get('getPremiseRegistrationCartesianReport', [SummaryReportController::class, 'getPremiseRegistrationCartesianReport']);
    // Route::get('getPremiseGridRegistrationReport', [SummaryReportController::class, 'getPremiseGridRegistrationReport']);
    // Route::get('getPremiseRegistrationAgeAnalysisReport', [SummaryReportController::class, 'getPremiseRegistrationAgeAnalysisReport']);
    // Route::get('getGmpRegistrationCartesianReport', [SummaryReportController::class, 'getGmpRegistrationCartesianReport']);
    // Route::get('getGmpGridRegistrationReport', [SummaryReportController::class, 'getGmpGridRegistrationReport']);
    // Route::get('getGmpRegistrationAgeAnalysisReport', [SummaryReportController::class, 'getGmpRegistrationAgeAnalysisReport']);
    // Route::get('getClinicalTrialRegistrationCartesianReport', [SummaryReportController::class, 'getClinicalTrialRegistrationCartesianReport']);
    // Route::get('getClinicalTrialGridRegistrationReport', [SummaryReportController::class, 'getClinicalTrialGridRegistrationReport']);
    // Route::get('getClinicalTrialRegistrationAgeAnalysisReport', [SummaryReportController::class, 'getClinicalTrialRegistrationAgeAnalysisReport']);
    //  Route::get('getImportExportRegistrationCartesianReport', [SummaryReportController::class, 'getImportExportRegistrationCartesianReport']);
    // Route::get('getImportExportGridRegistrationReport', [SummaryReportController::class, 'getImportExportGridRegistrationReport']);
    // Route::get('getImportExportRegistrationAgeAnalysisReport', [SummaryReportController::class, 'getImportExportRegistrationAgeAnalysisReport']);
    // Route::get('getPromAdvertRegistrationCartesianReport', [SummaryReportController::class, 'getPromAdvertRegistrationCartesianReport']);
    // Route::get('getPromAdvertGridRegistrationReport', [SummaryReportController::class, 'getPromAdvertGridRegistrationReport']);
    // Route::get('getPromAdvertRegistrationAgeAnalysisReport', [SummaryReportController::class, 'getPromAdvertRegistrationAgeAnalysisReport']);
    // Route::get('getDisposalRegistrationCartesianReport', [SummaryReportController::class, 'getDisposalRegistrationCartesianReport']);
    // Route::get('getDisposalGridRegistrationReport', [SummaryReportController::class, 'getDisposalGridRegistrationReport']);
    // Route::get('getDisposalRegistrationAgeAnalysisReport', [SummaryReportController::class, 'getDisposalRegistrationAgeAnalysisReport']); 
    // Route::get('exportProductDefinedColumns', [SummaryReportController::class, 'exportProductDefinedColumns']);
    // Route::get('exportPremiseDefinedColumns', [SummaryReportController::class, 'exportPremiseDefinedColumns']);
    // Route::get('exportGmpDefinedColumns', [SummaryReportController::class, 'exportGmpDefinedColumns']);
    // Route::get('exportImportExportDefinedColumns', [SummaryReportController::class, 'exportImportExportDefinedColumns']);
    // Route::get('exportClinicalTrialDefinedColumns', [SummaryReportController::class, 'exportClinicalTrialDefinedColumns']);
    // Route::get('exportPromAdvertDefinedColumns', [SummaryReportController::class, 'exportPromAdvertDefinedColumns']);
    // Route::get('exportDisposalDefinedColumns', [SummaryReportController::class, 'exportDisposalDefinedColumns']);
    // Route::get('getPremiseZonalGridReports', [SummaryReportController::class, 'getPremiseZonalGridReports']);
    // Route::get('getProductAssessmentGridReports', [SummaryReportController::class, 'getProductAssessmentGridReports']);
    // Route::get('getProductClassificationGridReports', [SummaryReportController::class, 'getProductClassificationGridReports']);
    // Route::get('getDisposalTypeGridReports', [SummaryReportController::class, 'getDisposalTypeGridReports']);
    // Route::get('getImportExportPermitGridReports', [SummaryReportController::class, 'getImportExportPermitGridReports']);
    // Route::get('getAllUploadedDocumentDetails', [SummaryReportController::class, 'getAllUploadedDocumentDetails']);
    // Route::get('getregisteredApplicationsGridReports', [SummaryReportController::class, 'getregisteredApplicationsGridReports']);
    // Route::get('getRegisteredApplicationsCounterGridReports', [SummaryReportController::class, 'getRegisteredApplicationsCounterGridReports']);
    // Route::get('getRegistrationApplicableModules', [SummaryReportController::class, 'getRegistrationApplicableModules']);
    // Route::get('getAnnualPMSImplementationReport', [SummaryReportController::class, 'getAnnualPMSImplementationReport']);
    // Route::get('getPMSManufacturerReport', [SummaryReportController::class, 'getPMSManufacturerReport']);
    // Route::get('ExportPmsReport', [SummaryReportController::class, 'ExportPmsReport']);
    // Route::get('ExportPmsManufacturerReport', [SummaryReportController::class, 'ExportPmsManufacturerReport']);
    // Route::get('getApplicationReceiptsReport', [SummaryReportController::class, 'getApplicationReceiptsReport']);
    // Route::get('generatedSystemReport', [SummaryReportController::class, 'generatedSystemReport']);
    // Route::get('getPremiseRegisterReport', [SummaryReportController::class, 'getPremiseRegisterReport']);
    // Route::get('getPremiseRegisterChart', [SummaryReportController::class, 'getPremiseRegisterChart']);
    // Route::get('getBusinessTypeScaleReport', [SummaryReportController::class, 'getBusinessTypeScaleReport']);
    // Route::get('exportData', [SummaryReportController::class, 'exportData']);
    // Route::get('exportDefinedColumnData', [SummaryReportController::class, 'exportDefinedColumnData']);
    // Route::get('printProductRegSummary', [SummaryReportController::class, 'printProductRegSummary']);
    // Route::get('printPremiseRegistrationReport', [SummaryReportController::class, 'printPremiseRegistrationReport']);
    // Route::get('printPremiseRegister', [SummaryReportController::class, 'printPremiseRegister']);
    // Route::get('printIERegSummaryReport', [SummaryReportController::class, 'printIERegSummaryReport']);
    // Route::get('printGMPRegSummaryReport', [SummaryReportController::class, 'printGMPRegSummaryReport']);
    // Route::get('printCTRegSummaryReport', [SummaryReportController::class, 'printCTRegSummaryReport']);
    // Route::get('printPromAdvertRegSummaryReport', [SummaryReportController::class, 'printPromAdvertRegSummaryReport']);
    // Route::get('printPremiseZonalSummaryReport', [SummaryReportController::class, 'printPremiseZonalSummaryReport']);
    // Route::get('exportPremiseZonalSummaryData', [SummaryReportController::class, 'exportPremiseZonalSummaryData']);
    // Route::get('printDisposalSummaryReport', [SummaryReportController::class, 'printDisposalSummaryReport']);
    // Route::get('getModuleRegReport', [SummaryReportController::class, 'getModuleRegReport']);
    // Route::get('printModuleRegReport', [SummaryReportController::class, 'printModuleRegReport']);
    // Route::get('exportModuleRegReportData', [SummaryReportController::class, 'exportModuleRegReportData']);
    // Route::get('printSectionRegReport', [SummaryReportController::class, 'printSectionRegReport']);
    // Route::get('getSectionRegReport', [SummaryReportController::class, 'getSectionRegReport']);
    // Route::get('getRequestCreditNoteSummaryReport', [SummaryReportController::class, 'getRequestCreditNoteSummaryReport']);
    // Route::get('getApprovedCreditNoteSummaryReport', [SummaryReportController::class, 'getApprovedCreditNoteSummaryReport']);
    //  Route::get('getPMSZonalReport', [SummaryReportController::class, 'getPMSZonalReport']);
    //  Route::get('printPMSZonalReport', [SummaryReportController::class, 'printPMSZonalReport']);
     Route::get('generateSpreadsheeetviewData', [SummaryReportController::class, 'generateSpreadsheeetviewData']);
     Route::get('getCorrespodenceUrl', [SummaryReportController::class, 'getCorrespodenceUrl']);
     Route::get('getDataBrowserDocuments', [SummaryReportController::class, 'getDataBrowserDocuments']);
     Route::get('getActiveApplicationsList', [SummaryReportController::class, 'getActiveApplicationsList']);
     
    
     
});
Route::group(['prefix' => 'reports','middleware' => ['web']], function() {
    Route::get('previewCorrespondence', [SummaryReportController::class, 'previewCorrespondence']);
    // Route::get('printRequestForAdditionalInformation', [SummaryReportController::class, 'printRequestForAdditionalInformation']);
    });
Route::group(['prefix' => 'reportmanagement','middleware' => ['web']], function() {
    Route::get('printProductScreeningApprovalLetter', [SummaryReportController::class, 'previewCorrespondence']);
    });

Route::group(['prefix' => 'reports'], function() {
    Route::get('printRequestForAdditionalInformation', [SummaryReportController::class, 'printRequestForAdditionalInformation']);
	Route::get('printProductRejectionLetter', [SummaryReportController::class, 'printProductRejectionLetter']);
    Route::get('printInspectionReport', [ReportsController::class, 'printInspectionReport']);
    // Route::get('printAdministrativeSubmissionResponses', [SummaryReportController::class, 'printAdministrativeSubmissionResponses']);
    Route::get('printProductExemptionRejectionLetter', [SummaryReportController::class, 'printProductExemptionRejectionLetter']);
    
    });
