Ext.define('Admin.controller.SharedUtilitiesCtr', {
    extend: 'Ext.app.Controller',

    config: {
        refs: [{
            ref: 'mainPanel',
            selector: 'maincontainerwrap'
        }, {
            ref: 'mainTabPanel',
            selector: '#contentPanel'
        }]
    },
    stores: [
            'Admin.store.administration.NavigationStr',
            'Admin.store.abstract.AbstractStore',
            'Admin.store.administration.SystemMenusStr',
            'Admin.store.administration.OnlineMenusStr',
            'Admin.store.ConfirmationStr',
            'Admin.store.abstract.AbstractTreeStr',
            'Admin.store.administration.UsershareditemsStr',
            'Admin.store.AgreeConfirmationStr',
            'Admin.store.ComplianceRiskScaleStr'
        
        ],
    control: {
            
            //handle viewing of application invoices
             'invoicepaymentverificationdetailsGrid': {
                refresh: 'addApplicationIdCodeParams'
            }, 
            'paymentsreceptionfrm button[name=save_details]': {
                click: 'saveApplicationPaymentDetails'
            },
            'receiptingGenericPnl button[name=process_submission_btn]': {
                click: 'showPaymentApplicationSubmissionWin'
            },
            'invoicingGenericPnl button[name=process_submission_btn]': {
                click: 'showInvoicingApplicationSubmissionWin'
            },
            'newpremiseinspectionpanel button[name=save_btn]': {
                click: 'saveApplicationChecklistDetails'
            },
            'newpremiseinspectionpanel button[name=inspection_details]': {
                click: 'showInspectionDetails'
            },
            'newpremiseinspectionpanel toolbar menu menuitem[name=inspection_details]': {
                click: 'showInspectionDetails'
            },
        'approvalfordeskreviewgrid button[action=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },

        'newgmpdeskreviewprocesspanel button[name=docs_btn]': {
            click: 'showApplicationUploads'
        },
        'newpremiseinspectionpanel toolbar menu menuitem[name=prev_inspections]': {
                click: 'showPrevStructuredChecklistDetails'
            },
            'newpremiseinspectionpanel button[name=docs_btn]': {
                click: 'showApplicationUploads'
            },
            'renewpremiseinspectionpanel button[name=save_btn]': {
                click: 'saveApplicationChecklistDetails'
            },
            'renewpremiseinspectionpanel button[name=inspection_details]': {
                click: 'showInspectionDetails'
            },
            'renewpremiseinspectionpanel button[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },
            'renewpremiseinspectionpanel button[name=docs_btn]': {
                click: 'showApplicationUploads'
            },
            'quotationGenericPnl button[name=process_submission_btn]': {
                click: 'showInvoicingApplicationSubmissionWin'
            },
            'productManagerScreeningPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'productManagerNewQueryPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'mirManagerAllocationPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
          
            'managerassessmentWizard button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            
            'pvManagerAllocationPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'pvExportImportPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'productcertificateconfirmationGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'productManagerEvaluationPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'productScreeningApprovalPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'rMUSubmissionReviewPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'listingScreeningApprovalPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'cosmeticListingScreeningApprovalPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
        'clinicaltrialassessmentpanel button[name=comments_btn]': {
            click: 'showApplicationCommentsWin'
        },
        'clinicaltrialauditingpanel button[name=comments_btn]': {
            click: 'showApplicationCommentsWin'
        },
            'exemptionProductApprovalPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'premiseNewApproval button[name=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
            },
            // 'managerapporvalWizard button[name=process_submission_btn]': {
            //     click: 'showManagerApplicationSubmissionWinGeneric'
            //     },
            'premiseLicensingReceiving button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'managerInvestigationWizard button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },

            'gmpapprovalsgrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'approvalsgrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'managercertificateammendmentsGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'certificateammendmentGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'managerreviewrenewalgrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'productcertificaterejectionIntentGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            
        'clinicaltrialregreviewapplicationgrid button[action=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
        'clinicaltrialmanagermeetinggrid button[action=process_returnsubmission_btn]': {
            click: 'showGridApplicationReturnSubmissionWinGeneric'
        },
        'clinicaltrialmanagermeetinggrid button[action=process_submission_btn]': {
            click: 'showManagerApplicationMeetingSubmissionWinGeneric'
        },
        'clinicaltrialmanagermeetingpanel button[action=process_submission_btn]': {
            click: 'showManagerApplicationMeetingSubmissionWinGeneric'
        },
        'clinicaltrialrecommreviewgrid button[action=process_submission_btn]': {
            click: 'showManagerApplicationMeetingSubmissionWinGeneric'
        },
        'clinicaltrialmanagerreviewgrid button[action=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
        'clinicaltrialapprovalsgrid button[action=process_returnsubmission_btn]': {
            click: 'showGridApplicationReturnSubmissionWinGeneric'
        },
        // 'clinicaltrialapprovalsgrid button[action=process_submission_btn]': {
        //     click: 'showManagerApplicationSubmissionWinGeneric'
        // },
        'portalSubmissionReceivingPnl button[name=process_receive_btn]': {
            click: 'showPortalSubmissionWinGeneric'
        },
        'clinicaltrialcommunicationsgrid': {
            moveRowTop: 'moveSelectedRecordRowToTop',
            refresh: 'tCMMeetingSchedulingRefreshGrid'
        },
        'approvalfordeskreviewgrid': {
            refresh: 'addApplicationWorkflowParams',
            moveRowTop: 'moveSelectedRecordRowToTop'
        },
        'gmpinspectionreportsreviewgrid': {
            refresh: 'addApplicationWorkflowParams',
            moveRowTop: 'moveSelectedRecordRowToTop'
        },
        'gmpinspectionreportsreviewgrid button[action=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },

        'clinicaltrialscreeninggrid': {
            refresh: 'refreshScreeningChecklistItemsGrid'
        },
        'clinicaltrialauditscreeninggrid': {
            refresh: 'refreshScreeningChecklistItemsGrid'
        },
        'gmpscreeninggrid': {
            refresh: 'refreshScreeningChecklistItemsGrid'
        },
        'clinicaltrialcommunicationsgrid button[action=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
        'clinicaltrialapprovalrecommfrm button[name=save_recommendation]': {
            click: 'saveApplicationApprovalDetails'
        },
        'clinicaltrialregapprovalrecommfrm button[name=save_recommendation]': {
            click: 'saveApplicationApprovalDetails'
        },
        'queryApprovalRecommFrm button[name=save_recommendation]': {
            click: 'saveQueryApprovalDetails'
        },
            'applicationdocuploadsgrid': {
                refresh: 'refreshApplicationDocUploadsGrid'
            },
        'ctrvariationrequestsgrid': {
            refresh: 'refreshCtrvariationrequestsgrid'
        },
        'ctrvariationethicsgrid': {
            refresh: 'refreshCtrvariationEthicsrequestsgrid'
        },
            'applicationdocpreviewgrid': {
                refresh: 'refreshApplicationDocPreviewGrid'
            },
            'managerinspectiongrid button[action=process_returnsubmission_btn]': {
                click: 'showGridApplicationReturnSubmissionWinGeneric'
            },
            'productscreeninggrid button[name=show_screeninghistory_btn]': {
                  click: 'showApplicationChecklistRevisions'
              },
              'premisescreeninggrid button[name=show_screeninghistory_btn]': {
                  click: 'showApplicationChecklistRevisions'
              },
              'detailedChecklistGrid button[name=show_screeninghistory_btn]': {
                  click: 'showApplicationChecklistRevisions'
              },
              'secondReviewscreeninggrid button[name=show_screeninghistory_btn]': {
                  click: 'showApplicationChecklistRevisions'
              },
              'clinicaltrialscreeninggrid button[name=show_screeninghistory_btn]': {
                click: 'showApplicationChecklistRevisions'
            },
            'clinicaltrialauditscreeninggrid button[name=show_screeninghistory_btn]': {
                click: 'showApplicationChecklistRevisions'
            },
            // 'productEvaluationUploadsGrid button[name=add_upload]': {
            //     click: 'showApplicationDocUploadWin'
            // },
            'variationrequestsabstractgrid button[name=add_variation]': {
                click: 'showAddApplicationVariationRequest'
            },
            'gmpapprovalsgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'managerinspectiongrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'approvalsgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'communicationsgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },

        'clinicaltrialmanagerreviewgrid': {
            refresh: 'addApplicationWorkflowParams',
            moveRowTop: 'moveSelectedRecordRowToTop'
        },
        'clinicaltrialapprovalsgrid': {
            moveRowTop: 'moveSelectedRecordRowToTop',
            refresh: 'tCMMeetingSchedulingRefreshGrid'
        },
        'clinicaltrialrecommreviewgrid': {
            refresh: 'tCMMeetingSchedulingRefreshGrid'
        },
        'clinicaltrialmanagermeetinggrid': {
            refresh: 'tCMMeetingSchedulingRefreshGrid'
        },
        'clinicaltrialstudysitesgrid': {
            refresh: 'addApplicationIdCodeParams'
        },
        'clinicaltrialotherinvestigatorsgrid': {
            refresh: 'addApplicationIdCodeParams'
        },
        'clinicaltrialmonitorsgrid': {
            refresh: 'addApplicationIdCodeParams'
        },
        'gmptcmeetingrecommendationgrid': {
            refresh: 'tCMMeetingSchedulingRefreshGrid'
            //moveRowTop: 'moveSelectedRecordRowToTop'
        },
        'gmpLicensingMeetingRecommendationGrid': {
            refresh: 'tCMMeetingSchedulingRefreshGrid'
            //moveRowTop: 'moveSelectedRecordRowToTop'
        },
        'gmpmeetingschedulinggrid': {
            refresh: 'tCMMeetingSchedulingRefreshGrid',
            //moveRowTop: 'moveSelectedRecordRowToTop'
        },
        'gmpLicensingMeetingSchedulingGrid': {
            refresh: 'tCMMeetingSchedulingRefreshGrid',
            //moveRowTop: 'moveSelectedRecordRowToTop'
        },
            // 'productdocuploadsgrid button[name=add_upload]': {
            //     click: 'showApplicationDocUploadWin'
            // },
            // 'productDocUploadsGrid button[name=add_upload]': {
            //     click: 'showApplicationDocUploadWin'
            // },
            'productscreeninggrid button[name=savegrid_screening_btn]': {
                click: 'saveApplicationChecklistDetails'
            },
            'premisescreeninggrid button[name=savegrid_screening_btn]': {
                click: 'saveApplicationChecklistDetails'
            },
            'detailedChecklistGrid button[name=savegrid_screening_btn]': {
                click: 'saveApplicationPopUpChecklistDetails'
            },
            'secondReviewscreeninggrid button[name=savegrid_screening_btn]': {
                click: 'saveApplicationChecklistDetails'
            },
            'clinicaltrialscreeninggrid button[name=savegrid_screening_btn]': {
                click: 'saveApplicationChecklistDetails'
            },
            'clinicaltrialauditscreeninggrid button[name=savegrid_screening_btn]': {
                click: 'saveApplicationChecklistDetails'
            },
            'gmpscreeninggrid button[name=savegrid_screening_btn]': {
                click: 'saveApplicationChecklistDetails'
            },
            'checklistresponsescmngrid': {
                beforerender: 'setWorkflowModuleGridsStore',
                // showAppQueries: 'showApplicationQueriesWin'
            },
            'button[name=raise_view_query]': {
                click: 'showApplicationQueriesWin',
            },
            'transitionsbtn': {
                click: 'showApplicationTransitioning'
            },
            'transitionsgrid': {
                refresh: 'addApplicationIdCodeParams'
            },
            'productScreeningPnl button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'secondReviewscreeninggrid button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'productScreeningaAuditPnl button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'psurAssessmentPnl button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'productscreeninggrid': {
                refresh: 'refreshScreeningChecklistItemsGrid'
            },
            'premisescreeninggrid': {
                refresh: 'refreshScreeningChecklistItemsGrid'
            },
            'detailedChecklistGrid': {
                refresh: 'refreshScreeningChecklistItemsGrid'
            },
            'secondReviewscreeninggrid': {
                refresh: 'refreshScreeningChecklistItemsGrid'
            },
            'applicationcommentsgrid': {
                refresh: 'addAppCodeWfStageIdToStore'
            },
        'applicationqueriesgrid': {
            refresh: 'refreshApplicationQueriesGrid'
        },
            'button[name=upload_file_btn]': {
                click: 'uploadApplicationFile',
                afterrender: 'initializeResumableUpload'
            },
            'button[name=upload_excel_btn]': {
                click: 'uploadExcelFile',
               // sendExcelToBD
               afterrender: 'initializeResumableExcelUpload'
            },
            'drugnewevaluationpnl button[name=submission_remark]': {
                click: 'viewSubmissionRemark'
            },
            'enforcementinvestigationpnl button[name=submission_remark]': {
                click: 'viewSubmissionRemark'
            },
            'enforcementinvestigationpnl button[name=save_evaluationchecklist]': {
                click: 'saveApplicationChecklistDetails'
            },
            'drugnewevaluationpnl button[name=save_evaluationchecklist]': {
                click: 'saveApplicationChecklistDetails'
            },
            'drugnewevaluationpnl button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'enforcementinvestigationpnl button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'mirFindingsPnl button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'drugnewauditingpnl button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'importexportpermitmanagerreviewwizard button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'drugnewauditingpnl toolbar menu menuitem[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },
            'newpremiseevaluationpanel button[name=save_btn]': {
                click: 'saveApplicationChecklistDetails'
            },
            'newpremiseevaluationpanel toolbar menu menuitem[name=inspection_details]': {
                click: 'showInspectionDetails'
            },
            'newpremiseevaluationpanel button[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },
            'newpremiseevaluationpanel toolbar menu menuitem[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'newpremiseevaluationpanel button[name=docs_btn]': {
                click: 'showApplicationUploads'
            },
            'newpremiseevaluationpanel button[name=manager_query]': {
                click: 'showManagerQueries'
            },
        'newgmpinspectionpanel button[name=comments_btn]': {
            click: 'showApplicationCommentsWin'
        },
        'renewgmpinspectionpanel button[name=comments_btn]': {
            click: 'showApplicationCommentsWin'
        },
            'meetingparticipantsgrid button[name=save_selected]': {
                click: 'addTcMeetingParticipants'
            },
            'debriefmeetingparticipantsgrid button[name=save_selected]': {
                click: 'addTcMeetingParticipants'
            },
            'meetingschedulesparticipantsselectiongrid button[name=save_selected]': {
                click: 'addMeetingParticipants'
            },
            'advancedCustomerManagerApprovalPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
              'psurManagerReviewPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'psurManagerAllocationPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'peerReviewSchedulingPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
           
            'enforcementPeerReviewMeetingPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'pvReviewPeerSchedulingPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'pvReviewRcSchedulingPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'pvReviewRcMeetingPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'pvReviewPeerMeetingPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'newPremiseTcMeetingpnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'newPremiseTcReviewMeetingpnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            
            'premisepeerReviewMeetingPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'invoicingpanel button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'rcReviewSchedulingPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            ' premiseManagerMeetingGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'premisesInspectionPeerReviewRecomGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'inspectionPeerReviewPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'inspectionpeerReviewSchedulingPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            ' newpremisetcMeetingGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'premiseReviewTCMeetingGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'premiseLicensingGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            ' premisePeerReviewMeetingGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            ' premiseReviewTCMeetingApprovalGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'applicationdocuploadsgrid button[name=add_upload]': {
                click: 'showApplicationDocUploadWin'
            },
            'peerReviewMeetingPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'rcReviewMeetingPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'productRegistrationApprovalPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'premiseVariationApprovalPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'enforcementinvestigationpnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'refundApplicationManagerReviewPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'refundApprovalPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },

        'clinicaltrialmanagerauditinggrid button[action=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
        'pmsProgramMeetingScheduling button[name=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
        'sampleCollectorMeetingSchedulingPnl button[name=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
        'sampleCollectorMeetingPnl button[name=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
        'pmsSampleCollectionPnl button[name=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
         'pmsSampleLabScreeningResultsPnl button[name=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
        'pmsSampleCollectedScreeningPnl button[name=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
        'pmsSampleLabResultsPnl button[name=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
        'pmsProgramMeetingPnl button[name=process_submission_btn]': {
            click: 'showManagerApplicationSubmissionWinGeneric'
        },
        'clinicaltrialauditingpanel toolbar menu menuitem[name=prev_comments]': {
            click: 'showApplicationCommentsWin'
        },
            'productApprovalRecommFrm button[name=save_recommendation]': {
                click: 'saveApplicationApprovalDetails'
            },
            'approvalrecommendationfrm button[name=save_recommendation]': {
                click: 'saveApplicationApprovalDetails'
            },
            'gmpapprovalrecommendationfrm button[name=save_recommendation]': {
                click: 'saveApplicationApprovalDetails'
            },
            'enforcementApprovalRecommFrm button[name=save_recommendation]': {
                click: 'saveApplicationApprovalDetails'
            },
            'promotionCEOApprovalFrm button[name=save_recommendation]': {
                click: 'saveApplicationApprovalDetails'
            },
            'signPlanFrm button[name=save_recommendation]': {
                click: 'saveOfficerSignatureDetails'
            },
            // 'productAuditingUploadsGrid button[name=add_upload]': {
            //     click: 'showApplicationDocUploadWin'
            // },
            'exportbtn menu menuitem[action=exportBtnPlugin]': {
                click: 'generateReport'
            },
            'productcertificateconfirmationGrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'managercertificateammendmentsGrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'certificateammendmentGrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'productcertificaterejectionIntentGrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'rejectionAppealResponsesGrid': {
                refresh: 'attachAppCodefromMainPaneltoStr',
            },
            'unstructureddocumentuploadsgrid button[name=add_upload]': {
                click: 'showUnstructuredDocUploadWin'
            },
            'unstructureddocumentuploadsgrid': {
                refresh: 'refreshunstructureddocumentuploadsgrid'
            },
            'productScreeningReportGrid': {
                refresh: 'addChecklistListApplicationFilters'
            },
            'unstructureddocumentuploadsfrm button[name=upload_file]': {
                click: 'uploadunstructureddocumentuploads'
            },
            'approvalsalterationgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'approvalsalterationgrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'approvalscancellationgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'approvalsuspensiongrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'clinicaltrialmanagerauditinggrid':{
                showApplicationCommentsWin:'showApplicationCommentsWin'
            },

            'managerreviewrenewalgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'communicationsrenewalgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'managerevaluationrenewalgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'managerinspectionrenewalgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'facilityScheduleManagerGrid': {
                refresh: 'addApplicationWorkflowParams'
            },
            'facilityScheduleImplementationGrid': {
                refresh: 'addApplicationWorkflowParams'
            },
            'pMSProgramMeetingAppList': {
                refresh: 'addApplicationWorkflowParams'
            },
            'pmsSampleMeetingGrid': {
                refresh: 'addApplicationWorkflowParams'
            },
            // 'documentapplicationreceivingwizard': {
            //     afterrender: 'prepapreDocumentCreationReceiving'
            //  },
            'approvalscancellationgrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'approvalsuspensiongrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'pmsManagerProgramPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'facilityScheduleManagerPnl button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'mirDetailsFrm': {
                beforerender: 'prepareInterfaceBasedonConfig'
            },
            'rmuSubmissionDetailsFrm': {
                beforerender: 'prepareInterfaceBasedonConfig'
            },
            'pvDetailsFrm': {
                beforerender: 'prepareInterfaceBasedonConfig'
            },
            'premisedetailsfrm': {
                beforerender: 'prepareInterfaceBasedonConfig'
            },
             'drugsProductsDetailsFrm': {
                beforerender: 'prepareInterfaceBasedonConfig'
            },
            'reportedbyFrm': {
                beforerender: 'prepareInterfaceBasedonConfig'
            },
            'suspectinforFrm': {
                beforerender: 'prepareInterfaceBasedonConfig'
            },
            'importexportdetailsfrm': {
                beforerender: 'prepareInterfaceBasedonConfig'
            },
            'portalImportExportDetailsFrm': {
                beforerender: 'prepareInterfaceBasedonConfig'
            },
            'controldrugsimpdetailsfrm': {
                beforerender: 'prepareInterfaceBasedonConfig'
            },
            'productreginothercountriesGrid': {
                refresh: 'findAndAttachAppCodetoStr',
            },
            'premisewithdrawalreasonsgrid': {
                refresh: 'addApplicationIdCodeParams',
            },
            'premisesuspensionreasonsgrid': {
                refresh: 'addApplicationIdCodeParams',
            }, 
            'promotionmaterialsmanagerevaluationgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'promotionmaterialsmanagerevaluationgrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'promotionadvertsevaluationdocpanel button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            }, 'promotionmaterialsmanagerreviewgrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },'promotionmaterialsmanagerreviewgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'promotionandadvertapprovalsgrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'promotionandadvertapprovalsgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },'promoapprovalrecommendationfrm button[name=save_recommendation]': {
                click: 'saveApplicationApprovalDetails'
            },

            'pmsprogramgrid button[action=add]': {
                click: 'showAddPmsProgram'
            },
            'applicationpmsplandetailsfrm combo[name=region_id]': {
                change: 'onChangePmsPlanRegionDetails'
            },
            'applicationpmsplandetailsfrm combo[name=district_id]': {
                change: 'onChangePmsPlanDistrictDetails'
            },
            'programimplementationdetailsgrid combo[name=pms_program_id]':{
                afterrender: 'onRenderProgramImplDetailGrid'
            },
            'groupsampleanalysisgrid button[action=addsamplebatchapplication]':{
                click: 'funcaddsamplebatchapplication'
            },
            'groupsampleanalysisdetailspnl button[name=samplegroupreturn]':{
                click: 'funcReturntosamplebatchapplication'
            },
            'facilityScheduleManagerGrid toolbar menu menuitem[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'facilityScheduleImplementationGrid toolbar menu menuitem[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'pMSProgramMeetingAppList button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            // 'importexportmanagersubmissionpnl button[action=process_submission_btn]': {
            //     click: 'showManagerApplicationSubmissionWinGeneric'
            // },
            // 'permitCancellationReceivingPnl button[action=processreceiving_submission_btn]': {
            //     click: 'showManagerApplicationSubmissionWinGeneric'
            // },
            // 'newpsurreceivingwizard button[name=process_submission_btn]': {
            //     click: 'showManagerApplicationSubmissionWinGeneric'
            // },
            'permitevaluationchecklistsgrid': {
                refresh: 'refreshScreeningChecklistItemsGrid'
            },
            'permitevaluationchecklistsgrid button[name=savegrid_screening_btn]': {
                click: 'saveApplicationChecklistDetails'
            },
            'permitevaluationchecklistsgrid button[name=show_screeninghistory_btn]': {
                click: 'showApplicationChecklistRevisions'
            },
            'importexportevaluationpnl button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'importexportscreeninggrid': {
                refresh: 'refreshScreeningChecklistItemsGrid'
            },
            'multitransitionsgrid': {
                refresh: 'addGridApplicationIdCodeParams'
            },
            'permitReleaseRecommFrm button[name=save_recommendation]': {
                click: 'savepermitReleaseRecommendation'
            },
            'managerschedulingGrid': {
                refresh: 'addApplicationWorkflowParams'
            },
            'importexportqueryverificationgrid button[action=process_submission_btn]': {
                click: 'showManagerQueryApplicationSubmissionWin'
            },
            'controlleddrugspermitsreceivingwizard button[name=prechecking_recommendation]': {
                click: 'showApplicationCommentsWin'
            },
            'controldrugsimpevaluationpnl button[name=prev_comments]': {
                click: 'showApplicationCommentsWin'
            },
            'gmpmeetingschedulinggrid button menu menuitem[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },
            'gmptcmeetingrecommendationgrid button menu menuitem[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },'gmpapprovalsgrid button menu menuitem[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },
            'importexportpermitreleaseapprovalgrid button[action=process_submission_btn]': {
                click: 'showManagerQueryApplicationSubmissionWin'
            },
            'drugsProductsOtherInformationPnl': {
                beforerender: 'showHideTabsOtherDetails'
            },
            'accountOverviewPnl': {
                afterrender: 'getRevenueTotal'
            },
            'abstractaccountsmanagementfrm': {
                afterrender: 'hidePrescriber'
            },
            'ctrgcpinspectionsapplicationsgrid button[action=process_submission_btn]': {
                click: 'showInspectionApplicationSubmissionWin'
            },
            'ctrgcpmanagernpsectionreview button[action=process_submission_btn]': {
                click: 'showApprovalInspectionApplicationSubmissionWin'
            },'ctrgcpapprovalinspectionsapplicationsgrid button[action=process_submission_btn]': {
                click: 'showApprovalInspectionApplicationSubmissionWin'
            },'ctrgcpletterofcomplianceissuancegrid button[action=process_submission_btn]': {
                click: 'showApprovalInspectionApplicationSubmissionWin'
            }, 
            'importexportdetailspnl': {
                afterrender: 'hideConsignortabforexport'
            },
            'portalImportExportDetailsTab': {
                afterrender: 'hideConsignortabforexport'
            },
            // 'controlleddrugsimpmanagerreviewwizrd toolbar menu menuitem[name=comments_btn]': {
            //     click: 'showApplicationCommentsWin'
            // },
            'promoadvertonlinepreviewwizard button[name=save_screening_btn]': {
                click: 'saveOnlineApplicationChecklistDetails'
            },
            'promoadvertonlinepreviewwizard button[name=prechecking_recommendation]': {
                click: 'addPrecheckingRecommendation'
            },
            'promoadvertonlinepreviewwizard button[name=submit_btn]': {
                click: 'receiveOnlineApplicationDetailsFrmBtn'
            },
            'promoadvertonlinepreviewwizard button[name=receive_invoicebtn]': {
                click: 'receiveAndInvoiceOnlineApplicationDetailsFrmBtn'
            },
            'onlinesubmissionsfrm button[name=app_submission_btn]': {
                click: 'receiveOnlineApplicationDetails'
            },
             'meetingGroupSelectionGrid': {
                itemdblclick: 'onMeetingGroupSelectionListDblClick'
            },
            // 'secondReviewscreeninggrid': {
            //     beforerender: 'prepareChecklistsCategories'
            // }
        },
    listen: {
        controller: {
            '*': {
                setGridStore: 'setGridStore',
                setGridTreeStore: 'setGridTreeStore',
                viewApplicationDetails: 'onViewApplicationDetails',
                setCompStore: 'setCompStore',
                deleteRecord: 'deleteRecordByID',
                showInvoiceReceipts: 'showInvoiceReceipts',
                showPrevUploadedDocsWin: 'showPreviousUploadedDocsGeneric',
                showInspectionEvalautionHistory:'showInspectionEvalautionHistory',
                renderParameterMenu: 'renderParameterMenu',
                printReceipt: 'printApplicationReceipt',
                showPaymentReceptionForm: 'showPaymentReceptionForm',
                showApplicationUploadedDocument: 'showApplicationUploads',
                viewApplicationMoreDetails: 'viewPredefinedInterfaceApplicationDetails',
                setConfigCombosProductfilterStore: 'setConfigCombosProductfilterStore',
                getExpiryDate: 'getExpiryDate',
                printProductCorrespondences: 'printProductCorrespondences',
                showApplicationMoreDetails: 'showApplicationMoreDetails',
                showSelectedReportDetails: 'showSelectedReportDetails',
                showJointOperationRegisterMoreDetails: 'showJointOperationRegisterMoreDetails',
                showMonitoringRegisterMoreDetails: 'showMonitoringRegisterMoreDetails',
                showProductRegisterApplicationsMoreDetails: 'showProductRegisterApplicationsMoreDetails',
                showProductRegisterPortalApplicationsMoreDetails: 'showProductRegisterPortalApplicationsMoreDetails',
                showMirRegisterMoreDetails: 'showMirRegisterMoreDetails',
                showRMURegisterMoreDetails: 'showRMURegisterMoreDetails',
                showAdvancedCustomerRegisterMoreDetails:'showAdvancedCustomerRegisterMoreDetails',
                showPvRegisterMoreDetails: 'showPvRegisterMoreDetails',
                showPromotionRegisterMoreDetails: 'showPromotionRegisterMoreDetails',
                add_application_details_tag:'add_application_details_tag',
                addAuthSignature: 'addAuthSignature',
                SaveAuthSignature: 'SaveAuthSignature',
                funcUploadTCMeetingtechnicalDocuments:'funcUploadTCMeetingtechnicalDocuments',
                saveTCMeetingDetails: 'saveTCMeetingDetails',
                showApplicationCommentsWin:'showApplicationCommentsWin',
                setReportApplicableChecklistComboStore: 'setReportApplicableChecklistComboStore',
                showApplicationDismissalFormGeneric: 'showApplicationDismissalFormGeneric',
                viewnotifications:'viewnotifications',
                loadMeetingInterface: 'loadMeetingInterface',
                setSelectedGridRecToTab: 'setSelectedGridRecToTab',
                loadnotificationsReply:'loadnotificationsReply',
                viewVariationChangeInteface: 'viewVariationChangeInteface',
                saveVariationChanges: 'saveVariationChanges',
                checkVariatedFields: 'checkVariatedFields',
                approveVariationField: 'approveVariationField',
                showReasonsWin:'showReasonsWinApp',
                showExcelImportFrm: 'showExcelImportFrm',
                showApplicationQueries: 'showApplicationQueries',
                setConfigCombosStoreWithSectionFilter: 'setConfigCombosStoreWithSectionFilter',
                previewApplicationProcessingTransitions:'previewApplicationProcessingTransitions',
                funcPrevGridApplicationDocuments: 'funcPrevGridApplicationDocuments',
                returnApplicationBack: 'showGridApplicationReturnSubmissionWinGeneric',
                getRevenueTotal: 'getRevenueTotal',
                showSelectedQueriesApplicationMoreDetails: 'showSelectedQueriesApplicationMoreDetails',
                progresSaveApplicationScreeningDetails: 'progresSaveApplicationScreeningDetails',
                printFacilityInspectionReport: 'printFacilityInspectionReport',
                printFacilityInspectionReportFromGrid: 'printFacilityInspectionReportFromGrid',
                autoGenerateChecklistBasedQueries: 'autoGenerateChecklistBasedQueries',
                updateProductReviewBaseDetails: 'updateProductReviewBaseDetails',
                onInitiateDocumentApplication: 'onInitiateDocumentApplication'
            }
        }
    },
     setGridStore: function (me, options) {
        // console.log(me);
        var config = options.config,
            isLoad = options.isLoad,
            toolbar = me.down('pagingtoolbar'),
            store = Ext.create('Admin.store.abstract.AbstractStore', config);
        me.setStore(store);
        toolbar.setStore(store);
        if (isLoad === true || isLoad == true) {
            store.removeAll();
            store.load();
        }
    },
    viewnotifications: function (view,record) {
        var me = this,
            mainPanel = this.getMainPanel(),
            mainTabPanel = mainPanel.down('#contentPanel');
            //console.log(mainTabPanel);
            profileTab = mainTabPanel.getComponent('user_profile');
            if (!profileTab) {
                mainTabPanel.add({
                    xtype: 'profile',
                    closable: true,
                    title: 'My Profile',
                    id: 'user_profile'
                });
            }
            mainTabPanel.setActiveTab('user_profile');
    
    },
//     loadnotificationsReply: function (view,record) {
//         var me = this,
//         mainPanel = this.getMainTabPanel();
//         childXtype = Ext.widget('notificationsfrm');
//         mainPanel.add(childXtype)
//  mainPanel.setActiveTab(childXtype);
//     },
    //notificationsfrm
    loadnotificationsReply: function (view,record) {
        var me = this,
            mainPanel = this.getMainTabPanel();
            childXtype = Ext.widget('replyNotificationPnl');
            mainPanel.add(childXtype);
        var id = record.get('id');
        var subject= record.get('subject');
        var message= record.get('body');
        var reply= record.get('reply');
        var sender= record.get('sender');
        var senderProfile= record.get('saved_name');
        var attachment=record.get('attachment_name');
        var recipient= record.get('sender_id');
        grid = view.grid,
        user_notification_id=record.get('user_notification_id'),
        group_notification_id=record.get('group_notification_id'),
        store = grid.getStore();     
        childXtype.down('hiddenfield[name=notification_id]').setValue(id);
        childXtype.down('hiddenfield[name=recipient_id]').setValue(recipient);
        childXtype.down('displayfield[name=subject]').setValue(subject);
        childXtype.down('displayfield[name=body]').setValue(message);
        childXtype.down('displayfield[name=reply]').setValue(reply);
       childXtype.down('displayfield[name=sender]').setValue(sender);
       childXtype.down('#userImage').setSrc(base_url +'/resources/images/user-profile/'+ senderProfile);
       if(!attachment){
       }else{
        childXtype.down('#attachments').setSrc(base_url +'/resources/images/user-profile/'+ attachment);
       }
      
       grid.mask('loading');
       Ext.Ajax.request({
          url: 'notifications/updateInboxNotification',
          method: 'POST',
          // timeout: 60000,
          params:
          {
              id: id ,
              user_notification_id: user_notification_id,
              group_notification_id: group_notification_id,
              _token: token

          },
        
          success: function (response,) {
              var response = Ext.JSON.decode(response.responseText),
              success = response.success,
              message = response.message;
              grid.unmask();
              if (success == true || success === true) {
                  ///toastr.success(message, "Success Response");
                      store.load();
              } else {
                  toastr.error(message, 'Failure Response');
              }
          
          
          },
          failure: function (response) {
              grid.unmask();
              toastr.error('Server error', 'Failure Response');

          }
      });
            mainPanel.setActiveTab(childXtype);
    
    },
    uploadExcelFile: function (btn) {
        var me = this,
            form = btn.up('form'),
            win = form.up('window'),
            frm = form.getForm(),
            formValues = form.getValues(),
            storeID = btn.storeID,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            resumable = btn.resumable,
            progressBar = btn.progressBar;
        if(resumable != ''){
            resumable.opts.query.module_id=formValues.module_id;
            resumable.opts.query.application_code=formValues.application_code;
            resumable.opts.query.process_id=formValues.process_id;
            resumable.opts.query.workflow_stage_id=formValues.workflow_stage_id;
            resumable.opts.query.start_column=formValues.start_column;
            resumable.opts.query.upload_type_id=formValues.upload_type_id;
            funcShowCustomizableWindow("Upload Progress", '20%', progressBar, 'customizablewindow', btn);
            resumable.upload();
        }else{
             toastr.error('Please select a file/document to upload!', 'Missing File');
        }
},
    initializeResumableExcelUpload: function(btn){
        var me = this,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = btn.up('form'),
            win = form.up('window'),
            uploads_store = Ext.getStore(btn.storeID),
            progressBar = Ext.widget('progress');
        // let browseFile = $('#browseFile');
        let resumable = new Resumable({
            target: 'documentmanagement/importExcelFile',
            query:{
                _token:token,
                module_id: '',
                process_id: '',
                workflow_stage_id: '',
                application_code: '',
                start_column: '',
                upload_type_id: ''
            },
            fileType: ['xlsx','csv','xls'],
            chunkSize: 10*1024*1024, // 10mbs
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Accept' : 'application/json'
            },
            testChunks: false,
            throttleProgressCallbacks: 1,
        });
        // console.log(browseFile);
        resumable.assignBrowse(document.getElementById('browseButton'));

        resumable.on('fileAdded', function (file) { // trigger when file picked
            document.getElementById('fileName').value = file.relativePath;
            btn.resumable = resumable;
            btn.progressBar = progressBar;
            //resumable.upload() // to actually start uploading.
        });

        resumable.on('fileProgress', function (file) { // trigger when file progress update
            me.updateProgress(Math.floor(file.progress() * 100), progressBar);
        });

        resumable.on('fileSuccess', function (file, response) { // trigger when file upload complete
            response = JSON.parse(response);
            success = response.success;
            if(success == true){
                toastr.success("Uploaded Successfully", 'Success Response');
                if(uploads_store){
                    uploads_store.load();
                }
                
            }else{
                toastr.error(response.message+ " If problem persist contact system admin", 'Failure Response!!');
            }
            progressBar.up('window').close();
            win.close();
            delete resumable;
            
        });

        resumable.on('fileError', function (file, response) { // trigger when there is any error
            progressBar.up('window').close();
            res = JSON.parse(response);
            win.close();
            toastr.error(res.message+ " If problem persist contact system admin", 'Failure Response!!');
        });
    },

    setGridTreeStore: function (me, options) {
        // console.log(me);
        var config = options.config,
            isLoad = options.isLoad,
            toolbar = me.down('pagingtoolbar'),
            store = Ext.create('Admin.store.abstract.AbstractTreeStr', config);
        me.setStore(store);
        toolbar.setStore(store);
        if (isLoad === true || isLoad == true) {
            store.removeAll();
            store.load();
        }
    },
    setCompStore: function (me, options) {
        var config = options.config,
            isLoad = options.isLoad,
            store = Ext.create('Admin.store.abstract.AbstractStore', config);
        me.setStore(store);
        if (isLoad === true || isLoad == true) {
            store.removeAll();
            store.load();
        }
    },
    deleteRecordByID: function (id, table_name, storeID, url, method=null, is_variation='') {
        var me = this,
            store = Ext.getStore(storeID);
        Ext.MessageBox.confirm('Delete', 'Are you sure to perform this action ?', function (btn) {
            if (btn === 'yes') {
                Ext.getBody().mask('Deleting record...');
                if (!method) {
                    method = "POST";
                }
                Ext.Ajax.request({
                    url: base_url + url,
                    method: method,
                    params: {
                        table_name: table_name,
                        id: id,
                        is_variation: is_variation,
                        _token: token
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Accept': 'application/json'
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                            store.removeAll();
                            store.load();
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
                    }
                });
            } else {
                //
            }
        });
    },
     renderParameterMenu: function(parameter_id){
       var def_id = parameter_id,
           contentPnl = this.getMainTabPanel();
       Ext.getBody().mask('Loading...');
       //check if tab item is currently open
       if(contentPnl.getComponent('item_id'+def_id)){
        //set it as active and close
         var index = contentPnl.items.indexOf(contentPnl.getComponent('item_id'+def_id));
         contentPnl.setActiveTab(index);
         Ext.getBody().unmask();
         return false;
       }
       //render interface
       else{
        Ext.Ajax.request({
                url: 'configurations/getParameterGridColumnsConfig',
                method: 'GET',
                params: {
                    def_id: def_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (response) {

                    var resp = Ext.JSON.decode(response.responseText),
                        success = resp.success,
                        message = resp.message,
                        result = resp.results,
                        title = resp.title;
                        table_name = resp.table_name;
                    if (success == true || success === true) {
                        
                        var panel = Ext.create('Ext.panel.Panel',{
                            viewModel: 'configurationsvm',
                            controller: 'configurationsvctr',
                            title: title,
                            itemId: 'item_id'+def_id,
                            closable: true,
                            userCls: 'big-100 small-100',
                            height: Ext.Element.getViewportHeight() - 118,
                            layout:{
                                type: 'fit'
                            },
                            items: []
                        });
                        var grid = Ext.create('Ext.grid.Panel',{
                                        cls: 'dashboard-todo-list',
                                        autoScroll: true,
                                        autoHeight: true,
                                        width: '100%',
                                        //height: Ext.Element.getViewportHeight() - 118,
                                        viewConfig: {
                                            deferEmptyText: false,
                                            emptyText: 'Nothing to display',
                                            getRowClass: function (record, rowIndex, rowParams, store) {
                                                var is_enabled = record.get('is_enabled');
                                                if (is_enabled == 0 || is_enabled === 0) {
                                                    return 'invalid-row';
                                                }
                                            }
                                        },
                                        tbar: [{
                                            xtype: 'button',
                                            text: 'Add',
                                            iconCls: 'x-fa fa-plus',
                                            action: 'add',
                                            ui: 'soft-blue',
                                            //childXtype: 'actingreasonFrm',
                                            winTitle: title+'',
                                            winWidth: '40%',
                                            handler: 'renderParameterForm',
                                            stores: '[]'
                                        },{
                                            xtype: 'hiddenfield',
                                            name: 'def_id',
                                            fieldLabel: 'def_id',
                                            allowBlank: true
                                        },{
                                            xtype: 'hiddenfield',
                                            name: 'db_con',
                                            fieldLabel: 'db_con',
                                            allowBlank: true
                                        }, {
                                            xtype: 'exportbtn'
                                        }],
                                        plugins: [
                                            {
                                                ptype: 'gridexporter'
                                            }
                                        ],
                                        export_title: title+'',
                                        bbar: [{
                                            xtype: 'pagingtoolbar',
                                            width: '100%',
                                            displayInfo: true,
                                            displayMsg: 'Showing {0} - {1} of {2} total records',
                                            emptyMsg: 'No Records',
                                            beforeLoad: function() {
                                                var grid=this.up('grid'),
                                                    store = grid.getStore(),
                                                    def_id=grid.down('hiddenfield[name=def_id]').getValue();

                                                 var store=this.getStore();
                                                 store.getProxy().extraParams = {
                                                        def_id:def_id
                                                    }
                                                }
                                        }],
                                        features: [{
                                            ftype: 'searching',
                                            minChars: 2,
                                            mode: 'local'
                                        }],
                                        listeners: {
                                            beforerender: {
                                                fn: 'setGridStore',
                                                config: {
                                                    pageSize: 1000,
                                                    storeId: table_name+'Str',
                                                    proxy: {
                                                        url: 'configurations/getParameterGridConfig',
                                                    }
                                                },
                                                isLoad: true
                                            }
                                        },
                                    
                                    columns:[{
                                            xtype: 'gridcolumn',
                                            dataIndex: 'id',
                                            text: 'Ref ID'
                                        },{
                                            xtype: 'gridcolumn',
                                            dataIndex: 'is_enabled',
                                            text: 'Enable',
                                            width: 150,
                                            renderer: function (value, metaData) {
                                                if (value) {
                                                    metaData.tdStyle = 'color:white;background-color:green';
                                                    return "True";
                                                }

                                                metaData.tdStyle = 'color:white;background-color:red';
                                                return "False";
                                            }
                                        },{
                                        text: 'Options',
                                        xtype: 'widgetcolumn',
                                        width: 90,
                                        widget: {
                                            width: 75,
                                            textAlign: 'left',
                                            xtype: 'splitbutton',
                                            iconCls: 'x-fa fa-th-list',
                                            ui: 'gray',
                                            menu: {
                                                xtype: 'menu',
                                                items: [{
                                                    text: 'Edit',
                                                    iconCls: 'x-fa fa-edit',
                                                    tooltip: 'Edit Record',
                                                    action: 'edit',
                                                    //childXtype: 'actingreasonFrm',
                                                    winTitle: title+'',
                                                    winWidth: '40%',
                                                    handler: 'renderParameterForm',
                                                    stores: '[]'
                                                }, {
                                                    text: 'Disable',
                                                    iconCls: 'x-fa fa-repeat',
                                                    table_name: table_name,
                                                    storeID: table_name+'Str',
                                                    db_con: resp.db_con_name,
                                                    action_url: 'configurations/softDeleteConfigRecord',
                                                    action: 'soft_delete',
                                                    handler: 'deleteRecordFromIDByConnection'
                                                }, {
                                                    text: 'Delete',
                                                    iconCls: 'x-fa fa-trash',
                                                    tooltip: 'Delete Record',
                                                    db_con: resp.db_con_name,
                                                    table_name: table_name,
                                                    storeID: table_name+'Str',
                                                    action_url: 'configurations/deleteConfigRecord',  
                                                    action: 'actual_delete',
                                                    handler: 'deleteRecordFromIDByConnection',
                                                }, {
                                                    text: 'Enable',
                                                    iconCls: 'x-fa fa-undo',
                                                    tooltip: 'Enable Record',
                                                    db_con: resp.db_con_name,
                                                    table_name: table_name,
                                                    storeID: table_name+'Str',
                                                    action_url: 'configurations/undoConfigSoftDeletes',
                                                    action: 'enable',
                                                    disabled: true,
                                                    handler: 'deleteRecordFromIDByConnection'
                                                }
                                                ]
                                            }
                                        }, onWidgetAttach: function (col, widget, rec) {
                                            var is_enabled = rec.get('is_enabled');
                                            if (is_enabled === 0 || is_enabled == 0) {
                                                widget.down('menu menuitem[action=enable]').setDisabled(false);
                                                widget.down('menu menuitem[action=soft_delete]').setDisabled(true);
                                            } else {
                                                widget.down('menu menuitem[action=enable]').setDisabled(true);
                                                widget.down('menu menuitem[action=soft_delete]').setDisabled(false);
                                            }
                                        }
                                    }]
                                    });
                        //add columns
                        var tot = result.length-1;
                        if(tot > 5){
                            for (var i = result.length - 1; i >= 0; i--) {
                                var column = Ext.create('Ext.grid.column.Column', {
                                        text: result[i]+'',
                                        dataIndex: result[i]+'',
                                        width: 150,
                                        tbCls: 'wrap'
                                    });
                                 grid.headerCt.insert(
                                      grid.columns.length-2, 
                                      column);
                              }
                          }else{
                            for (var i = result.length - 1; i >= 0; i--) {
                                var column = Ext.create('Ext.grid.column.Column', {
                                        text: result[i]+'',
                                        dataIndex: result[i]+'',
                                        flex: 1,
                                        tbCls: 'wrap'
                                    });
                                 grid.headerCt.insert(
                                      grid.columns.length-2, 
                                      column);
                              }
                          }
                        grid.down('hiddenfield[name=def_id]').setValue(def_id);
                        grid.down('hiddenfield[name=db_con]').setValue(resp.db_con_name);
                        panel.add(grid);

                        // var main_panel =  Ext.ComponentQuery.query("#contentPanel")[0];
                        contentPnl.add(panel);
                        contentPnl.setActiveTab(contentPnl.items.length-1);
                        Ext.getBody().unmask();
                    } else {
                        Ext.getBody().unmask();
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Ext.getBody().unmask();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        }
    },
     onViewApplicationDetails: function (record) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            process_id = record.get('process_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            workflow_stage = record.get('workflow_stage'),
            ref_no = record.get('reference_no'),
            tracking_no = record.get('tracking_no'),
            isGeneral = record.get('is_general'),
            view_id = record.get('view_id'),
            html_id = record.get('destination_html_id'),
            title_suffix = ref_no;
            
    workflow_details = getAllWorkflowDetails(process_id, workflow_stage_id);
    if (!workflow_details || workflow_details.length < 1) {
        Ext.getBody().unmask();
        toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
        return false;
    }
    if (!ref_no || ref_no == '' || ref_no == null) {
        title_suffix = tracking_no;
    }

    var tab = mainTabPanel.getComponent(view_id),
        title = workflow_stage + '-' + title_suffix;
        title = workflow_stage; //+ '-' + title_suffix;
    if ((isGeneral) && (isGeneral == 1 || isGeneral === 1)) {
        title = workflow_stage;
        view_id = view_id + Math.floor(Math.random() * 100015);
    }
    if (!tab) {//
        var newTab = Ext.widget(workflow_details.viewtype, {
            title: title,
            id: view_id,
            closable: true
        });
        //set prerequsites
        if(newTab.down('hiddenfield[name=prodclass_category_id]')){
            newTab.down('hiddenfield[name=prodclass_category_id]').setValue(record.get('prodclass_category_id'));
        }
        if(newTab.down('hiddenfield[name=premise_type_id]')){
            newTab.down('hiddenfield[name=premise_type_id]').setValue(record.get('premise_type_id'));
        }
        if(newTab.down('hiddenfield[name=report_type_id]')){
            newTab.down('hiddenfield[name=report_type_id]').setValue(record.get('report_type_id'));
        }
        if(newTab.down('hiddenfield[name=importexport_permittype_id]')){
            newTab.down('hiddenfield[name=importexport_permittype_id]').setValue(record.get('importexport_permittype_id'));
        }
        //updates the access control on the interface to be rendered.
        me.updateVisibilityAccess(newTab, workflow_stage_id);
        //prepare the interface and populates it accordingly
        me.prepareApplicationBaseDetails(newTab, record);
        mainTabPanel.add(newTab);
        //manipulate other details for product medical devices screens
        if(record.get('sub_module_id') == 79){
        }

        else {
        if(record.get('section_id') == 4 && record.get('module_id') == 1 && record.get('sub_module_id') != 75){
            if(newTab.down('drugsIngredientsGrid')){
                newTab.down('drugsIngredientsGrid').destroy();
            }
            if(newTab.down('productApiManuctureringGrid')){
                newTab.down('productApiManuctureringGrid').destroy();
            }
            if(newTab.down('productGmpInspectionDetailsGrid')){
                newTab.down('productGmpInspectionDetailsGrid').setTitle('GMP/QMS Inspection Details');
            }
            if(newTab.down('inspectioninothercountriesGrid')){
                newTab.down('inspectioninothercountriesGrid').setTitle('GMP/QMS Inspection In Other Countries');
            }
        }
    }
        //set save button 
        var sub_module_id = record.get('sub_module_id');
        // if(sub_module_id == 8 && newTab.down('button[name=save_btn]')){
        //     newTab.getViewModel().set('isReadOnly', true);
        //     newTab.down('button[name=save_btn]').action_url = 'saveRenAltProductReceivingBaseDetails';
        // }
        // if(sub_module_id == 9 && newTab.down('button[name=save_btn]')){
        //     newTab.getViewModel().set('isReadOnly', true);
        //     newTab.down('button[name=save_btn]').action_url = 'saveRenAltProductReceivingBaseDetails';
        // }
        var lastTab = mainTabPanel.items.length - 1;
        mainTabPanel.setActiveTab(lastTab);
    } else {
        me.prepareApplicationBaseDetails(tab, record);
        mainTabPanel.setActiveTab(tab);
    }

        Ext.Function.defer(function () {
            Ext.getBody().unmask();
            me.updateSubmissionsTable(record, 'isRead');
        }, 300);

    },
    updateVisibilityAccess: function(me, workflow_stage_id){
        Ext.Ajax.request({
            url: 'workflow/checkWorkflowStageInformationVisibilityMode',
            params: {
                stage_id: workflow_stage_id,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success || success == true || success === true) {
                    var right = resp.access_level;

                    if(me.getViewModel()){
                        /*
                        if(right == 2){
                            me.getViewModel().set('isReadOnly', true);
                            me.getViewModel().set('hideDeleteButton', false);
                        }
                        if(right == 3){
                           me.getViewModel().set('isReadOnly', false);
                           me.getViewModel().set('hideDeleteButton', false); 
                        }
                        if(right == 4){
                            me.getViewModel().set('hideDeleteButton', true); 
                            me.getViewModel().set('isReadOnly', false); 
                        }
                        if(right == 1){
                            me.getViewModel().set('isReadOnly', true); 
                            me.getViewModel().set('hideDeleteButton', false); 
                        }
*/
                    }
                } else {
                   // disable the warning
                    //toastr.error(message, 'Failure Response!!');
                }
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    prepareApplicationBaseDetails: function (tab, record) {
        var me = this,
            applicant_id=record.get('applicant_id'),
            application_id = record.get('active_application_id'),
            application_code = record.get('application_code'),
            process_name = record.get('process_name'),
            workflow_stage = record.get('workflow_stage'),
            application_status = record.get('application_status'),
            tracking_no = record.get('tracking_no'),
            name = record.get('name'),
            document_type_id = record.get('document_type_id'),
            has_parent_level = record.get('has_parent_level'),
            docparent_id = record.get('docparent_id'),
            description = record.get('description'),
            application_code = record.get('application_code'),
            reference_no = record.get('reference_no'),
            process_id = record.get('process_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            application_status_id = record.get('application_status_id');
            
        if(tab.down('hiddenfield[name=applicant_id]')){
            tab.down('hiddenfield[name=applicant_id]').setValue(applicant_id);
        }
        if(tab.down('hiddenfield[name=workflow_stage_id]')){
            tab.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        }
        
        tab.down('hiddenfield[name=active_application_id]').setValue(application_id);
        tab.down('hiddenfield[name=active_application_code]').setValue(application_code);
        tab.down('hiddenfield[name=process_id]').setValue(process_id);
        tab.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        tab.down('hiddenfield[name=application_status_id]').setValue(application_status_id);
        tab.down('hiddenfield[name=module_id]').setValue(module_id);
        tab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        tab.down('displayfield[name=process_name]').setValue(process_name);
        tab.down('displayfield[name=workflow_stage]').setValue(workflow_stage);
        tab.down('displayfield[name=application_status]').setValue(application_status);
        tab.down('displayfield[name=tracking_no]').setValue(tracking_no);
        tab.down('textfield[name=name]').setValue(name);
        // tab.down('textfield[name=document_type_id]').setValue(document_type_id);
        // tab.down('textfield[name=has_parent_level]').setValue(has_parent_level);
        // tab.down('textfield[name=docparent_id]').setValue(docparent_id);
        // tab.down('textfield[name=description]').setValue(description);
        tab.down('hiddenfield[name=application_code]').setValue(application_code);
      //tab.down('displayfield[name=reference_no]').setValue(reference_no);
    },
    showPreviousUploadedDocsGeneric: function (btn, section_id, module_id, sub_module_id, workflow_stage, application_code) {
        var childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            childObject = Ext.widget(childXtype);
           
            childObject.setHeight(450);
            childObject.down('hiddenfield[name=section_id]').setValue(section_id);
            childObject.down('hiddenfield[name=module_id]').setValue(module_id);
            childObject.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            childObject.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage);
            childObject.down('hiddenfield[name=application_code]').setValue(application_code);
            funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');
    },
    showInspectionEvalautionHistory: function(btn, application_code){
        var child = Ext.widget(btn.childXtype);
        child.down('hiddenfield[name=application_code]').setValue(application_code);
        funcShowCustomizableWindow(btn.winTitle, btn.winWidth, child, 'customizablewindow');
    },
    showGridApplicationReturnSubmissionWinGeneric:function (item) {
        Ext.getBody().mask('Please wait...');

        var mainTabPanel = this.getMainTabPanel(), btn = item.up('button'),
            winWidth = item.winWidth,
            storeID = item.storeID,
            
            activeTab = mainTabPanel.getActiveTab(),
            record = btn.getWidgetRecord(),
            application_code = record.get('application_code'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),   
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),   
            application_id = record.get('id');
            extraParams = [{
                    field_type: 'hiddenfield',
                    field_name: 'workflowaction_type_id',
                    value: 9
                },{
                    field_type: 'hiddenfield',
                    field_name: 'non_mainpanel_close',
                    value: 1

                }];      
            
                    table_name = getApplicationTable(module_id);

        
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,extraParams, '', '', workflow_stage_id);
    },
    updateSubmissionsTable: function (record, update_type) {
        var application_id = record.get('active_application_id'),
            application_code = record.get('application_code'),
            current_stage = record.get('workflow_stage_id');
        Ext.Ajax.request({
            url: 'workflow/updateInTrayReading',
            params: {
                application_id: application_id,
                application_code: application_code,
                current_stage: current_stage,
                update_type: update_type
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success;
                if (success == true || success === true) {

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },

     onInitiateDocumentApplication: function (sub_module_id, btn) {
        Ext.getBody().mask('Loading Please wait...');
        var me = this,
        is_dataammendment_request = btn.is_dataammendment_request,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#documentapplicationwrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue();

              workflow_details = getInitialDocumentCreationWorkflowDetails(module_id, sub_module_id, is_dataammendment_request, ''); 

        if (!workflow_details) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        dashboardWrapper.removeAll();
        var workflowContainer = Ext.widget(workflow_details.viewtype);
        workflowContainer.down('displayfield[name=process_name]').setValue(workflow_details.processName);
        workflowContainer.down('displayfield[name=workflow_stage]').setValue(workflow_details.initialStageName);
        workflowContainer.down('displayfield[name=application_status]').setValue(workflow_details.applicationStatus);
        workflowContainer.down('hiddenfield[name=process_id]').setValue(workflow_details.processId);
        workflowContainer.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_details.initialStageId);
        workflowContainer.down('hiddenfield[name=module_id]').setValue(module_id);
        workflowContainer.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        dashboardWrapper.add(workflowContainer);


        if(dashboardWrapper.down('premisedetailscmnfrm')){
        dashboardWrapper.down('premisedetailscmnfrm').down('button[action=search_premise]').enable();
        }
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);

        //load the stores

    },

    findAndAttachAppCodetoStr: function(caller, table_name){
        var grid = caller.up('grid'),
                store = caller.getStore(),
                panel = grid.up('panel'),
                cpanel = panel.up('panel'),
                wrapper = cpanel.up('panel'),
                application_code;
               // console.log(wrapper);
        if(wrapper.down('hiddenfield[name=active_application_code]')){
             application_code = wrapper.down('hiddenfield[name=active_application_code]').getValue();
            // console.log(application_code);
            var filters = JSON.stringify({application_code: application_code});
        
        }else{
            var mainTabPanel = this.getMainTabPanel(),
                panel = mainTabPanel.getActiveTab(),
                store = grid.getStore();
                // console.log(panel);
                application_code = panel.down('hiddenfield[name=active_application_code]').getValue();
        
            var filters = JSON.stringify({application_code: application_code});
        }
        store.getProxy().extraParams = {
            filters: filters,
            table_name: table_name,
            application_code: application_code
        }
    },
    setConfigCombosProductfilterStore: function (me, options) {
        var config = options.config,
            isLoad = options.isLoad,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue(),
            filters = {product_id:product_id},
            filters = JSON.stringify(filters),

            store = Ext.create('Admin.store.abstract.AbstractStore', config);
            me.setStore(store);
            
        if (isLoad === true || isLoad == true) {
            store.removeAll();
            store.load({params:{filters:filters} });
        }
    },
    addApplicationIdCodeParams: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            module_id=activeTab.down('hiddenfield[name=module_id]').getValue();
            sub_module_id=activeTab.down('hiddenfield[name=sub_module_id]').getValue();
            
        store.getProxy().extraParams = {
            application_code: application_code,
            application_id:application_id,
            module_id:module_id,
            sub_module_id:sub_module_id
           
        };
        if(me.store.storeId == 'invoicepaymentverificationdetailsGridStr'){
            this.func_check_balance(application_code);
        }
    },

    func_check_balance: function(application_code){
        var me = this;
        Ext.Ajax.request({
            url: 'revenuemanagement/checkApplicationInvoiceBalance',
            params: {
                application_code: application_code,
                _token: token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success || success == true || success === true) {
                    var mainTabPanel = me.getMainTabPanel(),
                        panel = mainTabPanel.getActiveTab(),
                        running_balance;
                    if(panel.down('displayfield[name=running_balance]')){
                        running_balance = panel.down('displayfield[name=running_balance]');
                    }else{
                        var payment_pnl = Ext.ComponentQuery.query("#paymentspanelRefId")[0];
                        if(Ext.ComponentQuery.query("#paymentspanelRefId")[0]){
                            running_balance = payment_pnl.down('displayfield[name=running_balance]');
                        }
                      
                    }
                    running_balance.setValue(resp.balance);
                } else {
                    toastr.error(message, 'Failure Response!!');
                }
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showInvoiceReceipts: function(invoice_no){
        var grid = Ext.widget('applicationpaymentsreceiptsGrid');
        grid.down('hiddenfield[name=invoice_no]').setValue(invoice_no);
        funcShowCustomizableWindow(invoice_no+' - Payment Receipts', '70%', grid, 'customizablewindow');
    },
     printApplicationReceipt: function (receipt_no) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue();
            
        this.generateApplicationReceipt(application_code, module_id, receipt_no);
    },

    generateApplicationReceipt: function (application_code, module_id, receipt_no) {
        var action_url = 'http://192.168.225.100:8009/home/receipt?receipt_no=' + receipt_no;
        print_report(action_url);
        // var action_url = 'http://10.0.0.12:888/home/receipt?receipt_no='+receipt_no;//'reports/generateApplicationInvoice?application_id=' + application_id + '&&module_id=' + module_id + '&&invoice_id=' + invoice_id+ '&&application_code=' + application_code;
        // print_report(action_url);
    },
    printProductCorrespondences: function (btn) {
        var record = btn.up('button').getWidgetRecord(),
            application_code = record.get('application_code'),
            module_id = record.get('module_id');
            section_id = record.get('section_id');
            sub_module_id = record.get('sub_module_id');
        //var action_url = btn.print_url+'?application_code='+application_code;
       // print_report(action_url);
        if(btn.name == 'rejection'){
            decision_id = 2;
        }else{
            decision_id = 0;
        }
        previewCorrespondence(application_code, module_id, btn.print_url,JSON.stringify({section_id:section_id,sub_module_id:sub_module_id, decision_id: decision_id}));
    },
    showPaymentReceptionForm: function (btn) {
        var me = this,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            title = btn.winTitle,
            width = btn.winWidth,
            childXtype = btn.childXtype,
            //table_name = btn.table_name,
            child = Ext.widget(childXtype),
            item_rec = btn.up('button'),
            record = item_rec.getWidgetRecord(),
            table_name = getApplicationTable(module_id, section_id);
      
        Ext.MessageBox.confirm('Confirm', 'This option is only acceptable for Non Electronic payments as per the set guidelines. Do you want to continue?', function (button) {
            if (button === 'yes') {
                Ext.getBody().mask('Please wait...');
                Ext.Ajax.request({
                    method: 'GET',
                    url: 'configurations/getApplicationApplicantDetails',
                    params: {
                        application_code: application_code,
                        table_name: table_name
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message,
                            results = resp.results;
                        if (success == true || success === true) {
                            if (!results) {
                                toastr.warning('Problem getting applicant details!!', 'Warning Response');
                                return false;
                            }
                            var model = Ext.create('Ext.data.Model', results);
                            child.loadRecord(model);

                            child.down('textfield[name=drawer]').setValue(results.applicant_name);
                            child.down('hiddenfield[name=invoice_no]').setValue(record.get('invoice_no'));
                            child.down('hiddenfield[name=invoice_id]').setValue(record.get('invoice_id'));
                            child.down('combo[name=currency_id]').setValue(record.get('paying_currency_id'));
                            funcShowCustomizableWindow(title, width, child, 'customizablewindow');
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });
            }
        });
    },
     saveApplicationPaymentDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            running_balance = activeTab.down('displayfield[name=running_balance]'),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            url = btn.action_url,
            table_name = btn.table_name,
            form = btn.up('form'),
            applicant_name = form.down('displayfield[name=applicant_name]').getValue(),
            amount_paid = form.down('numberfield[name=amount_paid]').getValue(),
            currency_id = form.down('combo[name=currency_id]').getValue(),
            invoice_id = form.down('hiddenfield[name=invoice_id]').getValue(),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm(),
            mask = new Ext.LoadMask({
                msg: 'Validating Payments...',
                target: win
            });


        if (frm.isValid()) {
            Ext.MessageBox.confirm('Confirm', 'Save Payment Transaction?', function (bbttn) {
                if (bbttn === 'yes') {
                    mask.show();
                    Ext.Ajax.request({
                        method: 'GET',
                        url: 'revenuemanagement/checkInvoicePaymentsLimit',
                        params: {
                            section_id: section_id,
                            module_id: module_id,
                            currency_id: currency_id,
                            amount: amount_paid,
                        },
                        success: function (response) {
                            mask.hide();
                            var resp = Ext.JSON.decode(response.responseText),
                                status_code = resp.status_code,
                                limit_amount = resp.limit_amount,
                                message = resp.message;
                            if (status_code == 2 || status_code === 2) {
                                Ext.MessageBox.confirm('Payment Invoice Limit(Warning)', 'Payments Limit = ' + limit_amount + ', Generated Payment Amount = ' + amount_paid + ', Do you want to Continue?', function (button) {
                                    if (button === 'yes') {
                                        me.commitApplicationPayment(frm, url, table_name, application_code, invoice_id, section_id, module_id, sub_module_id, applicant_name, running_balance, store, win);
                                    }
                                });
                            } else if (status_code == 4 || status_code === 4) {
                                toastr.error(message, 'Failure Response');
                            } else {
                                me.commitApplicationPayment(frm, url, table_name, application_code, invoice_id, section_id, module_id, sub_module_id, applicant_name, running_balance, store, win);
                            }
                        },
                        failure: function (response) {
                            mask.hide();
                            var resp = Ext.JSON.decode(response.responseText),
                                message = resp.message;
                            toastr.error(message, 'Failure Response');
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            mask.hide();
                            toastr.error('Error: ' + errorThrown, 'Error Response');
                        }
                    });
                }
            });
        }
    },
     commitApplicationPayment: function (frm, url, table_name, application_code, invoice_id, section_id, module_id, sub_module_id, applicant_name, running_balance, store, win) {
        var me = this;
        frm.submit({
            url: url,
            params: {
                table_name: table_name,
                application_code: application_code,
                section_id: section_id,
                module_id: module_id,
                _token: token,
                sub_module_id: sub_module_id,
                applicant_name: applicant_name
            },
            waitMsg: 'Please wait...',
            success: function (form, action) {
                var response = Ext.decode(action.response.responseText),
                    success = response.success,
                    message = response.message,
                    balance = response.balance,
                    receipt_no = response.receipt_no,
                    invoice_amount = response.invoice_amount,
                    payment_id = response.record_id,
                    txt;
                if (success == true || success === true) {
                    if (Math.abs(parseFloat(balance)) == parseFloat(invoice_amount) || Math.abs(parseFloat(balance)) === parseFloat(invoice_amount)) {
                        txt = ' (Not Paid)';
                    } else if (parseFloat(balance) > 0) {
                        txt = ' (Over-Paid)';
                    } else if (parseFloat(balance) < 0) {
                        txt = ' (Under-Paid)';
                    } else {
                        txt = ' (Cleared)';
                    }
                    running_balance.setValue(balance + txt);
                    toastr.success(message, "Success Response");
                    if(store){
                        store.removeAll();
                        store.load();
                    }
                    win.close();
                    me.fireEvent('printReceipt', receipt_no);
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (form, action) {
                var resp = action.result;
                toastr.error(resp.message, 'Failure Response');
            }
        });
    },
    showInvoicingApplicationSubmissionWin: function (btn) {
        btn.setLoading(true);
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            //paymentDetailsGrid = activeTab.down('applicationpaymentsgrid'),
            invoicepaymentverificationdetailsGrid = activeTab.down('invoicepaymentverificationdetailsGrid'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
                workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            storeID = '[]',
            table_name = getApplicationTable(module_id);
            if(activeTab.down('invoicepaymentverificationdetailsGrid')){
                store = invoicepaymentverificationdetailsGrid.getStore();
                if(store.getTotalCount() < 1){
                    toastr.warning('The application doesnt have an Invoice, Please generate!!', 'Warning Response');
                    btn.setLoading(false);
                    return false;
                }
            }
            else if(activeTab.down('applicationQuotationsGrid')){
                store = activeTab.down('applicationQuotationsGrid').getStore();
                if(store.getTotalCount() < 1){
                    toastr.warning('The application doesnt have a Quote, Please generate!!', 'Warning Response');
                    btn.setLoading(false);
                    return false;
                }
            }
            if(store.getTotalCount() < 1){
                btn.setLoading(false);
                toastr.warning('The application doesnt have an Invoice, Please generate!!', 'Warning Response');
            }
            else{
               // showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
                showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,'','','',workflow_stage_id,'');
                
            }
            btn.setLoading(false);
            
       
    },
    showPaymentApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            //paymentDetailsGrid = activeTab.down('applicationpaymentsgrid'),
            invoicepaymentverificationdetailsGrid = activeTab.down('invoicepaymentverificationdetailsGrid'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            valid = this.validatePaymentSubmission(),
            storeID = '[]',
            table_name = getApplicationTable(module_id);
            
            if(invoicepaymentverificationdetailsGrid.getStore().getTotalCount() < 1){
                toastr.warning('The application doesnt have an invoice, kindly contact the system Admin!!', 'Warning Response');
            }
            else{
                if (valid == true || valid === true) {
                    //showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
                    showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,'','','',workflow_stage_id,'');

                } else {
                    Ext.getBody().unmask();
                }
            }
             Ext.getBody().unmask();
            
       
    },

    validatePaymentSubmission: function () {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            // paymentDetailsGrid = activeTab.down('applicationpaymentsgrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            balance_str = activeTab.down('displayfield[name=running_balance]').getValue(),
            balance = 0;
            if(balance_str){
                balance = balance_str.split("(")[0];
                var bal_txt = balance.replace('-', ''),
                bal = balance.replace(',', '');
                if (parseFloat(bal) > 0) {
                    toastr.warning('The Application cannot be submitted until the applicant clears a balance of ' + balance_str, 'Warning Response');
                    return false;
                }
            }
           
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
       
       
        return true;
    },
    showManagerApplicationSubmissionWinGeneric: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            categorize_selected=btn.categorize_selected,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
      
            valid = true,
            is_dataammendment_request =0,
            storeID = btn.storeID,
            table_name = getApplicationTable(module_id);
            if(activeTab.down('hiddenfield[name=is_dataammendment_request]')){
                is_dataammendment_request =activeTab.down('hiddenfield[name=is_dataammendment_request]').getValue();
            }
            if(btn.table_name != ''){
                table_name = btn.table_name;
            }
            if(categorize_selected){
                //check if inspections type set
            }
            
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagersgenericfrm', winWidth, storeID,'','','',workflow_stage_id,is_dataammendment_request);
         
        } else {
            Ext.getBody().unmask();
        }
    },
    showApplicationUploads: function (btn) {
        var me = this,
            child = Ext.widget('applicationdocpreviewgrid'),//applicationdocuploadsgrid
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
     
        funcShowCustomizableWindow('Associated Documents', '70%', child, 'customizablewindow');
        // var docTypesStr = child.down('combo[name=applicable_documents]').getStore();
        // docTypesStr.removeAll();
        // docTypesStr.load({
        //     params: {
        //         section_id: section_id,
        //         module_id: module_id,
        //         sub_module_id: sub_module_id,
        //         workflow_stage: workflow_stage
        //     }
        // });
    },
    showManagerQueries: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            tracking_no = activeTab.down('displayfield[name=tracking_no]').getValue(),
            childItem = Ext.widget(btn.childXtype);
        childItem.down('hiddenfield[name=application_code]').setValue(application_code);
        childItem.down('hiddenfield[name=module_id]').setValue(module_id);
        childItem.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        childItem.down('hiddenfield[name=section_id]').setValue(section_id);
        funcShowCustomizableWindow(tracking_no + ' QUERIES', '85%', childItem, 'customizablewindow');
    },
    refreshApplicationDocPreviewGrid: function (me) {
        var store = me.store,
            grid = me.up('treepanel'),
            document_type_id = grid.down('combo[name=applicable_documents]').getValue(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            // process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            premise_type_id,prodclass_category_id;
            
            if(grid.document_type_id){
                document_type_id = grid.document_type_id;
            }
            if(module_id == 1){
                if(!prodclass_category_id){
                    if(activeTab.down('hiddenfield[name=prodclass_category_id]')){
                        prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
                    }
                }
            }
            if(module_id == 2){
                    if(activeTab.down('hiddenfield[name=premise_type_id]')){
                        premise_type_id = activeTab.down('hiddenfield[name=premise_type_id]').getValue();
                    }
            }
            store.getProxy().extraParams = {
                application_code: application_code,
                // table_name: table_name,
                document_type_id: document_type_id,
                module_id: module_id,
                sub_module_id: sub_module_id,
                prodclass_category_id: prodclass_category_id,
                premise_type_id: premise_type_id
            };
    },
    refreshApplicationDocUploadsGrid: function (me) {
        var store = me.store,
            grid = me.up('treepanel'),
           // document_type_id = grid.down('combo[name=applicable_documents]').getValue(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            premise_type_id,prodclass_category_id;
           
            // if(grid.document_type_id){
            //     document_type_id = grid.document_type_id;
            // }
            if(module_id == 1){
                if(!prodclass_category_id){
                    if(activeTab.down('hiddenfield[name=prodclass_category_id]')){
                        prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
                    }
                }
            }
            if(module_id == 2){
                    if(activeTab.down('hiddenfield[name=premise_type_id]')){
                        premise_type_id = activeTab.down('hiddenfield[name=premise_type_id]').getValue();
                        
                    }
            }
            store.getProxy().extraParams = {
                application_code: application_code,
                // table_name: table_name,
               // document_type_id: document_type_id,
                process_id: process_id,
                section_id: section_id,
                module_id: module_id,
                sub_module_id: sub_module_id,
                workflow_stage: workflow_stage,
                prodclass_category_id: prodclass_category_id,
                premise_type_id: premise_type_id
            };
    },
    showApplicationChecklistRevisions: function(btn){
        var mainTabPanel = this.getMainTabPanel(),
            panel = mainTabPanel.getActiveTab(),
            grid = btn.up('grid'),
            workflow_stage_id = panel.down('hiddenfield[name=workflow_stage_id]').getValue(), 
            application_code = panel.down('hiddenfield[name=active_application_code]').getValue(),
            child = Ext.widget('checklistRevisionsGrid');
        child.is_auditor_checklist = grid.is_auditor_checklist;
        child.down('hiddenfield[name=application_code]').setValue(application_code);
        child.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);

        funcShowCustomizableWindow('Checklist Revisions', '70%', child, 'customizablewindow');
    },
    showApplicationDocUploadWin: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            grid = btn.up('treepanel'), 
            query_id;
            if(grid.down('hiddenfield[name=query_ref_id]')){
                 query_id = grid.down('hiddenfield[name=query_ref_id]').getValue();
            }
            if(application_code != ''){
                this.showApplicationDocUploadWinGeneric(btn, section_id, module_id, sub_module_id, workflow_stage, application_code, query_id);
            }
            else{
                toastr.error('Application details not found, save application to upload!!', 'Failure Response');
            }
       
    },
    showAddApplicationVariationRequest: function (btn) {
        var me = this,
            winWidth = btn.winWidth,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            title = btn.winTitle,
            childObject = Ext.widget(btn.childXtype),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;
        childObject.down('hiddenfield[name=application_code]').setValue(application_code);
        childObject.down('hiddenfield[name=module_id]').setValue(module_id);
        childObject.down('hiddenfield[name=section_id]').setValue(section_id);
        
        // if(activeTab.down('hiddenfield[name=appeal_type_id]')){
        //     var appeal_type_id = activeTab.down('hiddenfield[name=appeal_type_id]').getValue();
        //     childObject.down('hiddenfield[name=appeal_type_id]').setValue(appeal_type_id);
        
        // }
        if (!application_id) {
            toastr.warning('Please save application first!!', 'Warning Response');
            return false;
        }
        if (arrayLength > 0) { 
            me.fireEvent('refreshStores', storeArray);
        }
        funcShowCustomizableWindow(title, winWidth, childObject, 'customizablewindow');
    },
    showApplicationDocUploadWinGeneric: function (btn, section_id, module_id, sub_module_id, workflow_stage, application_code, query_id=null) {
        var childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            grid = btn.up('treepanel'),
            storeID = grid.storeID,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            prodclass_category = activeTab.down('hiddenfield[name=prodclass_category_id]'),
            premise_type_id = activeTab.down('hiddenfield[name=premise_type_id]'),
            form = Ext.widget(childXtype),
            prodclass_category_id;
        if(prodclass_category){
            prodclass_category_id = prodclass_category.getValue();
        }
        if(premise_type_id){
            premise_type_id = premise_type_id.getValue();
        }
        form.down('hiddenfield[name=application_code]').setValue(application_code);
        form.down('hiddenfield[name=section_id]').setValue(section_id);
        form.down('hiddenfield[name=module_id]').setValue(module_id);
        form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        form.down('hiddenfield[name=query_ref_id]').setValue(query_id);
        form.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);//for products only
        form.down('hiddenfield[name=premise_type_id]').setValue(premise_type_id);//for premises only
        form.down('hiddenfield[name=process_id]').setValue(process_id); //added for clean filtering of required docs
        form.down('button[name=upload_file_btn]').storeID = storeID;
        if(!btn.show_assessor){
            form.down('combo[name=assessment_by]').setVisible(false);
        }
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
        var docTypesStr = form.down('combo[name=doctype_id]').getStore();
        docTypesStr.removeAll();
        docTypesStr.load({
            params: {
                section_id: section_id,
                module_id: module_id,
                sub_module_id: sub_module_id,
                query_id: query_id,
                process_id: process_id,
                workflow_stage: workflow_stage
            }
        });
    },
    saveApplicationChecklistDetails: function (btn) {
        btn.setLoading(true);
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            screeningGrid = activeTab.down('checklistresponsescmngrid');
        this.commitApplicationChecklistDetails(btn, application_id, application_code, screeningGrid);
    },
    progresSaveApplicationScreeningDetails: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            screeningGrid = activeTab.down('checklistresponsescmngrid');
        this.commitApplicationChecklistDetails(btn, application_id, application_code, screeningGrid, null, null, 1);
    },
    saveApplicationPopUpChecklistDetails: function (btn) {
        btn.setLoading(true);
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            screeningGrid = btn.up('grid');
        this.commitApplicationChecklistDetails(btn, application_id, application_code, screeningGrid, module_id, sub_module_id);
    },
     commitApplicationChecklistDetails: function (btn, application_id, application_code, screeningGrid, module_id=null,  sub_module_id=null, silent_save=null) {
        var checklist_type = screeningGrid.down('combo[name=applicable_checklist]').getValue(),
            store = screeningGrid.getStore(),
            params = [];
        for (var i = 0; i < store.data.items.length; i++) {
            var record = store.data.items [i],
                checklist_item_id = record.get('id'),
                pass_status = record.get('pass_status'),
                comment = record.get('comment'),
                observation = record.get('observation'),
                auditor_comment = record.get('auditor_comment'),
                risk_type = record.get('risk_type'),
                risk_type_remarks = record.get('risk_type_remarks'),
                auditorpass_status = record.get('auditorpass_status'),
                scale = record.get('scale'),
                item_resp_id = record.get('item_resp_id');
            var obj = {
                application_id: application_id,
                application_code: application_code,
                item_resp_id: item_resp_id,
                created_by: user_id,
                checklist_item_id: checklist_item_id,
                pass_status: pass_status,
                comment: comment,
                auditor_comment:auditor_comment,
                auditorpass_status:auditorpass_status,
                risk_type:risk_type,
                risk_type_remarks:risk_type_remarks,
                scale:scale,
                observation: observation
            };
            if (record.dirty) {
                params.push(obj);
            }
        }
        if (params.length < 1 ) {
            btn.setLoading(false);
            toastr.warning('No records to save!!', 'Warning Response');
            return false;
        }
        params = JSON.stringify(params);
        Ext.Ajax.request({
            url: 'productregistration/saveApplicationChecklistDetails',
            params: {
                application_id: application_id,
                application_code: application_code,
                checklist_type: checklist_type,
                _token: token,
                module_id: module_id,
                sub_module_id: sub_module_id,
                screening_details: params
            },
            success: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if(silent_save != 1){
                    if (success == true || success === true) {
                        toastr.success(message, 'Success Response');
                        store.load();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                }
            },
            failure: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                btn.setLoading(false);
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showInspectionDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            isReadOnly = btn.isReadOnly,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            childItem = Ext.widget(btn.childXtype),
            form = childItem.down('form'),
            grid = childItem.down('grid');
        grid.setIsWin(1);
        grid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        form.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        form.setHeight(100);
        grid.setHeight(250);
        Ext.getBody().mask('Please wait...');
        Ext.Ajax.request({
            method: 'GET',
            url: 'premiseregistration/getInspectionDetails',
            params: {
                application_id: application_id,
                application_code: application_code
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    results = resp.results;
                if (success == true || success === true) {
                    if (results) {
                        var model = Ext.create('Ext.data.Model', results);
                        form.loadRecord(model);
                    }
                    funcShowCustomizableWindow(winTitle, winWidth, childItem, 'customizablewindow');
                    grid.getStore().load();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showPrevStructuredChecklistDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            childObject = Ext.widget(btn.childXtype);
        childObject.down('hiddenfield[name=application_code]').setValue(application_code);
        childObject.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');
    },
    showApplicationQueriesWin: function (sourceGrid) {
        var mainTabPanel =this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            grid = Ext.widget('applicationqueriesgrid'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        //check for unsaved store
        // var check = false;
        // if(sourceGrid.getStore()){
        //    var store = sourceGrid.getStore();
        //    for (var i = 0; i < store.data.items.length; i++) {
        //             var record = store.data.items [i];
        //             if (record.dirty) {
        //                 check = true;
        //             }
        //         }
        //     if (check) {
        //         toastr.warning('There is unsaved information, make sure you save the changes by clicking on \'Save Screening Details\' before performing this action!!', 'Warning Response');
        //         return false;
        //     } 
        // }
        //
        grid.down('hiddenfield[name=module_id]').setValue(module_id);
        grid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        grid.down('hiddenfield[name=section_id]').setValue(section_id);
        grid.down('hiddenfield[name=application_code]').setValue(application_code);
        grid.down('hiddenfield[name=process_id]').setValue(process_id);
        grid.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        funcShowCustomizableWindow('Query Wizard', '70%', grid, 'customizablewindow');
    },
     setWorkflowModuleGridsStore: function (grid) {
        var storeConfig = grid.storeConfig,
            isOnline = grid.isOnline;
        if ((isOnline) && isOnline == 1) {
            storeConfig.config.proxy.url = 'workflow/getOnlineProcessApplicableChecklistItems';
        } 
        // else {
        //     storeConfig.config.proxy.url = 'workflow/getProcessApplicableChecklistItems';
        // }
        this.fireEvent('setWorkflowGridsStore', grid, storeConfig);
    },
    showApplicationTransitioning: function () {
        var childObject = Ext.widget('transitionsgrid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            ref_no = activeTab.down('displayfield[name=reference_no]').getValue();
        funcShowCustomizableWindow(ref_no + ' Transitions', '70%', childObject, 'customizablewindow');
    },
    showApplicationCommentsWin: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        this.showApplicationCommentsGeneric(btn, application_id, application_code,workflow_stage_id);
    },

    showApplicationCommentsGeneric: function (item, application_id, application_code,workflow_stage_id) {
        var me = this,
            childXtype = item.childXtype,
            winTitle = item.winTitle,
            winWidth = item.winWidth,
            comment_type_id = item.comment_type_id,
            child = Ext.widget(childXtype);
        if (!comment_type_id) {
            toastr.warning('Comment Type not specified!!', 'Warning Response');
            return;
        }
        if( child.down('hiddenfield[name=workflow_stage_id]')){
            child.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        }
        
        child.down('hiddenfield[name=application_id]').setValue(application_id);
        child.down('hiddenfield[name=application_code]').setValue(application_code);
        child.down('hiddenfield[name=comment_type_id]').setValue(comment_type_id);
        // child.setHeight(630);
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow',item);
    },
    refreshScreeningChecklistItemsGrid: function (me) {
        var store = me.getStore(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            checklist_type = 0;
            if(me.is_auditor_checklist == 1){
                store.getProxy().extraParams = {
                    application_id: application_id,
                    application_code: application_code,
                    checklist_type: checklist_type,
                    process_id: process_id,
                    workflow_stage: workflow_stage,
                    is_auditor: 1
                };
            }else{
                store.getProxy().extraParams = {
                    application_id: application_id,
                    application_code: application_code,
                    checklist_type: checklist_type,
                    process_id: process_id,
                    workflow_stage: workflow_stage
                };
            }
    },
    refreshApplicationQueriesGrid: function (me) {
        var store = me.getStore(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        checklist_type = 0;
        if(me.down('combo[name=applicable_checklist]')){
            checklist_type = me.down('combo[name=applicable_checklist]').getValue();

        }
        if(me.is_auditor_checklist == 1){
            store.getProxy().extraParams = {
                application_id: application_id,
                application_code: application_code,
                checklist_type: checklist_type,
                process_id: process_id,
                workflow_stage: workflow_stage,
                is_auditor: 1
            };
        }else{
            store.getProxy().extraParams = {
                application_id: application_id,
                application_code: application_code,
                checklist_type: checklist_type,
                process_id: process_id,
                workflow_stage: workflow_stage
            };
        }
    },
    addAppCodeWfStageIdToStore: function(me) {
        var store = me.getStore(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            checklist_type = 0;
        store.getProxy().extraParams = {
            application_id: application_id,
            application_code: application_code,
            workflow_stage_id: workflow_stage_id
        }

    },
    getExpiryDate: function(form) {
        var application_code = form.down('hiddenfield[name=application_code]').getValue(),
            module_id = form.down('hiddenfield[name=module_id]').getValue(),
            approved_date = form.down('datefield[name=approval_date]').getValue(),
            sub_module_id = form.down('hiddenfield[name=sub_module_id]').getValue();

        Ext.Ajax.request({
            url: 'workflow/getApprovalExpiryDate',
            params: {
                application_code: application_code,
                sub_module_id: sub_module_id,
                module_id: module_id,
                approved_date: approved_date,
                _token: token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    expiry_date = resp.expiry_date,
                    message = resp.message;
                if (success == true || success === true) {
                    form.down('datefield[name=expiry_date]').setValue(expiry_date);
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    uploadApplicationFile: function (btn) {
        var me = this,
            form = btn.up('form'),
            win = form.up('window'),
            frm = form.getForm(),
            formValues = form.getValues(),
            storeID = btn.storeID,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            uploads_store = Ext.getStore(storeID),
            resumable = btn.resumable,
            progressBar = btn.progressBar;
        if(resumable != ''){
            //add parameters
            resumable.opts.query.id=formValues.id;
            resumable.opts.query.application_id=formValues.application_id;
            resumable.opts.query.application_code=formValues.application_code;
            resumable.opts.query.process_id=formValues.process_id;
            resumable.opts.query.section_id=formValues.section_id;
            resumable.opts.query.module_id=formValues.module_id;
            resumable.opts.query.sub_module_id=formValues.sub_module_id;
            resumable.opts.query.workflow_stage_id=formValues.workflow_stage_id;
            resumable.opts.query.document_type_id=formValues.document_type_id;
            resumable.opts.query.prodclass_category_id=formValues.prodclass_category_id;
            resumable.opts.query.importexport_permittype_id=formValues.importexport_permittype_id;
            resumable.opts.query.premise_type_id=formValues.premise_type_id;
            resumable.opts.query.query_ref_id=formValues.query_ref_id;
            resumable.opts.query.node_ref=formValues.node_ref;
            resumable.opts.query.doctype_id=formValues.doctype_id;
            resumable.opts.query.document_requirement_id=formValues.document_requirement_id;
            resumable.opts.query.assessment_by=formValues.assessment_by;
            resumable.opts.query.assessment_start_date=formValues.assessment_start_date;
            resumable.opts.query.assessment_end_date=formValues.assessment_end_date;
            resumable.opts.query.description=formValues.description;
           
            funcShowCustomizableWindow("Upload Progress", '20%', progressBar, 'customizablewindow', btn);
            resumable.upload();
        }else{
             toastr.error('Please select a file/document to upload!', 'Missing File');
        }
    },
    initializeResumableUpload: function(btn){
        var me = this,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = btn.up('form'),
            win = form.up('window'),
            rec = form.getValues(),
            id = rec.application_id,
            application_id = rec.application_id,
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            uploads_store = Ext.getStore('applicationDocumentsUploadsStr'),
            progressBar = Ext.widget('progress');
        // let browseFile = $('#browseFile');
        let resumable = new Resumable({
            target: 'documentmanagement/resumableuploadApplicationDocumentFile',
            query:{
                _token:token,
                view_module_id: module_id,
                id: id,
                application_id: application_id,
                application_code: '',
                process_id: '',
                section_id: '',
                module_id: '',
                sub_module_id: '',
                workflow_stage_id: '',
                document_type_id: '',
                prodclass_category_id: '',
                importexport_permittype_id: '',
                premise_type_id: '',
                query_ref_id: '',
                node_ref: '',
                doctype_id: '',
                document_requirement_id: '',
                assessment_by: '',
                assessment_start_date: '',
                assessment_end_date: '',
                description: ''
            } ,
            fileType: [],
            chunkSize: 10*1024*1024, // 10mbs
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Accept' : 'application/json'
            },
            testChunks: false,
            throttleProgressCallbacks: 1,
        });
        // console.log(browseFile);
        resumable.assignBrowse(document.getElementById('browseButton'));

        resumable.on('fileAdded', function (file) { // trigger when file picked
            document.getElementById('fileName').value = file.relativePath;
            btn.resumable = resumable;
            btn.progressBar = progressBar;
            //resumable.upload() // to actually start uploading.
        });

        resumable.on('fileProgress', function (file) { // trigger when file progress update
            me.updateProgress(Math.floor(file.progress() * 100), progressBar);
        });

        resumable.on('fileSuccess', function (file, response) { // trigger when file upload complete
            response = JSON.parse(response);
            uploads_store.load();
            success = response.success;
            if(success == true){
                toastr.success("Uploaded Successfully", 'Success Response');
                uploads_store.load();
            }else{
                toastr.error(response.message+ " If problem persist contact system admin", 'Failure Response!!');
            }
            progressBar.up('window').close();
            win.close();
            delete resumable;
            
        });

        resumable.on('fileError', function (file, response) { // trigger when there is any error
            progressBar.up('window').close();
            res = JSON.parse(response);
            uploads_store.load();
            win.close();
            toastr.error(res.message+ " If problem persist contact system admin", 'Failure Response!!');
        });
    },
    updateProgress: function(value,progressBar) {
            progressBar.setValue(value*0.01);
            progressBar.updateText(value+' %');          
        },
    viewSubmissionRemark: function(btn){
        var mainTabPanel = this.getMainTabPanel(),
            panel = mainTabPanel.getActiveTab(),
            application_code = panel.down('hiddenfield[name=active_application_code]').getValue(),
            child = Ext.widget('submissionRemarksViewFrm'); 
            btn.mask('Loading..');
         Ext.Ajax.request({
            url: 'workflow/getApplicationSubmissionRemarks',
            params: {
                application_code: application_code,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                btn.unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                    results = resp.results;
                if (success || success == true || success === true) {
                   var model = Ext.create('Ext.data.Model', results);
                    child.loadRecord(model);
                    funcShowCustomizableWindow("Submission Remark", '40%', child, 'customizablewindow', btn);
                } else {
                    toastr.error(message, 'Failure Response!!');
                }
            },
            failure: function (response) {
                btn.unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                btn.unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });

    },
    addTcMeetingParticipants: function (btn) {
        var grid = btn.up('grid'),
            win = grid.up('window'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form'),
            meeting_id = form.down('hiddenfield[name=id]').getValue(),
            store = Ext.getStore('tcmeetingparticipantsstr'),
            sm = grid.getSelectionModel(),
            selected_records = sm.getSelection(),
            selected = [],
            mask = new Ext.LoadMask(
                {
                    target: grid,
                    msg: 'Please wait...'
                }
            );
        if (!meeting_id) {
            toastr.warning('Please save meeting details first!!', 'Warning Response');
            return false;
        }
        Ext.each(selected_records, function (item) {
            var user_id = item.data.id,
                name = item.data.fullnames,
                phone = item.data.phone,
                email = item.data.email,
                obj = {
                    user_id: user_id,
                    participant_name: name,
                    phone: phone,
                    email: email
                };
            selected.push(obj);
            //selected.push(item.data.id);
        });
        mask.show();
        Ext.Ajax.request({
            url: 'common/syncTcMeetingParticipants',
            params: {
                selected: JSON.stringify(selected),
                meeting_id: meeting_id,
                _token: token
            },
            success: function (response) {
                mask.hide();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success || success == true || success === true) {
                    toastr.success(message, 'Success Response!!');
                    store.load();
                    win.close();
                } else {
                    toastr.error(message, 'Failure Response!!');
                }
            },
            failure: function (response) {
                mask.hide();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                mask.hide();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    addMeetingParticipants: function (btn) {
        var grid = btn.up('grid'),
            win = grid.up('window'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            // form = activeTab.down('form'),
          // meeting_id = grid.meeting_id.getValue(),
            meeting_id = grid.down('hiddenfield[name=meeting_id]').getValue(),
            store = grid.getStore('tcmeetingparticipantsstr'),
            sm = grid.getSelectionModel(),
            selected_records = sm.getSelection(),
            selected = [],
            mask = new Ext.LoadMask(
                {
                    target: grid,
                    msg: 'Please wait...'
                }
            );
        if (!meeting_id) {
            toastr.warning('Please save meeting details first!!', 'Warning Response');
            return false;
        }
        Ext.each(selected_records, function (item) {
            var user_id = item.data.id,
                name = item.data.fullnames,
                phone = item.data.phone,
                email = item.data.email,
                branch = item.data.branch,
                department = item.data.department,
                gender = item.data.gender, 
                title= item.data.title,

                obj = {
                    user_id: user_id,
                    participant_name: name,
                    phone: phone,
                    email: email,
                    branch: branch,
                    department: department,
                    gender: gender,
                    title: title,

                };
            selected.push(obj);
            //selected.push(item.data.id);
        });
        mask.show();
        Ext.Ajax.request({
            url: 'common/syncTcMeetingParticipants',
            params: {
                selected: JSON.stringify(selected),
                meeting_id: meeting_id,
                _token: token
            },
            success: function (response) {
                mask.hide();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success || success == true || success === true) {
                    toastr.success(message, 'Success Response!!');
                    store.load();
                    win.close();
                } else {
                    toastr.error(message, 'Failure Response!!');
                }
            },
            failure: function (response) {
                mask.hide();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                mask.hide();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showApplicationMoreDetails: function (btn) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            ref_no = activeTab.down('displayfield[name=reference_no]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            //premise_type_id = activeTab.down('hiddenfield[name=premise_type_id]').getValue(),
            if(section_id ==4){
                view = 'mDDrugsProductsDetailsPnl'; 
            }
            else{
                view = 'drugsProductsDetailsPnl';
            }
            enforcement_view = 'enforcementDetailsPnl';
        if(activeTab.down('hiddenfield[name=applicant_id]')){
             applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue();
        }
        if(sub_module_id == 9){
             view = 'altdrugsProductsDetailsPnl';
        }
        else if(sub_module_id == 79){
            view = 'listingproductdetailsPnl';
            
        }
        else if(sub_module_id == 75){
            prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
            console.log(prodclass_category_id);
            if(section_id == 4){
                view = 'exemptionMDProductsDetailsPnl';
            }
            else if(prodclass_category_id){
                if(prodclass_category_id == 47){
                    view = 'exemptionVetProductsDetailsPnl';
                }
                else if(prodclass_category_id == 48){
                       view = 'exemptionVetWSProductsDetailsPnl';
                   }
                 else if(prodclass_category_id == 372){
                       view = 'exemptionVetWSProductsDetailsPnl';
                   }
                else if(prodclass_category_id == 373){
                    view = 'exemptionVetWSProductsDetailsPnl';
                }
                else if(prodclass_category_id == 50){
                    view = 'exemptionDrugProductsDetailsPnl';
                } 
                else if(prodclass_category_id == 51){
                       view = 'exemptionWSProductsDetailsPnl';
                   }   
            }
        }
        else if(sub_module_id ==78 || sub_module_id ==3){
            view='premiseAltappmoredetailswizard'
        }
        else if(sub_module_id ==33){
            view='promotionMaterialsDetailsPnl'
        }

        if(module_id==1){
            this.showProductApplicationMoreDetailsGeneric(application_code,view,isReadOnly,'',workflow_stage_id);
        }
        else if(module_id==3){

            var application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                site_id = activeTab.down('hiddenfield[name=manufacturing_site_id]').getValue(),
                gmp_type_id = activeTab.down('hiddenfield[name=gmp_type_id]').getValue();
            this.showGmpApplicationMoreDetailsGeneric(application_id, application_code, site_id, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, gmp_type_id);
        }else if(module_id == 21){
            this.showPvApplicationMoreDetailsGeneric(application_code, 'pvDetailsPnl', isReadOnly);
        }else if(module_id == 22){
            this.showMirApplicationMoreDetailsGeneric(application_code, 'mirDetailsPnl', isReadOnly);
        }else if(module_id == 25){
            this.showPsurApplicationMoreDetailsGeneric(application_code, 'psurDetailsPnl', isReadOnly);
        }else if(module_id == 24){
            this.showRMUApplicationMoreDetailsGeneric(application_code, 'rmuSubmissionDetailsPnl', isReadOnly);
        }
        else if(module_id == 8){
            if(sub_module_id == 88){
                this.showMonitoringApplicationMoreDetailsGeneric(application_code, 'monitoringDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
            }
            else if(sub_module_id == 89){
                    this.showEnforcementApplicationMoreDetailsGeneric(application_code, 'operationDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
            } 
            else if(sub_module_id == 86){
                joint_investigation_id = activeTab.down('hiddenfield[name=joint_investigation_id]').getValue();
             
                if(joint_investigation_id){
                    this.showJointReportInvestigationMoreDetailsGeneric(application_code, 'jointInvestigationDetails',module_id, sub_module_id,section_id,isReadOnly)
                }
                else{
                    this.showEnforcementApplicationMoreDetailsGeneric(application_code, 'enforcementDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
                }

            }
            else{
                this.showEnforcementApplicationMoreDetailsGeneric(application_code, 'enforcementDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
            }
        }
        else if(module_id == 7){
            this.showClinicalTrialApplicationMoreDetailsGeneric(application_id, application_code, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly);
        }else if(module_id == 2){
            var premise_id = activeTab.down('hiddenfield[name=premise_id]').getValue();
            this.showPremiseApplicationMoreDetailsGeneric(application_id, premise_id, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, application_code);
        }else if(module_id == 14){
            this.showPromotionMaterialApplicationMoreDetailsGeneric(application_id,application_code, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly,view);
        }
        else if(sub_module_id == 49){
            this.previewInspectionDetails(application_id);
        }
        else if(sub_module_id == 73){
            this.showPermitApplicationMoreDetailsGeneric('previewAmmendimportexportpermitdetails',application_id, applicant_id, ref_no, process_id,  isReadOnly);
        }
        else if(module_id == 4){
            this.showPermitApplicationMoreDetailsGeneric('previewimportexportpermitdetails',application_id, applicant_id, ref_no, process_id,  isReadOnly);
        }
        else if(module_id == 12){
            this.showPermitApplicationMoreDetailsGeneric('previewcontroldrugsimppermitdetails',application_id, applicant_id, ref_no, process_id,  isReadOnly);
        }
        else if(module_id == 16){
            if(sub_module_id == 98){
            this.showAdvancedCustomerApplicationMoreDetailsGeneric(application_code, 'advancedCustomerDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
            }
            else if(sub_module_id == 99){
                this.showInvoicesRefundApplicationMoreDetailsGeneric(application_code, 'revenueRefundApplicationDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
            }
            else{

            }
        }
        else{
            toastr.error('Not mapped', 'Please map the preview for this module');
        }


    },
    showProductApplicationMoreDetailsGeneric: function (application_code,productdetails_panel,isReadOnly,ref_no,workflow_stage_id) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(!ref_no){
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue();
            }
            is_dataammendment_request =0;
        //when fired from a manager grid and the selection is different from what was loaded from intray
        //this helps product wizard grids to load with the correct application  code
        // if(application_code){
        //     activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
        // }
        var me = this,
            productdetails_panel = Ext.widget(productdetails_panel);
        //     {
        //     xtype: 'tabpanel',
        //     layout: 'fit',
        //     defaults: {
        //         margin: 3
        //     },
        //     items: [{
        //         xtype: 'productapplicantdetailsfrm',
        //         title: 'Pharmacist Details'
        //     },
        //     {
        //         xtype: 'productlocalapplicantdetailsfrm',
        //         is_prescriber: 1,
        //         title: 'Prescriber Details'
        //     }]
        // }

        // productdetails_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        productdetails_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'productregistration/getProductApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    applicantDetails = resp.applicant_details,
                    ltrDetails = resp.ltrDetails,
                    product_details = resp.product_details,
                    prodclass_category_id = product_details.prodclass_category_id,
                    applicant_id_no = product_details.applicant_id_no,
                    branch_id = resp.branch_id;
                if (success == true || success === true) {
                    productdetails_panel.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);

                    products_form = productdetails_panel.down('form');

                    //add applicant
                    if(prodclass_category_id == 50){
                       // productdetails_panel.add(0, {title: 'Presciber', xtype: 'productlocalapplicantdetailsfrm'});
                        productdetails_panel.add(0, {title: 'Pharmacist(Applicant)', xtype: 'productapplicantdetailsfrm'});
                    }else if(prodclass_category_id == 51){
                        productdetails_panel.add(0, {title: 'Practitioner Details', xtype: 'exmpProductsDetailsFrm'});
                    }else if(prodclass_category_id == 47){
                        productdetails_panel.add(0, {title: 'Application on behalf of the Animal Holding Unit (Farm or Homestead)', xtype: 'animalHoldingUnitGrid'});
                        productdetails_panel.add(0, {title: 'PRESCRIBER/ APPLICANT Details (Veterinary Surgeon or Paraprofessional)', xtype: 'exmpProductsDetailsFrm'});
                    }else if(prodclass_category_id == 48){
                        productdetails_panel.add(0, {title: 'Practitioner/ Applicant (RESPONSIBLE PERSON [Pharmacist / Veterinary Surgeon or Principal Investigator)', xtype: 'exmpProductsDetailsFrm'});
                        // productdetails_panel.add(1, {title: 'Application on behalf of the Animal Holding Unit (Farm or Homestead)', xtype: 'animalHoldingUnitGrid'});
                    }else if(prodclass_category_id == 372){
                        productdetails_panel.add(0, {title: 'Practitioner/ Applicant (RESPONSIBLE PERSON [Pharmacist / Veterinary Surgeon or Principal Investigator)', xtype: 'exmpProductsDetailsFrm'});
                        // productdetails_panel.add(1, {title: 'Application on behalf of the Animal Holding Unit (Farm or Homestead)', xtype: 'animalHoldingUnitGrid'});
                    }else if(prodclass_category_id == 373){
                        productdetails_panel.add(0, {title: 'Practitioner/ Applicant (RESPONSIBLE PERSON [Pharmacist / Veterinary Surgeon or Principal Investigator)', xtype: 'exmpProductsDetailsFrm'});
                        // productdetails_panel.add(1, {title: 'Application on behalf of the Animal Holding Unit (Farm or Homestead)', xtype: 'animalHoldingUnitGrid'});
                    }else{
                        productdetails_panel.add(0, {title: 'Contact Person', xtype: 'productlocalapplicantdetailsfrm'});
                        productdetails_panel.add(0, {title: 'Applicant', xtype: 'productapplicantdetailsfrm'});
                    }

                    if(!products_form){ //loads after added forms intop if the original view had no form
                        products_form = productdetails_panel.down('form');
                    }
                    funcShowStatelessCustomizableWindow(ref_no, '85%', productdetails_panel, 'customizablewindow');
                    if (product_details) {
                        var model2 = Ext.create('Ext.data.Model', product_details);
                        products_form.loadRecord(model2);
                        productdetails_panel.getViewModel().set('model', model2);

                        //load data
                        if(productdetails_panel.down('productapplicantdetailsfrm')){
                            productdetails_panel.down('productapplicantdetailsfrm').loadRecord(model2);
                            applicant_form = productdetails_panel.down('productapplicantdetailsfrm');
                            applicant_form.down('hiddenfield[name=applicant_id]').setValue(applicant_id_no);
                        }
                        if(productdetails_panel.down('exmpProductsDetailsFrm')){
                            productdetails_panel.down('exmpProductsDetailsFrm').loadRecord(model2);
                        }
                        var model3 = Ext.create('Ext.data.Model', ltrDetails);
                        if(productdetails_panel.down('productlocalapplicantdetailsfrm')){
                            productdetails_panel.down('productlocalapplicantdetailsfrm').loadRecord(model3);
                        }
                    }

                    if (isReadOnly == 1) {

                        productdetails_panel.getViewModel().set('isReadOnly', true);

                    } else if((isReadOnly == 0) && (workflow_stage_id == 402 || workflow_stage_id === 403)){
                        productdetails_panel.getViewModel().set('isReadOnly', false);
                        frm = productdetails_panel.down('drugsProductsDetailsFrm');
                        frm.down('button[name=update_btn]').setVisible(true);
                    } else if((isReadOnly == 1111)){
                        productdetails_panel.getViewModel().set('isReadOnly', false);
                        frm = productdetails_panel.down('drugsProductsDetailsFrm');
                        frm.down('button[name=update_btn]').setVisible(true);
                        frm.is_register = 1111;
                    }
                     else {
                        productdetails_panel.getViewModel().set('isReadOnly', false);

                    }
                    productdetails_panel.setActiveTab(0);

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showGmpApplicationMoreDetailsGeneric: function (application_id, application_code, site_id, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, gmp_type_id) {
        Ext.getBody().mask('Please wait...');
        var childXtype = 'mansiteappmoredetailswizard';
        if (sub_module_id == 40 || sub_module_id === 40) {
            childXtype = 'mansiteappmoredetailsaltwizard';
        }

        var me = this,
            wizardPnl = Ext.widget(childXtype),
            applicantFrm = wizardPnl.down('gmpapplicantdetailsfrm'),
            siteFrm = wizardPnl.down('mansitedetailsfrm'),
            contactPersonFrm = wizardPnl.down('premisecontactpersonfrm'),
            ltrFrm = wizardPnl.down('ltrfrm'),
            otherDetailsGrid = wizardPnl.down('mansiteotherdetailswingrid'),
            productLineDetailsGrid = wizardPnl.down('productlinedetailswingrid'),
            gmpProductDetailsGrid = wizardPnl.down('gmpproductslinkagedetailswingrid'),
            blocksGrid = wizardPnl.down('mansiteblockdetailswingrid'),
            assessmentType_fld = wizardPnl.down('combo[name=assessment_type_id]'),
            assessment_procedure_id_fld = wizardPnl.down('combo[name=assessment_procedure_id]'),
            gmpType_fld = wizardPnl.down('combo[name=gmp_type_id]'),
            deviceType_fld = wizardPnl.down('combo[name=device_type_id]'),
            siteReadOnly = 0,
            personnelTabPnl = wizardPnl.down('mansitepersonneltabpnl'),
            personnelDetailsGrid = Ext.widget('mansitepersonneldetailswingrid', {
                title: 'Other Personnel'
            });
        if (gmp_type_id == 2 || gmp_type_id === 2) {
            siteReadOnly = 0;
        }
        contactPersonFrm.setMoreDetails(1);
        personnelTabPnl.remove(personnelTabPnl.items.getAt(1));
        personnelTabPnl.add(personnelDetailsGrid);
        wizardPnl.setHeight(550);
        applicantFrm.down('button[name=link_applicant]').setDisabled(false);
        siteFrm.down('button[action=search_site]').setDisabled(false);
        siteFrm.down('button[name=search_manufacturer]').setDisabled(false);
        ltrFrm.down('button[action=link_ltr]').setDisabled(false);
        wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
        wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        wizardPnl.down('hiddenfield[name=application_id]').setValue(application_id);
        wizardPnl.down('hiddenfield[name=application_code]').setValue(application_code);
        wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
        wizardPnl.down('hiddenfield[name=gmp_type_id]').setValue(gmp_type_id);
        //wizardPnl.down('combo[name=zone_id]').setReadOnly(false);
        if ((siteReadOnly) && (siteReadOnly == 1 || siteReadOnly === 1)) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
        }
        /* personnelDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         blocksGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         productLineDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         gmpProductDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         */
        siteFrm.down('hiddenfield[name=isReadOnly]').setValue(siteReadOnly);
        if (section_id == 4) {
            wizardPnl.down('button[name=line_details]').setText('DEVICE TYPE DETAILS');
            wizardPnl.down('combo[name=device_type_id]').setVisible(true);
            wizardPnl.down('combo[name=device_type_id]').setReadOnly(false);
            productLineDetailsGrid.down('button[name=add_line]').setText('Add Device Type');
            productLineDetailsGrid.columns[0].setText('Device Type');
            productLineDetailsGrid.columns[1].setText('Device Type Category');
            productLineDetailsGrid.columns[2].setText('Device Type Description');
        }
        if (sub_module_id == 40 || sub_module_id === 40) {
            wizardPnl.down('gmpvariationrequestsgrid').down('hiddenfield[name=isReadOnly]').setValue(siteReadOnly);
        }
        Ext.Ajax.request({
            method: 'GET',
            url: 'gmpapplications/getGmpApplicationMoreDetails',
            params: {
                application_id: application_id,
                site_id: site_id,
                applicant_id: applicant_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    applicantDetails = resp.applicant_details,
                    siteDetails = resp.site_details,
                    ltrDetails = resp.ltr_details,
                    contactPersonDetails = resp.contact_details;
                if (success == true || success === true) {
                    if (applicantDetails) {
                        var model1 = Ext.create('Ext.data.Model', applicantDetails);
                        applicantFrm.loadRecord(model1);
                        assessmentType_fld.setValue(applicantDetails.assessment_type_id);
                        gmpType_fld.setValue(applicantDetails.gmp_type_id);
                        assessment_procedure_id_fld.setValue(applicantDetails.assessment_procedure_id);
                    }
                    if (siteDetails) {
                        deviceType_fld.setValue(siteDetails.device_type_id);
                        var model2 = Ext.create('Ext.data.Model', siteDetails);
                        siteFrm.loadRecord(model2);
                    }
                    if (ltrDetails) {
                        var model3 = Ext.create('Ext.data.Model', ltrDetails);
                        ltrFrm.loadRecord(model3);
                    }
                    if (contactPersonDetails) {
                        var model4 = Ext.create('Ext.data.Model', contactPersonDetails);
                        contactPersonFrm.loadRecord(model4);
                    }
                    funcShowCustomizableWindow(ref_no, '85%', wizardPnl, 'customizablewindow');
                    if (sub_module_id == 6 || sub_module_id === 6) {
                        if (isReadOnly < 1) {
                            siteFrm.getForm().getFields().each(function (field) {
                                field.setReadOnly(true);
                            });
                            personnelDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
                            otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(0);
                            me.fireEvent('formAuth', process_id, 1, siteFrm);
                            me.fireEvent('gmpOtherPartsAuth', process_id, wizardPnl);
                        }
                    }
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showPromotionMaterialApplicationMoreDetailsGeneric:function(application_id,application_code, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly,view){
        Ext.getBody().mask('Please wait...');
        var me = this,
            wizardPnl = Ext.widget('promotionMaterialsDetailsPnl'),
           // wizardPnl = Ext.widget('newpromotionmaterialwizard'),
            applicantFrm = wizardPnl.down('promotionapplicantdetailsfrm'),
            promotionalappdetailsfrm = wizardPnl.down('promotionalappdetailsfrm'),
			promotiommaterialproductgrid = wizardPnl.down('promotiommaterialproductgrid'),
			//  promotionmaterialproductparticularsform=wizardPnl.down('promotionmaterialproductparticularsform'),
			promotionmaterialdetailsgrid = wizardPnl.down('promotionmaterialdetailsgrid');
            appDetailsReadOnly=1;

        wizardPnl.setHeight(500);        
        wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
        wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        wizardPnl.down('hiddenfield[name=active_application_id]').setValue(application_id);
        wizardPnl.down('hiddenfield[name=application_code]').setValue(application_code);
        wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
        
        // if ((appDetailsReadOnly) && (appDetailsReadOnly == 1 || appDetailsReadOnly === 1)) {
        //     wizardPnl.down('button[name=save_btn]').setVisible(false);
        //     wizardPnl.down('button[name=process_submission_btn]').setVisible(false);    
        // }
		
		promotiommaterialproductgrid.down('button[name=add_details]').setVisible(false);
		promotionmaterialdetailsgrid.down('button[name=add_details]').setVisible(false);
        view.height = Ext.Element.getViewportHeight() - 118;

        Ext.Ajax.request({
            method: 'GET',
            url: 'promotionmaterials/getPromotionApplicationMoreDetails',
            params: {
                application_id: application_id,
                applicant_id: applicant_id,
                // application_code : active_application_code
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    applicantDetails = resp.applicant_details,
                    promotionDetails = resp.promotion_details;

                if (success == true || success === true) {
                    if (applicantDetails) {
                        var model1 = Ext.create('Ext.data.Model', applicantDetails);
                        applicantFrm.loadRecord(model1);
                    }
                    if(promotionDetails){
                        var model2 = Ext.create('Ext.data.Model', promotionDetails);
                        promotionalappdetailsfrm.loadRecord(model2);
                    }

                    funcShowCustomizableWindow(ref_no, '85%', wizardPnl, 'customizablewindow');
                    
                    if (isReadOnly == 1) {

                        wizardPnl.getViewModel().set('isReadOnly', true);

                    } else {
                        wizardPnl.getViewModel().set('isReadOnly', false);

                    }
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
		
    },
   
    add_application_details_tag:function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            container = btn.up().down('displayfield[name=application_details]');
        Ext.Ajax.request({
            method: 'GET',
            url: 'productregistration/getProductApplicationDetailsTag',
            params: {
                application_code: application_code,
                module_id:module_id
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    results = resp.results;
                if (success == true || success === true) {
                    if (!results) {
                        return false;
                    }
                    container.setValue(results);
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });

    },

    addAuthSignature: function(btn) {
        //logde sign request
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            pnl = btn.up('#'+btn.callerPnl),
            win = pnl.up('window'),
            form_values = pnl.getForm().getValues(),
            decision_id = pnl.down('combo[name=decision_id]').getValue(),
            mainStore = activeTab.down('grid').getStore(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue();
    
       if(!pnl.getForm().isValid()){
            toastr.error('Please fill in the form before submitting', 'Failure Response');
            return false;
       }
       win.mask('Submitting for Signing Please wait....');
        Ext.Ajax.request({
            method: 'GET',
            url: 'integration/postSignRequest',
            params: {
                application_code: application_code,
                module_id:module_id,
                decision_id: decision_id,
                payload: JSON.stringify(form_values)
            },
            success: function (response) {
                win.unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success == true || success === true) {
                    toastr.success('Sign request successfully submitted the status will change once signed', 'Success Response');
                    mainStore.load();
                    window.open(esign_url, "_blank");
                    win.close();
                } else {
                    toastr.error(message, 'Failure Response');
                    window.open(esign_url, "_blank");
                }
            },
            failure: function (response) {
                win.unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                win.unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
        //console.log(btn);
        // var child = Ext.widget('signaturePnl');
        // child.down('button[name=save_signature_btn]').callerId = btn.callerPnl;
        // funcShowCustomizableWindow('Authorization Signature', '40%', child, 'customizablewindow');
       // 'save_signature_btn',//addAuthSignature
    },
    SaveAuthSignature: function(btn) {
        var pnl = btn.up('panel'),
            sign_pad = pnl.down('signaturePad'),
            sign_data = sign_pad.toDataURL(),
            caller = Ext.ComponentQuery.query("#"+btn.callerId)[0],
            sign_holder = caller.down('signaturePad');
        //set Value
        sign_holder.clear();
        caller.down('textfield[name=sign_file]').setValue(sign_data);
        sign_holder.fromDataURL(sign_data);
        sign_holder.off();
        pnl.up('window').close();

    },
     saveQueryApprovalDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mainStore = activeTab.down('grid').getStore(),
            form = btn.up('form'),
            frm = form.getForm(),
            win = form.up('window');
            action_url = 'common/saveQueryApprovalDetails';
        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                waitMsg: 'Please wait...',
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        mainStore.load();
                        toastr.success(message, "Success Response");
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error('Failure Response');
                }
            });
        }
    },
    saveApplicationApprovalDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mainStore = activeTab.down('grid').getStore(),
            form = btn.up('form'),
            frm = form.getForm(),
            win = form.up('window');
            action_url = 'common/saveApplicationApprovalDetails';
        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                waitMsg: 'Please wait...',
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        mainStore.load();
                        toastr.success(message, "Success Response");
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error('Failure Response');
                }
            });
        }
    },
    generateReport: function (btn) {
        var grid = btn.up('grid'),
            exportrpt_title = 'system_report_' + grid.export_title,
            type = btn.type;
        var file_name = exportrpt_title + btn.file_name;
        this.doExport({
            type: type,
            title: exportrpt_title,
            fileName: file_name
        }, grid);
    },
    doExport: function (config, grid) {
        grid.saveDocumentAs(config);
    },
    tCMMeetingSchedulingRefreshGrid: function (me) {

        var store = me.store,
            table_name = me.table_name,
            strict_mode = me.strict_mode,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            meeting_id = activeTab.down('form').down('hiddenfield[name=id]').getValue();

        store.getProxy().extraParams = {
            table_name: table_name,
            workflow_stage_id: workflow_stage_id,
            meeting_id: meeting_id,
            strict_mode: strict_mode
        };
    },
    funcUploadTCMeetingtechnicalDocuments:function(btn){
        var me = this,
            mainTabPnl = btn.up('#contentPanel'),
            containerPnl = mainTabPnl.getActiveTab(),
            grid = btn.up('grid'),
            childXtype = btn.childXtype,
            childXtype= Ext.widget(childXtype),
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            document_type_id = btn.document_type_id,
            reference_table_name = btn.reference_table_name,
            table_name = btn.table_name,
            meeting_id = containerPnl.down('hiddenfield[name=id]').getValue();

        if(meeting_id != ''){
            childXtype.down('hiddenfield[name=document_type_id]').setValue(document_type_id);
            childXtype.down('hiddenfield[name=reference_record_id]').setValue(meeting_id);
            childXtype.down('hiddenfield[name=table_name]').setValue(table_name);
            childXtype.down('hiddenfield[name=reference_table_name]').setValue(reference_table_name);
            funcShowCustomizableWindow(winTitle, winWidth, childXtype, 'customizablewindow');
        }
        else{
            toastr.warning('Please save meeting details first!!', 'Warning Response');
            return false;
        }


    },
    saveTCMeetingDetails: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form'),
            toaster = btn.toaster,
            frm = form.getForm(),
            applicationsGrid = btn.up('grid'),//activeTab.down(applicationsGridXtype),
            sm = applicationsGrid.getSelectionModel(),
            selected_records = sm.getSelection(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            applicationsStore = applicationsGrid.getStore(),
            selected = [];

        Ext.each(selected_records, function (item) {
            selected.push(item.data.application_code);
        });

        if (frm.isValid()) {
            if (!sm.hasSelection()) {
                //toastr.warning('Please select at least one application!!', 'Warning Response');
                //return false;
            }
            frm.submit({
                url: 'premiseregistration/saveTCMeetingDetails',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                params: {
                    application_code: application_code,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    workflow_stage_id:workflow_stage_id,
                    selected: JSON.stringify(selected),
                },
                waitMsg: 'Please wait...',
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message,
                        record_id = response.record_id;
                    if (success == true || success === true) {
                        form.down('hiddenfield[name=id]').setValue(record_id);
                        applicationsStore.load();
                        if (toaster == 1 || toaster === 1) {
                            toastr.success(message, "Success Response");
                        }
                    } else {
                        closeActiveWindow();
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    closeActiveWindow();
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        } else {
            toastr.warning('Fill all required fields!!', 'Warning Response');
            closeActiveWindow();
            return false;
        }
    },

    viewPredefinedInterfaceApplicationDetails: function (record, interfaceXtype) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            process_id = record.get('process_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            workflow_stage = record.get('workflow_stage'),
            ref_no = record.get('tracking_no'),
            view_id = record.get('view_id'),
            workflow_details = getAllWorkflowDetails(process_id, workflow_stage_id);

        if (!workflow_details || workflow_details.length < 1) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        var tab = mainTabPanel.getComponent(view_id);

        /*var tab = mainTabPanel.items.find(function (i) {
            if (i.title.indexOf(ref_no) !== -1) {
                return i;
            } else {
                return false;
            }
        });*/
        if (!tab) {
            var newTab = Ext.widget(interfaceXtype, {
                title:'Personal Use Permits' + '-' + ref_no,
                closable: true
            });
            /*   if (workflow_stage_id == 14 || workflow_stage_id === 14) {
              newTab.down('premisedetailsfrm').down('hiddenfield[name=isReadOnly]').setValue(1);
               }*/
            me.prepareApplicationBaseDetails(newTab, record);
            mainTabPanel.add(newTab);
            var lastTab = mainTabPanel.items.length - 1;
            mainTabPanel.setActiveTab(lastTab);
        } else {
            mainTabPanel.setActiveTab(tab);
        }
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
            me.updateSubmissionsTable(record, 'isRead');
        }, 300);
    },
    addApplicationWorkflowParams: function (me) {
        var store = me.store,
            managerInspection = me.managerInspection,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            gmp_type_id = (activeTab.down('combo[name=gmp_type_id]')) ? activeTab.down('combo[name=gmp_type_id]').getValue() : null,
            region_id = (activeTab.down('combo[name=region_id]')) ? activeTab.down('combo[name=region_id]').getValue() : null,
            premise_type_id = activeTab.down('hiddenfield[name=premise_type_id]')?activeTab.down('hiddenfield[name=premise_type_id]').getValue():'',
            inspection_type_id = me.inspection_type_id,
            table_name = getApplicationTable(module_id),
            inspection_id = null, risk_rating_id;
        if ((managerInspection) && managerInspection == 1) {
            inspection_id = activeTab.down('form').down('hiddenfield[name=id]').getValue();
        }
        if(me.down('combo[name=risk_rating_id]')){
            risk_rating_id = me.down('combo[name=risk_rating_id]').getValue();
        }
        store.getProxy().extraParams = {
            table_name: table_name,
            workflow_stage_id: workflow_stage_id,
            section_id: section_id,
            gmp_type_id: gmp_type_id,
            premise_type_id:premise_type_id,
            inspection_type_id: inspection_type_id,
            inspection_id: inspection_id,
            region_id: region_id,
            risk_rating_id: risk_rating_id
        };
    },
    moveSelectedRecordRowToTop: function (gridView) {
        var store = gridView.getStore(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            selectedRecordIndex = store.find('id', application_id);
        if (selectedRecordIndex > 0) {
            var selectedRecord = store.getAt(selectedRecordIndex);
            store.removeAt(selectedRecordIndex);
            store.insert(0, [selectedRecord]);
            gridView.refresh();
        }
        
    },
    attachAppCodefromMainPaneltoStr: function (grid){
         var mainTabPanel = this.getMainTabPanel(),
            panel = mainTabPanel.getActiveTab(),
            store = grid.getStore(),
            application_code = panel.down('hiddenfield[name=active_application_code]').getValue();
        store.getProxy().extraParams = {
            application_code: application_code
        }
    },
      refreshunstructureddocumentuploadsgrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            table_name = grid.down('hiddenfield[name=table_name]').getValue(),
            reference_record_id = grid.down('hiddenfield[name=reference_record_id]').getValue(),
            document_type_id = grid.down('hiddenfield[name=document_type_id]').getValue();

        store.getProxy().extraParams = {
            document_type_id: document_type_id,
            table_name: table_name,
            reference_record_id: reference_record_id
        };
    },
    showUnstructuredDocUploadWin: function (btn) {

        var childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            grid = btn.up('grid'),
            document_type_id = grid.down('hidden[name=document_type_id]').getValue(),
            table_name = grid.down('hidden[name=table_name]').getValue(),
            reference_record_id = grid.down('hidden[name=reference_record_id]').getValue(),
            reference_table_name = grid.down('hidden[name=reference_table_name]').getValue(),
            storeID = grid.storeID,
            form = Ext.widget(childXtype);


        form.down('hiddenfield[name=document_type_id]').setValue(document_type_id);
        form.down('hiddenfield[name=table_name]').setValue(table_name);
        form.down('hiddenfield[name=reference_record_id]').setValue(reference_record_id);
        form.down('hiddenfield[name=reference_table_name]').setValue(reference_table_name);

        form.down('button[name=upload_file]').storeID = storeID;

        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
    },
    addChecklistListApplicationFilters: function (me) {
        var store = me.store,
            panel = me.up('panel'),
            application_code = panel.down('hidden[name=application_code]').getValue(),
            checklist_type = panel.down('combo[name=applicable_checklist]').getValue(),
            mainTabPanel = this.getMainTabPanel(),
            activepanel = mainTabPanel.getActiveTab(),
            //pass_status = me.down('combo[name=pass_status]').getValue(),
            sub_module_id = panel.down('hidden[name=sub_module_id]').getValue(),
            workflow_stage_id = activepanel.down('hidden[name=workflow_stage_id]').getValue(),
            module_id = panel.down('hidden[name=module_id]').getValue();

        store.getProxy().extraParams = {
            application_code: application_code,
            module_id: module_id,
            checklist_type: checklist_type,
            sub_module_id: sub_module_id,
            workflow_stage_id: workflow_stage_id,
          //  pass_status: pass_status
        };
    },
    setReportApplicableChecklistComboStore: function(combo){
        var mainTabPanel = this.getMainTabPanel(),
            panel = mainTabPanel.getActiveTab(),
            app_check_types_store = combo.getStore(),
            process_id = panel.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = panel.down('hiddenfield[name=workflow_stage_id]').getValue();

        app_check_types_store.removeAll();
        app_check_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
    },
    showApplicationDismissalForm: function () {
        var childObject = Ext.widget('applicationdismissalfrm'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            tracking_no = activeTab.down('displayfield[name=tracking_no]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        this.showApplicationDismissalFormGeneric(tracking_no, application_id, application_code, module_id, sub_module_id, section_id, workflow_stage_id);
    },

    showApplicationDismissalFormGeneric: function (ref_no, application_id, application_code, module_id, sub_module_id, section_id, workflow_stage_id) {
        var childObject = Ext.widget('applicationdismissalfrm');
        childObject.down('hiddenfield[name=application_id]').setValue(application_id);
        childObject.down('hiddenfield[name=application_code]').setValue(application_code);
        childObject.down('hiddenfield[name=module_id]').setValue(module_id);
        childObject.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        childObject.down('hiddenfield[name=section_id]').setValue(section_id);
        childObject.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        funcShowCustomizableWindow(ref_no + ' Dismissal', '50%', childObject, 'customizablewindow');
    },
    uploadunstructureddocumentuploads: function (btn) {
        var me = this,
            form = btn.up('form'),
            win = form.up('window'),
            frm = form.getForm(),
            storeID = btn.storeID,
            uploads_store = Ext.getStore(storeID);
        frm.submit({
            //clientValidation: false,
            url: 'documentmanagement/uploadunstructureddocumentuploads',
            waitMsg: 'Uploading...',
            success: function (fm, action) {
                var response = Ext.decode(action.response.responseText),
                    message = response.message,
                    success = response.success;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                    uploads_store.load();
                    win.close();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (fm, action) {
                var response = Ext.decode(action.response.responseText),
                    message = response.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },

    prepapreDocumentCreationReceiving: function (pnl) {

         Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl;
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
           // applicantFrm = activeTab.down('importexportapplicantdetailsfrm'),
            //senderreceiverdetailsfrm = activeTab.down('#senderreceiverdetailsfrm'),
            //application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            documentdetailsfrm = activeTab.down('docdefinationrequirementfrm'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=zone_id]');
            filter = { section_id: section_id },
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

            
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
if (sub_module_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'documentmanagement/prepareDocumentCreationReceivingStage',
                params: {
                    sub_module_id: sub_module_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results,
                        zone_id = results.zone_id,
                        model = Ext.create('Ext.data.Model', results);

                    if (success == true || success === true) {
                        documentdetailsfrm.loadRecord(model);

                        zone_cbo.setValue(zone_id);

                        activeTab.down('displayfield[name=application_status]').setValue(results.application_status);

                        activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                        
                        var parent_pnl = pnl.up('panel');
                            parent_pnl.getViewModel().set('isReadOnly', false);
                            if(activeTab.down('button[action=search_premise]')){
                               activeTab.down('button[action=search_premise]').setDisabled(true);
                            }

                            if(activeTab.down('button[action=link_applicant]')){
                            activeTab.down('button[action=link_applicant]').setDisabled(true);
                            }
                            
                            if( activeTab.down('combo[name=sub_module_id]')){
                                activeTab.down('combo[name=sub_module_id]').setDisabled(true);
                            }
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Ext.getBody().unmask();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
                          
        }
    },
    prepareInterfaceBasedonConfig: function(me){//me - the form
         var frm_cont = me.up('panel'),
            wizard = frm_cont.up('panel'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            is_register = me.is_register,
            premise_type_id,prodclass_category_id,importexport_permittype_id, start_index=1;
            
        if(wizard.down('hiddenfield[name=module_id]')){
            if(wizard.down('hiddenfield[name=module_id]').getValue()){
                var module_id = wizard.down('hiddenfield[name=module_id]').getValue(),
                    sub_module_id = wizard.down('hiddenfield[name=sub_module_id]').getValue(),
                    section_id = wizard.down('hiddenfield[name=section_id]').getValue();
                if(wizard.down('hiddenfield[name=prodclass_category_id]')){
                    prodclass_category_id = wizard.down('hiddenfield[name=prodclass_category_id]').getValue();
                }
                if(wizard.down('hiddenfield[name=importexport_permittype_id]')){
                    importexport_permittype_id = wizard.down('hiddenfield[name=importexport_permittype_id]').getValue();
                }
            }else{
                var wizard = wizard.up(),
                    module_id = wizard.down('hiddenfield[name=module_id]').getValue(),
                    sub_module_id = wizard.down('hiddenfield[name=sub_module_id]').getValue(),
                    section_id = wizard.down('hiddenfield[name=section_id]').getValue();
                   
                if(wizard.down('hiddenfield[name=prodclass_category_id]')){
                    prodclass_category_id = wizard.down('hiddenfield[name=prodclass_category_id]').getValue();
                }
                if(wizard.down('hiddenfield[name=importexport_permittype_id]')){
                    importexport_permittype_id = wizard.down('hiddenfield[name=importexport_permittype_id]').getValue();
                }
           }

        }else if(activeTab.down('hiddenfield[name=module_id]')){
            var mainTabPanel = this.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
                sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            if(activeTab.down('hiddenfield[name=importexport_permittype_id]')){
                    importexport_permittype_id = activeTab.down('hiddenfield[name=importexport_permittype_id]').getValue();
                } 
        }else{
            var win = wizard.up('window'), module_id,sub_module_id,section_id;
            if(win.down('hiddenfield[name=module_id]')){
                 module_id = win.down('hiddenfield[name=module_id]').getValue();
            }
            if(win.down('hiddenfield[name=sub_module_id]')){
                 sub_module_id = win.down('hiddenfield[name=sub_module_id]').getValue();
            } 
             if(win.down('hiddenfield[name=section_id]')){
                 section_id = win.down('hiddenfield[name=section_id]').getValue();
            } 
            
            if(win.down('hiddenfield[name=importexport_permittype_id]')){
                    importexport_permittype_id = win.down('hiddenfield[name=importexport_permittype_id]').getValue();
                }
        }

        if(module_id == 1 && me.down('hiddenfield[name=prodclass_category_id]') && me.down('hiddenfield[name=prodclass_category_id]').getValue()){
            prodclass_category_id = me.down('hiddenfield[name=prodclass_category_id]').getValue();
        }
        else if(activeTab && module_id == 1 && activeTab.down('hiddenfield[name=prodclass_category_id]') && activeTab.down('hiddenfield[name=prodclass_category_id]').getValue()){
            prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
        }
        if(module_id == 2){
            premise_type_id = wizard.down('hiddenfield[name=premise_type_id]').getValue();
        }  
        // if(module_id == 8){
        //     report_type_id=wizard.down('hiddenfield[name=report_type_id]').getValue();
        // } 
        // if(sub_module_id == 2 || sub_module_id == 6){
        //     start_index = 8;
        // }
        // if(sub_module_id == 8){
        //     start_index = 5;
        // }
        // if(sub_module_id == 68){
        //     start_index = 8;
        // }
         Ext.Ajax.request({
                url: 'configurations/prepareInterfaceBasedonConfig',
                params: {
                    module_id:module_id,
                    sub_module_id:sub_module_id,
                    section_id:section_id,
                    prodclass_category_id: prodclass_category_id,
                    premise_type_id: premise_type_id,
                    importexport_permittype_id: importexport_permittype_id
                    // report_type_id:report_type_id
                },
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (response) {
              
                    var resp = Ext.JSON.decode(response.responseText),
                        success = resp.success,
                        message = resp.message;
                        result = resp.results;
                    if (success == true || success === true) {
                        //render form
                        var live_group_tracker = {};
                        var group_tracker = [];
                        for (var i = result.length - 1; i >= 0; i--) {
                            var base_result = result[i];
                            var field_name =  base_result.field_name;
                            var label =  base_result.label;
                            var is_enabled =  base_result.is_enabled;
                            var is_mandatory =  base_result.is_mandatory;
                            var is_readOnly =  base_result.is_readOnly;
                            var has_relation =  base_result.has_relation;
                            var bind_column =  base_result.bind_column;
                            var child_combo =  base_result.child_combo;
                            var parent_combo =  base_result.parent_combo;
                            var xtype =  base_result.xtype;
                            var table =  base_result.combo_table;
                            var displayfield =  base_result.displayfield;
                            var valuefield =  base_result.valuefield;
                            var is_parent =  base_result.is_parent;
                            var is_hidden =  base_result.is_hidden;
                            var is_multiparent =  base_result.is_multiparent;
                            var total_children =  base_result.total_children;
                            var has_logic =  base_result.has_logic;
                            var tpl_block =  base_result.tpl_block;
                            var other_logic = base_result.other_logic;
                            var def_id = base_result.def_id;
                            var column_width = base_result.column_width;
                            var formfield = base_result.formfield;
                            var group = base_result.group;
                            var group_title = base_result.group_title;
                            //for registers
                            if(is_register == 1111){
                                is_readOnly = false;
                                is_mandatory = false;
                            }
                            if(group){
                                if(group_tracker.includes(group)){
                                    fieldset = live_group_tracker[group];
                                }else{
                                    fieldset = Ext.create('Ext.form.FieldSet', {
                                            xtype:'fieldset',
                                            columnWidth: 1,
                                            title: group_title,
                                            collapsible: true,
                                            layout: 'column',
                                            defaults: {
                                                allowBlank: false,
                                                labelAlign: 'top',
                                                columnWidth: 0.33,
                                                margin: 5,
                                            },
                                            items: []
                                        });
                                    live_group_tracker[group]= fieldset;
                                    group_tracker.push(group);
                                }
                            }else{
                                fieldset = me;
                            }
                            
                            if(is_mandatory == 1 ){
                                is_mandatory = false;
                            }else{
                                is_mandatory = true;
                            }
                            if(is_hidden == 1 ){
                                is_hidden = true;
                            }else{
                                is_hidden = false;
                            }
                            if( result[i].form_field_type_id == 6 ){
                                if(is_multiparent){
                                    if(is_readOnly == 1){
                                        var configs = {
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            hidden: is_hidden,
                                            columnWidth: column_width,
                                            total_children: total_children,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            readOnly: true,
                                            anyMatch: true,
                                            forceSelection: true,
                                            queryMode: 'local',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    // //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                           total_children = me.total_children;
                                                        //console.log(me);
                                                       for (var i = total_children - 1; i >= 0; i--) {
                                                        //console.log(me);
                                                          var child_combo = 'child_combo'+i,
                                                              bind_column = 'bind_column'+i,
                                                              store = form.down('combo[name='+me[child_combo]+']').getStore(),
                                                              filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
                                                              store.removeAll();
                                                              store.load({params:{filters:filters}});
                                                       }
                                                       // if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){
                                                            eval(me.other_logic);
                                                       }
                                                    // me.fireEvent('addListenerToConfig', me);
                                                }
                                               
                                            }
                                        };
                                    }else{
                                        var configs = {
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            hidden: is_hidden,
                                            total_children: total_children,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            anyMatch: true,
                                            columnWidth: column_width,
                                            other_logic: other_logic,
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            forceSelection: true,
                                            queryMode: 'local',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    // //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                           total_children = me.total_children;
                                                        //console.log(me);
                                                       for (var i = total_children - 1; i >= 0; i--) {
                                                        //console.log(me);
                                                          var child_combo = 'child_combo'+i,
                                                              bind_column = 'bind_column'+i,
                                                              store = form.down('combo[name='+me[child_combo]+']').getStore(),
                                                              filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
                                                              store.removeAll();
                                                              store.load({params:{filters:filters}});
                                                       }
                                                       // if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){

                                                            eval(me.other_logic);
                                                       }
                                                    // me.fireEvent('addListenerToConfig', me);
                                                }
                                               
                                            }
                                        };
                                    }
                                    
                                    for (var i = total_children - 1; i >= 0; i--) {
                                        var child_combo = 'child_combo'+i;
                                        var bind_column = 'bind_column'+i;
                                        configs[child_combo] = base_result[child_combo];
                                        configs[bind_column] = base_result[bind_column];
                                    }
                                     var field = Ext.create('Ext.form.ComboBox', configs);
                                }
                                else if(is_parent){
                                    if(is_readOnly==1){
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            child_combo: child_combo,
                                            bind_column: bind_column,
                                            anyMatch: true,
                                            hidden: is_hidden,
                                            columnWidth: column_width,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            readOnly: true,
                                            forceSelection: true,
                                            queryMode: 'local',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                        store = form.down('combo[name='+me.child_combo+']').getStore(),
                                                        filters = JSON.stringify({[me.bind_column]:newVal});
                                                        store.removeAll();
                                                        store.load({params:{filters:filters}});
                                                       //  if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){
                                                            eval(me.other_logic);
                                                       }
                                                }
                                               
                                            }
                                        });
                                    }else{
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            child_combo: child_combo,
                                            bind_column: bind_column,
                                            anyMatch: true,
                                            hidden: is_hidden,
                                            columnWidth: column_width,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            forceSelection: true,
                                            queryMode: 'local',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                        store = form.down('combo[name='+me.child_combo+']').getStore(),
                                                        filters = JSON.stringify({[me.bind_column]:newVal});
                                                        store.removeAll();
                                                        store.load({params:{filters:filters}});
                                                       //  if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                   }
                                                }
                                               
                                            }
                                        });
                                    }
                                    
                                 }else{
                                    if(is_readOnly == 1){
                                       var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            displayField: displayfield,
                                            anyMatch: true,
                                            hidden: is_hidden,
                                            columnWidth: column_width,
                                            forceSelection: true,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            queryMode: 'local',
                                            readOnly: true,
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    if(me.has_logic == 1){
                                                        // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                        //    var form = combo.up('form');
                                                        //     eval(combo.other_logic);
                                                        //  });
                                                        eval(me.other_logic);
                                                    }
                                                }
                                            }
                                        }); 
                                    }else{
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            displayField: displayfield,
                                            hidden: is_hidden,
                                            columnWidth: column_width,
                                            forceSelection: true,
                                            anyMatch: true,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            queryMode: 'local',
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    if(me.has_logic == 1){
                                                        // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                        //    var form = combo.up('form');
                                                        //     eval(combo.other_logic);
                                                        //  });
                                                        eval(me.other_logic);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }

                            }
                            //for filterable combo
                            else if( result[i].form_field_type_id == 9 ){
                                if(is_multiparent){
                                    if(is_readOnly == 1){
                                        var configs = {
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            hidden: is_hidden,
                                            anyMatch: true,
                                            pageSize: 100,
                                            columnWidth: column_width,
                                            total_children: total_children,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            readOnly: true,
                                            tpl: eval(tpl_block),
                                            forceSelection: false,
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 100,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    // //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                           total_children = me.total_children;
                                                        //console.log(me);
                                                       for (var i = total_children - 1; i >= 0; i--) {
                                                        //console.log(me);
                                                          var child_combo = 'child_combo'+i,
                                                              bind_column = 'bind_column'+i,
                                                              store = form.down('combo[name='+me[child_combo]+']').getStore(),
                                                              filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
                                                              store.removeAll();
                                                              store.load({params:{filters:filters}});
                                                       }
                                                       // if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){
                                                            eval(me.other_logic);
                                                       }
                                                    // me.fireEvent('addListenerToConfig', me);
                                                }
                                               
                                            },
                                            triggers: {
                                                refresh: {
                                                    weight: 1,
                                                    cls: 'x-fa fa-search',
                                                    handler: function () {
                                                        // this is the ComboBox
                                                        var filter = this.getValue();
                                                        this.mask();
                                                        this.getStore().reload({params:{comboFilter:filter}});
                                                        this.unmask();
                                                    }
                                                }

                                            }
                                        };
                                    }else{
                                        var configs = {
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            hidden: is_hidden,
                                            pageSize: 100,
                                            total_children: total_children,
                                            displayField: displayfield,
                                            anyMatch: true,
                                            has_logic: has_logic,
                                            columnWidth: column_width,
                                            tpl: eval(tpl_block),
                                            other_logic: other_logic,
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            forceSelection: false,
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 100,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    // //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                           total_children = me.total_children;
                                                        //console.log(me);
                                                       for (var i = total_children - 1; i >= 0; i--) {
                                                        //console.log(me);
                                                          var child_combo = 'child_combo'+i,
                                                              bind_column = 'bind_column'+i,
                                                              store = form.down('combo[name='+me[child_combo]+']').getStore(),
                                                              filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
                                                              store.removeAll();
                                                              store.load({params:{filters:filters}});
                                                       }
                                                       // if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){

                                                            eval(me.other_logic);
                                                       }
                                                    // me.fireEvent('addListenerToConfig', me);
                                                }
                                               
                                            },
                                            triggers: {
                                                refresh: {
                                                    weight: 1,
                                                    cls: 'x-fa fa-search',
                                                    handler: function () {
                                                        // this is the ComboBox
                                                        var filter = this.getValue();
                                                        this.mask();
                                                        this.getStore().reload({params:{comboFilter:filter}});
                                                        this.unmask();
                                                    }
                                                }

                                            }
                                        };
                                    }
                                    
                                    for (var i = total_children - 1; i >= 0; i--) {
                                        var child_combo = 'child_combo'+i;
                                        var bind_column = 'bind_column'+i;
                                        configs[child_combo] = base_result[child_combo];
                                        configs[bind_column] = base_result[bind_column];
                                    }
                                     var field = Ext.create('Ext.form.ComboBox', configs);
                                }
                                else if(is_parent){
                                    if(is_readOnly==1){
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            child_combo: child_combo,
                                            bind_column: bind_column,
                                            hidden: is_hidden,
                                            anyMatch: true,
                                            tpl: eval(tpl_block),
                                            pageSize: 100,
                                            columnWidth: column_width,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            readOnly: true,
                                            forceSelection: false,
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 100,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                        store = form.down('combo[name='+me.child_combo+']').getStore(),
                                                        filters = JSON.stringify({[me.bind_column]:newVal});
                                                        store.removeAll();
                                                        store.load({params:{filters:filters}});
                                                       //  if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){
                                                            eval(me.other_logic);
                                                       }
                                                }
                                               
                                            },
                                            triggers: {
                                                refresh: {
                                                    weight: 1,
                                                    cls: 'x-fa fa-search',
                                                    handler: function () {
                                                        // this is the ComboBox
                                                        var filter = this.getValue();
                                                        this.mask();
                                                        this.getStore().reload({params:{comboFilter:filter}});
                                                        this.unmask();
                                                    }
                                                }

                                            }
                                        });
                                    }else{
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            child_combo: child_combo,
                                            bind_column: bind_column,
                                            hidden: is_hidden,
                                            anyMatch: true,
                                            tpl: eval(tpl_block),
                                            pageSize: 100,
                                            columnWidth: column_width,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            forceSelection: false,
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 100,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                        store = form.down('combo[name='+me.child_combo+']').getStore(),
                                                        filters = JSON.stringify({[me.bind_column]:newVal});
                                                        store.removeAll();
                                                        store.load({params:{filters:filters}});
                                                       //  if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                   }
                                                }
                                               
                                            },
                                            triggers: {
                                                refresh: {
                                                    weight: 1,
                                                    cls: 'x-fa fa-search',
                                                    handler: function () {
                                                        // this is the ComboBox
                                                        var filter = this.getValue();
                                                        this.mask();
                                                        this.getStore().reload({params:{comboFilter:filter}});
                                                        this.unmask();
                                                    }
                                                }

                                            }
                                        });
                                    }
                                    
                                 }else{
                                    if(is_readOnly == 1){
                                       var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            displayField: displayfield,
                                            hidden: is_hidden,
                                            columnWidth: column_width,
                                            forceSelection: false,
                                            anyMatch: true,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            tpl: eval(tpl_block),
                                            pageSize: 100,
                                            queryMode: 'remote',
                                            readOnly: true,
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 100,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    if(me.has_logic == 1){
                                                        // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                        //    var form = combo.up('form');
                                                        //     eval(combo.other_logic);
                                                        //  });
                                                        eval(me.other_logic);
                                                    }
                                                }
                                            },
                                            triggers: {
                                                refresh: {
                                                    weight: 1,
                                                    cls: 'x-fa fa-search',
                                                    handler: function () {
                                                        // this is the ComboBox
                                                        var filter = this.getValue();
                                                        this.mask();
                                                        this.getStore().reload({params:{comboFilter:filter}});
                                                        this.unmask();
                                                    }
                                                }

                                            }
                                        }); 
                                    }else{
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            displayField: displayfield,
                                            hidden: is_hidden,
                                            anyMatch: true,
                                            tpl: eval(tpl_block),
                                            pageSize: 100,
                                            columnWidth: column_width,
                                            forceSelection: false,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            queryMode: 'remote',
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 100,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    if(me.has_logic == 1){
                                                        // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                        //    var form = combo.up('form');
                                                        //     eval(combo.other_logic);
                                                        //  });
                                                        eval(me.other_logic);
                                                    }
                                                }
                                            },
                                            triggers: {
                                                refresh: {
                                                    weight: 1,
                                                    cls: 'x-fa fa-search',
                                                    handler: function () {
                                                        // this is the ComboBox
                                                        var filter = this.getValue();
                                                        this.mask();
                                                        this.getStore().reload({params:{comboFilter:filter}});
                                                        this.unmask();
                                                    }
                                                }

                                            }
                                        });
                                    }
                                }

                            }
                            //for grid combo
                            else if(result[i].form_field_type_id == 7 ){
                                if(is_multiparent){
                                    if(is_readOnly==1){
                                        var configs = {
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            anyMatch: true,
                                            hidden: is_hidden,
                                            columnWidth: column_width,
                                            total_children: total_children,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            readOnly: true,
                                            pageSize: 20,
                                            // listConfig:{
                                            //     minWidth:400,
                                            //     loadingText: 'Searching...',
                                            //     emptyText: 'No match found.', 
                                            // },
                                            forceSelection: true,
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        // enablePaging:true,
                                                        // remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    // //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                           total_children = me.total_children;
                                                        //console.log(me);
                                                       for (var i = total_children - 1; i >= 0; i--) {

                                                          var child_combo = 'child_combo'+i,
                                                              bind_column = 'bind_column'+i,
                                                              store = form.down('combo[name='+me[child_combo]+']').getStore(),
                                                              filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
                                                              store.removeAll();
                                                              store.load({params:{filters:filters}});
                                                       }
                                                     });
                                                    if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                    // me.fireEvent('addListenerToConfig', me);
                                                }
                                               
                                            }
                                        };
                                    }else{
                                        var configs = {
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            anyMatch: true,
                                            hidden: is_hidden,
                                            total_children: total_children,
                                            columnWidth: column_width,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            pageSize: 20,
                                            // listConfig:{
                                            //     minWidth:400,
                                            //     loadingText: 'Searching...',
                                            //     emptyText: 'No match found.', 
                                            // },
                                            forceSelection: true,
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        // enablePaging:true,
                                                        // remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    // //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                           total_children = me.total_children;
                                                        //console.log(me);
                                                       for (var i = total_children - 1; i >= 0; i--) {

                                                          var child_combo = 'child_combo'+i,
                                                              bind_column = 'bind_column'+i,
                                                              store = form.down('combo[name='+me[child_combo]+']').getStore(),
                                                              filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
                                                              store.removeAll();
                                                              store.load({params:{filters:filters}});
                                                       }
                                                       // if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                     if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                    // me.fireEvent('addListenerToConfig', me);
                                                }
                                               
                                            }
                                        };
                                    }
                                    for (var i = total_children - 1; i >= 0; i--) {
                                        var child_combo = 'child_combo'+i;
                                        var bind_column = 'bind_column'+i;
                                        configs[child_combo] = base_result[child_combo];
                                        configs[bind_column] = base_result[bind_column];
                                    }
                                     var field = Ext.create('Ext.form.ComboBox', configs);
                                }
                                else if(is_parent){
                                    if(is_readOnly==1){
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            anyMatch: true,
                                            valueField: valuefield,
                                            child_combo: child_combo,
                                            bind_column: bind_column,
                                            columnWidth: column_width,
                                            hidden: is_hidden,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            readOnly: true,
                                            forceSelection: true,
                                            pageSize: 20,
                                            // listConfig:{
                                            //     minWidth:400,
                                            //     loadingText: 'Searching...',
                                            //     emptyText: 'No match found.', 
                                            // },
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        // enablePaging:true,
                                                        // remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                        store = form.down('combo[name='+me.child_combo+']').getStore(),
                                                        filters = JSON.stringify({[me.bind_column]:newVal});
                                                        store.removeAll();
                                                        store.load({params:{filters:filters}});
                                                       //  if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                     if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                }
                                               
                                            }
                                        });
                                    }else{
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            child_combo: child_combo,
                                            bind_column: bind_column,
                                            anyMatch: true,
                                            hidden: is_hidden,
                                            columnWidth: column_width,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            forceSelection: true,
                                            pageSize: 20,
                                            // listConfig:{
                                            //     minWidth:400,
                                            //     loadingText: 'Searching...',
                                            //     emptyText: 'No match found.', 
                                            // },
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        // enablePaging:true,
                                                        // remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                        store = form.down('combo[name='+me.child_combo+']').getStore(),
                                                        filters = JSON.stringify({[me.bind_column]:newVal});
                                                        store.removeAll();
                                                        store.load({params:{filters:filters}});
                                                       //  if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                     if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                }
                                               
                                            }
                                        });
                                    }
                                 }else{
                                    if(is_readOnly==1){
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            displayField: displayfield,
                                            anyMatch: true,
                                            hidden: is_hidden,
                                            forceSelection: true,
                                            columnWidth: column_width,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            pageSize: 20,
                                            // listConfig:{
                                            //     minWidth:400,
                                            //     loadingText: 'Searching...',
                                            //     emptyText: 'No match found.', 
                                            // },
                                            queryMode: 'remote',
                                            readOnly: true,
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        // enablePaging:true,
                                                        // remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    // if(me.has_logic == 1){
                                                    //     me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                    //        var form = combo.up('form');
                                                    //         eval(combo.other_logic);
                                                    //      });
                                                    // }
                                                     if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                }
                                            }
                                        });
                                    }else{
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            displayField: displayfield,
                                            anyMatch: true,
                                            hidden: is_hidden,
                                            forceSelection: true,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            columnWidth: column_width,
                                            pageSize: 20,
                                            // listConfig:{
                                            //     minWidth:400,
                                            //     loadingText: 'Searching...',
                                            //     emptyText: 'No match found.', 
                                            // },
                                            queryMode: 'remote',
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        // enablePaging:true,
                                                        // remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    // if(me.has_logic == 1){
                                                    //     me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                    //        var form = combo.up('form');
                                                    //         eval(combo.other_logic);
                                                    //      });
                                                    // }
                                                     if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    
                                }

                            }
                            //other fields
                            else if(result[i].form_field_type_id == 8){
                                if(is_readOnly==1){
                                    var field = Ext.create('Ext.form.'+xtype,{
                                        layout: 'column',
                                        // name: field_name,
                                        fieldLabel: label,
                                        columnWidth: column_width,
                                        // hidden: is_hidden,
                                        // allowBlank: is_mandatory,
                                        readOnly: true,
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                name: field_name,
                                                columnWidth: 0.9,
                                                allowBlank: is_mandatory
                                            },{
                                                xtype: 'hiddenfield',
                                                name: formfield,
                                                columnWidth: 0.9,
                                                allowBlank: false
                                            },
                                            {
                                                xtype: 'button',
                                                iconCls: 'x-fa fa-search',
                                                columnWidth: 0.1,
                                                tooltip: 'Click to search',
                                                action: 'link_personnel',
                                                winTitle: 'Search Details',
                                                disabled: true,
                                                table_name: table,
                                                def_id: def_id,
                                                handler: function(btn){
                                                    var panel = btn.up('panel'),
                                                        ctr =  Ext.getApplication().getController("DashboardCtr");
                                                    Ext.getBody().mask('Loading List');
                                                     ctr.fireEvent("showDynamicSelectionList", btn);
                                                },//'showDynamicSelectionList',
                                                winWidth: '70%'
                                            }
                                        ]
                                    }); 
                                }else{
                                    var field = Ext.create('Ext.form.'+xtype,{
                                        layout: 'column',
                                        // name: field_name,
                                        fieldLabel: label,
                                        columnWidth: column_width,
                                        // hidden: is_hidden,
                                        // allowBlank: is_mandatory,
                                        // readOnly: is_readOnly,
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                name: displayfield,
                                                columnWidth: 0.9,
                                                readOnly: true,
                                                allowBlank: is_mandatory
                                            },{
                                                xtype: 'hiddenfield',
                                                name: formfield,
                                                columnWidth: 0.9,
                                                allowBlank: false
                                            },
                                            {
                                                xtype: 'button',
                                                iconCls: 'x-fa fa-search',
                                                columnWidth: 0.1,
                                                tooltip: 'Click to search',
                                                action: 'link_personnel',
                                                valuefield: valuefield,
                                                displayfield: displayfield,
                                                formfield: formfield,
                                                table_name: table,
                                                winTitle: 'Search Details',
                                                def_id: def_id,
                                                bind: {
                                                    hidden: '{isReadOnly}'
                                                },
                                                handler: function(btn){
                                                    var panel = btn.up('panel'),
                                                        ctr =  Ext.getApplication().getController("DashboardCtr");
                                                    Ext.getBody().mask('Loading List');
                                                    ctr.fireEvent("showDynamicSelectionList", btn);
                                                },
                                                // handler: 'showDynamicSelectionList',
                                                winWidth: '70%'
                                            }
                                        ]
                                    }); 
                                }
                                
                            }
                            else if(result[i].form_field_type_id == 5){
                               if(is_readOnly==1){

                                    var field = Ext.create('Ext.form.'+xtype,{
                                        name: field_name,
                                        fieldLabel: label,
                                        format:'Y-m-d',
                                        altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00',
                                        hidden: is_hidden,
                                        columnWidth: column_width,
                                        allowBlank: is_mandatory,
                                        readOnly: true
                                    }); 
                                }else{
                                    var field = Ext.create('Ext.form.'+xtype,{
                                        name: field_name,
                                        fieldLabel: label,
                                        format:'Y-m-d',
                                        altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00',
                                        hidden: is_hidden,
                                        columnWidth: column_width,
                                        allowBlank: is_mandatory,
                                        bind: {
                                            readOnly: '{isReadOnly}' 
                                        }
                                    });
                                } 
                            }
                            else{
                                if(is_readOnly==1){

                                    var field = Ext.create('Ext.form.'+xtype,{
                                        name: field_name,
                                        fieldLabel: label,
                                        hidden: is_hidden,
                                        columnWidth: column_width,
                                        allowBlank: is_mandatory,
                                        readOnly: true
                                    }); 
                                }else{
                                    var field = Ext.create('Ext.form.'+xtype,{
                                        name: field_name,
                                        fieldLabel: label,
                                        hidden: is_hidden,
                                        columnWidth: column_width,
                                        allowBlank: is_mandatory,
                                        bind: {
                                            readOnly: '{isReadOnly}' 
                                        }
                                    });
                                }
                                  
                            }
                            fieldset.insert(start_index,field);
                        }
                        // console.log(live_group_tracker);
                        //insert fieldsets
                        for (const key in live_group_tracker) {
                            const grouper = live_group_tracker[key];
                            me.add(1, grouper);
                            
                        }
                        var found = false;
                        if(me.up().up().getViewModel()){
                            var vmodel = me.up().up().getViewModel();
                                model = vmodel.get('model');
                                if(!Ext.Object.isEmpty(model)){
                                    me.loadRecord(model);
                                    found = true;
                                }
                        }
                        if(!found && activeTab.getViewModel()){
                            var vmodel = activeTab.getViewModel();
                            model = vmodel.get('model');
                            if(!Ext.Object.isEmpty(model)){
                                me.loadRecord(model);
                            }
                        }
                        if(module_id == 2){
                          //  me.down('combo[name=premise_type_id]').setValue(premise_type_id);
                        }else{
                           // me.down('combo[name=prodclass_category_id]').setValue(prodclass_category_id);
                        }
                        
                        
                        if(me.down('combo[name=section_id]')){
                            me.down('combo[name=section_id]').setValue(section_id);
                        }
                        
                        
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    btn.setLoading(false);
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    btn.setLoading(false);
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        
    },
    showRMUApplicationMoreDetailsGeneric:function (application_code,details_panel,isReadOnly,ref_no) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(!ref_no){
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue();
            }
            is_dataammendment_request =0;

        var me = this,
            details_panel = Ext.widget(details_panel);
            // details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'rmu/getRMUApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    rmu_details = resp.rmu_details;
                if (success == true || success === true) {
                    mir_form = details_panel.down('form');
                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (rmu_details) {
                        var model2 = Ext.create('Ext.data.Model', rmu_details);
                        mir_form.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                    }

                    if (isReadOnly == 1) {

                        details_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        details_panel.getViewModel().set('isReadOnly', false);

                    }

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showMirApplicationMoreDetailsGeneric: function (application_code,details_panel,isReadOnly,ref_no) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(!ref_no){
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue();
            }
            is_dataammendment_request =0;
        var me = this,
            details_panel = Ext.widget(details_panel);

        // details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'mir/getMirApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    // applicantDetails = resp.applicant_details,
                    mir_details = resp.mir_details;
                if (success == true || success === true) {
                    mir_form = details_panel.down('form');
                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (mir_details) {
                        var model2 = Ext.create('Ext.data.Model', mir_details);
                        mir_form.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                    }

                    if (isReadOnly == 1) {

                        details_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        details_panel.getViewModel().set('isReadOnly', false);

                    }

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showEnforcementApplicationMoreDetailsGeneric: function (application_code,details_panel,module_id, sub_module_id,section_id,isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            ref_no = activeTab.down('displayfield[name=tracking_no]').getValue(),
            is_dataammendment_request =0;
        var me = this,
            details_panel = Ext.widget(details_panel);
            details_panel.down('hiddenfield[name=module_id]').setValue(module_id);
            details_panel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'enforcement/getEnforcementApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    // applicantDetails = resp.applicant_details,
                    enforcement_details = resp.enforcement_details;
                    investigation_details = resp.investigation_details;
                    joint_Operation_details = resp.joint_Operation_details;
                if (success == true || success === true) {
                    complainant_form = details_panel.down('complainantfrm');
                    suspect_info = details_panel.down('suspectinforFrm');
                    jointOperationsWorkPlanFrm =details_panel.down('jointOperationsWorkPlanFrm');
                    //suspectedoffencegrid = details_panel.down('suspectedoffencegrid');
                  
                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (enforcement_details) {
                        var model1 = Ext.create('Ext.data.Model', enforcement_details);
                        complainant_form.loadRecord(model1);
                        suspect_info.loadRecord(model1);
                        details_panel.getViewModel().set('model', model1);
                    }
                    if (investigation_details) {
                        var model2 = Ext.create('Ext.data.Model', investigation_details);
                        complainant_form.loadRecord(model2);
                        suspect_info.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                    }
                    if (joint_Operation_details) {
                        var model3 = Ext.create('Ext.data.Model', joint_Operation_details);
                        jointOperationsWorkPlanFrm.loadRecord(model3);
                        details_panel.getViewModel().set('model', model3);
                    }

                    if (isReadOnly == 1) {

                        details_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        details_panel.getViewModel().set('isReadOnly', false);

                    }

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showMonitoringApplicationMoreDetailsGeneric: function (application_code,details_panel,module_id, sub_module_id,section_id,isReadOnly,ref_no) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(!ref_no){
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue();
            }
            is_dataammendment_request =0;
        var me = this,
            details_panel = Ext.widget('monitoringDetailsPnl');
            productscreeninggrid =Ext.widget('productscreeninggrid');
            details_panel.down('hiddenfield[name=module_id]').setValue(module_id);
            details_panel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        productscreeninggrid.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'enforcement/getMonitoringApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    enforcement_details = resp.enforcement_details;
                    // console.log(enforcement_details);
                if (success == true || success === true) {
                    licenseInformationFrm = details_panel.down('licenseInformationFrm');
                    complianceinformationtabPnl = details_panel.down('complianceinformationtabPnl');

                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (enforcement_details) {
                        var model2 = Ext.create('Ext.data.Model', enforcement_details);
                        licenseInformationFrm.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                        // details_panel.getViewModel().set('isReadOnly', true);
                    }

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showPvApplicationMoreDetailsGeneric: function (application_code,details_panel,isReadOnly,ref_no) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(!ref_no){
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue();
            }
            is_dataammendment_request =0;
       
        var me = this,
            details_panel = Ext.widget(details_panel);

        // details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'pv/getPvApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    // applicantDetails = resp.applicant_details,
                    pv_details = resp.pv_details;
                if (success == true || success === true) {
                    mir_form = details_panel.down('form');
                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (pv_details) {
                        var model2 = Ext.create('Ext.data.Model', pv_details);
                        mir_form.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                    }

                    if (isReadOnly == 1) {

                        details_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        details_panel.getViewModel().set('isReadOnly', false);

                    }

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showManagerApplicationMeetingSubmissionWinGeneric: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            gridXtype = btn.gridXtype,
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = this.validateApplicationTcMeetingDetails(btn),
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagersgenericfrm', winWidth, storeID,'',gridXtype);
        } else {

            toastr.error('Enter meeting Details to proceed!!', 'Failure Response');
            Ext.getBody().unmask();
        }
    },
    validateApplicationTcMeetingDetails: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            frm = activeTab.down('form'),
            form = frm.getForm(),
            valid = true;

        if (!form.isValid()) {
            valid = false;
        }
        var meeting_id = frm.down('hiddenfield[name=id]').getValue();
        if (meeting_id == '') {
            valid = false;
        }
        return valid;
    },
    showClinicalTrialApplicationMoreDetailsGeneric: function (application_id, application_code, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            wizardPnl = Ext.widget('clinicaltrialappmoredetailswizard'),
            applicantFrm =wizardPnl.down('clinicaltrialapplicantdetailsfrm'),
            detailsFrm = wizardPnl.down('clinicaltrialdetailsfrm'),
            sponsorFrm = wizardPnl.down('clinicaltrialsponsorfrm'),
            investigatorFrm = wizardPnl.down('clinicaltrialltrfrm'),
            // clinicalparticipantsfrm = wizardPnl.down('clinicalparticipantsfrm'),
            //otherDetailsFrm = wizardPnl.down('clinicaltrialotherdetailsfrm'),
            studySitesGrid = wizardPnl.down('clinicaltrialstudysitesgrid'),
            impProductsGrid = wizardPnl.down('impproductsgrid'),
            investigatorsWinGrid = wizardPnl.down('clinicaltrialotherinvestigatorsgrid'),
            clinicaltrialotherformdetailsfrm = wizardPnl.down('clinicaltrialotherformdetailsfrm'),
            previewproductDocUploadsGrid = wizardPnl.down('previewproductDocUploadsGrid');
        if(wizardPnl.down('previewproductDocUploadsGrid')){
            previewproductDocUploadsGrid.setController('productregistrationvctr');

            previewproductDocUploadsGrid.down('hiddenfield[name=process_id]').setValue(process_id);
            previewproductDocUploadsGrid.down('hiddenfield[name=section_id]').setValue(section_id);
            previewproductDocUploadsGrid.down('hiddenfield[name=module_id]').setValue(module_id);
            previewproductDocUploadsGrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            previewproductDocUploadsGrid.down('hiddenfield[name=application_code]').setValue(application_code);

        }

        wizardPnl.setHeight(500);
        applicantFrm.down('button[name=link_applicant]').setDisabled(true);
        wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
        if(workflow_stage_id){
            wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        } else{

        }
        wizardPnl.down('hiddenfield[name=application_id]').setValue(application_id);
        wizardPnl.down('hiddenfield[name=application_code]').setValue(application_code);
        wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
        detailsFrm.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        sponsorFrm.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        investigatorFrm.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        studySitesGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        impProductsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        investigatorsWinGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
            wizardPnl.down('button[name=save_clinicaltrial_details_btn]').setVisible(false);
        }


        Ext.Ajax.request({
            method: 'GET',
            url: 'clinicaltrial/getClinicalTrialApplicationMoreDetails',
            params: {
                application_id: application_id,
                applicant_id: applicant_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    applicantDetails = resp.applicant_details,
                    appDetails = resp.app_details,
                    sponsorDetails = resp.sponsor_details,
                    participants_data = resp.participants_data,
                    investigatorDetails = resp.investigator_details;
                if (success == true || success === true) {
                    if (applicantDetails) {
                        var model1 = Ext.create('Ext.data.Model', applicantDetails);
                        applicantFrm.loadRecord(model1);
                    }
                    if (appDetails) {
                        var model2 = Ext.create('Ext.data.Model', appDetails);
                        detailsFrm.loadRecord(model2);
                        clinicaltrialotherformdetailsfrm.loadRecord(model2);
                    }
                    if (sponsorDetails) {
                        var model3 = Ext.create('Ext.data.Model', sponsorDetails);
                        sponsorFrm.loadRecord(model3);
                    }
                    if (investigatorDetails) {
                        var model4 = Ext.create('Ext.data.Model', investigatorDetails);
                        investigatorFrm.loadRecord(model4);
                    }
                    // if (participants_data) {
                    //     var participants_data = Ext.create('Ext.data.Model', participants_data);
                    //     clinicalparticipantsfrm.loadRecord(participants_data);
                    // }
                    if(wizardPnl.getViewModel()){
                        wizardPnl.getViewModel().set('isReadOnly', isReadOnly);
                    }
                    funcShowCustomizableWindow(ref_no, '85%', wizardPnl, 'customizablewindow');
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    refreshCtrvariationrequestsgrid: function (me) {

        var store = me.store,
            table_name=me.table_name,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id,
            application_code,
            filters,
            grid = me;
        if(me.up('grid')){
            grid =me.up('grid');
        }
        if(grid.up('window')){
            if(grid.down('hiddenfield[name=application_id]')){
                // console.log('fff1');
                application_id = grid.down('hiddenfield[name=application_id]').getValue();
                application_code = grid.down('hiddenfield[name=application_code]').getValue();
                filters = JSON.stringify({application_code: application_code});
            }
            else{
                application_code = (activeTab.down('hiddenfield[name=active_application_code]')) ? activeTab.down('hiddenfield[name=active_application_code]').getValue() : null;
                // application_id = grid.down('hiddenfield[name=application_id]').getValue();
                // application_code = grid.down('hiddenfield[name=application_code]').getValue();
                filters = JSON.stringify({application_code: application_code});
            }
            
        }
        else{
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            filters = JSON.stringify({application_code: application_code});
        }

        store.getProxy().extraParams = {
            filters: filters,
            application_id: application_id,
            table_name:table_name,
            application_code: application_code
        };

    },
    refreshCtrvariationEthicsrequestsgrid: function (me) {

        var store = me.store,
            table_name=me.table_name,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id,
            application_code,
            filters,
            grid = me;
        if(me.up('grid')){
            grid =me.up('grid');
        }
        if(grid.up('window')){
            if(grid.down('hiddenfield[name=application_id]')){
                application_id = grid.down('hiddenfield[name=application_id]').getValue();
                application_code = grid.down('hiddenfield[name=application_code]').getValue();
                filters = JSON.stringify({application_id: application_id});
            }
            else{
                application_id = (activeTab.down('hiddenfield[name=active_application_id]')) ? activeTab.down('hiddenfield[name=active_application_id]').getValue() : null;
                // application_id = grid.down('hiddenfield[name=application_id]').getValue();
                // application_code = grid.down('hiddenfield[name=application_code]').getValue();
                filters = JSON.stringify({application_id: application_id});
            }
            
        }
        else{
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            filters = JSON.stringify({application_id: application_id});
        }

        store.getProxy().extraParams = {
            filters: filters,
            application_id: application_id,
            table_name:table_name,
            application_code: application_code
        };

    },
    refreshApplicationAmmendementrequestsgrid: function (me) {

        var store = me.store,
            grid = me.up('grid'),
            application_code = grid.down('hiddenfield[name=application_code]').getValue(),
            appdata_ammendementrequest_id = grid.down('hiddenfield[name=appdata_ammendementrequest_id]').getValue(),
            application_id = grid.down('hiddenfield[name=application_id]').getValue();

        store.getProxy().extraParams = {
            application_id: application_id,
            application_code: application_code,
            appdata_ammendementrequest_id:appdata_ammendementrequest_id
        };

    },
    showPremiseApplicationMoreDetailsGeneric: function (application_id, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, active_application_code=null,premise_type_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            wizardPnl = Ext.widget('premiseappmoredetailswizard'),
            applicantPanel = wizardPnl.down('premiseapplicantpnl'),
            applicantFrm = applicantPanel.down('applicantdetailsfrm'),
            premiseFrm = wizardPnl.down('premisedetailsfrm'),
            contactFrm = wizardPnl.down('premisecontactpersonfrm'),
            personnelGrid = wizardPnl.down('premisepersonneldetailsgrid'),
            premiseproprietorsdetailsgrid = wizardPnl.down('premiseproprietorsdetailsgrid'),
            otherDetailsGrid = wizardPnl.down('premiseotherdetailswingrid');

        wizardPnl.setHeight(500);
        wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
        if(workflow_stage_id){
            wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        }else{

        }
        wizardPnl.down('hiddenfield[name=application_id]').setValue(application_id);
        wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
        if(premise_type_id){
            wizardPnl.down('hiddenfield[name=premise_type_id]').setValue(premise_type_id);
        }else{

        }
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
        }
        wizardPnl.down('combo[name=branch_id]').setReadOnly(true);
        wizardPnl.down('combo[name=application_region_id]').setReadOnly(true);
        personnelGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        premiseproprietorsdetailsgrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        //otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        premiseFrm.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        // applicantFrm.down('button[action=link_applicant]').setDisabled(true);
        // premiseFrm.down('button[name=hospital_facilitybutton]').setDisabled(true);
        contactFrm.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        personnelGrid.setIsWin(1);
        premiseproprietorsdetailsgrid.setIsWin(1);
        Ext.Ajax.request({
            method: 'GET',
            url: 'premiseregistration/getPremApplicationMoreDetails',
            params: {
                application_id: application_id,
                //premise_id: premise_id,
                applicant_id: applicant_id,
                application_code : active_application_code
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    applicantDetails = resp.applicant_details,
                    premiseDetails = resp.premise_details,
                    contactDetails = resp.contact_details;
                if (success == true || success === true) {
                    if(wizardPnl.down('hiddenfield[name=premise_type_id]')){
                        wizardPnl.down('hiddenfield[name=premise_type_id]').setValue(premiseDetails.premise_type_id);
                        // console.log('here');
                    }
                    if (applicantDetails) {
                        var model1 = Ext.create('Ext.data.Model', applicantDetails);
                        applicantFrm.loadRecord(model1);
                    }
                    if (premiseDetails) {
                        var model2 = Ext.create('Ext.data.Model', premiseDetails);
                        premiseFrm.loadRecord(model2);
                        //hold details for rendering load
                        wizardPnl.getViewModel().set('model', model2);
                    }
                    if (contactDetails) {
                        var model3 = Ext.create('Ext.data.Model', contactDetails);
                        contactFrm.loadRecord(model3);
                    }
                    funcShowCustomizableWindow(ref_no, '85%', wizardPnl, 'customizablewindow');
                    if (sub_module_id == 2 || sub_module_id === 2) {
                        if (isReadOnly < 1) {
                            
                            //personnelDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
                           // otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
                            me.fireEvent('formAuth', process_id, 1, premiseFrm);
                            me.fireEvent('otherPartsAuth', process_id, wizardPnl);
                        }
                    }
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    loadMeetingInterface: function(rec){
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = Ext.widget('viewscheduledtcMeetingpnl'),
            module_id = rec.get('module_id'),
            application_code = rec.get('application_code'),
            section_id = rec.get('section_id'),
            sub_module_id = rec.get('sub_module_id'),
            meeting_id = rec.get('meeting_id'),
            meetingDetailsFrm = activeTab.down('form'),
            viewscheduledtcmeetingapplications = activeTab.down('panel[name=viewscheduledtcmeetingapplications]');

        activeTab.down('hiddenfield[name=active_application_id]').setValue(rec.get('application_id'));
        activeTab.down('hiddenfield[name=active_application_code]').setValue(rec.get('application_code'));
        activeTab.down('hiddenfield[name=process_id]').setValue(rec.get('process_id'));
        activeTab.down('hiddenfield[name=workflow_stage_id]').setValue(rec.get('workflow_stage_id'));
        activeTab.down('hiddenfield[name=application_status_id]').setValue(rec.get('application_status_id'));
        activeTab.down('hiddenfield[name=module_id]').setValue(rec.get('module_id'));
        activeTab.down('hiddenfield[name=sub_module_id]').setValue(rec.get('sub_module_id'));
        activeTab.down('hiddenfield[name=section_id]').setValue(rec.get('section_id'));
        activeTab.down('displayfield[name=process_name]').setValue(rec.get('process_name'));
        activeTab.down('hiddenfield[name=meeting_id]').setValue(rec.get('meeting_id'));
        activeTab.down('hiddenfield[name=prodclass_category_id]').setValue(rec.get('prodclass_category_id'));
        // activeTab.down('displayfield[name=workflow_stage]').rec.get('setValue'(workflow_stage);
        // activeTab.down('displayfield[name=application_status]').setValue(application_status);
        // activeTab.down('displayfield[name=tracking_no]').setValue(tracking_no);
        // activeTab.down('displayfield[name=reference_no]').setValue(reference_no);
        
         if(module_id == 1){

            var tc_meetingpnlgrid = 'viewScheduledMeetingApplicationListGrid';

        }else if(module_id == 2){

            var tc_meetingpnlgrid = 'premiseReviewTCMeetingGrid';

        }else if(module_id == 3){

            var tc_meetingpnlgrid = '';
        }else if(module_id == 5){

            var tc_meetingpnlgrid = '';
        }else if(module_id == 7){

            var tc_meetingpnlgrid = '';
        }

         //meeting details 
                Ext.Ajax.request({
                    method: 'GET',
                    url: 'productregistration/prepareProductsRegMeetingStage',
                    params: {
                        meeting_id: meeting_id,
                        module_id: module_id
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success,
                            results = resp.results;
                        if (success == true || success === true) {
                            if (results) {
                                var model = Ext.create('Ext.data.Model', results);
                                meetingDetailsFrm.getViewModel().set('isReadOnly', true);
                                meetingDetailsFrm.loadRecord(model);
                            }
                            viewscheduledtcmeetingapplications.add({xtype:tc_meetingpnlgrid});                            
                            //funcShowCustomizableWindow(winTitle, winWidth, childXtype, 'customizablewindow');
                             mainTabPanel.add(activeTab);
                             mainTabPanel.setActiveTab(activeTab);
                            //applicationsStore.load();
                           // participantsStore.load();
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });        
    },
    setSelectedGridRecToTab: function(rec){
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        //general
        activeTab.down('hiddenfield[name=active_application_id]').setValue(rec.get('application_id'));
        activeTab.down('hiddenfield[name=active_application_code]').setValue(rec.get('application_code'));
        activeTab.down('hiddenfield[name=process_id]').setValue(rec.get('process_id'));
        activeTab.down('hiddenfield[name=workflow_stage_id]').setValue(rec.get('workflow_stage_id'));
        activeTab.down('hiddenfield[name=application_status_id]').setValue(rec.get('application_status_id'));
        activeTab.down('hiddenfield[name=module_id]').setValue(rec.get('module_id'));
        activeTab.down('hiddenfield[name=sub_module_id]').setValue(rec.get('sub_module_id'));
        activeTab.down('hiddenfield[name=section_id]').setValue(rec.get('section_id'));
        activeTab.down('displayfield[name=process_name]').setValue(rec.get('process_name'));
        activeTab.down('displayfield[name=workflow_stage]').setValue(rec.get('workflow_stage'));
        activeTab.down('displayfield[name=application_status]').setValue(rec.get('application_status'));
        activeTab.down('displayfield[name=tracking_no]').setValue(rec.get('tracking_no'));
        activeTab.down('displayfield[name=reference_no]').setValue(rec.get('reference_no'));

        // specifics
        if(activeTab.down('hiddenfield[name=meeting_id]')){
            activeTab.down('hiddenfield[name=meeting_id]').setValue(rec.get('meeting_id'));
        }
        if(activeTab.down('hiddenfield[name=prodclass_category_id]')){
            activeTab.down('hiddenfield[name=prodclass_category_id]').setValue(rec.get('prodclass_category_id'));
        }

    },
     viewVariationChangeInteface: function(btn) {
        var grid = btn.up('grid'),
            sm = grid.getSelectionModel(),
            panel = grid.up('panel'),
            thisController = this,
            viewContainer = panel.down('variationAltPnl'),
            form = viewContainer.down('form'),
            tabpanel = viewContainer.down('tabpanel'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            records = sm.getSelection();

        if (!sm.hasSelection()) {
            toastr.warning('Please select a change item!!', 'Warning Response');
            return;
        }
        //lock button
        btn.setLoading(true);
        form.mask('Loading ...');
        //remove current entries
        form.removeAll();
        tabpanel.removeAll();
        //get record 
        Ext.Ajax.request({
            url: 'premiseregistration/getPremisevariationDetails',
            params: {
                application_code: application_code,
                module_id: module_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                    results = resp.results;
                if (success == true || success === true) {
                    var model = Ext.create('Ext.data.Model', results);
                    Ext.each(records, function (record) {
                        var is_field = record.get('is_field'),
                            stage_category_id = record.get('stage_category_id');
                        if(stage_category_id == 15){
                                hide = false;
                            }else{
                                hide = true;
                            }
                        if(is_field){
                            var xtype = record.get('xtype'),
                                field_name = record.get('field_name'),
                                label = record.get('label'),
                                is_hidden = record.get('is_hidden'),
                                column_width = record.get('column_width'),
                                table = record.get('combo_table'),
                                def_id = record.get('def_id'),
                                formfield = record.get('formfield'),
                                displayfield = record.get('displayfield'),
                                valuefield = record.get('valuefield'),
                                valuefield = record.get('valuefield'),
                                is_mandatory = record.get('is_mandatory'),
                                field_id = record.get('field_id'),
                                variation_type_id = record.get('variation_type_id'),
                                stage_category_id = record.get('stage_category_id'),
                                decision_id = record.get('decision_id'),
                                approval_id = record.get('approval_id'),
                                remarks = record.get('remarks'),
                                field_type = record.get('form_field_type_id');
                            
                            if(field_type == 6 || field_type == 7){
                                var configs = {
                                    name: field_name,
                                    fieldLabel: label,
                                    allowBlank: is_mandatory,
                                    valueField: valuefield,
                                    hidden: is_hidden,
                                    field_id: field_id,
                                    variation_type_id: variation_type_id,
                                    columnWidth: column_width,
                                    displayField: displayfield,
                                    // pageSize: 100,
                                    // listConfig:{
                                    //     minWidth:400,
                                    //     loadingText: 'Searching...',
                                    //     emptyText: 'No match found.', 
                                    // },
                                    forceSelection: true,
                                    queryMode: 'local',
                                    listeners: {
                                        beforerender: {
                                            fn: 'setCompStore',
                                            config: {
                                                // enablePaging:true,
                                                // remoteFilter: true,
                                                pageSize: 100,
                                                proxy: {
                                                    extraParams: {
                                                        table_name: table
                                                    }
                                                }
                                            },
                                            isLoad: true
                                        }
                                       
                                    }
                                }
                                var field = Ext.create('Ext.form.ComboBox', configs);
                                //change for current
                                configs.name = 'cur_'+field_name;
                                var cur_field = Ext.create('Ext.form.ComboBox', configs);
                            }
                            else if(field_type == 8){
                                var field = Ext.create('Ext.form.'+xtype,{
                                    layout: 'column',
                                    // name: field_name,
                                    fieldLabel: label,
                                    field_id: field_id,
                                    variation_type_id: variation_type_id,
                                    columnWidth: column_width,
                                    // hidden: is_hidden,
                                    // allowBlank: is_mandatory,
                                    // readOnly: is_readOnly,
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            name: displayfield,
                                            columnWidth: 0.9,
                                            disabled: true,
                                            allowBlank: is_mandatory
                                        },{
                                            xtype: 'hiddenfield',
                                            name: formfield,
                                            columnWidth: 0.9,
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'x-fa fa-search',
                                            columnWidth: 0.1,
                                            tooltip: 'Click to search',
                                            action: 'link_personnel',
                                            valuefield: valuefield,
                                            displayfield: displayfield,
                                            formfield: formfield,
                                            table_name: table,
                                            winTitle: 'Search Details',
                                            def_id: def_id,
                                            bind: {
                                                hidden: '{isReadOnly}'
                                            },
                                            handler: function(btn){
                                                var panel = btn.up('panel'),
                                                    ctr =  Ext.getApplication().getController("DashboardCtr");
                                                Ext.getBody().mask('Loading List');
                                                ctr.fireEvent("showDynamicSelectionList", btn);
                                            },
                                            // handler: 'showDynamicSelectionList',
                                            winWidth: '70%'
                                        }
                                    ]
                                });
                                var cur_field = field;
                            }
                            else if(field_type == 9){
                                var configs = {
                                    name: field_name,
                                    fieldLabel: label,
                                    allowBlank: is_mandatory,
                                    valueField: valuefield,
                                    pageSize: 100,
                                    field_id: field_id,
                                    variation_type_id: variation_type_id,
                                    columnWidth: column_width,
                                    displayField: displayfield,
                                    forceSelection: false,
                                    queryMode: 'local',
                                    listeners: {
                                        beforerender: {
                                            fn: 'setCompStore',
                                            config: {
                                                pageSize: 100,
                                                proxy: {
                                                    extraParams: {
                                                        table_name: table
                                                    }
                                                }
                                            },
                                            isLoad: true
                                        }
                                    },
                                    triggers: {
                                        refresh: {
                                            weight: 1,
                                            cls: 'x-fa fa-search',
                                            handler: function () {
                                                // this is the ComboBox
                                                var filter = this.getValue();
                                                this.mask();
                                                this.getStore().reload({params:{comboFilter:filter}});
                                                this.unmask();
                                            }
                                        }

                                    }
                                }
                            var field = Ext.create('Ext.form.ComboBox', configs);
                            //change for current
                                configs.name = 'cur_'+field_name;
                                var cur_field = Ext.create('Ext.form.ComboBox', configs);
                        }
                        else{//create from record
                            var field = Ext.create('Ext.form.'+xtype,{
                                    name: field_name,
                                    fieldLabel: label,
                                    field_id: field_id,
                                    variation_type_id: variation_type_id,
                                    columnWidth: column_width,
                                    allowBlank: is_mandatory
                                });
                            var cur_field = Ext.create('Ext.form.'+xtype,{
                                    name: 'cur_'+field_name,
                                    fieldLabel: label,
                                    field_id: field_id,
                                    variation_type_id: variation_type_id,
                                    columnWidth: column_width,
                                    allowBlank: is_mandatory
                                });
                            }
                            
                        //create temp field set to hold the field
                        var me = Ext.create('Ext.form.FieldSet', {
                                xtype:'fieldset',
                                columnWidth: 1,
                                name: field_name,
                                field_id: field_id,
                                variation_type_id: variation_type_id,
                                title: 'Changes to '+label,
                                collapsible: true,
                                layout: 'form',
                                defaults: {
                                    labelAlign: 'top',
                                    allowBlank: false,
                                    labelAlign: 'top',
                                    columnWidth: 0.5,
                                    margin: 5,
                                },
                                items: []
                            });
                            var apprvBtn = Ext.create('Ext.button.Button', {
                                text: (decision_id == 1) ? 'Change Approved' : (decision_id==2) ? 'Change Rejected': 'Approve Change',
                                ui: (decision_id == 2) ? 'soft-red': (decision_id==1) ? 'green': 'soft-blue',
                                hidden: hide,
                                approval_id: approval_id,
                                remarks: remarks,
                                decision_id: decision_id,
                                variation_type_id: variation_type_id,
                                field_id: field_id,
                                iconCls: (decision_id == 1) ? 'fa fa-check' : (decision_id==2) ? 'fa fa-window-close': 'fa fa-check-square',
                                handler: (decision_id == 1) ? 'alertOnDoubleApproval' : 'approveVariationField'
                            });
                            var recomBtn = Ext.create('Ext.button.Button', {
                                text: 'View/Add Recommendation',
                                ui: 'soft-blue',
                                variation_type_id: variation_type_id,
                                field_id: field_id,
                                iconCls: 'fa fa-check-square',
                                handler: 'viewVariationRecommendation'
                            });

                            if(form.down('fieldset[name='+field_name+']')){
                                // toastr.error('Field Already Added', 'Duplicate Entry');
                                // return false
                            }else{
                                me.insert(0, field);
                                me.insert(1, recomBtn);
                                me.insert(2, apprvBtn);
                                cur_field.setFieldLabel('Current '+label+' Record');
                                cur_field.setReadOnly(true);
                                cur_field.allowBlank = true;
                                me.insert(0, cur_field);
                                form.insert(0, me); 
                            }
                        }
                        //when its a grid data change
                        else{
                            var xtype = record.get('view'),
                                view_type = record.get('view_type'),
                                save_url = record.get('save_url'),
                                get_url = record.get('get_url'),
                                decision_id = record.get('decision_id'),
                                remarks = record.get('remarks'),
                                approval_id = record.get('approval_id'),
                                stage_category_id = record.get('stage_category_id'),
                                view = Ext.widget(xtype);
                        //alter view
                        if(stage_category_id == 15){
                                hide = false;
                            }else{
                                hide = true;
                            }
                           view.is_variation = 1;
                           view.variation_type_id = variation_type_id;
                           view.setTitle(record.get('name'));
                           view.addDocked({
                                xtype: 'toolbar',
                                dock: 'top',
                                items: [{
                                    text: 'View/Add Recommendation',
                                    ui: 'soft-blue',
                                    variation_type_id: record.get('variation_type_id'),
                                    field_id: record.get('field_id'),
                                    iconCls: 'fa fa-check-square',
                                    handler: 'viewVariationRecommendation'
                                }, {
                                    text: (decision_id == 1) ? 'Change Approved' : (decision_id==2) ? 'Change Rejected': 'Approve Change',
                                    ui: (decision_id == 2) ? 'soft-red': (decision_id==1) ? 'green': 'soft-blue',
                                    hidden: hide,
                                    remarks: remarks,
                                    approval_id: approval_id,
                                    decision_id: decision_id,
                                    variation_type_id: record.get('variation_type_id'),
                                    field_id: record.get('field_id'),
                                    iconCls: (decision_id == 1) ? 'fa fa-check' : (decision_id==2) ? 'fa fa-window-close': 'fa fa-check-square',
                                    handler: (decision_id == 1) ? 'alertOnDoubleApproval' : 'approveVariationField'
                                }]
                            });
                           tabpanel.add(view);
                           tabpanel.setActiveTab(0);
                           if(xtype == 'premisecontactpersonfrm'){
                                thisController.loadContactPersonDetails(view, application_code, module_id);
                           }

                        }
                    });
                form.loadRecord(model);
                } else {
                    toastr.error(message, 'Failure Response');
                }
                btn.setLoading(false);
                form.unmask();
            },
            failure: function (response) {
                btn.setLoading(false);
                form.unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                btn.setLoading(false); 
                form.unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
       
    },
    saveVariationChanges: function(btn){
        var form = btn.up('form'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            frm = form.getForm();
        if (frm.isValid()) {
            frm.submit({
                url: 'premiseregistration/saveVariationChanges',
                params: {
                    application_code: application_code,
                    module_id: module_id
                },
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp, 'Failure Response');
                }
            });
        }else{
            toastr.error('Please fill in all added fields', 'Missing Fields');
        }
    },
    checkVariatedFields: function(grid){
        var sm = grid.getSelectionModel(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue();

        Ext.Ajax.request({
            url: 'premiseregistration/getVariatedFields',
            params: {
                application_code: application_code,
                module_id: module_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    results = resp.results;
                if (success == true || success === true) {
                    field_keys = Object.keys(results);
                    grid.store.on('load', function (store, records, options) {
                        Ext.each(records, function (record) {
                            var key = record.get('field_name');
                            if(key){
                                //do something
                            }else{
                                key = record.get('name'); 
                            }
                            //check if found
                            var contains = results.hasOwnProperty(key);
                            if (contains) {
                                var rowIndex = store.indexOf(record);
                                sm.select(rowIndex, true);
                            }
                        });
                    });
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    loadContactPersonDetails: function (view, application_code, module_id) {
        Ext.Ajax.request({
            url: 'premiseregistration/getVariatedContactPersonDetails',
            params: {
                application_code: application_code,
                module_id: module_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    results = resp.results;
                if (success == true || success === true) {
                    var model = Ext.create('Ext.data.Model', results);
                    view.loadRecord(model);
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    approveVariationField: function(btn){
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            field_id = btn.field_id,
            variation_type_id = btn.variation_type_id,
            child = Ext.widget('variatedFieldApprovalFrm');
        //pass variables 
        child.down('hiddenfield[name=field_id]').setValue(field_id);
        child.down('hiddenfield[name=application_code]').setValue(application_code);
        child.down('hiddenfield[name=module_id]').setValue(module_id);
        child.down('hiddenfield[name=variation_type_id]').setValue(variation_type_id);
        if(btn.decision_id){
            child.down('combo[name=decision_id]').setValue(btn.decision_id);
        }
        if(btn.remarks){
            child.down('htmleditor[name=remarks]').setValue(btn.remarks);
        }
        if(btn.approval_id){
            child.down('hiddenfield[name=id]').setValue(btn.approval_id);
        }
        child.approvalBtn = btn;
        funcShowCustomizableWindow('Field Approval', '40%', child, 'customizablewindow');

        // Ext.Ajax.request({
        //     url: 'common/approveVariatedFields',
        //     params: {
        //         application_code: application_code,
        //         field_id: field_id,
        //         variation_type_id: variation_type_id,
        //         module_id: module_id
        //     },
        //     headers: {
        //         'Authorization': 'Bearer ' + access_token,
        //         'X-CSRF-Token': token
        //     },
        //     success: function (response) {
        //         var resp = Ext.JSON.decode(response.responseText),
        //             success = resp.success,
        //             message = resp.message,
        //             results = resp.results;
        //         if (success == true || success === true) {
        //             field_keys = Object.keys(results);
        //             grid.store.on('load', function (store, records, options) {
        //                 Ext.each(records, function (record) {
        //                     var key = record.get('field_name');
        //                     if(key){
        //                         //do something
        //                     }else{
        //                         key = record.get('name'); 
        //                     }
        //                     //check if found
        //                     var contains = results.hasOwnProperty(key);
        //                     if (contains) {
        //                         var rowIndex = store.indexOf(record);
        //                         sm.select(rowIndex, true);
        //                     }
        //                 });
        //             });
        //         } else {
        //             toastr.error(message, 'Failure Response');
        //         }
        //     },
        //     failure: function (response) {
        //         var resp = Ext.JSON.decode(response.responseText),
        //             message = resp.message;
        //         toastr.error(message, 'Failure Response');
        //     },
        //     error: function (jqXHR, textStatus, errorThrown) {
        //         toastr.error('Error: ' + errorThrown, 'Error Response');
        //     }
        // });
    },

    showReasonsWinApp:function(btn){
        var me = this,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue();
        this.showReasonsWinAppGeneric(btn,application_code,module_id);
    },
    showReasonsWinAppGeneric:function(item,application_code,module_id){
        var me = this,
            childXtype = item.childXtype,
            winTitle = item.winTitle,
            winWidth = item.winWidth,
            child = Ext.widget(childXtype);
        
            child.down('hiddenfield[name=application_code]').setValue(application_code);
            child.down('hiddenfield[name=module_id]').setValue(module_id);

            funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow',item);

    },
    showExcelImportFrm: function(btn){
        var me = this,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            storeId = btn.storeId,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            child = Ext.widget('excelImportFrm');
        
            child.down('hiddenfield[name=application_code]').setValue(application_code);
            child.down('hiddenfield[name=module_id]').setValue(module_id);
            child.down('hiddenfield[name=process_id]').setValue(process_id);
            child.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
            child.down('button[name=upload_excel_btn]').storeID = storeId;
            funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow',btn);
    },
    setConfigCombosStoreWithSectionFilter: function (me, options) {
        var config = options.config,
            isLoad = options.isLoad,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            
            store = Ext.create('Admin.store.abstract.AbstractStore', config);
            me.setStore(store);

            if(me.up('window')){
                win = me.up('window');
                if(win.down('hiddenfield[name=section_id]')){
                    section_id = win.down('hiddenfield[name=section_id]').getValue();
                }
                else{
                    section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
                }
               
            }
            else{
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
               
            } 
            if(section_id >0){
                var filters = {section_id:section_id},
                filters = JSON.stringify(filters);
                if (isLoad === true || isLoad == true) {
                    store.removeAll();
                    store.load({params:{filters:filters} });
                }
            }
            else{
                if (isLoad === true || isLoad == true) {
                    store.removeAll();
                    store.load();
                }
            }
    },
    onChangePmsPlanRegionDetails:function(cmb,newVal){
        var form = cmb.up('form'),
            districtStore = form.down('combo[name=district_id]').getStore(),
            filterObj = {region_id: newVal},
            filterStr = JSON.stringify(filterObj);
        districtStore.removeAll();
        districtStore.load({params: {filter: filterStr}});
        var samplecollectionsitefrm = this.getSamplecollectionsitefrm();

            samplecollectionsitefrm.down('combo[name=region_id]').setValue(newVal);
            
            samplecollectionsitefrm.down('combo[name=region_id]').setReadOnly(true);
    },
    onChangePmsPlanDistrictDetails:function(cmb,newVal){
        var samplecollectionsitefrm = this.getSamplecollectionsitefrm();
            samplecollectionsitefrm.down('combo[name=district_id]').setValue(newVal);

            samplecollectionsitefrm.down('combo[name=district_id]').setReadOnly(true);

    },onRenderProgramImplDetailGrid:function(cbo){
        var store = cbo.getStore(),
            grid = cbo.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();

        store.removeAll();
        store.load({params: {section_id:section_id}});
        
    },
    funcaddsamplebatchapplication:function(btn){
        var store = 
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            groupsampleanalysispnl = activeTab.down('#groupsampleanalysispnl');
        
            groupsampleanalysispnl.removeAll();

            groupsampleanalysispnl.add({xtype:'groupsampleanalysisdetailspnl',title:'Batch Sample Analysis Request'});

    },
    funcReturntosamplebatchapplication:function(btn){
        var store = 
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            groupsampleanalysispnl = activeTab.down('#groupsampleanalysispnl');
        
            groupsampleanalysispnl.removeAll();
            groupsampleanalysispnl.add({xtype:'groupsampleanalysisgrid'});

    },
    showAddPmsProgram: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            grid = btn.up('grid'),
            homePnl = grid.up('panel'),
            addPnl = Ext.widget('pmsprogramcontainer');
          /*  plansGrid = addPnl.down('pmsprogramplansgrid'),
            dosageFormCol = plansGrid.getColumnManager().getHeaderByDataIndex('dosage_form'),
            productFormCol = plansGrid.getColumnManager().getHeaderByDataIndex('product_form'),
            deviceTypeCol = plansGrid.getColumnManager().getHeaderByDataIndex('device_type');
        if (section_id == 1 || section_id == 3 || section_id === 1 || section_id === 3) {//food and cosmetics
            if (productFormCol) {
                productFormCol.setHidden(false);
            }
        } else if (section_id == 4 || section_id === 4) {//medical devices
            if (deviceTypeCol) {
                deviceTypeCol.setHidden(false);
            }
        } else {
            if (dosageFormCol) {
                dosageFormCol.setHidden(false);
            }
        }
       */ 
        grid.hide();
        homePnl.add(addPnl);
    },
   
    showApplicationQueries: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            is_manager_query = grid.is_manager_query,
            is_manager_query_response = grid.is_manager_query_response,
            record = btn.getWidgetRecord(),
            ref_no = record.get('tracking_no'),
            workflow_stage_id = record.get('workflow_stage_id'),
            application_code = record.get('application_code'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            assessment_procedure_id = record.get('assessment_procedure_id'),
            classification_id = record.get('classification_id'),
            prodclass_category_id = record.get('prodclass_category_id'),
            product_subcategory_id = record.get('product_subcategory_id'),
            product_origin_id = record.get('product_origin_id'),
            application_status_id = record.get('application_status_id'),
            section_id = record.get('section_id'),
            childXtype = item.childXtype,
            childItemXtype = 'allqueriesgrid',
            childItem;
        if (childXtype) {
            childItemXtype = childXtype;
        }
        childItem = Ext.widget(childItemXtype);
        childItem.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        childItem.down('hiddenfield[name=application_code]').setValue(application_code);
        childItem.down('hiddenfield[name=module_id]').setValue(module_id);
        childItem.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        childItem.down('hiddenfield[name=section_id]').setValue(section_id);
        childItem.down('hiddenfield[name=is_manager_query]').setValue(is_manager_query);
        childItem.down('hiddenfield[name=assessment_procedure_id]').setValue(assessment_procedure_id);
        childItem.down('hiddenfield[name=classification_id]').setValue(classification_id);
        childItem.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);
        childItem.down('hiddenfield[name=product_subcategory_id]').setValue(product_subcategory_id);
        childItem.down('hiddenfield[name=product_origin_id]').setValue(product_origin_id);
        childItem.down('hiddenfield[name=application_status_id]').setValue(application_status_id);
        childItem.down('hiddenfield[name=is_manager_query_response]').setValue(is_manager_query_response);
        funcShowCustomizableWindow(ref_no + ' QUERIES', '85%', childItem, 'customizablewindow');
    },
    previewApplicationProcessingTransitions: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            ref_no = record.get('reference_no'),
            application_code = record.get('application_code');

        var childObject = Ext.widget('multitransitionsgrid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            ref_no = activeTab.down('displayfield[name=reference_no]').getValue();

            childObject.down('hiddenfield[name=application_code]').setValue(application_code);
            childObject.down('hiddenfield[name=reference_no]').setValue(ref_no);

        funcShowCustomizableWindow(ref_no + ' Transitions', '70%', childObject, 'customizablewindow');

    },
     funcPrevGridApplicationDocuments: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            document_previewpnl = 'applicationprevdocuploadsgrid',
            grid = Ext.widget(document_previewpnl),
            store = grid.store,
            application_code = record.get('application_code'),
            section_id = record.get('section_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            ref_no = record.get('reference_no');
        grid.height = 450;
        funcShowCustomizableWindow(ref_no, '85%', grid, 'customizablewindow');

        grid.down('hiddenfield[name=application_code]').setValue(application_code);
        grid.down('hiddenfield[name=section_id]').setValue(section_id);
        grid.down('hiddenfield[name=module_id]').setValue(module_id);
        grid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

        grid.getViewModel().set('isReadOnly', true);

    },
    addGridApplicationIdCodeParams: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            application_code = grid.down('hiddenfield[name=application_code]').getValue();
       
        store.getProxy().extraParams = {
            application_code: application_code
        };

    },
    savepermitReleaseRecommendation:function(btn){
            
        var me = this,
        mainTabPanel = me.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab(),
       
        mainStore = activeTab.down('grid').getStore(),
        form = btn.up('form'),
        frm = form.getForm(),

        win = form.up('window'),
        action_url = 'importexportpermits/savepermitReleaseRecommendation';
    if (frm.isValid()) {
        frm.submit({
            url: action_url,
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            waitMsg: 'Please wait...',
            success: function (fm, action) {
                var response = Ext.decode(action.response.responseText),
                    success = response.success,
                    message = response.message;
                if (success == true || success === true) {

                    toastr.success(message, "Success Response");
                    mainStore.removeAll();
                    mainStore.load();

                    win.close();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (fm, action) {
                var resp = action.result;
                toastr.error(resp.message, 'Failure Response');
            }
        });
    }

    },
    showPermitApplicationMoreDetailsGeneric: function (permitsdetails_panel, application_id,  applicant_id, ref_no, process_id, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            permitsdetails_panel = Ext.widget(permitsdetails_panel),
            tab = permitsdetails_panel.down('panel'),
            module_id = permitsdetails_panel.down('hiddenfield[name=module_id]'),
            permit_form = permitsdetails_panel.down('form'),
            importexportapplicantdetailsfrm = permitsdetails_panel.down('importexportapplicantdetailsfrm');
            importexportdetailsfrm = permitsdetails_panel.down('#importexportdetailsfrm');
            senderreceiverdetailsfrm = permitsdetails_panel.down('#senderreceiverdetailsfrm');
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            permitsdetails_panel.down('button[name=save_btn]').setVisible(false);
            //   prepareNewProductReceivingStage applicant_id
        }
        Ext.Ajax.request({
            method: 'POST',
            url: 'importexportpermits/getPermitsApplicationMoreDetails',
            params: {
                application_id: application_id,
                applicant_id: applicant_id,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    permit_details = resp.permit_details,
                    senderReceiverDetails = resp.senderReceiverDetails,
                    senderReceiverDetails = resp.senderReceiverDetails,
                    premisesDetails = resp.premisesDetails;

                if (success == true || success === true) {

                    if (permit_details) {
                        var model2 = Ext.create('Ext.data.Model', permit_details);
                        
                       var senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails),
                            premisesDetails = Ext.create('Ext.data.Model', premisesDetails);
                            if(permit_details.module_id != 20){
                                if(permitsdetails_panel.down('#importexportpremisesfrm')){
                                    importexportpremisesfrm = permitsdetails_panel.down('#importexportpremisesfrm'),
                                    importexportpremisesfrm.loadRecord(premisesDetails);
                                }
                            }
                            if(senderreceiverdetailsfrm){
                                senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                            }
                            importexportapplicantdetailsfrm.loadRecord(model2);
                            importexportdetailsfrm.loadRecord(model2);
                            if(permitsdetails_panel.down('combo[name=branch_id]')){
                                permitsdetails_panel.down('combo[name=branch_id]').setValue(permit_details.branch_id);
                            }
                    }
                    permitsdetails_panel.height = 550;
                    funcShowCustomizableWindow(ref_no, '85%', permitsdetails_panel, 'customizablewindow');

                    if (isReadOnly == 1) {


                        me.fireEvent('formAuth', process_id, 1, permitsdetails_panel);
                        
                    }
                   
                    
                    permitsdetails_panel.down('hiddenfield[name=active_application_code]').setValue(permit_details.application_code);
                    permitsdetails_panel.down('hiddenfield[name=section_id]').setValue(permit_details.section_id);
                    permitsdetails_panel.down('hiddenfield[name=module_id]').setValue(permit_details.module_id);
                    permitsdetails_panel.down('hiddenfield[name=sub_module_id]').setValue(permit_details.sub_module_id);

                    if(permit_details.module_id == 20){

                        docsGrid = permitsdetails_panel.down('declaredimportexportdocuploadsgrid');
                    }
                    else{
                        docsGrid = permitsdetails_panel.down('onlineimportexportdocuploadsgrid');
                    }
                    
                    docsGrid.down('hiddenfield[name=application_code]').setValue(permit_details.application_code);
                    docsGrid.down('hiddenfield[name=section_id]').setValue(permit_details.section_id);
                    docsGrid.down('hiddenfield[name=module_id]').setValue(permit_details.module_id);
                    docsGrid.down('hiddenfield[name=sub_module_id]').setValue(permit_details.sub_module_id);
                    if(docsGrid.down('hiddenfield[name=importexport_permittype_id]')){

                        docsGrid.down('hiddenfield[name=importexport_permittype_id]').setValue(permit_details.importexport_permittype_id);
                      
                    }
                    if(permitsdetails_panel.down('#variationrequestsgrid')){
                        if(permitsdetails_panel.down('#variationrequestsgrid').down('hiddenfield[name=application_code]')){
                            permitsdetails_panel.down('#variationrequestsgrid').down('hiddenfield[name=application_code]').setValue(permit_details.application_code);
                            permitsdetails_panel.down('#variationrequestsgrid').down('hiddenfield[name=application_id]').setValue(application_id);
                        }
                    }
                    activeTab.getViewModel().set('model', model2);
                    permitsdetails_panel.getViewModel().set('model', model2);
                    permitsdetails_panel.getViewModel().set('isReadOnly', true);
                    permitsdetails_panel.down('hiddenfield[name=active_application_id]').setValue(application_id);
                    permitsdetails_panel.down('hiddenfield[name=importexport_permittype_id]').setValue(permit_details.importexport_permittype_id);

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showManagerQueryApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            valid = true,
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagerqueryfrm', winWidth, storeID,'','','',workflow_stage_id);
           
        } else {
            Ext.getBody().unmask();
        }
    },
    previewInspectionDetails: function(application_id) {
        var inspectionPreviewPnl = Ext.widget('poeinspectionpreviewpnl'),
            inspectionFrm = inspectionPreviewPnl.down('form');
        Ext.Ajax.request({
            method: 'GET',
            url: 'importexportpermits/prepareReceivingpoeinspectionswizard',
            params: {
                application_id: application_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success,
                    results = resp.results;
                if (success == true || success === true) {
                    if (results) {
                        var model = Ext.create('Ext.data.Model', results);
                        inspectionFrm.loadRecord(model);
                    }
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function(response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success;
                toastr.error(message, 'Failure Response');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
        funcShowCustomizableWindow("Inspection Preview", '60%', inspectionPreviewPnl, 'customizablewindow');
    },
    showProductRegisterApplicationsMoreDetails: function (btn,application_code,module_id,sub_module_id,section_id,prodclass_category_id,ref_no,applicant_id) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            activeTab.down('hiddenfield[name=module_id]').setValue(module_id);
            activeTab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            activeTab.down('hiddenfield[name=section_id]').setValue(section_id);
            activeTab.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);
            view = 'drugsProductsDetailsPnl';
            if(sub_module_id == 9){
                view = 'altdrugsProductsDetailsPnl';
           }
           else if(sub_module_id == 79){
               view = 'listingproductdetailsPnl';
           }
           else if(sub_module_id == 75){
           // prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
            if(section_id == 4){
                view = 'exemptionMDProductsDetailsPnl';
            }
            else if(prodclass_category_id){
                if(prodclass_category_id == 47){
                    view = 'exemptionVetProductsDetailsPnl';
                }
                else if(prodclass_category_id == 51){
                       view = 'exemptionWSProductsDetailsPnl';
                   }
                else if(prodclass_category_id == 48){
                       view = 'exemptionVetWSProductsDetailsPnl';
                   }
                else if(prodclass_category_id == 50){
                    view = 'exemptionDrugProductsDetailsPnl';
                }    
            }
        }
        else if(sub_module_id ==78 || sub_module_id ==3){
            view='premiseAltappmoredetailswizard'
        }
        else if(sub_module_id ==33){
            view='newpromotionmaterialwizard'
        }
       
        if(module_id==1){
            this.showProductApplicationMoreDetailsGeneric(application_code,view,isReadOnly,ref_no,'');
        }
    },
    showSelectedReportDetails: function (btn,application_code,module_id,sub_module_id,section_id,ref_no) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            this.showEnforcementSelectedReportDetails(application_code, 'enforcementDetailsPnl',module_id, sub_module_id,section_id,ref_no,isReadOnly);
    },
    showEnforcementSelectedReportDetails: function (application_code,details_panel,module_id, sub_module_id,section_id,ref_no,isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            //ref_no = activeTab.down('displayfield[name=tracking_no]').getValue(),
            is_dataammendment_request =0;
        var me = this,
            details_panel = Ext.widget('enforcementDetailsPnl');
            details_panel.down('hiddenfield[name=module_id]').setValue(module_id);
            details_panel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'enforcement/getEnforcementApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    // applicantDetails = resp.applicant_details,
                    enforcement_details = resp.enforcement_details;
                    investigation_details = resp.investigation_details;
                if (success == true || success === true) {
                    //mir_form = details_panel.down('form');
                    complainant_form = details_panel.down('complainantfrm');
                    suspect_info = details_panel.down('suspectinforFrm');
                    //suspectedoffencegrid = details_panel.down('suspectedoffencegrid');
                  
                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (enforcement_details) {
                        var model2 = Ext.create('Ext.data.Model', enforcement_details);
                        complainant_form.loadRecord(model2);
                        suspect_info.loadRecord(model2);
                        //suspectedoffencegrid.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                    }
                    if (investigation_details) {
                        var model3 = Ext.create('Ext.data.Model', investigation_details);
                        complainant_form.loadRecord(model3);
                        suspect_info.loadRecord(model3);
                        //suspectedoffencegrid.loadRecord(model2);
                        details_panel.getViewModel().set('model', model3);
                    }
                    if (isReadOnly == 1) {

                        details_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        details_panel.getViewModel().set('isReadOnly', false);

                    }

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showJointOperationRegisterMoreDetails: function (btn,application_code,module_id,sub_module_id,section_id,ref_no) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            this.showJointOperationMoreDetails(application_code, 'operationDetailsPnl',module_id, sub_module_id,section_id,ref_no,isReadOnly);
    },
    showJointOperationMoreDetails: function (application_code,details_panel,module_id, sub_module_id,section_id,ref_no,isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            //ref_no = activeTab.down('displayfield[name=tracking_no]').getValue(),
            is_dataammendment_request =0;
        var me = this,
            details_panel = Ext.widget(details_panel);
            details_panel.down('hiddenfield[name=module_id]').setValue(module_id);
            details_panel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'enforcement/getEnforcementApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    // applicantDetails = resp.applicant_details,
                    enforcement_details = resp.enforcement_details;
                    joint_Operation_details = resp.joint_Operation_details;
                if (success == true || success === true) {
                    complainant_form = details_panel.down('complainantfrm');
                    suspect_info = details_panel.down('suspectinforFrm');
                    jointOperationsWorkPlanFrm =details_panel.down('jointOperationsWorkPlanFrm');
                    //suspectedoffencegrid = details_panel.down('suspectedoffencegrid');
                    
                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (enforcement_details) {
                        var model2 = Ext.create('Ext.data.Model', enforcement_details);
                        complainant_form.loadRecord(model2);
                        suspect_info.loadRecord(model2);
                        //jointOperationsWorkPlanFrm.loadRecord(model2);
                        //suspectedoffencegrid.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                    }
                    if (joint_Operation_details) {
                        var model3 = Ext.create('Ext.data.Model', joint_Operation_details);
                        jointOperationsWorkPlanFrm.loadRecord(model3);
                        //suspectedoffencegrid.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                    }

                    if (isReadOnly == 1) {

                        details_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        details_panel.getViewModel().set('isReadOnly', false);

                    }

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showHideTabsOtherDetails: function(pnl){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            tab = pnl.down('drugsIngredientsGrid'),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();

        if(section_id == 7){
            pnl.remove(tab);
            pnl.insert(0, {title:'Ingredients', xtype: 'cosmeticsIngredientsGrid'});
        }
    },
    saveOfficerSignatureDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mainStore = activeTab.down('grid').getStore(),
            form = btn.up('form'),
            frm = form.getForm(),
            win = form.up('window');
      
            action_url = 'enforcement/saveOfficerSignatureDetails';
        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                waitMsg: 'Please wait...',
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        mainStore.load();
                        toastr.success(message, "Success Response");
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error('Failure Response');
                }
            });
        }
    },
    

    showJointReportInvestigationMoreDetailsGeneric: function (application_code,details_panel,module_id, sub_module_id,section_id,isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            ref_no = activeTab.down('displayfield[name=tracking_no]').getValue(),
            is_dataammendment_request =0;
        var me = this,
            details_panel = Ext.widget('jointInvestigationDetails');
            productscreeninggrid =Ext.widget('productscreeninggrid');
            details_panel.down('hiddenfield[name=module_id]').setValue(module_id);
            details_panel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
            details_panel.down('hiddenfield[name=active_application_code]').setValue(application_code);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        productscreeninggrid.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'enforcement/getJointReportInvestigationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    enforcement_details = resp.enforcement_details;
                    // console.log(enforcement_details);
                if (success == true || success === true) {
                    jointOffenceDetailsFrm = details_panel.down('jointOffenceDetailsFrm');
                    //complianceinformationtabPnl = details_panel.down('complianceinformationtabPnl');

                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (enforcement_details) {
                        var model2 = Ext.create('Ext.data.Model', enforcement_details);
                        jointOffenceDetailsFrm.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                        // details_panel.getViewModel().set('isReadOnly', true);
                    }

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },

    showAdvancedCustomerApplicationMoreDetailsGeneric: function (application_code,details_panel,module_id, sub_module_id,section_id,isReadOnly,ref_no) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(!ref_no){
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue();
              }
            is_dataammendment_request =0;
        var me = this,
            details_panel = Ext.widget(details_panel);
            details_panel.down('hiddenfield[name=module_id]').setValue(module_id);
            details_panel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'revenuemanagement/getAdvancedCustomerApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    // applicantDetails = resp.applicant_details,
                    applicant_details = resp.applicant_details;
                if (success == true || success === true) {
                    customer_form = details_panel.down('#customerFrm');
                    customer_form.down('button[name=link_applicant]').setDisabled(true);
                    customer_form.down('button[name=save_details]').setVisible(true);

                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (applicant_details) {
                        var model1 = Ext.create('Ext.data.Model', applicant_details);
                        customer_form.loadRecord(model1);
                        details_panel.getViewModel().set('model', model1);
                    }
                    if (isReadOnly == 1) {

                        details_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        details_panel.getViewModel().set('isReadOnly', false);

                    }

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
  showInvoicesRefundApplicationMoreDetailsGeneric: function (application_code,details_panel,module_id, sub_module_id,section_id,isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            ref_no = activeTab.down('displayfield[name=tracking_no]').getValue(),
            is_dataammendment_request =0;
        var me = this,
            details_panel = Ext.widget(details_panel);
            details_panel.down('hiddenfield[name=module_id]').setValue(module_id);
            details_panel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'revenuemanagement/getRevenueRefundApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    // applicantDetails = resp.applicant_details,
                    applicant_details = resp.applicant_details;
                if (success == true || success === true) {
                    customer_form = details_panel.down('#customerFrm');
                    customer_form.down('button[name=link_applicant]').setDisabled(true);

                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (applicant_details) {
                        var model1 = Ext.create('Ext.data.Model', applicant_details);
                        customer_form.loadRecord(model1);
                        details_panel.getViewModel().set('model', model1);
                    }
                    if (isReadOnly == 1) {

                        details_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        details_panel.getViewModel().set('isReadOnly', false);

                    }

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },

    showMirRegisterMoreDetails: function (btn,application_code,ref_no) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        this.showMirApplicationMoreDetailsGeneric(application_code,'mirDetailsPnl',isReadOnly,ref_no);
    }, 
    showRMURegisterMoreDetails: function (btn,application_code,ref_no) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        this.showRMUApplicationMoreDetailsGeneric(application_code,'rmuSubmissionDetailsPnl',isReadOnly,ref_no);
    }, 
    showAdvancedCustomerRegisterMoreDetails: function (btn,application_code,module_id,sub_module_id,section_id,ref_no) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        this.showAdvancedCustomerApplicationMoreDetailsGeneric(application_code,'advancedCustomerDetailsPnl',module_id, sub_module_id,section_id,isReadOnly,ref_no);
    },
    showPvRegisterMoreDetails: function (btn,application_code,ref_no) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
          
        this.showPvApplicationMoreDetailsGeneric(application_code,'pvDetailsPnl',isReadOnly,ref_no);
    },
    showPromotionRegisterMoreDetails: function (application_id,application_code, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly,view) {
        this.showPromotionMaterialApplicationMoreDetailsGeneric(application_id,application_code, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly,'newpromotionmaterialwizard');
    },
    showMonitoringRegisterMoreDetails: function (application_code,view,module_id,sub_module_id,section_id,isReadOnly,ref_no) {
        this.showMonitoringApplicationMoreDetailsGeneric(application_code,'monitoringDetailsPnl',module_id, sub_module_id, section_id, isReadOnly,ref_no);
    },
    getRevenueTotal: function(pnl){
        var cont = pnl.up('advancedCustomerLedgerPnl'), applicant_id,date_from,date_to;

        if(cont){
            applicant_id = cont.down('hiddenfield[name=CustomerId]').getValue();
            // pnl.down('cartesian').getStore().getProxy().extraParams = {applicant_id: applicant_id};
        }
        if(pnl.down('datefield[name=date_from]')){
            date_from = pnl.down('datefield[name=date_from]').getValue();
            date_to = pnl.down('datefield[name=date_to]').getValue();
        }
        if(applicant_id){
            cont.down('cartesian').getStore().reload({params: {applicant_id: applicant_id}});
        }

        Ext.Ajax.request({
            method: 'GET',
            url: 'revenuemanagement/getAccountBalances',
            params: {
                applicant_id: applicant_id,
                date_from: date_from,
                date_to: date_to
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    total_payables = resp.total_payables,
                    account_balance = resp.account_balance,
                    total_receivables = resp.total_receivables;

                if (success == true || success === true) {
                   pnl.down('displayfield[name=total_receivables]').setValue(total_receivables);
                   pnl.down('displayfield[name=total_payables]').setValue(total_payables);
                   pnl.down('displayfield[name=account_balance]').setValue(account_balance);
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    hidePrescriber: function(frm){
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        if(activeTab.down('hiddenfield[name=prodclass_category_id]')){
            prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
            if(prodclass_category_id == 50){
                frm.down('combo[name=is_prescriber]').setVisible(true);
            }else{
                frm.down('combo[name=is_prescriber]').setVisible(false); 
            }
        }

    },
    hideConsignortabforexport: function(frm){
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        if(activeTab.down('hiddenfield[name=sub_module_id]')){
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();

            if(sub_module_id == 16){
                frm.remove('senderreceiverdetailsfrm');
            }
        }

    },
    showApprovalInspectionApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
             storeID = getApplicationStore(module_id, section_id,sub_module_id),
            table_name = getApplicationTable(module_id);

            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsinspectionsfrm', winWidth, storeID, '', '', 'selected');
            
    },

    showInspectionApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            inspectorsGrid = activeTab.down('inspectioninspectorsgrid'),
            inspectorsStore = inspectorsGrid.getStore(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            storeID = getApplicationStore(module_id, section_id,sub_module_id),
            table_name = getApplicationTable(module_id),
            inspection_id = activeTab.down('form').down('hiddenfield[name=id]').getValue(),
            leadInspectorDetails = inspectorsStore.findRecord('role_id', 2);
          //  alert(application_id)
        
            extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'inspection_id',
                value: inspection_id,
            }];
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsinspectionsfrm', winWidth, storeID, extraParams, '', 'selected');
    },

    showPsurApplicationMoreDetailsGeneric: function (application_code,details_panel,isReadOnly,ref_no) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(!ref_no){
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue();
            }
            is_dataammendment_request =0;
        var me = this,
        details_panel = Ext.widget(details_panel);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'psur/getPsurApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    psur_details = resp.psur_details;
                    ltrDetails = resp.ltrDetails;
                if (success == true || success === true) {
                    psurdetailsFrm = details_panel.down('psurdetailsFrm'),
                    productapplicantdetailsfrm = details_panel.down('productapplicantdetailsfrm'),
                    productlocalapplicantdetailsfrm = details_panel.down('productlocalapplicantdetailsfrm'),
                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (psur_details) {
                        var model2 = Ext.create('Ext.data.Model', psur_details);
                        psurdetailsFrm.loadRecord(model2);
                        productapplicantdetailsfrm.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                    }
                    if (ltrDetails) {
                        var model3 = Ext.create('Ext.data.Model', ltrDetails);
                        productlocalapplicantdetailsfrm.loadRecord(model3);
                    }

                    if (isReadOnly == 1) {

                        details_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        details_panel.getViewModel().set('isReadOnly', false);

                    }

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    saveOnlineApplicationChecklistDetails: function (btn) {
        btn.setLoading(true);
        var win = btn.up('window'),
            screeningGrid = win.down('checklistresponsescmngrid'),
            application_id = win.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = win.down('hiddenfield[name=active_application_code]').getValue();
        this.commitApplicationChecklistDetails(btn, application_id, application_code, screeningGrid);
    },
    addPrecheckingRecommendation:function(btn){
        var win = btn.up('window'),
            application_code = win.down('hiddenfield[name=active_application_code]').getValue();

            var me = this,
            childXtype = 'precheckingrecommendationfrm',
            winTitle = 'Prechecking Recommendation',
            winWidth = '40%',
            child = Ext.widget(childXtype);
            child.down('hiddenfield[name=application_code]').setValue(application_code);

        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    },
     receiveOnlineApplicationDetailsFrmBtn: function (btn) {
        
        Ext.getBody().mask('Please wait...');
        var storeID = btn.storeID,
            winWidth = btn.winWidth,
            win = btn.up('window'),
            is_invoicecheck = btn.is_invoicecheck,
            application_id = win.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = win.down('hiddenfield[name=active_application_code]').getValue(),
            tracking_no = win.down('displayfield[name=tracking_no]').getValue(),
            module_id = win.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = win.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = win.down('hiddenfield[name=section_id]').getValue(),
            status_type_id = win.down('hiddenfield[name=status_type_id]').getValue(),
            process_id= win.down('hiddenfield[name=process_id]').getValue(),
            application_status_id = win.down('hiddenfield[name=application_status_id]').getValue(),
            hasQueries = checkApplicationRaisedQueries(application_code, module_id),
            table_name = getApplicationTable(module_id),
            extraParams = [
                {
                    field_type: 'hiddenfield',
                    field_name: 'table_name',
                    value: table_name
                }, {
                    field_type: 'hiddenfield',
                    field_name: 'application_code',
                    value: application_code
                }, {
                    field_type: 'hiddenfield',
                    field_name: 'application_status_id',
                    value: application_status_id
                }, {
                    field_type: 'hiddenfield',
                    field_name: 'status_type_id',
                    value: status_type_id
                }, {
                    field_type: 'hiddenfield',
                    field_name: 'has_queries',
                    value: hasQueries
                }, {
                    field_type: 'hiddenfield',
                    field_name: 'process_id',
                    value: process_id
                }
            ];
            if(!hasQueries){
                //skip some modules 
                if(is_invoicecheck){
                    invoiceIsGenerated = checkGeneratedInvoiceDetails(application_code, module_id,sub_module_id,section_id);
                    if(!invoiceIsGenerated){
                            toastr.warning('Receive and Generate Invoice, to proceed!!', 'Warning Response');
                            Ext.getBody().unmask();
                            return false;
    
                    }
                }
                

            }
            /*
            if(win.down('combo[name=applicable_checklist]')){
                checklist_category_id = win.down('combo[name=applicable_checklist]').getValue();
                hasValidatedChecklist = checkOnlineApplicationChecklistDetails(application_code, module_id,sub_module_id,section_id,checklist_category_id);
                if(!hasValidatedChecklist){

                    toastr.warning('Fill in all the checklist details to proceed!!', 'Warning Response');
                    Ext.getBody().unmask();
                    return false;

                }

            }
            */
            //needs_re
            if(win.down('button[name=prechecking_recommendation]')){
                hasPrecheckingrecommendation = checkPrecheckingrecommendation(application_code, module_id);
                if(!hasPrecheckingrecommendation){
                    toastr.warning('Add Prechecking Recommendation to proceed.', 'Warning Response');
                    Ext.getBody().unmask();
                    return false;
                }
                
            }
        showOnlineSubmissionWin(application_id, application_code, module_id, sub_module_id, section_id, 'onlinesubmissionsfrm', winWidth, storeID, tracking_no, status_type_id, extraParams, hasQueries,process_id);
        Ext.getBody().unmask();
    },
    receiveAndInvoiceOnlineApplicationDetailsFrmBtn: function (btn) {
            Ext.getBody().mask('Please wait...');
            var storeID = btn.storeID,
                winWidth = btn.winWidth,
                win = btn.up('window'),
                application_id = win.down('hiddenfield[name=active_application_id]').getValue(),
                application_code = win.down('hiddenfield[name=active_application_code]').getValue(),
                tracking_no = win.down('displayfield[name=tracking_no]').getValue(),
                module_id = win.down('hiddenfield[name=module_id]').getValue(),
                sub_module_id = win.down('hiddenfield[name=sub_module_id]').getValue(),
                section_id = win.down('hiddenfield[name=section_id]').getValue(),
                status_type_id = win.down('hiddenfield[name=status_type_id]').getValue(),
                application_status_id = win.down('hiddenfield[name=application_status_id]').getValue(),
                hasQueries = checkApplicationRaisedQueries(application_code, module_id),
               
                table_name = getApplicationTable(module_id),

                extraParams = [
                    {
                        field_type: 'hiddenfield',
                        field_name: 'table_name',
                        value: table_name
                    }, {
                        field_type: 'hiddenfield',
                        field_name: 'application_code',
                        value: application_code
                    }, {
                        field_type: 'hiddenfield',
                        field_name: 'application_status_id',
                        value: application_status_id
                    }
                ];
                invoiceIsGenerated = checkGeneratedInvoiceDetails(application_code, module_id,sub_module_id,section_id);
                if(invoiceIsGenerated){
                        toastr.warning('Invoice has already been generated, print and submit!!', 'Warning Response');
                        Ext.getBody().unmask();
                        return false;

                }
                
                if(!hasQueries){
                    if(win.down('combo[name=applicable_checklist]')){
                        checklist_category_id = win.down('combo[name=applicable_checklist]').getValue();
                        hasValidatedChecklist = checkOnlineApplicationChecklistDetails(application_code, module_id,sub_module_id,section_id,checklist_category_id);
                        if(!hasValidatedChecklist){
                            toastr.warning('Fill in all the checklist details to proceed!!', 'Warning Response');
                            Ext.getBody().unmask();
                            return false;
        
                        }
    
                    }
                    showreceiveAndInvoiceOnlineApplicationDetails(application_id, application_code, module_id, sub_module_id, section_id, 'onlineapplicationreceiceinvoicefrm', winWidth, storeID, tracking_no, status_type_id, extraParams, hasQueries);
                }
                else{
                    toastr.warning('The Application has a pending query, close the query or submit to the Manager(Query Process) !!', 'Warning Response');
                    Ext.getBody().unmask();
                    return false;

                }
            
    },
     receiveOnlineApplicationDetails: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            storeID = btn.storeID,
            action_url = btn.action_url,
            store = activeTab.down('grid').getStore(),//Ext.getStore(storeID),
            intrayStore = Ext.getStore('intraystr'),
            onlineapplicationdashboardgridstr = Ext.getStore('onlineapplicationdashboardgridstr'),
            onlineappssubmissioncounterstr = Ext.getStore('onlineappssubmissioncounterstr'),
            outtrayStore = Ext.getStore('outtraystr'),
            form = btn.up('form'),
            win = form.up('window'),
            frm = form.getForm();
        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.load();
                        intrayStore.load();
                        outtrayStore.load();
                        onlineapplicationdashboardgridstr.load();
                        onlineappssubmissioncounterstr.load();
                        win.close();
                        closeActiveWindow();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },

    showPortalSubmissionWinGeneric: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            categorize_selected=btn.categorize_selected,
            activeTab = mainTabPanel.getActiveTab();
            console.log(activeTab);
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
      
            valid = true,
            is_dataammendment_request =0,
            storeID = btn.storeID,
            table_name = getApplicationTable(module_id);
            if(activeTab.down('hiddenfield[name=is_dataammendment_request]')){
                is_dataammendment_request =activeTab.down('hiddenfield[name=is_dataammendment_request]').getValue();
            }
            if(btn.table_name != ''){
                table_name = btn.table_name;
            }
            if(categorize_selected){
                //check if inspections type set
            }
            
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagersgenericfrm', winWidth, storeID,'','','',workflow_stage_id,is_dataammendment_request);
         
        } else {
            Ext.getBody().unmask();
        }
    },

    showProductPortalApplicationMoreDetailsGeneric: function (application_code,productdetails_panel,isReadOnly,ref_no) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(!ref_no){
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue();
            }
            is_dataammendment_request =0;
        //when fired from a manager grid and the selection is different from what was loaded from intray
        //this helps product wizard grids to load with the correct application  code
        // if(application_code){
        //     activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
        // }
        var me = this,
            productdetails_panel = Ext.widget(productdetails_panel);

        
        //     {
        //     xtype: 'tabpanel',
        //     layout: 'fit',
        //     defaults: {
        //         margin: 3
        //     },
        //     items: [{
        //         xtype: 'productapplicantdetailsfrm',
        //         title: 'Pharmacist Details'
        //     },
        //     {
        //         xtype: 'productlocalapplicantdetailsfrm',
        //         is_prescriber: 1,
        //         title: 'Prescriber Details'
        //     }]
        // }

        // productdetails_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        productdetails_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'productregistration/getProductPortalApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    applicantDetails = resp.applicant_details,
                    ltrDetails = resp.ltrDetails,
                    product_details = resp.product_details,
                    prodclass_category_id = product_details.prodclass_category_id,
                    branch_id = resp.branch_id;
                if (success == true || success === true) {
                    productdetails_panel.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);

                    products_form = productdetails_panel.down('form');

                    //add applicant
                    if(prodclass_category_id == 50){
                        productdetails_panel.add(0, {title: 'Presciber', xtype: 'productlocalapplicantdetailsfrm'});
                        productdetails_panel.add(0, {title: 'Pharmacist(Applicant)', xtype: 'productapplicantdetailsfrm'});
                    }else{
                        productdetails_panel.add(0, {title: 'Contact Person', xtype: 'productlocalapplicantdetailsfrm'});
                        productdetails_panel.add(0, {title: 'Applicant', xtype: 'productapplicantdetailsfrm'});
                    }
                    

                    funcShowStatelessCustomizableWindow(ref_no, '85%', productdetails_panel, 'customizablewindow');
                    if (product_details) {
                        var model2 = Ext.create('Ext.data.Model', product_details);
                        products_form.loadRecord(model2);
                        productdetails_panel.getViewModel().set('model', model2);

                        //load data
                        if(productdetails_panel.down('productapplicantdetailsfrm')){
                            productdetails_panel.down('productapplicantdetailsfrm').loadRecord(model2);
                        }
                        var model3 = Ext.create('Ext.data.Model', ltrDetails);
                        if(productdetails_panel.down('productlocalapplicantdetailsfrm')){
                            productdetails_panel.down('productlocalapplicantdetailsfrm').loadRecord(model3);
                        }
                    }

                    if (isReadOnly == 1) {

                        productdetails_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        productdetails_panel.getViewModel().set('isReadOnly', false);

                    }
                    productdetails_panel.setActiveTab(0);

                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },

    showProductRegisterPortalApplicationsMoreDetails: function (btn,application_code,module_id,sub_module_id,section_id,prodclass_category_id,ref_no) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            activeTab.down('hiddenfield[name=module_id]').setValue(module_id);
            activeTab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            activeTab.down('hiddenfield[name=section_id]').setValue(section_id);
            activeTab.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);
            view = 'drugsPortalProductsDetailsPnl';
            if(sub_module_id == 9){
                view = 'altdrugsProductsDetailsPnl';
           }
           else if(sub_module_id == 79){
               view = 'listingproductdetailsPnl';
           }
           else if(sub_module_id == 75){
           // prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
            if(section_id == 4){
                view = 'exemptionMDProductsDetailsPnl';
            }
            else if(prodclass_category_id){
                if(prodclass_category_id == 47){
                    view = 'exemptionVetProductsDetailsPnl';
                }
                else if(prodclass_category_id == 51){
                       view = 'exemptionWSProductsDetailsPnl';
                   }
                   else if(prodclass_category_id == 48){
                       view = 'exemptionVetWSProductsDetailsPnl';
                   }
                else if(prodclass_category_id == 50){
                    view = 'exemptionDrugProductsDetailsPnl';
                }    
            }
        }
        else if(sub_module_id ==78 || sub_module_id ==3){
            view='premiseAltappmoredetailswizard'
        }
        else if(sub_module_id ==33){
            view='newpromotionmaterialwizard'
        }
       
        if(module_id==1){
            this.showProductPortalApplicationMoreDetailsGeneric(application_code,view,isReadOnly,ref_no);
        }
    },
   
    onMeetingGroupSelectionListDblClick: function (view, record, item, index, e, eOpts) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            grid = view.grid,
            win = grid.up('window'),
            pnl= grid.up('panel');
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            group_id = record.get('id'),
            meeting_id = pnl.down('hiddenfield[name=meeting_id]').getValue();
            storeID = 'tcmeetingparticipantsstr',
            store = Ext.getStore(storeID),
            Ext.Ajax.request({
                method: 'POST',
                url: 'common/syncTcMeetingGroupParticipants',
                waitMsg: 'Please wait...',
                params: {
                    group_id: group_id,
                    meeting_id: meeting_id,
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                     'X-CSRF-Token': token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        success = resp.success,
                        message = resp.message;
                        store.removeAll();
                        store.load();
                        win.close();
                    if (success == true || success === true) {

                      toastr.success(message, "Success Response"); 
                    
                    } else {
                        toastr.error(message, "Failure Response");
                    }
                },
                failure: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        success = resp.success,
                        message = resp.message;
                    toastr.error(message, "Failure Response");
                }
            });
    },
  showSelectedQueriesApplicationMoreDetails: function (btn,application_code,module_id,sub_module_id,section_id,prodclass_category_id,ref_no,application_id,applicant_id,process_id) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            view = 'drugsProductsDetailsPnl';
            //drugsPortalProductsDetailsPnl
            //products details
            if(sub_module_id == 9){
                view = 'altdrugsProductsDetailsPnl';
           }
           else if(sub_module_id == 79){
               view = 'listingproductdetailsPnl';
           }
           else if(sub_module_id == 75){
               prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
               if(section_id == 4){
                   view = 'exemptionMDProductsDetailsPnl';
               }
               else if(prodclass_category_id){
                   if(prodclass_category_id == 47){
                       view = 'exemptionVetProductsDetailsPnl';
                   }
                   else if(prodclass_category_id == 51){
                       view = 'exemptionWSProductsDetailsPnl';
                   }
                   else if(prodclass_category_id == 48){
                       view = 'exemptionVetWSProductsDetailsPnl';
                   }
                   else if(prodclass_category_id == 50){
                       view = 'exemptionDrugProductsDetailsPnl';
                   }    
               }
           }
           else if(sub_module_id ==78 || sub_module_id ==3){
               view='premiseAltappmoredetailswizard'
           }
           else if(sub_module_id ==33){
               view='newpromotionmaterialwizard'
           }
           if(module_id==1){
            this.showProductApplicationMoreDetailsGeneric(application_code,view,isReadOnly,ref_no,workflow_stage_id);
        }else if(module_id == 2){
            //var premise_id = activeTab.down('hiddenfield[name=premise_id]').getValue();
            this.showPremiseApplicationMoreDetailsGeneric(application_id, applicant_id, ref_no, process_id, '', module_id, sub_module_id, section_id, isReadOnly, application_code, '');
        }else if(sub_module_id == 73){
            this.showPermitApplicationMoreDetailsGeneric('previewAmmendimportexportpermitdetails',application_id, applicant_id, ref_no, process_id,  isReadOnly);
        }
        else if(module_id == 4){
            this.showPermitApplicationMoreDetailsGeneric('previewimportexportpermitdetails',application_id, applicant_id, ref_no, process_id,  isReadOnly);
        }
        else if(module_id == 12){
            this.showPermitApplicationMoreDetailsGeneric('previewcontroldrugsimppermitdetails',application_id, applicant_id, ref_no, process_id,  isReadOnly);
        } else if(module_id==3){
            // var application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            //     site_id = activeTab.down('hiddenfield[name=manufacturing_site_id]').getValue(),
            //     gmp_type_id = activeTab.down('hiddenfield[name=gmp_type_id]').getValue();
            this.showGmpQueriesApplicationMoreDetailsGeneric(application_id, application_code, applicant_id, ref_no, process_id, module_id, sub_module_id, section_id, isReadOnly);
        } else if(module_id == 14){
            this.showPromotionMaterialApplicationMoreDetailsGeneric(application_id,application_code, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly,view);
        }else if(sub_module_id == 49){
            this.previewInspectionDetails(application_id);
        }else if(module_id == 16){
            if(sub_module_id == 98){
            this.showAdvancedCustomerApplicationMoreDetailsGeneric(application_code, 'advancedCustomerDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
            }
            else if(sub_module_id == 99){
                this.showInvoicesRefundApplicationMoreDetailsGeneric(application_code, 'revenueRefundApplicationDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
            }
            else{

            }
        }else if(module_id == 21){
            this.showPvApplicationMoreDetailsGeneric(application_code, 'pvDetailsPnl', isReadOnly);
        }else if(module_id == 22){
            this.showMirApplicationMoreDetailsGeneric(application_code, 'mirDetailsPnl', isReadOnly);
        }else if(module_id == 25){
            this.showPsurApplicationMoreDetailsGeneric(application_code, 'psurDetailsPnl', isReadOnly);
        }else if(module_id == 24){
            this.showRMUApplicationMoreDetailsGeneric(application_code, 'rmuSubmissionDetailsPnl', isReadOnly);
        }
        else if(module_id == 8){
            if(sub_module_id == 88){
                this.showMonitoringApplicationMoreDetailsGeneric(application_code, 'monitoringDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
            }
            else if(sub_module_id == 89){
                    this.showEnforcementApplicationMoreDetailsGeneric(application_code, 'operationDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
            } 
            else if(sub_module_id == 86){
                joint_investigation_id = activeTab.down('hiddenfield[name=joint_investigation_id]').getValue();
             
                if(joint_investigation_id){
                    this.showJointReportInvestigationMoreDetailsGeneric(application_code, 'jointInvestigationDetails',module_id, sub_module_id,section_id,isReadOnly)
                }
                else{
                    this.showEnforcementApplicationMoreDetailsGeneric(application_code, 'enforcementDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
                }

            }
            else{
                this.showEnforcementApplicationMoreDetailsGeneric(application_code, 'enforcementDetailsPnl',module_id, sub_module_id,section_id,isReadOnly);
            }
        }
        else if(module_id == 7){
            this.showClinicalTrialApplicationMoreDetailsGeneric(application_id, application_code, applicant_id, ref_no, process_id, '', module_id, sub_module_id, section_id, isReadOnly);
        }
        else{
            toastr.error('Not mapped', 'Please map the preview for this module');
        }
    },
    showGmpQueriesApplicationMoreDetailsGeneric: function (application_id, application_code, applicant_id, ref_no, process_id ,module_id, sub_module_id, section_id, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var childXtype = 'mansiteappmoredetailswizard';
        if (sub_module_id == 40 || sub_module_id === 40) {
            childXtype = 'mansiteappmoredetailsaltwizard';
        }
        var me = this,
            wizardPnl = Ext.widget(childXtype),
            applicantFrm = wizardPnl.down('gmpapplicantdetailsfrm'),
            siteFrm = wizardPnl.down('mansitedetailsfrm'),
            contactPersonFrm = wizardPnl.down('premisecontactpersonfrm'),
            ltrFrm = wizardPnl.down('ltrfrm'),
            otherDetailsGrid = wizardPnl.down('mansiteotherdetailswingrid'),
            productLineDetailsGrid = wizardPnl.down('productlinedetailswingrid'),
            gmpProductDetailsGrid = wizardPnl.down('gmpproductslinkagedetailswingrid'),
            blocksGrid = wizardPnl.down('mansiteblockdetailswingrid'),
            assessmentType_fld = wizardPnl.down('combo[name=assessment_type_id]'),
            //gmpType_fld = wizardPnl.down('combo[name=gmp_type_id]'),
            deviceType_fld = wizardPnl.down('combo[name=device_type_id]'),
            siteReadOnly = 0,
            personnelTabPnl = wizardPnl.down('mansitepersonneltabpnl'),
            personnelDetailsGrid = Ext.widget('mansitepersonneldetailswingrid', {
                title: 'Other Personnel'
            });
        // if (gmp_type_id == 2 || gmp_type_id === 2) {
        //     siteReadOnly = 0;
        // }
        contactPersonFrm.setMoreDetails(1);
        personnelTabPnl.remove(personnelTabPnl.items.getAt(1));
        personnelTabPnl.add(personnelDetailsGrid);
        wizardPnl.setHeight(550);
        applicantFrm.down('button[name=link_applicant]').setDisabled(false);
        siteFrm.down('button[action=search_site]').setDisabled(false);
        siteFrm.down('button[name=search_manufacturer]').setDisabled(false);
        ltrFrm.down('button[action=link_ltr]').setDisabled(false);
        wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
       // wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        wizardPnl.down('hiddenfield[name=application_id]').setValue(application_id);
        wizardPnl.down('hiddenfield[name=application_code]').setValue(application_code);
        wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
       // wizardPnl.down('hiddenfield[name=gmp_type_id]').setValue(gmp_type_id);
        wizardPnl.down('combo[name=branch_id]').setReadOnly(false);
        if ((siteReadOnly) && (siteReadOnly == 1 || siteReadOnly === 1)) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
        }
        /* personnelDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         blocksGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         productLineDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         gmpProductDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         */
        siteFrm.down('hiddenfield[name=isReadOnly]').setValue(siteReadOnly);
        if (section_id == 4) {
            wizardPnl.down('button[name=line_details]').setText('DEVICE TYPE DETAILS');
            wizardPnl.down('combo[name=device_type_id]').setVisible(true);
            wizardPnl.down('combo[name=device_type_id]').setReadOnly(false);
            productLineDetailsGrid.down('button[name=add_line]').setText('Add Device Type');
            productLineDetailsGrid.columns[0].setText('Device Type');
            productLineDetailsGrid.columns[1].setText('Device Type Category');
            productLineDetailsGrid.columns[2].setText('Device Type Description');
        }
        if (sub_module_id == 40 || sub_module_id === 40) {
            wizardPnl.down('gmpvariationrequestsgrid').down('hiddenfield[name=isReadOnly]').setValue(siteReadOnly);
        }
        Ext.Ajax.request({
            method: 'GET',
            url: 'gmpapplications/getGmpApplicationMoreDetails',
            params: {
                application_id: application_id,
               // site_id: site_id,
                applicant_id: applicant_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    applicantDetails = resp.applicant_details,
                    siteDetails = resp.site_details,
                    ltrDetails = resp.ltr_details,
                    contactPersonDetails = resp.contact_details;
                if (success == true || success === true) {
                    if (applicantDetails) {
                        assessmentType_fld.setValue(applicantDetails.assessment_type_id);
                        //gmpType_fld.setValue(applicantDetails.gmp_type_id);
                        var model1 = Ext.create('Ext.data.Model', applicantDetails);
                        applicantFrm.loadRecord(model1);
                    }
                    if (siteDetails) {
                        deviceType_fld.setValue(siteDetails.device_type_id);
                        var model2 = Ext.create('Ext.data.Model', siteDetails);
                        siteFrm.loadRecord(model2);
                    }
                    if (ltrDetails) {
                        var model3 = Ext.create('Ext.data.Model', ltrDetails);
                        ltrFrm.loadRecord(model3);
                    }
                    if (contactPersonDetails) {
                        var model4 = Ext.create('Ext.data.Model', contactPersonDetails);
                        contactPersonFrm.loadRecord(model4);
                    }
                    funcShowCustomizableWindow(ref_no, '85%', wizardPnl, 'customizablewindow');
                    if (sub_module_id == 6 || sub_module_id === 6) {
                        if (isReadOnly < 1) {
                            siteFrm.getForm().getFields().each(function (field) {
                                field.setReadOnly(true);
                            });
                            personnelDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
                            otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(0);
                            me.fireEvent('formAuth', process_id, 1, siteFrm);
                            me.fireEvent('gmpOtherPartsAuth', process_id, wizardPnl);
                        }
                    }
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    printFacilityInspectionReport: function(btn){
        var me = btn.up('panel'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            checklist_type = 0;

            if(me.down('combo[name=applicable_checklist]')){
                checklist_type = me.down('combo[name=applicable_checklist]').getValue();
            }
            if(me.is_auditor_checklist == 1){
                params = {
                    application_id: application_id,
                    application_code: application_code,
                    checklist_type: checklist_type,
                    process_id: process_id,
                    workflow_stage: workflow_stage,
                    is_auditor: 1
                };
            }else{
                params = {
                    application_id: application_id,
                    application_code: application_code,
                    checklist_type: checklist_type,
                    process_id: process_id,
                    workflow_stage: workflow_stage
                };
            }
        previewCorrespondence(application_code, module_id,'InspectionReport', params);
    },
    printFacilityInspectionReportFromGrid: function(button){
        var btn = button.up('button'),
            me = btn.up('panel'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            record = btn.getWidgetRecord(),
            application_id = record.get('active_application_id'),
            application_code = record.get('application_code'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            checklist_type = 0;

            if(me.is_auditor_checklist == 1){
                params = {
                    application_id: application_id,
                    application_code: application_code,
                    checklist_type: checklist_type,
                    process_id: process_id,
                    workflow_stage: workflow_stage,
                    is_auditor: 1
                };
            }else{
                params = {
                    application_id: application_id,
                    application_code: application_code,
                    checklist_type: checklist_type,
                    process_id: process_id,
                    workflow_stage: workflow_stage
                };
            }
        previewCorrespondence(application_code, module_id,'InspectionReport', params);
    },
    autoGenerateChecklistBasedQueries: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            grid = btn.up('grid'),
            store = grid.getStore(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            process_id = grid.down('hiddenfield[name=process_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        grid.mask('Please wait...');
        Ext.Ajax.request({
            method: 'GET',
            url: 'common/autoGenerateChecklistBasedQueries',
            params: {
                module_id: module_id,
                section_id: section_id,
                application_id: application_id,
                application_code: application_code,
                workflow_stage_id: workflow_stage_id,
                sub_module_id: sub_module_id,
                process_id: process_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                grid.unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;

                if (success == true || success === true) {
                    toastr.success(message, "Success Response"); 
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                grid.unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                grid.unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
      },
    prepareChecklistsCategories: function(me){
        mainTabPanel = this.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab(),
        application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
        application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
        process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
        workflow_stage = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        console.log(process_id);
        applicableChecklistStr = me.down('combo[name=applicable_checklist]').getStore(),
        filters = JSON.stringify({process_id: process_id});
        applicableChecklistStr.removeAll();
        applicableChecklistStr.load({
           params:{
               process_id:process_id,
               workflow_stage:workflow_stage,
               application_code:application_code
       }
      });
      },

    updateProductReviewBaseDetails: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        if(activeTab.xtype != 'productRegisterPnl' && activeTab.xtype != 'listedCosmeticsRegisterPnl' && activeTab.xtype != 'listedDevicesRegisterPnl'){
          var process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
                sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
                module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
                // workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
                active_application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue(),
                local_applicant_id = activeTab.down('hiddenfield[name=local_applicant_id]').getValue(),
                product_id = activeTab.down('hiddenfield[name=product_id]').getValue(),
                is_register_update = '';
        }else{
            var win = btn.up('form').up('window'),
                // process_id = win.down('hiddenfield[name=process_id]').getValue(),
                sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
                module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
                // workflow_stage_id = win.down('hiddenfield[name=workflow_stage_id]').getValue(),
                active_application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                local_applicant_id = win.down('productlocalapplicantdetailsfrm').down('hiddenfield[name=applicant_id]').getValue(),
                applicant_id = win.down('productapplicantdetailsfrm').down('hiddenfield[name=applicant_id]').getValue();
                
                product_id = activeTab.down('hiddenfield[name=product_id]').getValue(),
                is_register_update = 1;
        }
          var  action_url = btn.action_url,
            containerPnl = Ext.widget('drugsProductsDetailsPnl');
            pnl = containerPnl.down('panel');
            productDetailsForm = btn.up('drugsProductsDetailsFrm');
            productDetailsForm = Ext.widget(productDetailsForm);
            productDetailsForm.down('hiddenfield[name=product_id]').setValue(product_id);
            // is_listed = productDetailsForm.down('combo[name=is_b_listed]').getValue();
            
           if (productDetailsForm.isValid()) {
              productDetailsForm.submit({
                url: 'productregistration/'+action_url,
                waitMsg: 'Please wait...',
                params: {
                    active_application_id: active_application_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    section_id: section_id,
                    applicant_id:applicant_id,
                    local_applicant_id:local_applicant_id,
                    is_register_update: is_register_update,
                    '_token': token
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (frm, action) {
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success,
                        active_application_id = resp.active_application_id,
                        active_application_code = resp.active_application_code,
                        product_id = resp.product_id,
                        ref_no = resp.ref_no;
                        tracking_no = resp.tracking_no;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        if(containerPnl.down('hiddenfield[name=product_id]')){
                            containerPnl.down('hiddenfield[name=product_id]').setValue(product_id);
                        }
                    } else {
                        toastr.error(message, "Failure Response");
                    }
                },
                failure: function (frm, action) {
                    var resp = action.result;
                   
                        message = resp.message;
                        console.log(message);
                    toastr.error(message, "Failure Response");
                }
            });
        } else {
            toastr.warning('Please fill all the required fields!!', 'Warning Response');
        }
}

});
