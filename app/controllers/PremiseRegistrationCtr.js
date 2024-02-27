Ext.define('Admin.controller.PremiseRegistrationCtr', {
    extend: 'Ext.app.Controller',
    stores: [
         'Admin.store.premiseRegistration.PremiseRegGridAbstractStore',
         'Admin.store.premiseRegistration.PremiseRegComboAbstractStore',
         'Admin.store.premiseRegistration.CommonUseRegistrationStr',
         'Admin.store.premiseRegistration.DrugsPremiseRegistrationStr',
         'Admin.store.premiseRegistration.CosmeticsPremiseRegistrationStr',
         'Admin.store.premiseRegistration.MedicinePremiseRegistrationStr',
         'Admin.store.premiseRegistration.OnlinePremRegistrationStr',
         'Admin.store.premiseRegistration.PremiseOtherDetailsOnlineStr',
         'Admin.store.premiseRegistration.PremisePersonnelDetailsOnlineStr',
         'Admin.store.premiseRegistration.FoodPremDocOnlineUploadsStr',
         'Admin.store.premiseRegistration.TraPersonnelQualificationsStr',
         'Admin.store.premiseRegistration.PremisesInspectionDashGridStr',
         'Admin.store.parameters.premiseregistration.BusinessScalesStr',
         'Admin.store.parameters.premiseregistration.SectionsStr',
         'Admin.store.parameters.premiseregistration.BusinessTypesStr',
         'Admin.store.parameters.premiseregistration.BusinessTypeDetailsStr',
         'Admin.store.parameters.premiseregistration.BusinessCategoriesStr',
         'Admin.store.parameters.premiseregistration.StudyFieldsStr',
         'Admin.store.parameters.premiseregistration.PersonnelQualificationsStr',
         'Admin.store.parameters.premiseregistration.PersonnelPositionsStr'
        
    ],
    config: {
        refs: [{
            ref: 'mainPanel',
            selector: 'maincontainerwrap'
        }, {
            ref: 'mainTabPanel',
            selector: '#contentPanel'
        }],

        control: {
            'foodpremregtb button[name=foodPremiseRegHomeBtn]': {
                click: 'foodPremiseRegHome'
            },
            'drugspremregtb button[name=drugsPremiseRegHomeBtn]': {
                click: 'drugsPremiseRegHome' 
            },
            'cosmeticspremregtb button[name=cosmeticsPremiseRegHomeBtn]': {
                click: 'cosmeticsPremiseRegHome'
            },
            'meddevicespremregtb button[name=medDevicesPremiseRegHomeBtn]': {
                click: 'medDevicesPremiseRegHome'
            },
            // 'premiseapplicantselectiongrid': {
            //     itemdblclick: 'onApplicantSelectionListDblClick'
            // },
              'applicantselectiongrid': {
                itemdblclick: 'onApplicantSelectionListDblClick'
            },
            'premiseselectiongrid': {
                itemdblclick: 'onPremiseSelectionListDblClick'
            },
            // 'appdocuploadsfrm button[name=upload_file_btn]': {
            //     click: 'uploadApplicationFile'
            // },

            //NEW
            'drugsnewpremisereceivingwizard button[name=next_btn]': {
                click: 'onNextCardClick'
            },
            'drugsnewpremisereceivingwizard button[name=prev_btn]': {
                click: 'onPrevCardClick'
            },
            'drugsnewpremisereceivingwizard button[action=quickNav]': {
                click: 'quickNavigation'
            },
            //CANCELLATION
            'cancelpremisereceivingwizard button[name=next_btn]': {
                click: 'onNextCardClickCancellation'
            },
            'cancelpremisereceivingwizard button[name=prev_btn]': {
                click: 'onPrevCardClickCancellation'
            },
            'cancelpremisereceivingwizard button[action=quickNav]': {
                click: 'quickNavigationCancellation'
            },
            //SUSPENSIONS
            'suspensionpremisereceivingwizard button[name=next_btn]': {
                click: 'onNextCardClickSuspension'
            },
            'suspensionpremisereceivingwizard button[name=prev_btn]': {
                click: 'onPrevCardClickSuspension'
            },
            'suspensionpremisereceivingwizard button[action=quickNav]': {
                click: 'quickNavigationSuspension'
            },
            //prepare main interfaces
            //NEW
            'newpremisereceiving': {
                afterrender: 'prepareNewPremiseReceiving'
            },
            'newpremiseinvoicing': {
                afterrender: 'prepareNewPremiseInvoicing'
            },
            'newpremisepaymentspanel': {//originally newpremisepayments
                afterrender: 'prepareNewPremisePayments'
            },
            'newpremisemanagerinspection': {
                afterrender: 'prepareNewPremiseManagerInspection'
            },
            'newpremiseinspection': {
                afterrender: 'prepareNewPremiseInspection'
            },
            'newpremisemanagerevaluation': {
                afterrender: 'prepareNewPremiseManagerEvaluation'
            },
            'newpremiseevaluation': {
                afterrender: 'prepareNewPremiseEvaluation'
            },
           
            'newpremisemanagerreview': {
                afterrender: 'prepareNewPremiseManagerReview'
            },
            'newpremiseapprovals': {
                afterrender: 'prepareNewPremiseMainApprovals'
            },
            
            'newsinglepremiseapproval': {
                afterrender: 'prepareSinglePremiseApproval'
            },
            'newpremisecommunication': {
                afterrender: 'prepareNewPremiseCommunications'
            },
            //RETRURNS
            'annualreturnpremiseReceiving': {
                afterrender: 'prepareRenewPremiseReceiving'
            },
            //RENEW
            'renewpremisereceivingwizard button[action=quickNav]': {
                click: 'quickNavigationRenewal'
            },
            'renewpremisereceiving': {
                afterrender: 'prepareRenewPremiseReceiving'
            },
            'renewpremiseinvoicing': {
                afterrender: 'prepareRenewalPremiseInvoicing'
            },
            'renewpremisepayments': {
                afterrender: 'prepareRenewalPremisePayments'
            },
            'renewpremisemanagerinspection': {
                afterrender: 'prepareNewPremiseManagerInspection'
            },
            'renewpremiseinspection': {
                afterrender: 'prepareRenewalPremiseInspection'
            },
            'renewpremisemanagerevaluation': {
                afterrender: 'prepareNewPremiseManagerEvaluation'
            },
            'renewpremiseevaluation': {
                afterrender: 'prepareRenewalPremiseEvaluation'
            },
            'renewpremisemanagerreview': {
                afterrender: 'prepareNewPremiseManagerReview'
            },
            'renewpremiseapprovals': {
                afterrender: 'prepareNewPremiseMainApprovals'
            },
            'renewpremisecommunication': {
                afterrender: 'prepareNewPremiseCommunications'
            },
            //ALTERATION
            'registeredpremisesgrid': {
                refresh: 'refreshRegisteredPremisesgrid'
            }, 
            'registeredpremisesgrid': {
                itemdblclick: 'onRegisteredPremisegridDblClick'
            },
            'altpremisereceivingwizard button[action=quickNav]': {
                click: 'quickNavigationAlteration'
            },
            'altpremisereceiving': {
                afterrender: 'prepareAlterationPremiseReceiving'
            },
            'altpremiseapprovals': {
                afterrender: 'prepareNewPremiseMainApprovals'
            },
            'altpremisecommunication': {
                afterrender: 'prepareNewPremiseCommunications'
            },
            //CANCELLATION
            'cancelpremisereceiving': {
                afterrender: 'prepareCancellationPremiseReceiving'
            },
            'cancelpremiseapprovals': {
                afterrender: 'prepareNewPremiseMainApprovals'
            },
            'cancelpremisecommunication': {
                afterrender: 'prepareNewPremiseCommunications'
            },
            //SUSPENSION
            'suspensionpremisereceiving': {
                afterrender: 'prepareSuspensionPremiseReceiving'
            },
            'suspensionpremiseapprovals': {
                afterrender: 'prepareNewPremiseMainApprovals'
            },
            'suspensionpremisecommunication': {
                afterrender: 'prepareNewPremiseCommunications'
            },
            //ONLINE
            'newpremiseonlinepreviewpnl': {
                afterrender: 'prepareNewPremiseOnlinePreview'
            },
            'cancelpremiseonlinepreviewpnl': {
                afterrender: 'prepareNewPremiseOnlinePreview'
            },
            'altpremiseonlinepreviewpnl': {
                afterrender: 'prepareNewPremiseOnlinePreview'
            },'renewalpremiseonlinepreviewpnl': {
                afterrender: 'prepareNewPremiseOnlinePreview'
            },
            
            //COMPARE DETAILS
            'premisecomparepanel': {
                afterrender: 'preparePremiseComparePreview'
            },
            //end
            //Submission NEW
            'newpremisereceivingwizard  button[name=process_submission_btn]': {
                click: 'showNewReceivingApplicationSubmissionWin'
            },
            'managerinspectiongrid button[action=process_submission_btn]': {
                click: 'showManagerInspectionApplicationSubmissionWin'
            },
            'newpremiseinspectionpanel button[name=process_submission_btn]': {
                click: 'showInspectionApplicationSubmissionWin'
            },
          

            'newpremiseevaluationpanel button[name=process_submission_btn]': {
                click: 'showEvaluationApplicationSubmissionWin'
            },
            'newfoodapprovalswizard button[name=process_submission_btn]': {
                click: 'showSingleApprovalsApplicationSubmissionWin'
            },
            'newsinglepremiseapprovalwizard button[name=process_submission_btn]': {
                click: 'showSingleApprovalsApplicationSubmissionWin'
            },
            'communicationsgrid button[action=process_submission_btn]': {
                click: 'showCommunicationsApplicationSubmissionWin'
            },
            'managerquerygrid button[action=process_submission_btn]': {
                click: 'showManagerQueryApplicationSubmissionWin'
            },
            'premisemanagerqueryresponsegrid button[action=process_submission_btn]': {
                click: 'showManagerQueryApplicationSubmissionWin'
            },
            //Submission RENEWAL
            'renewpremisereceivingwizard button[name=process_submission_btn]': {
                click: 'showRenewalReceivingApplicationSubmissionWin'
            },
            'renewpremiseinspectionpanel button[name=process_submission_btn]': {
                click: 'showInspectionApplicationSubmissionWin'
            },
            'renewpremiseevaluationpanel button[name=process_submission_btn]': {
                click: 'showEvaluationApplicationSubmissionWin'
            },
            'communicationsrenewalgrid button[action=process_submission_btn]': {
                click: 'showCommunicationsApplicationSubmissionWin'
            },
            //Submission ALTERATION
            'altpremisereceivingwizard button[name=process_submission_btn]': {
                click: 'showAlterationReceivingApplicationSubmissionWin'
            },
            //Submission CANCELLATION
            'cancelpremisereceivingwizard button[name=process_submission_btn]': {
                click: 'showCancellationReceivingApplicationSubmissionWin'
            },
            //Submission SUSPENSION
            'suspensionpremisereceivingwizard button[name=process_submission_btn]': {
                click: 'showSubmisionsReceivingApplicationSubmissionWin'
            },
            //
            'invoicingcostelementsgrid combo[name=fee_type_id]': {
                change: 'onInvoiceFeeTypeChange'
            },
            'paymentinvoicingcostdetailsgrid': {
                refresh: 'refreshInvoiceCostDetailsGrid'
            },
            'onlinepaymentinvoicingcostdetailsgrid': {
                refresh: 'refreshOnlineInvoiceCostDetailsGrid'
            },
            
            'applicationpaymentsgrid': {
                refresh: 'addApplicationIdCodeParams'
            },
            'onlineapplicationpaymentsgrid': {
                refresh: 'addOnlineApplicationIdCodeParams'
            },
            
            'uploadedapplicationpaymentsgrid': {
                refresh: 'addOnlineApplicationIdCodeParams'
            },
            'approvaluploadeddocsgrid': {
                refresh: 'addApplicationIdCodeParams'
            },
            'approvalcommentsgrid': {
                refresh: 'addApplicationIdCodeParams'
            },
            'applicationpaymentsgrid button[name=remove_selected]': {
                click: 'removeApplicationPaymentDetails'
            },
            'managerreviewgrid': {
                previousUploadedDocs: 'showPreviousUploadedDocs'
            },
            'foodpremauditingcheckgrid': {
                refresh: 'refreshAuditingChecklistItemsGrid'
            },
            'premiseinspectionscreeninggrid' :{
                refresh :'refreshApplicableChecklist'
            },
            // 'premisescreeninggrid' :{
            //     refresh :'refreshApplicableChecklist'
            // },
            // 'inspectioninspectorsgrid':{
            //     refresh:'refreshpremisesinspectionschedulinggrid'
            // },
            'managerreviewgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'managerreviewrenewalgrid': {
                refresh: 'addApplicationWorkflow',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'managerreviewgrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'managerevaluationgrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'managerevaluationgrid': {
                refresh: 'addApplicationWorkflowParams',
                moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'managerreviewrenewalgrid': {
                previousUploadedDocs: 'showPreviousUploadedDocs'
            },
            'newfoodpremauditing button[name=save_btn]': {
                click: 'saveApplicationAuditingChecklistDetails'
            },
            'foodnewevaluationpnl button[name=show_template]': {
                click: 'showApplicationEvaluationTemplate'
            },
            'newsinglepremiseapprovalwizard button[name=show_recommendation]': {
                click: 'getApplicationApprovalDetails'
            },
            'foodnewonlinereceivingwizard button menu menuitem[name=action_accept]': {
                click: 'saveOnlineApplicationDetails'
            },
            'foodnewonlinereceivingwizard button menu menuitem[name=action_reject]': {
                click: 'rejectOnlineApplicationDetails'
            },
            'premiseotherdetailsgrid': {
                refresh: 'addPremiseDependentGrids'
            },
            'premiseotherdetailsgrid button[name=add_details]': {
                click: 'showAddPremiseOtherDetails'
            },
            'premisepersonneldetailsgrid': {
                refresh: 'addPremiseDependentGrids',//'addPremiseApplicantIDs'
                editPremisePersonnel: 'showEditPremisePersonnelDetails',
                beforerender: 'updateIsWinProperty'
            },
            'premiseproprietorsdetailsgrid': {
                refresh: 'addPremiseDependentGrids',//'addPremiseApplicantIDs'
                editPropriteryDetails: 'showEditPremisePersonnelDetails',
                beforerender: 'updateIsWinProperty'
            },
            'premisecontactpersonfrm': {
                beforerender: 'updateIsWinPropertyonForm'
            },
            'premisepersonneldetailsgrid button[name=add_personnel]': {
                click: 'showAddPremisePersonnelDetails'
            },
            'premiseproprietorsdetailsgrid button[name=add_proprietor]': {
                click: 'showAddPremisePersonnelDetails'
            },
            'newpremiseinspectionpanel button[name=more_app_details]': {
                click: 'showApplicationMoreDetails'
            },
            'newpremiseevaluationpanel button[name=more_app_details]': {
                click: 'showApplicationMoreDetails'
            },
            'newpremiseinvoicingpanel form toolbar button[name=more_app_details]': {
                click: 'showApplicationMoreDetails'
            },
            'newpremisepaymentspanel form toolbar button[name=more_app_details]': {//originally renewpremiseinvoicingpanel
                click: 'showApplicationMoreDetails'
            },
            
            'renewpremisepaymentspanel form toolbar button[name=more_app_details]': {
                click: 'showApplicationMoreDetails'
            },
            'newpremiseinspectionpanel form toolbar button[name=more_app_details]': {
                click: 'showApplicationMoreDetails'
            },
            'newpremiseevaluationpanel form toolbar button[name=more_app_details]': {
                click: 'showApplicationMoreDetails'
            },
            'renewpremiseinspectionpanel form toolbar button[name=more_app_details]': {
                click: 'showApplicationMoreDetails'
            },
            'newpremiseevaluationpanel form toolbar button[name=more_app_details]': {
                click: 'showApplicationMoreDetails'
            },
            'renewpremiseevaluationpanel form toolbar button[name=more_app_details]': {
                click: 'showApplicationMoreDetails'
            },
            'newpremiseinspectionpanel button[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },
            'managerreviewgrid button menu menuitem[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },
            'managerreviewrenewalgrid button menu menuitem[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },
            'newpremiseinspectionpanel button[name=premisesinspectiondocs_btn]': {
                click: 'showInspectionRecommendationDetails'
            },
            'newpremiseevaluationpanel button[name=premisesinspectiondocs_btn]': {
                click: 'showInspectionRecommendationDetails'
            },
            //SAVE
            'newpremisereceivingwizard button[name=save_btn]': {//new
                click: 'savePremiseNewReceivingBaseDetails'
            },
            'renewpremisereceivingwizard button[name=save_btn]': {//renewal
                click: 'savePremiseRenewalReceivingBaseDetails'
            },
            'altpremisereceivingwizard button[name=save_btn]': {//alteration
                click: 'savePremiseAlterationReceivingBaseDetails'
            },
            'cancelpremisereceivingwizard button[name=save_btn]': {//cancellation
                click: 'savePremiseCancellationReceivingBaseDetails'
            },
            'suspensionpremisereceivingwizard button[name=save_btn]': {//suspensions
                click: 'savePremiseCancellationReceivingBaseDetails'
            },
             'annualreturnspremisereceivingwizard button[name=save_btn]': {//cancellation
                click: 'savePremiseCancellationReceivingBaseDetails'
            },
            'premiseappmoredetailswizard button[name=save_btn]': {//late updates...Inspection, Evaluation and Com with Applicants
                click: 'updatePremiseApplicationDetails'
            },
            'enforcementappmoredetailswizard button[name=save_btn]': {//late updates...Inspection, Evaluation and Com with Applicants
                click: 'updatePremiseApplicationDetails'
            },
            'personnelbasicinfofrm button[action=link_personnel]': {
                click: 'showTraderPersonnel'
            },
            'premisepersonnelabstractfrm button[action=link_personnel]': {
                click: 'showTraderPersonnelSelectionGrid'
            },
            'premisecontactpersonfrm button[action=link_personnel]': {
                click: 'showTraderPersonnelSelectionGrid'
            },
            'invoicingcostelementsgrid': {
                select: 'addInvoiceCostElement',
                beforeselect: 'beforeCostElementSelect'
            },
            'invoicingcostdetailsgrid': {
                refresh: 'refreshInvoiceCostDetailsGrid',
                select: 'onInvoiceItemSelect',
                deselect: 'onInvoiceItemDeselect',
                beforeselect: 'beforeCostElementSelect',
                beforeedit: 'beforeCostElementEdit'
            },
            'newpremiseevaluationpanel toolbar menu menuitem[name=prev_uploads]': {
                click: 'showPreviousUploadedDocs'
            },
            'renewpremiseevaluationpanel toolbar menu menuitem[name=prev_uploads]': {
                click: 'showPreviousUploadedDocs'
            },
            'managerinspectiongrid button[name=save_btn]': {
                click: 'saveInspectionDetails'
            },
            // 'premisesinspectionschedulinggrid button[name=save_btn]': {
            //     click: 'saveInspectionDetails'
            // },
            'premiseManagerMeetingGrid menu menuitem[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },
            'premiseReviewTCMeetingGrid menu menuitem[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },
            'premisePeerReviewMeetingGrid menu menuitem[name=comments_btn]': {
                click: 'showApplicationCommentsWin'
            },
            'applicantdetailsfrm button[action=link_applicant]': {
                click: 'showApplicantSelectionList'
            },
            'premisedetailsfrm button[action=search_premise]': {
                click: 'showPremiseSelectionList'
            },
            'alterationsetupparamsgrid': {
                refresh: 'addApplicationModuleSetUpParams'
            },
            'alterationsetupformfieldsgrid combo[name=form_id_cmb]': {
                afterrender: 'refreshAlterationFormsCombo'
            },
            'alterationsetupformfieldsgrid button[name=effect_changes]': {
                click: 'syncAlterationAmendmentFormParts'
            },
            'alterationsetupparamsgrid button[name=effect_changes]': {
                click: 'syncAlterationAmendmentOtherParts'
            },
            'alterationsetupformfieldsgrid': {
                refresh: 'refreshAlterationFormFieldsGrid'
            },
            'premisedetailsfrm combo[name=country_id]': {
                afterrender: 'afterPremiseCountriesComboRender'
            },
            'traderpersonnelgrid': {
                itemdblclick: 'onTraderPersonnelItemdblclick'
            },
              'medicaldevicespremisesinspectiontb button[name=medicaldevicespremisesinspectionHomeBtn]': {
                click: 'premisesinspectionHomeBtn' 
            }, 'medicinespremisesinspectiontb button[name=medicinespremisesinspectionHomeBtn]': {
                click: 'premisesinspectionHomeBtn' 
            },
            'premisesinspectiondetailsfrm button[name=save_btn]': {
                click: 'savePremisesInspectionDetails'
            },
            'premisesinspectionschedulinggrid button[name=save_btn]': {
                click: 'savePremisesRoutineInspectionDetails'
            },
            'premisesinspectionschedulinggrid button[action=search_premise]': {
                click: 'showPremiseInspectionSelection'
            },'registeredpremiseselectiongrid button[name=addregpremisesbtn]': {
                click: 'linkRegisteredPremisestoInpection'
            },'inspectionpremiseselectiongrid button[name=addregpremisesbtn]': {
                click: 'linkRegisteredPremisestoInpection'
            },
            
            
            'premisesinspectiondashgrid': {
                refresh: 'refreshpremisesinspectiondashgrid'
            },
            'premisesinspectionschedulingpanel': {
                afterrender: 'preparepremisesinspectionschedulingpanel'
            },
            'premisesinspectionschedulinggrid': {
                refresh: 'refreshpremisesinspectionschedulinggrid'
            },
            'premisesinspectionschedulinggrid button[action=process_submission_btn]': {
                click: 'shownewPremisesInspectionApplicationSubmissionWin'
            },'premisesinspectionprocesspanel': {
                afterrender: 'preparePremisesInspectionProcesspanel'
            },
            'premisesinspectionprocessgrid': {
                refresh: 'refreshpremisesinspectionschedulinggrid'
            },
            'premisesinspectionprocessgrid button[action=process_submission_btn]': {
                click: 'showPremisesInspectionApplicationSubmissionWin'
            },
            'premisesinspectionreviewrecomgrid button[action=process_submission_btn]': {
                click: 'showApprovalInspectionApplicationSubmissionWin'
            },
            // 'premiseManagerMeetingGrid button[action=process_submission_btn]': {
            //     click: 'showApprovalInspectionApplicationSubmissionWin'
            // },
            'premisesinspectionreviewrecomgrid': {
                refresh: 'refreshpremisesinspectionApprovalgrid'
            },
            'premisesInspectionPeerReviewRecomGrid': {
                refresh: 'refreshpremisesinspectionApprovalgrid'
            },
            'inspectedapprovedpremisesinspectiondashgrid': {
                refresh: 'refreshinspectedapprovedpremisesinspectiondashgrid'
            },
            'newpremisepaymentspanel button[name=process_submission_btn]': {
                click: 'showPaymentApplicationSubmissionWin'
            },
            'communicationsgrid button[action=process_submission_btn]': {
                click: 'showCommunicationsApplicationSubmissionWin'
            },
            //meeting stage
            'newPremiseTcMeetingpnl': {
                afterrender: 'preparePremiseTCMeeting'
            },
            'premisepeerReviewMeetingPnl': {
                afterrender: 'preparePremiseManagerMeeting'
            },
           
            'premiseManagerMeetingGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            // 'premisesInspectionPeerReviewRecomGrid button[name=save_btn]': {
            //     click: 'saveTCMeetingDetails'
            // },
            'inspectionpeerReviewSchedulingPnl': {
                afterrender: 'preparePremiseRoutineInspectionPeerReviewSchedule'
            },
            'inspectionPeerReviewPnl': {
                afterrender: 'preparePremiseRoutineInspectionPeerReview'
            },
            // 'inspectionPeerReviewPnl': {
            //     afterrender: 'preparePremiseManagerMeeting'
            // },
            'newpremisetcMeetingGrid button[name=save_btn]': {
                click: 'savePeerMeetingDetails'
            },
            'premiseManagerMeetingGrid': {
                refresh: 'managerMeetingRefreshGrid',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            'premiseVariationApprovalGrid': {
                refresh: 'addApplicationWorkflowParams',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            'newpremisetcMeetingGrid': {
                refresh: 'managerMeetingRefreshGrid',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            'newpremiseinspectionpanel button[name=more_app_details]': {
                click: 'showApplicationMoreDetails'
            },     
            'newPremiseTcReviewMeetingpnl': {
                afterrender: 'preparePremiseTcRecommReview'
            },
            'newPremisePeerReviewMeetingpnl': {
                afterrender: 'preparePremiseRecommPeerReview'
            },
            'premisetcreviewreportinspectionreview': {
                afterrender: 'preparePremiseRecommReview'
            },
            
            'newPremiseTcapprovalReviewMeetingpnl': {
                afterrender: 'preparePremiseRecommApproval'
            },
            'premiseReviewTCMeetingGrid': {
                refresh: 'managerMeetingRefreshGrid',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            'premisePeerReviewMeetingGrid': {
                refresh: 'managerMeetingRefreshGrid',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            'premisetcreviewreportinspectionreviewgrid': {
                refresh: 'managerMeetingRefreshGrid',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            
            'premiseReviewTCMeetingApprovalGrid': {
                refresh: 'managerMeetingRefreshGrid',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            'variableListGrid': {
                refresh: 'getAllApplicationDetails'
            },
            'premiseVariationRecommendationsGrid': {
                refresh: 'refreshVariationRecommendationGrid'
            },
            'premisesinspectionreviewrecompnl': {
                afterrender: 'preparePremisesInspectionReviewreComPnl'
            },
            'managerquerygrid':{
                refresh: 'refreshmanagerquerygrid'
            }
            
        }

    },

    /**
     * Called when the view is created
     */
    init: function () {

    },

    listen: {
        controller: {
            '*': {
                setPremiseRegGridsStore: 'setPremiseRegGridsStore',
                setPremiseRegCombosStore: 'setPremiseRegCombosStore',
                newPremiseRegistration: 'onNewPremiseRegApplication',
                onNewPremiseRoutineInspectionpplication: 'onNewPremiseRoutineInspectionpplication',
                showNewPremiseInspectionSchedule:'showNewPremiseInspectionSchedule',
                onEditFoodPremiseRegApplication: 'onEditFoodPremiseRegApplication',
                applicationMoreDetails: 'showApplicationMoreDetailsGeneric',
                showPremisesInspectionDetailsWizard:'showPremisesInspectionDetailsWizard',
                redoPremiseOtherDetailsGrid: 'redoPremiseOtherDetailsGrid',
                redoPremisePersonnelDetailsGrid: 'redoPremisePersonnelDetailsGrid',
                previewPremisesOnlineApplication:'previewPremisesOnlineApplication',
                funcGetApplicableChecklist:'funcGetApplicableChecklist',
                funcGetApplicableEvaluationChecklist:'funcGetApplicableEvaluationChecklist',
                getApplicationDetails :'getAllApplicationDetails',
                loadPremiseAltRenWizardFromRecord: 'onRenPremiseRegApplication',
                saveContactPerson: 'saveContactPerson',
                showAddViewVariationRecommendations: 'showAddViewVariationRecommendations',
                showFacilityRegister:'showFacilityRegister',
                savefacilityInpsectionMeetingDetails: 'saveTCMeetingDetails',
                selectUpcomingScheduleOnDblClick: 'selectUpcomingScheduleOnDblClick'
            }
        }
    },previewPremisesOnlineApplication: function (view, record) {
        var grid = view.grid,
            isRejection = grid.isRejection,
            isReadOnly = grid.isReadOnly,
            status_id = record.get('application_status_id'),
            status_type_id = record.get('status_type_id'),
            status_name = record.get('application_status'),
            tracking_no = record.get('tracking_no'),
            application_id = record.get('active_application_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            application_code = record.get('application_code'),
            application_status_id = record.get('application_status_id'),
            is_manager_query = record.get('is_manager_query'),
            process_id = record.get('process_id'),
            onlinePanelXtype,
            wizardPnlXtype;
        if (sub_module_id == 3 || sub_module_id === 3) {//Alteration
            onlinePanelXtype = 'altpremiseonlinepreviewpnl';
            wizardPnlXtype = 'altpremiseonlinepreviewwizard';
        } else if (sub_module_id == 4 || sub_module_id === 4) {//Withdrawal
            onlinePanelXtype = 'cancelpremiseonlinepreviewpnl';
            wizardPnlXtype = 'cancelpremiseonlinepreviewwizard';
        }else if(sub_module_id == 2) {//New, Renewal
            onlinePanelXtype = 'renewalpremiseonlinepreviewpnl';
            wizardPnlXtype = 'renewalpremiseonlinepreviewwizard';
        } else {//New, Renewal
            onlinePanelXtype = 'newpremiseonlinepreviewpnl';
            wizardPnlXtype = 'newpremiseonlinepreviewwizard';
        }
        var onlinePanel = Ext.widget(onlinePanelXtype),
            wizardPnl = onlinePanel.down(wizardPnlXtype),
            docsGrid = onlinePanel.down('premregonlinedocuploadsgenericgrid'),
            premisePersonnelGrid = wizardPnl.down('premisepersonneldetailsgrid');
        if (status_id == 23 && isRejection != 1) {
            toastr.warning('Action not allowed for application in this status [' + status_name + '] ', 'Warning Response');
            return false;
        }
        if (isRejection == 1) {
            wizardPnl.down('button[name=prev_rejections]').setVisible(true);
            wizardPnl.down('button[name=actions]').setVisible(true);
            wizardPnl.down('button[name=submit_btn]').setVisible(false);
            wizardPnl.down('button[name=query_btn]').setVisible(false);
            wizardPnl.down('button[name=reject_btn]').setVisible(false);
        }
        /* if (is_manager_query == 1 || is_manager_query === 1) {
             wizardPnl.down('button[name=preview_queries_btn]').setVisible(true);
         }*/
        if (status_type_id == 2 || status_type_id === 2 || status_type_id == 3 || status_type_id === 3) {//pre checking and manager query response
           // wizardPnl.down('button[name=preview_queries_btn]').setVisible(true);
        }
        docsGrid.down('hiddenfield[name=application_code]').setValue(application_code);
        docsGrid.down('hiddenfield[name=section_id]').setValue(section_id);
        docsGrid.down('hiddenfield[name=module_id]').setValue(module_id);
        docsGrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        onlinePanel.down('hiddenfield[name=active_application_id]').setValue(application_id);
        onlinePanel.down('hiddenfield[name=active_application_code]').setValue(application_code);
        onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
        onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
        onlinePanel.down('hiddenfield[name=application_status_id]').setValue(application_status_id);
        onlinePanel.down('hiddenfield[name=process_id]').setValue(process_id);
        onlinePanel.down('button[action=link_applicant]').setDisabled(true);
        onlinePanel.down('premisedetailsfrm').down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        if(onlinePanel.down('hiddenfield[name=is_manager_query]')){
            onlinePanel.down('hiddenfield[name=is_manager_query]').setValue(is_manager_query);
        }
        if(onlinePanel.down('hiddenfield[name=status_type_id]')){
            onlinePanel.down('hiddenfield[name=status_type_id]').setValue(status_type_id);
       
        }
        premisePersonnelGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        premisePersonnelGrid.setIsWin(1);
        premisePersonnelGrid.setIsOnline(1);
        wizardPnl.down('premisecontactpersonfrm').down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        funcShowCustomizableWindow(tracking_no, '80%', onlinePanel, 'customizablewindow');
    }, refreshinspectedapprovedpremisesinspectiondashgrid: function (me) {
        
        var store = me.store,
            inspection_status_id = me.inspection_status_id,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form'),
            formValues = activeTab.down('form').getValues();
            //get the 
            Ext.apply(store.getProxy().extraParams, formValues);
    },
    linkRegisteredPremisestoInpection:function(btn){
        var grid = btn.up('grid'),
            win = grid.up('window'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            inspection_premsgrid = activeTab.down('premisesinspectionschedulinggrid'),
            inspection_premsgridstr = inspection_premsgrid.store,
            inspection_id = activeTab.down('hiddenfield[name=id]').getValue(),
            
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            params = [],
            sm = grid.getSelectionModel(),
            selected_records = sm.getSelection(),
            selected = [],
            mask = new Ext.LoadMask(
                {
                    target: grid,
                    msg: 'Please wait...'
                }
            );
      
        Ext.each(selected_records, function (item) {
            var main_registered_id = item.data.main_registered_id,
                premise_id = item.data.premise_id,
               
                obj = {
                    main_registered_id: main_registered_id,
                    premise_id: premise_id
                };
            selected.push(obj);
        });
        mask.show();
        Ext.Ajax.request({
            url: 'premiseregistration/linkRegisteredPremisestoInpection',
            params: {
                selected: JSON.stringify(selected),
                section_id: section_id,
                sub_module_id: sub_module_id,
                workflow_stage_id:workflow_stage_id,
                process_id:process_id,
                inspection_id:inspection_id,
                module_id: module_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                mask.hide();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success || success == true || success === true) {
                    toastr.success(message, 'Success Response!!');
                    activeTab.down('hiddenfield[name=active_application_id]').setValue(resp.application_id),
                    inspection_premsgridstr.load();
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
onRenPremiseRegApplication: function (view, record) {
    Ext.getBody().mask('Please wait...');
    var me = this,
        mainTabPanel = me.getMainTabPanel(),
        grid = view.grid,
        process_id = record.get('process_id'),
        workflow_stage_id = record.get('workflow_stage_id'),
        sub_module_id = grid.sub_module_id,
        module_id = record.get('module_id'),
        section_id = record.get('section_id'),
        premise_type_id=record.get('premise_type_id'),
        workflow_stage = record.get('workflow_stage'),
        ref_no = record.get('tracking_no'),
         view_id = record.get('view_id'),
        title = 'Facility Renewal',
        workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id,null,null,null,premise_type_id); //getAllWorkflowDetails(process_id, workflow_stage_id);
    if (!workflow_details) {
        Ext.getBody().unmask();
        toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
        return false;
    }
    var tab = mainTabPanel.getComponent(view_id);
    if(sub_module_id == 3 || sub_module_id == 78){
        title = "Facility Variation";
    }else if(sub_module_id == 4){
        title = 'Facility Withdrawal';
    }else if(sub_module_id == 81){
        title = 'Facility Suspension';
    }else if(sub_module_id == 1){
        title = 'Facility Registration';
    }
    if (!tab) {
        var newTab = Ext.widget(workflow_details.viewtype, {
            title: title,
            closable: true
        });
        record.set('sub_module_id', sub_module_id);
        record.set('process_id', workflow_details.processId);
        record.set('workflow_stage_id', workflow_details.initialStageId);
        record.set('workflow_stage', workflow_details.initialStageName);
        record.set('application_status', workflow_details.initialAppStatus);
        record.set('process_name', workflow_details.processName);
    //set prerequisites
    me.prepareRenApplicationBaseDetails(newTab, record);
    if(sub_module_id == 2 || sub_module_id == 3 || sub_module_id == 4 || sub_module_id == 81 || sub_module_id == 78){
        newTab.getViewModel().set('isReadOnly', true);
    }
     if(sub_module_id == 1){
        newTab.getViewModel().set('isReadOnly', false);
    }
    if(sub_module_id != 1){
        newTab.down('button[name=save_btn]').action_url = 'saveRenAltProductReceivingBaseDetails';
    }
    //load form
        mainTabPanel.add(newTab);
        var lastTab = mainTabPanel.items.length - 1;
        mainTabPanel.setActiveTab(lastTab);
    } else {
        mainTabPanel.setActiveTab(tab);
    }

    //loading prefilled form
    me.onRegisteredPremisegridDblClick(newTab, record);

    //close pop up if there
    grid = Ext.ComponentQuery.query("#premiseApprovedApplicationListGrid")[0];
    if(grid){
        grid.up('window').close();
    }
    Ext.Function.defer(function () {
        Ext.getBody().unmask();
    }, 300);
},
prepareRenApplicationBaseDetails: function (tab, record) {
    var me = this,
        process_name = record.get('process_name'),
        workflow_stage = record.get('workflow_stage'),
        application_status = record.get('application_status'),
        reference_no = record.get('reference_no'),
        process_id = record.get('process_id'),
        module_id = record.get('module_id'),
        sub_module_id = record.get('sub_module_id'),
        section_id = record.get('section_id'),
        premise_type_id=record.get('premise_type_id'),
        workflow_stage_id = record.get('workflow_stage_id');
 
    if(tab.down('hiddenfield[name=premise_type_id]')){
         tab.down('hiddenfield[name=premise_type_id]').setValue(record.get('premise_type_id'));
    }
    tab.down('hiddenfield[name=process_id]').setValue(process_id);
    tab.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
    tab.down('hiddenfield[name=module_id]').setValue(module_id);
    tab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
    tab.down('hiddenfield[name=section_id]').setValue(section_id);
    tab.down('hiddenfield[name=premise_type_id]').setValue(premise_type_id);
    tab.down('displayfield[name=process_name]').setValue(process_name);
    tab.down('displayfield[name=workflow_stage]').setValue(workflow_stage);
    tab.down('displayfield[name=application_status]').setValue(application_status);
    tab.down('displayfield[name=reference_no]').setValue(reference_no);
},

    afterPremiseCountriesComboRender: function (cmbo) {
        var form = cmbo.up('form'),
            is_local = form.down('hiddenfield[name=is_local]').getValue(),
            store = cmbo.getStore(),
            filterObj = {is_local: is_local},
            filterStr = JSON.stringify(filterObj);
        store.removeAll();
        store.load({params: {filter: filterStr}});
    },

    setPremiseRegGridsStore: function (me, options) {

        var config = options.config,
            isLoad = options.isLoad,
            toolbar = me.down('pagingtoolbar'),
            store = Ext.create('Admin.store.premiseRegistration.PremiseRegGridAbstractStore', config);

        me.setStore(store);
        toolbar.setStore(store);

        if (isLoad === true || isLoad == true) {
            store.removeAll();
            store.load();
        }
    },

    setPremiseRegCombosStore: function (me, options) {
        var config = options.config,
            isLoad = options.isLoad,
            store = Ext.create('Admin.store.premiseRegistration.PremiseRegComboAbstractStore', config);
        me.setStore(store);
        if (isLoad === true || isLoad == true) {
            store.removeAll();
            store.load();
        }
    },

    refreshAlterationFormsCombo: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue();
        store.removeAll();
        store.load({params: {module_id: module_id}});
    },

    addApplicationIdCodeParams: function (me) {
        
        if(me.up('paymentspanel')){
            var payment_pnl = me.up('paymentspanel');
            if(payment_pnl.up('panel')){
                var popupview = payment_pnl.up('panel'),
                    store = me.getStore(),
                application_id = popupview.down('hiddenfield[name=active_application_id]').getValue(),
                application_code = popupview.down('hiddenfield[name=active_application_code]').getValue();
            }
        }
        else{
            var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        }
        
        store.getProxy().extraParams = {
            application_id: application_id,
            application_code: application_code
        };
    },
    
    addOnlineApplicationIdCodeParams: function (me) {
        if(me.up('window')){
            var payment_pnl = me.up('window');
            var popupview = payment_pnl
                    store = me.getStore(),
                application_id = popupview.down('hiddenfield[name=active_application_id]').getValue(),
                application_code = popupview.down('hiddenfield[name=active_application_code]').getValue();

        }
        else{
            var  mainTabPanel = this.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                    store = me.getStore(),
                application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        }
            
           
        store.getProxy().extraParams = {
            application_id: application_id,
            application_code: application_code
        };
    },
    addApplicationBaseParams: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        store.getProxy().extraParams = {
            application_id: application_id,
            application_code: application_code,
            workflow_stage_id: workflow_stage_id
        };
    },

    addPremiseApplicantIDs: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            premise_id = activeTab.down('hiddenfield[name=premise_id]').getValue(),
            applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue();
        store.getProxy().extraParams = {
            premise_id: premise_id,
            applicant_id: applicant_id
        };
    },

    addPremiseDependentGrids: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            isWin = grid.getIsWin(),
            isOnline = grid.getIsOnline(),
            isCompare = grid.getIsCompare(),
            is_temporal = grid.down('hiddenfield[name=is_temporal]').getValue(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicant_id = (activeTab.down('hiddenfield[name=applicant_id]')) ? activeTab.down('hiddenfield[name=applicant_id]').getValue() : null,
            premise_id,manufacturing_site_id;
        
        if (isWin == 1 || isWin === 1) {
            var win = grid.up('window');
            if (isCompare == 1 || isCompare === 1) {
                if (isOnline == 1 || isOnline === 1) {
                    premise_id = win.down('premiseportalcomparepreviewpnl').down('premisedetailsfrm').down('hiddenfield[name=premise_id]').getValue();
                } else {
                    premise_id = win.down('premisemiscomparepreviewpnl').down('premisedetailsfrm').down('hiddenfield[name=premise_id]').getValue();
                }
            } else {
                premise_id = win.down('premisedetailsfrm').down('hiddenfield[name=premise_id]').getValue();
            }
        } else if(activeTab.down('hiddenfield[name=premise_id]')) {
            premise_id = activeTab.down('hiddenfield[name=premise_id]').getValue();
        }else if(activeTab.down('hiddenfield[name=manufacturing_site_id]')){
            manufacturing_site_id = activeTab.down('hiddenfield[name=manufacturing_site_id]').getValue();
        }
        //for variation refresh add flag
        var is_variation = grid.is_variation;

        store.getProxy().extraParams = {
            premise_id: premise_id,
            applicant_id: applicant_id,
            is_temporal: is_temporal,
            isOnline: isOnline,
            manufacturing_site_id: manufacturing_site_id,
            is_variation: is_variation
        };
    },

    addApplicationModuleSetUpParams: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        store.getProxy().extraParams = {
            application_id: application_id,
            application_code: application_code,
            module_id: module_id,
            sub_module_id: sub_module_id,
            section_id: section_id
        };
    },
    showFacilityRegister: function (sub_module_id, wrapper_xtype) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down(wrapper_xtype);
            dashboardWrapper.removeAll();
        var licensedFacilitiesRegisterGrid = Ext.widget('licensedFacilitiesRegisterGrid');
        dashboardWrapper.add(licensedFacilitiesRegisterGrid);
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },

    refreshAlterationFormFieldsGrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            form_id = grid.down('hiddenfield[name=form_id]').getValue(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        store.getProxy().extraParams = {
            application_id: application_id,
            application_code: application_code,
            form_id: form_id,
        };
    },
    refreshpremisesinspectiondashgrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            store.getProxy().extraParams = {
                section_id: section_id
            };
            
    },
    
    refreshpremisesinspectionschedulinggrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            inspection_id = activeTab.down('hiddenfield[name=id]').getValue(),
            implementation_id = activeTab.down('tagfield[name=implementation_id]'),
            region_ids = grid.down('tagfield[name=region_ids]'),
            district_ids = grid.down('tagfield[name=district_ids]'),
            selected_region_id,selected_district_id;
        if(region_ids){
            selected_region_id = region_ids.getValue();
        }
        if(district_ids){
            selected_district_id = district_ids.getValue();
        }
        if(implementation_id){
            selected_implementation_id = implementation_id.getValue();
        }

            store.getProxy().extraParams = {
                inspection_id: inspection_id,
                workflow_stage_id:workflow_stage_id,
                selected_region_id: JSON.stringify(selected_region_id),
                selected_district_id: JSON.stringify(selected_district_id),
                selected_implementation_id: JSON.stringify(selected_implementation_id)
            };
            

    },
    
    refreshpremisesinspectionApprovalgrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            inspection_id = activeTab.down('hiddenfield[name=inspection_id]').getValue(),
            region_ids = grid.down('tagfield[name=region_ids]'),
            district_ids = grid.down('tagfield[name=district_ids]'),
            selected_region_id,selected_district_id;

        if(region_ids){
            selected_region_id = region_ids.getValue();
        }
        if(district_ids){
            selected_district_id = district_ids.getValue();
        }
        store.getProxy().extraParams = {
            workflow_stage_id:workflow_stage_id,
            inspection_id: inspection_id,
            selected_region_id: JSON.stringify(selected_region_id),
            selected_district_id: JSON.stringify(selected_district_id)
        };
    },
    refreshManagerReviewGrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            table_name = me.table_name,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            recommendation_id = grid.down('combo[name=recommendation_id]').getValue();
        store.getProxy().extraParams = {
            table_name: table_name,
            workflow_stage_id: workflow_stage_id,
            section_id: section_id,
            recommendation_id: recommendation_id
        };
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
            inspection_id=
            inspection_type_id = me.inspection_type_id,
            table_name = getApplicationTable(module_id),
            inspection_id = null;
        if ((managerInspection) && managerInspection == 1) {
            inspection_id = activeTab.down('form').down('hiddenfield[name=id]').getValue();
        }
        store.getProxy().extraParams = {
            table_name: table_name,
            workflow_stage_id: workflow_stage_id,
            section_id: section_id,
            gmp_type_id: gmp_type_id,
            inspection_type_id: inspection_type_id,
            inspection_id: inspection_id
        };
    },
    addApplicationWorkflow: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            table_name = getApplicationTable(module_id);
        store.getProxy().extraParams = {
            table_name: table_name,
            workflow_stage_id: workflow_stage_id,
        };
    },
    moveSelectedRecordRowToTop: function (gridView) {
        /* var store = gridView.getStore(),
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
         */
     },
    getWorkflowDetails: function (module_id, section_id, application_type, is_initial) {
        var results = [];
        Ext.Ajax.request({
            method: 'GET',
            async: false,
            url: 'workflow/getWorkflowDetails',
            params: {
                module_id: module_id,
                section_id: section_id,
                sub_module_id: application_type,
                is_initial: is_initial
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success;
                if (success || success == true || success === true) {
                    results = resp.results;
                }
            }
        });
        return results;
    },
    onPrevCardClick: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            wizardPnl = activeTab.down('drugsnewpremisereceivingwizard');
        wizardPnl.getViewModel().set('atEnd', false);
        this.navigate(btn, wizardPnl, 'prev');
    },

    onNextCardClick: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            wizardPnl = activeTab.down('newpremisescreeningpanel');
        wizardPnl.getViewModel().set('atBeginning', false);
        console.log(wizardPnl);
        this.navigate(btn, wizardPnl, 'next');
    },
    quickNavigation: function (btn) {
        var step = btn.step,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            wizardPnl = activeTab.down('drugsnewpremisereceivingwizard'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            progress = wizardPnl.down('#progress_tbar'),
            progressItems = progress.items.items;
        if (step > 1) {
            var thisItem = progressItems[step];
            if (!application_id) {
                thisItem.setPressed(false);
                toastr.warning('Please save application details first!!', 'Warning Response');
                return false;
            }
        }
        if (step == 0) {
            //wizardPnl.down('button[name=save_btn]').setDisabled(true);
            wizardPnl.getViewModel().set('atBeginning', true);
        } else {
            //wizardPnl.down('button[name=save_btn]').setDisabled(false);
            wizardPnl.getViewModel().set('atBeginning', false);
        }
        if (step > 1) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
        } else {
            wizardPnl.down('button[name=save_btn]').setVisible(true);
        }
        if (step == 3) {
            // wizardPnl.down('button[name=save_screening_btn]').setVisible(true);
            wizardPnl.getViewModel().set('atEnd', true);
        } else {
            // wizardPnl.down('button[name=save_screening_btn]').setVisible(false);
            wizardPnl.getViewModel().set('atEnd', false);
        }
        wizardPnl.getLayout().setActiveItem(step);
        var layout = wizardPnl.getLayout(),
            item = null,
            i = 0,
            activeItem = layout.getActiveItem();

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (step === item.step) {
                item.setPressed(true);
            }
            else {
                item.setPressed(false);
            }

            if (Ext.isIE8) {
                item.btnIconEl.syncRepaint();
            }
        }
        activeItem.focus();
    },
    quickNavigationRenewal: function (btn) {
        var step = btn.step,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            wizardPnl = activeTab.down('drugsrenewpremisereceivingwizard'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            progress = wizardPnl.down('#progress_tbar'),
            progressItems = progress.items.items;
        if (step > 1) {
            var thisItem = progressItems[step];
            if (!application_id) {
                thisItem.setPressed(false);
                toastr.warning('Please save application details first!!', 'Warning Response');
                return false;
            }
        }
        if (step == 0) {
            wizardPnl.getViewModel().set('atBeginning', true);
        } else {
            wizardPnl.getViewModel().set('atBeginning', false);
        }
        if (step > 1) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
        } else {
            wizardPnl.down('button[name=save_btn]').setVisible(true);
        }
        if (step == 3) {
            // wizardPnl.down('button[name=save_screening_btn]').setVisible(true);
            wizardPnl.getViewModel().set('atEnd', true);
        } else {
            // wizardPnl.down('button[name=save_screening_btn]').setVisible(false);
            wizardPnl.getViewModel().set('atEnd', false);
        }
        wizardPnl.getLayout().setActiveItem(step);
        var layout = wizardPnl.getLayout(),
            item = null,
            i = 0,
            activeItem = layout.getActiveItem();

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (step === item.step) {
                item.setPressed(true);
            }
            else {
                item.setPressed(false);
            }

            if (Ext.isIE8) {
                item.btnIconEl.syncRepaint();
            }
        }
        activeItem.focus();
    },
    quickNavigationAlteration: function (btn) {
        var step = btn.step,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            wizardPnl = activeTab.down('drugsaltpremisereceivingwizard'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            progress = wizardPnl.down('#progress_tbar'),
            progressItems = progress.items.items;
        if (step > 1) {
            var thisItem = progressItems[step];
            if (!application_id) {
                thisItem.setPressed(false);
                toastr.warning('Please save application details first!!', 'Warning Response');
                return false;
            }
        }
        if (step == 0) {
            wizardPnl.getViewModel().set('atBeginning', true);
        } else {
            wizardPnl.getViewModel().set('atBeginning', false);
        }
        if (step > 2) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
        } else {
            wizardPnl.down('button[name=save_btn]').setVisible(true);
        }
        if (step == 3) {
            //wizardPnl.down('button[name=save_screening_btn]').setVisible(true);
            wizardPnl.getViewModel().set('atEnd', true);
        } else {
            //wizardPnl.down('button[name=save_screening_btn]').setVisible(false);
            wizardPnl.getViewModel().set('atEnd', false);
        }
        wizardPnl.getLayout().setActiveItem(step);
        var layout = wizardPnl.getLayout(),
            item = null,
            i = 0,
            activeItem = layout.getActiveItem();

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (step === item.step) {
                item.setPressed(true);
            }
            else {
                item.setPressed(false);
            }

            if (Ext.isIE8) {
                item.btnIconEl.syncRepaint();
            }
        }
        activeItem.focus();
    },
    onNewPremiseRegApplication: function (sub_module_id,section_id, premise_type_id= null) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#drugspremregdashwrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            // section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id, null, null, null,premise_type_id);
        if (!workflow_details || workflow_details.length < 1) {
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
        workflowContainer.down('hiddenfield[name=section_id]').setValue(section_id);
        workflowContainer.down('hiddenfield[name=premise_type_id]').setValue(premise_type_id);
        // console.log( workflowContainer.down('hiddenfield[name=premise_type_id]').getValue());
        dashboardWrapper.add(workflowContainer);

        console.log(sub_module_id);
        var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: workflow_details.processId,
                workflow_stage: workflow_details.initialStageId
            }
        });

        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },    
    showNewPremiseInspectionSchedule: function (sub_module_id, wrapper_xtype) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down(wrapper_xtype),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id);
        if (!workflow_details || workflow_details.length < 1) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        dashboardWrapper.removeAll();
        var workflowContainer = Ext.widget(workflow_details.viewtype);
        workflowContainer.down('displayfield[name=process_name]').setValue(workflow_details.processName);
        workflowContainer.down('displayfield[name=workflow_stage]').setValue(workflow_details.initialStageName);
        workflowContainer.down('displayfield[name=application_status]').setValue(workflow_details.initialAppStatus);
        workflowContainer.down('hiddenfield[name=process_id]').setValue(workflow_details.processId);
        workflowContainer.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_details.initialStageId);
        workflowContainer.down('hiddenfield[name=module_id]').setValue(module_id);
        workflowContainer.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        workflowContainer.down('hiddenfield[name=section_id]').setValue(section_id);
        dashboardWrapper.add(workflowContainer);
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    
    onEditFoodPremiseRegApplication: function (record) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            process_id = record.get('process_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            workflow_stage = record.get('workflow_stage'),
            ref_no = record.get('reference_no'),
            workflow_details = getAllWorkflowDetails(process_id, workflow_stage_id);
        if (!workflow_details || workflow_details.length < 1) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        var tab = mainTabPanel.items.find(function (i) {
            if (i.title.indexOf(ref_no) !== -1) {
                return i;
            } else {
                return false;
            }
        });
        if (!tab) {
            var newTab = Ext.widget(workflow_details.viewtype, {
                title: workflow_stage + '-' + ref_no,
                closable: true
            });
            me.prepareApplicationBaseDetails(newTab, record);
            mainTabPanel.add(newTab);
            var lastTab = mainTabPanel.items.length - 1;
            mainTabPanel.setActiveTab(lastTab);
        } else {
            mainTabPanel.setActiveTab(tab);
        }
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    
    // onRenPremiseRegApplication: function (view, record) {
    //     Ext.getBody().mask('Please wait...');
    //     var me = this,
    //         mainTabPanel = me.getMainTabPanel(),
    //         activeTab = mainTabPanel.getActiveTab(),
    //         dashboardWrapper = activeTab.down('drugspremregdashwrapper'),
    //         grid = view.grid,
    //         win = grid.up('window'),
    //         btn=win.btn,
    //         // process_id = record.get('process_id'),
    //         // workflow_stage_id = record.get('workflow_stage_id'),
    //         sub_module_id = grid.sub_module_id,
    //         module_id = record.get('module_id'),
    //         section_id = record.get('section_id'),
    //         premise_type_id=record.get('premise_type_id'),
    //         // workflow_stage = record.get('workflow_stage'),
    //         ref_no = record.get('tracking_no'),
    //          view_id = record.get('view_id'),
    //         title = 'Premise Renewal',
          
    //         workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id,null,null,null,premise_type_id); 
    //         //console.log(premise_type_id);//getAllWorkflowDetails(process_id, workflow_stage_id);
    //     if (!workflow_details) {
    //         Ext.getBody().unmask();
    //         toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
    //         return false;
    //     }

    //     var tab = mainTabPanel.getComponent(view_id);
    //     if (!tab) {
    //                 var newTab = Ext.widget(workflow_details.viewtype, {
    //                     title: title,
    //                     closable: true
    //                 });
    //     if(sub_module_id == 3){
    //         title = "Premise Variation";
    //     }else if(sub_module_id == 4){
    //         title = 'Premise Withdrawal';
    //     }else if(sub_module_id == 1){
    //         title = 'Premise Registration';
    //     }
    //     if (!tab) {
    //         var newTab = Ext.widget(workflow_details.viewtype, {
    //             title: title,
    //             closable: true
    //         });
    //         record.set('sub_module_id', sub_module_id);
    //         record.set('process_id', workflow_details.processId);
    //         record.set('workflow_stage_id', workflow_details.initialStageId);
    //         record.set('workflow_stage', workflow_details.initialStageName);
    //         record.set('application_status', workflow_details.initialAppStatus);
    //         record.set('process_name', workflow_details.processName);
    //     //set prerequisites
    //     me.prepareRenApplicationBaseDetails(newTab, record);
    //     if(sub_module_id == 2 || sub_module_id == 3 || sub_module_id == 1){
    //         newTab.getViewModel().set('isReadOnly', true);
    //     }
    //      if(sub_module_id == 4){
    //         newTab.getViewModel().set('isReadOnly', false);
    //     }
    //     if(sub_module_id != 1){
    //         newTab.down('button[name=save_btn]').action_url = 'saveRenAltProductReceivingBaseDetails';
    //     }
    //     //load form
    //         mainTabPanel.add(newTab);
    //         var lastTab = mainTabPanel.items.length - 1;
    //         mainTabPanel.setActiveTab(lastTab);
    //     } else {
    //         mainTabPanel.setActiveTab(tab);
    //     }

    //     //loading prefilled form
    //     me.onRegisteredPremisegridDblClick(newTab, record);

    //     //close pop up if there
    //     grid = Ext.ComponentQuery.query("#premiseApprovedApplicationListGrid")[0];
    //     if(grid){
    //         grid.up('window').close();
    //     }
    //     Ext.Function.defer(function () {
    //         Ext.getBody().unmask();
    //     }, 300);
    // }
    // },

    onRenewGmpApplication: function (view, record) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('drugspremregdashwrapper'),
            grid = view.grid,
            win = grid.up('window'),
            btn=win.btn,
            sub_module_id = btn.app_type,//record.get('sub_module_id'),
            module_id = record.get('module_id'),
            section_id = record.get('section_id'),
            // gmp_type_id = record.get('gmp_type_id'),
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id),
            gmp_type_txt,
            is_local;//for loading of countries
        if (!workflow_details || workflow_details.length < 1) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        // if (gmp_type_id == 1 || gmp_type_id === 1) {
        //     gmp_type_txt = 'Oversea GMP';
        //     is_local = 0;
        // }
        // if (gmp_type_id == 2 || gmp_type_id === 2) {
        //     gmp_type_txt = 'Domestic GMP';
        //     is_local = 1;
        // }
        dashboardWrapper.removeAll();
        var workflowContainer = Ext.widget(workflow_details.viewtype);
        console.log(workflowContainer);
        workflowContainer.down('displayfield[name=process_name]').setValue(workflow_details.processName);
        workflowContainer.down('displayfield[name=workflow_stage]').setValue(workflow_details.initialStageName);
        workflowContainer.down('displayfield[name=application_status]').setValue(workflow_details.initialAppStatus);
        workflowContainer.down('hiddenfield[name=process_id]').setValue(workflow_details.processId);
        workflowContainer.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_details.initialStageId);
        workflowContainer.down('hiddenfield[name=module_id]').setValue(module_id);
        workflowContainer.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        workflowContainer.down('hiddenfield[name=section_id]').setValue(section_id);

        // workflowContainer.down('hiddenfield[name=gmp_type_id]').setValue(gmp_type_id);
        // workflowContainer.down('displayfield[name=gmp_type_txt]').setValue(gmp_type_txt);

        //workflowContainer.down('hiddenfield[name=is_local]').setValue(is_local);
        dashboardWrapper.add(workflowContainer);

        //alter readonly
        workflowContainer.getViewModel().set('isReadOnly', false);
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
        //load data
        // dashboardWrapper.down('combo[name=gmp_type_id]').setValue(record.get('gmp_type_id'));
        dashboardWrapper.down('hiddenfield[name=process_id]').setValue(record.get('process_id'));
        dashboardWrapper.down('hiddenfield[name=workflow_stage_id]').setValue(record.get('workflow_stage_id'));
        dashboardWrapper.down('hiddenfield[name=active_application_id]').setValue(record.get('active_application_id'));
        dashboardWrapper.down('hiddenfield[name=active_application_code]').setValue(record.get('active_application_code'));
        dashboardWrapper.down('hiddenfield[name=application_status_id]').setValue(record.get('application_status_id'));
        dashboardWrapper.down('hiddenfield[name=module_id]').setValue(record.get('module_id'));
        dashboardWrapper.down('hiddenfield[name=sub_module_id]').setValue(record.get('sub_module_id'));
        dashboardWrapper.down('hiddenfield[name=section_id]').setValue(record.get('section_id'));
        // dashboardWrapper.down('combo[name=gmp_type_id]').setValue(record.get('gmp_type_id'));
        dashboardWrapper.down('combo[name=assessmentprocedure_type_id]').setValue(record.get('assessmentprocedure_type_id'));
        dashboardWrapper.down('combo[name=assessment_procedure_id]').setValue(record.get('assessment_procedure_id'));
        // dashboardWrapper.down('textfield[name=reference_no]').setValue(record.get('reference_no'));
        var applicationapplicantpnl = dashboardWrapper.down('applicationapplicantpnl'),
            applicantfrm = applicationapplicantpnl.down('form'),
            man_pnl = dashboardWrapper.down('mansitedetailstabpnl'),
            manufacturingSiteFrm = dashboardWrapper.down('mansitedetailsfrm'),
            ltrFrm = dashboardWrapper.down('ltrfrm'),
            contactPersonFrm = dashboardWrapper.down('premisecontactpersonfrm');
        //load other
        Ext.Ajax.request({
            method: 'GET',
            url: 'premiseregistration/prepareNewPremiseReceivingStage',
            params: {
                application_id: record.get('active_application_id')
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
                    ltrResults = resp.ltrDetails,
                    contactPersonDetails = resp.contactPersonDetails;
                if (success == true || success === true) {
                    if (results) {
                        var model = Ext.create('Ext.data.Model', results);

                        applicantfrm.loadRecord(model);
                        manufacturingSiteFrm.loadRecord(model);
                    }
                    if (ltrResults) {
                        var ltr_model = Ext.create('Ext.data.Model', ltrResults);
                        ltrFrm.loadRecord(ltr_model);
                    }
                    if (contactPersonDetails) {
                        var model3 = Ext.create('Ext.data.Model', contactPersonDetails);
                        contactPersonFrm.loadRecord(model3);
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

        Ext.Ajax.request({
            url: "tradermanagement/getApplicantsList",
            method: 'GET',
            params: {
                applicant_id: record.get('applicant_id'),
                start: 0,
                limit: 1000
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {

                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success;
                if (success == true || success === true) {
                    var model = Ext.create('Ext.data.Model', resp.results[0]);

                    applicantfrm.loadRecord(model);
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

                toastr.error('Error fetching data: ' + errorThrown, 'Error Response');

            }
        });
        win.close();

    },
    prepareApplicationBaseDetails: function (tab, record) {
        var me = this,
            application_id = record.get('active_application_id'),
            process_name = record.get('process_name'),
            workflow_stage = record.get('workflow_stage'),
            application_status = record.get('application_status'),
            reference_no = record.get('reference_no'),
            process_id = record.get('process_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            application_status_id = record.get('application_status_id');
        tab.down('hiddenfield[name=active_application_id]').setValue(application_id);
        tab.down('hiddenfield[name=process_id]').setValue(process_id);
        tab.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        tab.down('hiddenfield[name=application_status_id]').setValue(application_status_id);
        tab.down('hiddenfield[name=module_id]').setValue(module_id);
        tab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        tab.down('hiddenfield[name=section_id]').setValue(section_id);
        tab.down('displayfield[name=process_name]').setValue(process_name);
        tab.down('displayfield[name=workflow_stage]').setValue(workflow_stage);
        tab.down('displayfield[name=application_status]').setValue(application_status);
        tab.down('displayfield[name=reference_no]').setValue(reference_no);
    },
    // prepareRenApplicationBaseDetails: function (tab, record) {
    //     var me = this,
    //         process_name = record.get('process_name'),
    //         workflow_stage = record.get('workflow_stage'),
    //         application_status = record.get('application_status'),
    //         reference_no = record.get('reference_no'),
    //         process_id = record.get('process_id'),
    //         module_id = record.get('module_id'),
    //         sub_module_id = record.get('sub_module_id'),
    //         section_id = record.get('section_id'),
    //         workflow_stage_id = record.get('workflow_stage_id');
    //     // if(tab.down('hiddenfield[name=prodclass_category_id]')){
    //     //      tab.down('hiddenfield[name=prodclass_category_id]').setValue(record.get('prodclass_category_id'));
    //     // }
    //     tab.down('hiddenfield[name=process_id]').setValue(process_id);
    //     tab.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
    //     tab.down('hiddenfield[name=module_id]').setValue(module_id);
    //     tab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
    //     tab.down('hiddenfield[name=section_id]').setValue(section_id);
    //     tab.down('displayfield[name=process_name]').setValue(process_name);
    //     tab.down('displayfield[name=workflow_stage]').setValue(workflow_stage);
    //     tab.down('displayfield[name=application_status]').setValue(application_status);
    //     tab.down('displayfield[name=reference_no]').setValue(reference_no);
    // },
    onRegisteredPremisegridDblClick: function (grid, record) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            // win = grid.up('window'),
            activeTab = mainTabPanel.getActiveTab(),
            reg_premise_id = record.get('reg_premise_id'),
            tra_premise_id = record.get('tra_premise_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            premise_type_id=record.get('premise_type_id'),
             // app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            // localagentFrm = activeTab.down('productlocalapplicantdetailsfrm'),
            premise_detailsfrm = activeTab.down('#premisedetailsfrm'),
            is_populate_primaryappdata = false,
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        
            activeTab.down('hiddenfield[name=module_id]').setValue(module_id);
            activeTab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            activeTab.down('hiddenfield[name=section_id]').setValue(section_id);
            activeTab.down('hiddenfield[name=premise_type_id]').setValue(premise_type_id);
            // zone_cbo = activeTab.down('combo[name=branch_id]');
            // assessmentprocedure_type_id = activeTab.down('combo[name=assessmentprocedure_type_id]');
            // assessment_procedure_id = activeTab.down('combo[name=assessment_procedure_id]');
            if(activeTab.down('hiddenfield[name=is_populate_primaryappdata]')){

                is_populate_primaryappdata = activeTab.down('hiddenfield[name=is_populate_primaryappdata]').getValue();
            }
        filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        // if(sub_module_id == 1 || sub_module_id == 2){
        //     app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore()
        //     app_check_types_store.removeAll();
        //     app_check_types_store.load({
        //         params: {
        //             process_id: process_id,
        //             workflow_stage: workflow_stage_id
        //         }
        //     });

        // }
        
        // app_doc_types_store.removeAll();
        // app_doc_types_store.load({
        //     params: {
        //         process_id: process_id,
        //         workflow_stage: workflow_stage_id
        //     }
        // });
        if (reg_premise_id || sub_module_id == 1) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/onRegisteredPremiseSearchdetails',
                params: {
                    reg_premise_id: reg_premise_id,
                    tra_premise_id: tra_premise_id
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results,
                        ltrResults = resp.ltrDetails,
                        // branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                    ltr_model = Ext.create('Ext.data.Model', ltrResults);

                    if (success == true || success === true) {

                        applicantFrm.loadRecord(model);
                        // localagentFrm.loadRecord(ltr_model);
                        premise_detailsfrm.loadRecord(model);
                        // zone_cbo.setReadOnly(true);
                        // zone_cbo.setValue(branch_id);
                        // assessmentprocedure_type_id.setValue(results.assessmentprocedure_type_id);
                        // assessment_procedure_id.setValue(results.assessment_procedure_id);
                        if(is_populate_primaryappdata == 1){
                            
                            activeTab.down('hiddenfield[name=active_application_code]').setValue(results.active_application_code);
                            activeTab.down('hiddenfield[name=active_application_id]').setValue(results.active_application_id);
                            activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                            activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                            
                            activeTab.down('hiddenfield[name=product_id]').setValue(results.tra_premise_id);
                            
                            activeTab.down('#product_panel').getViewModel().set('isReadOnly', true);
                           console.log('onRegisteredPremiseSearchdetails');
                        }
                        // win.close();
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
    onNewPremiseRoutineInspectionpplication: function (sub_module_id,section_id, premise_type_id= null) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#medicinespremisesinspectiondashwrapper');
            console.log(activeTab);
            console.log(dashboardWrapper);
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            // section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id, null, null, null,premise_type_id);
        if (!workflow_details || workflow_details.length < 1) {
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
        workflowContainer.down('hiddenfield[name=section_id]').setValue(section_id);
        workflowContainer.down('hiddenfield[name=premise_type_id]').setValue(premise_type_id);
        // console.log( workflowContainer.down('hiddenfield[name=premise_type_id]').getValue());
        dashboardWrapper.add(workflowContainer);

        console.log(workflowContainer.down('hiddenfield[name=workflow_stage_id]'));
        // var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
        // app_doc_types_store.removeAll();
        // app_doc_types_store.load({
        //     params: {
        //         process_id: workflow_details.processId,
        //         workflow_stage: workflow_details.initialStageId
        //     }
        // });

        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },    
    prepareNewPremiseReceiving: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            
            premiseFrm = activeTab.down('premisedetailsfrm'),
            contactPersonFrm = activeTab.down('premisecontactpersonfrm'),
            // app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore(),
            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            app_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        premiseFrm.down('hiddenfield[name=is_local]').setValue(1);
      
        // app_check_types_store.removeAll();
        // app_check_types_store.load({
        //     params: {
        //         process_id: process_id,
        //         workflow_stage: workflow_stage_id
        //     }
        // });
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                section_id: section_id,
                module_id: module_id,
                sub_module_id: sub_module_id,
                workflow_stage: workflow_stage_id
            }
        });
        /* if (application_status_id == 4 || application_status_id === 4) {
             activeTab.down('button[name=queries_responses]').setVisible(true);
         }*/
        if (app_status_id == 8 || app_status_id === 8) {//manager raise query
            activeTab.down('button[name=manager_query]').setVisible(true);
        }
        if (app_status_id == 13 || app_status_id === 13) {//manager query response
            activeTab.down('button[name=manager_queryresp]').setVisible(true);
        }

        if (application_id) {
            //zone_fld.setReadOnly(true);
            //region_fld.setReadOnly(true);
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseReceivingStage',
                params: {
                    application_id: application_id
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
                        contactPersonDetails = resp.contactPersonDetails;
                    if (success == true || success === true) {
                        if (results) {
                            var model = Ext.create('Ext.data.Model', results);
                            applicantFrm.loadRecord(model);
                            premiseFrm.loadRecord(model);
                        }

                        if (contactPersonDetails) {
                            var model1 = Ext.create('Ext.data.Model', contactPersonDetails);
                            contactPersonFrm.loadRecord(model1);
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

    prepareNewPremiseOnlinePreview: function (pnl) {
        var me = this,
            applicantFrm = pnl.down('applicantdetailsfrm'),
            premiseFrm = pnl.down('premisedetailsfrm'),
            contactPersonFrm = pnl.down('premisecontactpersonfrm'),
            superintendentFrm = pnl.down('premisesuperintendentfrm'),
            application_id = pnl.down('hiddenfield[name=active_application_id]').getValue(),
            module_id = pnl.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = pnl.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = pnl.down('hiddenfield[name=section_id]').getValue();
            mask = new Ext.LoadMask({
                target: pnl,
                msg: 'Please wait...'
            });
             mask.show();
        // if(pnl.down('combo[name=applicable_checklist]')){
        //     var checklistTypesGrid = pnl.down('combo[name=applicable_checklist]'),
        //     checklistTypesStr = checklistTypesGrid.getStore();
           
        // checklistTypesStr.removeAll();
        // checklistTypesStr.load({params: {module_id: module_id, sub_module_id: sub_module_id, section_id: section_id}});

        // }
          
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewOnlineReceivingStage',
                params: {
                    application_id: application_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    mask.hide();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results,
                        contactPersonDetails = resp.contactPersonDetails,
                        superintendentDetails = resp.superintendentDetails;
                    if (success == true || success === true) {
                        if (results) {
                            var model = Ext.create('Ext.data.Model', results);
                            //pnl.down('combo[name=branch_id]').setValue(results.branch_id);
                            pnl.down('displayfield[name=application_status]').setValue(results.app_status);
                            pnl.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                            pnl.down('displayfield[name=process_name]').setValue(results.process_name);
                            applicantFrm.loadRecord(model);
                            premiseFrm.loadRecord(model);
                        }

                        if (contactPersonDetails) {
                            var model1 = Ext.create('Ext.data.Model', contactPersonDetails);
                            contactPersonFrm.loadRecord(model1);
                        }
                        if (superintendentDetails) {
                            var model2 = Ext.create('Ext.data.Model', superintendentDetails);
                            superintendentFrm.loadRecord(model2);
                        }
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    mask.hide();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    mask.hide();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        } else {
            mask.hide();
            //It's a new application
        }
    },

    prepareNewPremiseInvoicing: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]'),
            invoice_no = activeTab.down('displayfield[name=invoice_no]'),
            invoiceSummaryGrid = activeTab.down('invoicingcostdetailsgrid'),
            invoiceSummaryStore = invoiceSummaryGrid.getStore(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            premise_details = otherDetailsFrm.down('displayfield[name=premise_details]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            paying_currency = activeTab.down('combo[name=paying_currency_id]'),
            isFastTrack = activeTab.down('checkbox[name=is_fast_track]'),
            save_btn = activeTab.down('button[name=save_btn]'),
            commit_btn = activeTab.down('button[name=commit_btn]');
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseInvoicingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_premises_applications'
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
                        isLocked = results.isLocked,
                        is_fast_track = results.is_fast_track;
                    if (success == true || success === true) {
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=premise_id]').setValue(results.premise_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        activeTab.down('hiddenfield[name=isLocked]').setValue(isLocked);
                        activeTab.down('checkbox[name=is_fast_track]').setValue(is_fast_track);
                        paying_currency.setValue(results.paying_currency_id);
                        invoice_id.setValue(results.invoice_id);
                        invoice_no.setValue(results.invoice_no);
                        applicant_details.setValue(results.applicant_details);
                        invoiceSummaryStore.removeAll();
                        invoiceSummaryStore.load({
                            params: {
                                invoice_id: results.invoice_id
                            }
                        });
                        if (isLocked == 1 || isLocked === 1) {
                            paying_currency.setReadOnly(true);
                            isFastTrack.setReadOnly(true);
                            save_btn.setVisible(false);
                            commit_btn.setDisabled(true);
                        }
                        if (module_id == 2 || module_id === 2) {
                            premise_details.setVisible(true);
                            premise_details.setValue(results.premise_details);
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

    prepareNewPremisePayments: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]'),
            // invoice_no = activeTab.down('displayfield[name=invoice_no]'),
            running_balance = activeTab.down('displayfield[name=running_balance]'),
            // invoiceSummaryGrid = activeTab.down('paymentinvoicingcostdetailsgrid'),
            // invoiceSummaryStore = invoiceSummaryGrid.getStore(),
            // paymentsGrid = activeTab.down('applicationpaymentsgrid'),
            // paymentsStore = paymentsGrid.getStore(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            premise_details = otherDetailsFrm.down('displayfield[name=premise_details]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            //premise_type_id = activeTab.down('hiddenfield[name=premise_type_id]'),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremisePaymentStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_premises_applications'
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        balance = resp.balance,
                        invoice_amount = resp.invoice_amount,
                        results = resp.results,
                        txt;
                    if (success == true || success === true) {
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=premise_id]').setValue(results.premise_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        if (Math.abs(parseFloat(balance)) == parseFloat(invoice_amount) || Math.abs(parseFloat(balance)) === parseFloat(invoice_amount)) {
                            txt = ' (Not Paid)';
                        } else if (parseFloat(balance) > 0) {
                            txt = ' (Over-Paid)';
                        } else if (parseFloat(balance) < 0) {
                            txt = ' (Under-Paid)';
                        } else {
                            txt = ' (Cleared)';
                        }
                        applicant_details.setValue(results.applicant_details);
                        running_balance.setValue(balance + txt);
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
    prepareUniformPremisesInspectionPanel:function(applicationsGrid){

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down(applicationsGrid),
            inspectionDetailsFrm = activeTab.down('form'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            applicationsStore = applicationsGrid.getStore(),
            inspectorsGrid = activeTab.down('inspectioninspectorsgrid'),
            inspectorsStore = inspectorsGrid.getStore(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sm = applicationsGrid.getSelectionModel();
       
            if (application_id) {
            applicationsStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseManagerInspectionStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_premises_applications'
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
                            inspectionDetailsFrm.loadRecord(model);
                        }
                        applicationsStore.load();
                        inspectorsStore.load();
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
    preparePremisesInspectionProcesspanel: function () {
        
        this.prepareUniformPremisesInspectionPanel('premisesinspectionprocessgrid');

    },
    preparepremisesinspectionschedulingpanel: function () {
        
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            applicationsGrid = 'premisesinspectionschedulinggrid',
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down(applicationsGrid),
            upload_grid = activeTab.down('unstructureddocumentuploadsgrid'),
            inspectionDetailsFrm = activeTab.down('form'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            applicationsStore = applicationsGrid.getStore(),
           // inspectorsGrid = activeTab.down('inspectorsSchedulingGrid'),
            // inspectorsGrid = activeTab.down('inspectioninspectorsgrid'),
            // inspectorsStore = inspectorsGrid.getStore(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sm = applicationsGrid.getSelectionModel();
       
            if (application_id) {
           
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareScheduleInspectionStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_premises_applications'
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
                            inspectionDetailsFrm.loadRecord(model);
                            activeTab.down('displayfield[name=reference_no]').setValue(results.inspection_reference_no);
                            activeTab.down('hiddenfield[name=inspection_id]').setValue(results.inspection_id);
                            
                            upload_grid.down('hiddenfield[name=reference_record_id]').setValue(results.id);
                        }
                        upload_grid.down('hiddenfield[name=document_type_id]').setValue(11);
                        upload_grid.down('hiddenfield[name=table_name]').setValue('tra_preminspection_uploaddocuments');
                        upload_grid.down('hiddenfield[name=reference_table_name]').setValue('tra_premise_inspection_details');
           //  applicationsStore.on('load', function (store, records, options) {
          //                 var record = store.getById(application_id),
          //                     rowIndex = store.indexOf(record);
         //                 sm.select(rowIndex, true);
        //             });
                        applicationsStore.load({params:{
                            inspection_id: results.id
                        }});
                        // inspectorsStore.load();
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
            upload_grid.down('hiddenfield[name=document_type_id]').setValue(11);
            upload_grid.down('hiddenfield[name=table_name]').setValue('tra_preminspection_uploaddocuments');
            upload_grid.down('hiddenfield[name=reference_table_name]').setValue('tra_premise_inspection_details');
            Ext.getBody().unmask();
            //It's a new application
        }
    },
    prepareNewPremiseManagerInspection: function () {

        this.prepareUniformPremisesInspectionPanel('managerinspectiongrid');
        
    },

    prepareNewPremiseInspection1: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            app_check_types_store = activeTab.down('combo[name=applicable_checklist]').store,
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            premise_details = otherDetailsFrm.down('displayfield[name=premise_details]');
        if (application_id) {
            app_check_types_store.load({
                params: {
                    process_id: process_id,
                    workflow_stage: workflow_stage_id
                }
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseEvaluationStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_premises_applications'
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
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=premise_id]').setValue(results.premise_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        applicant_details.setValue(results.applicant_details);
                        if (module_id == 2 || module_id === 2) {
                            premise_details.setVisible(true);
                            premise_details.setValue(results.premise_details);
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
    prepareNewPremiseManagerEvaluation: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mainGrid = activeTab.down('grid'),
            mainStore = mainGrid.getStore(),
            sm = mainGrid.getSelectionModel(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (application_id) {
            mainStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }
    },
    prepareNewPremiseInspection: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            app_check_types_store = activeTab.down('combo[name=applicable_checklist]').store,
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            app_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            otherDetailsFrm = activeTab.down('form'),
            inspectionDetailsFrm = activeTab.down('#premiseinspectionrecommfrm'),
            inspectorsGrid = activeTab.down('inspectioninspectorsgrid'),
            inspectorsStore = inspectorsGrid.getStore(),
                       
            applicant_details = activeTab.down('displayfield[name=applicant_details]'),
            premise_details = activeTab.down('displayfield[name=premise_details]');
            
        if (app_status_id == 8 || app_status_id === 8) {//manager raise query
            activeTab.down('button[name=manager_query]').setVisible(true);
        }
        if (app_status_id == 13 || app_status_id === 13) {//manager query response
            activeTab.down('button[name=manager_queryresp]').setVisible(true);
        }
        inspectionDetailsFrm.down('hiddenfield[name=isReadOnly]').setValue(true);
        inspectorsGrid.down('hiddenfield[name=isReadOnly]').setValue(true);

        if (application_id) {
            app_check_types_store.load({
                params: {
                    process_id: process_id,
                    workflow_stage: workflow_stage_id
                }
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseEvaluationStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_premises_applications'
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
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=premise_id]').setValue(results.premise_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                       
                        if (module_id == 2 || module_id === 2) {
                          
                            var model = Ext.create('Ext.data.Model', results);
                            // console.log(model);
                            // console.log(inspectionDetailsFrm);
                            
                            inspectionDetailsFrm.getForm().loadRecord(model);
							inspectorsStore.load();

                           
                           premise_details.setVisible(true); 
                           premise_details.setValue(results.premise_details);
                        }
                       applicant_details.setValue(results.applicant_details);
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


    prepareNewPremiseEvaluation: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            app_check_types_store = activeTab.down('combo[name=applicable_checklist]').store,
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            app_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            otherDetailsFrm = activeTab.down('form'),
            // inspectionDetailsFrm = activeTab.down('form'),
            inspectorsGrid = activeTab.down('inspectioninspectorsgrid'),
            // inspectorsStore = inspectorsGrid.getStore(),
                       
            applicant_details = activeTab.down('displayfield[name=applicant_details]'),
            premise_details = activeTab.down('displayfield[name=premise_details]');
        if (app_status_id == 8 || app_status_id === 8) {//manager raise query
            activeTab.down('button[name=manager_query]').setVisible(true);
        }
        if (app_status_id == 13 || app_status_id === 13) {//manager query response
            activeTab.down('button[name=manager_queryresp]').setVisible(true);
        }
        if (application_id) {
            app_check_types_store.load({
                params: {
                    process_id: process_id,
                    workflow_stage: workflow_stage_id
                }
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseEvaluationStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_premises_applications'
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
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=premise_id]').setValue(results.premise_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                       
                        if (module_id == 2 || module_id === 2) {
                          
                            var model = Ext.create('Ext.data.Model', results);
                            console.log(model);
                            // console.log(inspectionDetailsFrm);
                            
                            // inspectionDetailsFrm.getForm().loadRecord(model);
							// inspectorsStore.load();
                            // inspectionDetailsFrm.down('hiddenfield[name=isReadOnly]').setValue(1);
                            // inspectorsGrid.down('hiddenfield[name=isReadOnly]').setValue(1);

                          //  premise_details.setVisible(true);
                          //  premise_details.setValue(results.premise_details);
                        }
                       // applicant_details.setValue(results.applicant_details);
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


    prepareNewPremiseManagerReview: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mainGrid = activeTab.down('grid'),
            mainStore = mainGrid.getStore(),
            sm = mainGrid.getSelectionModel(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (application_id) {
            mainStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }
    },

    prepareNewPremiseMainApprovals: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mainGrid = activeTab.down('grid'),
            mainStore = mainGrid.getStore(),
            sm = mainGrid.getSelectionModel(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (application_id) {
            mainStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }
    },

    // prepareNewFoodPremiseApprovals: function () {
    //     Ext.getBody().mask('Please wait...');
    //     var me = this,
    //         mainTabPanel = me.getMainTabPanel(),
    //         activeTab = mainTabPanel.getActiveTab(),
    //         section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
    //         applicantFrm = activeTab.down('applicantdetailsfrm'),
    //         premiseFrm = activeTab.down('premisedetailsfrm'),
    //         paymentsPanel = activeTab.down('approvalspaymentspnl'),
    //         application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
    //         application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
    //         invoice_id_field = activeTab.down('hiddenfield[name=invoice_id]'),
    //         invoice_no_field = paymentsPanel.down('displayfield[name=invoice_no]'),
    //         invoiceDetailsGrid = paymentsPanel.down('paymentinvoicingcostdetailsgrid'),
    //         paymentDetailsGrid = paymentsPanel.down('applicationpaymentsgrid'),
    //         invoiceDetailsStore = invoiceDetailsGrid.getStore(),
    //         paymentDetailsStore = paymentDetailsGrid.getStore(),
    //         preCheckingGrid = activeTab.down('premisescreeninggrid'),
    //         inspectionGrid = activeTab.down('foodpreminspectionchecklistgrid'),
    //         evaluationGrid = activeTab.down('foodpremevaluationchecklistgrid'),
    //         preCheckingChecklistsStore = preCheckingGrid.down('combo[name=applicable_checklist]').store,
    //         inspectionChecklistsStore = inspectionGrid.down('combo[name=applicable_checklist]').store,
    //         evaluationChecklistsStore = evaluationGrid.down('combo[name=applicable_checklist]').store,
    //         receiving_stage,
    //         inspection_stage,
    //         evaluation_stage;
    //     applicantFrm.down('button[action=link_applicant]').setDisabled(true);
    //     preCheckingGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
    //     inspectionGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
    //     evaluationGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
    //     activeTab.down('premisepersonneldetailsgrid').down('hiddenfield[name=isReadOnly]').setValue(1);
    //     activeTab.down('premiseotherdetailsgrid').down('hiddenfield[name=isReadOnly]').setValue(1);
    //     //paymentsPanel.down('button[name=remove_selected]').setHidden(true);
    //     invoiceDetailsGrid.setHeight(255);
    //     paymentDetailsGrid.setHeight(255);
    //     if (section_id == 1) {//Food
    //         receiving_stage = 1;
    //         inspection_stage = 17;
    //         evaluation_stage = 9;
    //     } else if (section_id == 2) {//Drugs
    //         receiving_stage = 5;
    //         inspection_stage = 24;
    //         evaluation_stage = 26;
    //     } else if (section_id == 3) {//Cosmetics

    //     } else if (section_id == 4) {//Medical Devices

    //     }
    //     if (application_id) {
    //         Ext.Ajax.request({
    //             method: 'GET',
    //             url: 'premiseregistration/prepareNewPremiseReceivingStage',
    //             params: {
    //                 application_id: application_id,
    //                 application_code: application_code
    //             },
    //             headers: {
    //                 'Authorization': 'Bearer ' + access_token
    //             },
    //             success: function (response) {
    //                 Ext.getBody().unmask();
    //                 var resp = Ext.JSON.decode(response.responseText),
    //                     message = resp.message,
    //                     success = resp.success,
    //                     results = resp.results,
    //                     model = Ext.create('Ext.data.Model', results);
    //                 if (success == true || success === true) {
    //                     applicantFrm.loadRecord(model);
    //                     premiseFrm.loadRecord(model);
    //                     invoice_id_field.setValue(results.invoice_id);
    //                     invoice_no_field.setValue(results.invoice_no);
    //                     invoiceDetailsStore.load({params: {invoice_id: results.invoice_id}});
    //                     paymentDetailsStore.load();
    //                     preCheckingChecklistsStore.removeAll();
    //                     preCheckingChecklistsStore.load({
    //                         params: {
    //                             process_id: results.process_id,
    //                             workflow_stage: results.workflow_stage_id,
    //                             is_approval: 1,
    //                             target_stage: receiving_stage//for screening checklists at receiving stage
    //                         }
    //                     });
    //                     inspectionChecklistsStore.removeAll();
    //                     inspectionChecklistsStore.load({
    //                         params: {
    //                             process_id: results.process_id,
    //                             workflow_stage: results.workflow_stage_id,
    //                             is_approval: 1,
    //                             target_stage: inspection_stage//for inspection checklists
    //                         }
    //                     });
    //                     evaluationChecklistsStore.removeAll();
    //                     evaluationChecklistsStore.load({
    //                         params: {
    //                             process_id: results.process_id,
    //                             workflow_stage: results.workflow_stage_id,
    //                             is_approval: 1,
    //                             target_stage: evaluation_stage//for evaluation checklists
    //                         }
    //                     });
    //                 } else {
    //                     toastr.error(message, 'Failure Response');
    //                 }
    //             },
    //             failure: function (response) {
    //                 Ext.getBody().unmask();
    //                 var resp = Ext.JSON.decode(response.responseText),
    //                     message = resp.message,
    //                     success = resp.success;
    //                 toastr.error(message, 'Failure Response');
    //             },
    //             error: function (jqXHR, textStatus, errorThrown) {
    //                 Ext.getBody().unmask();
    //                 toastr.error('Error: ' + errorThrown, 'Error Response');
    //             }
    //         });
    //     } else {
    //         Ext.getBody().unmask();
    //         //It's a new application
    //     }
    // },

    prepareSinglePremiseApproval: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            premiseFrm = activeTab.down('premisedetailsfrm'),
            paymentsPanel = activeTab.down('approvalspaymentspnl'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            invoice_id_field = activeTab.down('hiddenfield[name=invoice_id]'),
            invoice_no_field = paymentsPanel.down('displayfield[name=invoice_no]'),
            invoiceDetailsGrid = paymentsPanel.down('paymentinvoicingcostdetailsgrid'),
            // paymentDetailsGrid = paymentsPanel.down('applicationpaymentsgrid'),
            invoiceDetailsStore = invoiceDetailsGrid.getStore(),
            // paymentDetailsStore = paymentDetailsGrid.getStore(),
            preCheckingGrid = activeTab.down('premisescreeninggrid'),
            inspectionGrid = activeTab.down('foodpreminspectionchecklistgrid'),
            evaluationGrid = activeTab.down('foodpremevaluationchecklistgrid'),
            preCheckingChecklistsStore = preCheckingGrid.down('combo[name=applicable_checklist]').store,
            inspectionChecklistsStore = inspectionGrid.down('combo[name=applicable_checklist]').store,
            evaluationChecklistsStore = evaluationGrid.down('combo[name=applicable_checklist]').store,
            receiving_stage,
            inspection_stage,
            evaluation_stage,
            action_url;
        applicantFrm.down('button[action=link_applicant]').setDisabled(true);
        preCheckingGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
        inspectionGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
        evaluationGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
        activeTab.down('premisepersonneldetailsgrid').down('hiddenfield[name=isReadOnly]').setValue(1);
        // activeTab.down('premiseotherdetailsgrid').down('hiddenfield[name=isReadOnly]').setValue(1);
        //paymentsPanel.down('button[name=remove_selected]').setHidden(true);
        invoiceDetailsGrid.setHeight(255);
        // paymentDetailsGrid.setHeight(255);
        if (sub_module_id == 1) {//New
            action_url = 'premiseregistration/prepareNewPremiseReceivingStage';
            if (section_id == 1) {//Food
                receiving_stage = 1;
                inspection_stage = 17;
                evaluation_stage = 9;
            } else if (section_id == 2) {//Drugs
                receiving_stage = 5;
                inspection_stage = 24;
                evaluation_stage = 26;
            } else if (section_id == 3) {//Cosmetics
                receiving_stage = 11;
                inspection_stage = 35;
                evaluation_stage = 37;
            } else if (section_id == 4) {//Medical Devices
                receiving_stage = 43;
                inspection_stage = 47;
                evaluation_stage = 49;
            }
        } else if (sub_module_id == 2) {//Renewal
            action_url = 'premiseregistration/prepareNewPremiseReceivingStage';//prepareRenewalPremiseReceivingStage';
            // activeTab.down('premiseotherdetailsgrid').down('hiddenfield[name=is_temporal]').setValue(1);
            activeTab.down('premisepersonneldetailsgrid').down('hiddenfield[name=is_temporal]').setValue(1);
            if (section_id == 1) {//Food
                receiving_stage = 56;
                inspection_stage = 60;
                evaluation_stage = 62;
            } else if (section_id == 2) {//Drugs
                receiving_stage = 67;
                inspection_stage = 71;
                evaluation_stage = 73;
            } else if (section_id == 3) {//Cosmetics
                receiving_stage = 79;
                inspection_stage = 83;
                evaluation_stage = 85;
            } else if (section_id == 4) {//Medical Devices
                receiving_stage = 91;
                inspection_stage = 95;
                evaluation_stage = 97;
            }
        } else if (sub_module_id == 3) {//Alteration

        }
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: action_url,
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
                        message = resp.message,
                        success = resp.success,
                        results = resp.results,
                        model = Ext.create('Ext.data.Model', results);
                    if (success == true || success === true) {
                        applicantFrm.loadRecord(model);
                        premiseFrm.loadRecord(model);
                        invoice_id_field.setValue(results.invoice_id);
                        invoice_no_field.setValue(results.invoice_no);
                        invoiceDetailsStore.load({params: {invoice_id: results.invoice_id}});
                        // paymentDetailsStore.load();
                        preCheckingChecklistsStore.removeAll();
                        preCheckingChecklistsStore.load({
                            params: {
                                process_id: results.process_id,
                                workflow_stage: results.workflow_stage_id,
                                is_approval: 1,
                                target_stage: receiving_stage//for screening checklists at receiving stage
                            }
                        });
                        inspectionChecklistsStore.removeAll();
                        inspectionChecklistsStore.load({
                            params: {
                                process_id: results.process_id,
                                workflow_stage: results.workflow_stage_id,
                                is_approval: 1,
                                target_stage: inspection_stage//for inspection checklists
                            }
                        });
                        evaluationChecklistsStore.removeAll();
                        evaluationChecklistsStore.load({
                            params: {
                                process_id: results.process_id,
                                workflow_stage: results.workflow_stage_id,
                                is_approval: 1,
                                target_stage: evaluation_stage//for evaluation checklists
                            }
                        });
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

    prepareNewPremiseCommunications: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mainGrid = activeTab.down('grid'),
            mainStore = mainGrid.getStore(),
            sm = mainGrid.getSelectionModel(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (application_id) {
            mainStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }
    },
    //RENEW
    prepareRenewPremiseReceiving: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            premiseFrm = activeTab.down('premisedetailsfrm'),
            
            contactPersonFrm = activeTab.down('premisecontactpersonfrm'),
            //app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore(),
            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        premiseFrm.getForm().getFields().each(function (field) {
            field.setReadOnly(true);
        });
        contactPersonFrm.getForm().getFields().each(function (field) {
            field.setReadOnly(true);
        });
        //activeTab.down('premiseotherdetailsgrid').down('hiddenfield[name=isReadOnly]').setValue(1);
        activeTab.down('premisepersonneldetailsgrid').down('hiddenfield[name=isReadOnly]').setValue(1);
        me.fireEvent('formAuth', process_id, 1, premiseFrm);
        me.fireEvent('otherPartsAuth', process_id, activeTab);
        //premiseFrm.down('textfield[name=premise_reg_no]').setVisible(true);
        //premiseFrm.down('textfield[name=permit_no]').setVisible(true);
        //premiseFrm.down('button[action=search_premise]').setDisabled(false);
        // applicantFrm.down('button[action=link_applicant]').setDisabled(true);
        // app_check_types_store.removeAll();
        // app_check_types_store.load({
        //     params: {
        //         process_id: process_id,
        //         workflow_stage: workflow_stage_id
        //     }
        // });
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        if (application_id) {
            // activeTab.down('button[name=save_btn]').setDisabled(true);
            // activeTab.down('button[name=save_screening_btn]').setDisabled(true);
            //zone_fld.setReadOnly(true);
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseReceivingStage',
                params: {
                    application_id: application_id
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
                        contactPersonDetails = resp.contactPersonDetails;
                    if (success == true || success === true) {
                        if (results) {
                            var model = Ext.create('Ext.data.Model', results);
                            applicantFrm.loadRecord(model);
                            premiseFrm.loadRecord(model);
                        }
                        if (contactPersonDetails) {
                            var model1 = Ext.create('Ext.data.Model', contactPersonDetails);
                            contactPersonFrm.loadRecord(model1);
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
        //     premiseFrm.add({
        //     xtype: 'fieldcontainer',
        //     layout: 'column',
        //     defaults: {
        //         labelAlign: 'top'
        //     },
        //     items: [
        //         {
        //             xtype: 'textfield',
        //             name: 'name',
        //             columnWidth: 0.9,
        //             allowBlank: false,
        //             fieldLabel: 'Name'
        //         },
        //         {
        //             xtype: 'button',
        //             iconCls: 'x-fa fa-search',
        //             // disabled: true,
        //             columnWidth: 0.1,
        //             tooltip: 'Search',
        //             action: 'search_premise',
        //             childXtype: 'premiseselectiongrid',
        //             winTitle: 'Premises Selection List',
        //             winWidth: '90%',
        //             margin: '30 0 0 0'
        //         }
        //     ]
        // });
           // premiseFrm.down('button[action=search_premise]').setDisabled(false);
            Ext.getBody().unmask();
            //It's a new application
        }
    },

    prepareRenewalPremiseInvoicing: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]'),
            invoice_no = activeTab.down('displayfield[name=invoice_no]'),
            invoiceSummaryGrid = activeTab.down('invoicingcostdetailsgrid'),
            invoiceSummaryStore = invoiceSummaryGrid.getStore(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            premise_details = otherDetailsFrm.down('displayfield[name=premise_details]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseInvoicingStage',//prepareRenewalPremiseInvoicingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_premises_applications'
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
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=premise_id]').setValue(results.premise_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        invoice_id.setValue(results.invoice_id);
                        invoice_no.setValue(results.invoice_no);
                        applicant_details.setValue(results.applicant_details);
                        invoiceSummaryStore.removeAll();
                        invoiceSummaryStore.load({
                            params: {
                                invoice_id: results.invoice_id
                            }
                        });
                        if (module_id == 2 || module_id === 2) {
                            premise_details.setVisible(true);
                            premise_details.setValue(results.premise_details);
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

    prepareRenewalPremisePayments: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]'),
            invoice_no = activeTab.down('displayfield[name=invoice_no]'),
            running_balance = activeTab.down('displayfield[name=running_balance]'),
            invoiceSummaryGrid = activeTab.down('paymentinvoicingcostdetailsgrid'),
            invoiceSummaryStore = invoiceSummaryGrid.getStore(),
            // paymentsGrid = activeTab.down('applicationpaymentsgrid'),
            // paymentsStore = paymentsGrid.getStore(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            premise_details = otherDetailsFrm.down('displayfield[name=premise_details]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        if (application_id) {
            // paymentsStore.removeAll();
            // paymentsStore.load({
            //     params: {
            //         application_id: application_id,
            //         application_code: application_code
            //     }
            // });
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremisePaymentStage',//prepareRenewalPremisePaymentStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_premises_applications'
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        balance = resp.balance,
                        invoice_amount = resp.invoice_amount,
                        results = resp.results,
                        txt;
                    if (success == true || success === true) {
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=premise_id]').setValue(results.premise_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        if (Math.abs(parseFloat(balance)) == parseFloat(invoice_amount) || Math.abs(parseFloat(balance)) === parseFloat(invoice_amount)) {
                            txt = ' (Not Paid)';
                        } else if (parseFloat(balance) > 0) {
                            txt = ' (Over-Paid)';
                        } else if (parseFloat(balance) < 0) {
                            txt = ' (Under-Paid)';
                        } else {
                            txt = ' (Cleared)';
                        }
                        invoice_id.setValue(results.invoice_id);
                        invoice_no.setValue(results.invoice_no);
                        applicant_details.setValue(results.applicant_details);
                        running_balance.setValue(balance + txt);
                        invoiceSummaryStore.removeAll();
                        invoiceSummaryStore.load({
                            params: {
                                invoice_id: results.invoice_id
                            }
                        });
                        if (module_id == 2 || module_id === 2) {
                            premise_details.setVisible(true);
                            premise_details.setValue(results.premise_details);
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

    prepareRenewalPremiseInspection: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            app_check_types_store = activeTab.down('combo[name=applicable_checklist]').store,
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            premise_details = otherDetailsFrm.down('displayfield[name=premise_details]');
        if (application_id) {
            app_check_types_store.load({
                params: {
                    process_id: process_id,
                    workflow_stage: workflow_stage_id
                }
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseEvaluationStage',//prepareRenewalPremiseEvaluationStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_premises_applications'
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
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=premise_id]').setValue(results.premise_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        applicant_details.setValue(results.applicant_details);
                        if (module_id == 2 || module_id === 2) {
                            premise_details.setVisible(true);
                            premise_details.setValue(results.premise_details);
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

    prepareRenewalPremiseEvaluation: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            app_check_types_store = activeTab.down('combo[name=applicable_checklist]').store,
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            premise_details = otherDetailsFrm.down('displayfield[name=premise_details]');
        if (application_id) {
            app_check_types_store.load({
                params: {
                    process_id: process_id,
                    workflow_stage: workflow_stage_id
                }
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseEvaluationStage',//prepareRenewalPremiseEvaluationStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_premises_applications'
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
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=premise_id]').setValue(results.premise_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        applicant_details.setValue(results.applicant_details);
                        if (module_id == 2 || module_id === 2) {
                            premise_details.setVisible(true);
                            premise_details.setValue(results.premise_details);
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

    //ALTERATION
    prepareAlterationPremiseReceiving: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            premiseFrm = activeTab.down('premisedetailsfrm'),
            contactPersonFrm = activeTab.down('premisecontactpersonfrm'),
            premisepersonneldetailsgrid = activeTab.down('premisepersonneldetailsgrid'),
            premiseproprietorsdetailsgrid = activeTab.down('premiseproprietorsdetailsgrid'),
            variationReceivingPnl = activeTab.down('variationReceivingPnl'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=application_code]').getValue(),
            premise_personneldetails=activeTab.down('premisepersonneldetailsgrid'),
            directorsfrm=activeTab.down('premiseproprietorsdetailsgrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            application_code = activeTab.down('hiddenfield[name=application_code]').getValue();
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            premise_type_id=activeTab.down('hiddenfield[name=premise_type_id]').getValue();
    
	        premiseFrm.getForm().getFields().each(function (field) {
                field.setReadOnly(true);
            });
        if(premisepersonneldetailsgrid){
            premisepersonneldetailsgrid.down('hiddenfield[name=isReadOnly]').setValue(1);
        }
        if(premiseproprietorsdetailsgrid){
            premiseproprietorsdetailsgrid.down('hiddenfield[name=isReadOnly]').setValue(1);
        }
        if(contactPersonFrm){
            contactPersonFrm.down('hiddenfield[name=isReadOnly]').setValue(1);
        }
        if(variationReceivingPnl){
            if(sub_module_id == 78){
                variationReceivingPnl.down('combo[name=variation_type]').setValue(2);
            }else{
                variationReceivingPnl.down('combo[name=variation_type]').setValue(1);
            }
            
        }
            
        // premiseFrm.down('textfield[name=premise_reg_no]').setVisible(true);
        // premiseFrm.down('textfield[name=permit_no]').setVisible(true);
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseReceivingStage',
                params: {
                    application_id: application_id
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
                        contactPersonDetails = resp.contactPersonDetails;
                    if (success == true || success === true) {
                        if (results) {
                            var model = Ext.create('Ext.data.Model', results);
                            applicantFrm.loadRecord(model);
                            premiseFrm.loadRecord(model);
			                applicantFrm.down('button[name=link_applicant]').setDisabled(true);
                        }
                        if (contactPersonDetails) {
                            var model1 = Ext.create('Ext.data.Model', contactPersonDetails);
                            contactPersonFrm.loadRecord(model1);
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
            //It's a new application
            // premiseFrm.down('button[action=search_premise]').setDisabled(false);
            //activeTab.down('button[name=save_btn]').setText('Initialize Application');
            Ext.getBody().unmask();
        }
    },

    //CANCELLATION
    prepareCancellationPremiseReceiving: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            premiseFrm = activeTab.down('premisedetailsfrm'),
            contactPersonFrm = activeTab.down('premisecontactpersonfrm'),
            // premise_businessdetails = activeTab.down('premiseotherdetailsgrid'),
            directorsfrm=activeTab.down('premiseproprietorsdetailsgrid'),
            premise_personneldetails = activeTab.down('premisepersonneldetailsgrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            premise_type_id=activeTab.down('hiddenfield[name=premise_type_id]').getValue();

        premiseFrm.getForm().getFields().each(function (field) {
            field.setReadOnly(true);
        });
        directorsfrm.down('hiddenfield[name=isReadOnly]').setValue(1);
        premise_personneldetails.down('hiddenfield[name=isReadOnly]').setValue(1);
        contactPersonFrm.down('hiddenfield[name=isReadOnly]').setValue(1);
        // premiseFrm.down('textfield[name=premise_reg_no]').setVisible(true);
        // premiseFrm.down('textfield[name=permit_no]').setVisible(true);
        // premiseFrm.down('button[action=search_premise]').setDisabled(false);
     
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseReceivingStage',
                params: {
                    application_id: application_id
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
                        contactPersonDetails = resp.contactPersonDetails;
                    if (success == true || success === true) {
                        if (results) {
                            var model = Ext.create('Ext.data.Model', results);
                            applicantFrm.loadRecord(model);
                            premiseFrm.loadRecord(model);
                            applicantFrm.down('button[name=link_applicant]').setDisabled(true);
                        }
                        if (contactPersonDetails) {
                            var model1 = Ext.create('Ext.data.Model', contactPersonDetails);
                            contactPersonFrm.loadRecord(model1);
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
            //It's a new application
            Ext.getBody().unmask();
        }
    },
    prepareSuspensionPremiseReceiving: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            premiseFrm = activeTab.down('premisedetailsfrm'),
            contactPersonFrm = activeTab.down('premisecontactpersonfrm'),
            // premise_businessdetails = activeTab.down('premiseotherdetailsgrid'),
            directorsfrm=activeTab.down('premiseproprietorsdetailsgrid'),
            premise_personneldetails = activeTab.down('premisepersonneldetailsgrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            premise_type_id=activeTab.down('hiddenfield[name=premise_type_id]').getValue();

        premiseFrm.getForm().getFields().each(function (field) {
            field.setReadOnly(true);
        });
        directorsfrm.down('hiddenfield[name=isReadOnly]').setValue(1);
        premise_personneldetails.down('hiddenfield[name=isReadOnly]').setValue(1);
        contactPersonFrm.down('hiddenfield[name=isReadOnly]').setValue(1);
        // premiseFrm.down('textfield[name=premise_reg_no]').setVisible(true);
        // premiseFrm.down('textfield[name=permit_no]').setVisible(true);
        // premiseFrm.down('button[action=search_premise]').setDisabled(false);
     
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/prepareNewPremiseReceivingStage',
                params: {
                    application_id: application_id
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
                        contactPersonDetails = resp.contactPersonDetails;
                    if (success == true || success === true) {
                        if (results) {
                            var model = Ext.create('Ext.data.Model', results);
                            applicantFrm.loadRecord(model);
                            premiseFrm.loadRecord(model);
                            applicantFrm.down('button[name=link_applicant]').setDisabled(true);
                        }
                        if (contactPersonDetails) {
                            var model1 = Ext.create('Ext.data.Model', contactPersonDetails);
                            contactPersonFrm.loadRecord(model1);
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
            //It's a new application
            Ext.getBody().unmask();
        }
    },
    //COMPARE
    preparePremiseComparePreview: function (pnl) {
        var me = this,
            portalPnl = pnl.down('premiseportalcomparepreviewpnl'),
            misPnl = pnl.down('premisemiscomparepreviewpnl'),
            portalWizard = pnl.down('newpremiseonlinepreviewwizard'),
            misWizard = pnl.down('premiseappmoredetailswizard'),
            portalApplicantFrm = portalWizard.down('applicantdetailsfrm'),
            misApplicantFrm = misWizard.down('applicantdetailsfrm'),
            portalPremiseFrm = portalWizard.down('premisedetailsfrm'),
            misPremiseFrm = misWizard.down('premisedetailsfrm'),
            portalContactPersonFrm = portalWizard.down('premisecontactpersonfrm'),
            misContactPersonFrm = misWizard.down('premisecontactpersonfrm'),
            portal_application_id = portalPnl.down('hiddenfield[name=application_id]').getValue(),
            mis_application_id = misPnl.down('hiddenfield[name=application_id]').getValue(),
            mask = new Ext.LoadMask({
                target: pnl,
                msg: 'Please wait...'
            });
        mask.show();
        if (portal_application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/getPremiseCompareDetails',
                params: {
                    portal_application_id: portal_application_id,
                    mis_application_id: mis_application_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    mask.hide();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        portalResults = resp.portalResults,
                        portalContactPersonDetails = resp.portalContactPersonDetails,
                        misResults = resp.misResults,
                        misContactPersonDetails = resp.misContactPersonDetails;
                    if (success == true || success === true) {
                        if (portalResults) {
                            var model = Ext.create('Ext.data.Model', portalResults);
                            portalApplicantFrm.loadRecord(model);
                            portalPremiseFrm.loadRecord(model);
                        }
                        if (portalContactPersonDetails) {
                            var model1 = Ext.create('Ext.data.Model', portalContactPersonDetails);
                            portalContactPersonFrm.loadRecord(model1);
                        }
                        if (misResults) {
                            var model2 = Ext.create('Ext.data.Model', misResults);
                            misApplicantFrm.loadRecord(model2);
                            misPremiseFrm.loadRecord(model2);
                        }
                        if (misContactPersonDetails) {
                            var model3 = Ext.create('Ext.data.Model', misContactPersonDetails);
                            misContactPersonFrm.loadRecord(model3);
                        }
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    mask.hide();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    mask.hide();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        } else {
            mask.hide();
            //It's a new application
        }
    },
    //End

    foodPremiseRegHome: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('foodpremregdashwrapper');
        if (!dashboardWrapper.down('foodpremregdash')) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: 'foodpremregdash'});
        }
    },
    
    premisesinspectionHomeBtn: function (btn) {
        var me = this,
        dashwrapper = btn.dashwrapper,
        regdash = btn.regdash,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down(dashwrapper);
        if (!dashboardWrapper.down(regdash)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: regdash});
        }
    },
    drugsPremiseRegHome: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('drugspremregdashwrapper');
        if (!dashboardWrapper.down('drugspremregdash')) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: 'drugspremregdash'});
        }
    },
    
    cosmeticsPremiseRegHome: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('cosmeticspremregdashwrapper');
        if (!dashboardWrapper.down('cosmeticspremregdash')) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: 'cosmeticspremregdash'});
        }
    },

    medDevicesPremiseRegHome: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('meddevicespremregdashwrapper');
        if (!dashboardWrapper.down('meddevicespremregdash')) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: 'meddevicespremregdash'});
        }
    },

    onApplicantSelectionListDblClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            win = grid.up('window'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantForm = activeTab.down('applicantdetailsfrm'),
            mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: win
            });
        mask.show();
        applicantForm.loadRecord(record);
        Ext.Function.defer(function () {
            mask.hide();
            win.close();
        }, 200);
    },
  

    onPremiseSelectionListDblClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            premise_id = record.get('premise_id'),
             // console.log(record);
            //in = grid.up('window'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            // console.log(activeTab);
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            premise_type_id=activeTab.down('hiddenfield[name=premise_type_id]').getValue(),
            //premiseForm,
            // applicantForm,
            // contactPersonFrm;
            premiseFrmPanel= activeTab.down('applicationpremisepnl');
            premiseFormTab= premiseFrmPanel.down('premisedetailstabpnl');
            premiseForm=premiseFormTab.down('premisedetailsfrm');
            applicantForm = activeTab.down('applicantdetailsfrm');
            contactPersonFrm = activeTab.down('premisecontactpersonfrm');
            model = Ext.create('Ext.data.Model', record);
            premiseForm.loadRecord(model);
    //         mask = new Ext.LoadMask({
    //             msg: 'Please wait...',
    //             target: win
    //         });
    //    mask.show();
        if (module_id == 4 || module_id === 4) {
            var importexportpremisesfrm = activeTab.down('importexportpremisesfrm');
            importexportpremisesfrm.loadRecord(record);
        } else {
            premiseForm = activeTab.down('premisedetailsfrm');
            applicantForm = activeTab.down('applicantdetailsfrm');
            contactPersonFrm = activeTab.down('premisecontactpersonfrm');
        }
        if (module_id == 3 || module_id === 3) {//GMP
            premiseForm.loadRecord(record);
        } else {
            premiseForm.loadRecord(model);
            applicantForm.loadRecord(record);
            //activeTab.down('premiseotherdetailsgrid').getStore().load();
            activeTab.down('premisepersonneldetailsgrid').getStore().load();
            me.getPremiseContactPersonDetails(premise_id, contactPersonFrm);
        }
        // Ext.Function.defer(function () {
        //     mask.hide();
        //     win.close();
        // }, 200);
    },

    getPremiseContactPersonDetails: function (premise_id, contactPersonFrm) {
        Ext.getBody().mask('Please wait...');
        Ext.Ajax.request({
            method: 'GET',
            url: 'premiseregistration/getPremiseContactPersonDetails',
            params: {
                premise_id: premise_id
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
                        contactPersonFrm.loadRecord(model);
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

    showApplicationCommentsWin: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            //workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        this.showApplicationCommentsGeneric(btn, application_id, application_code);
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
    refreshAuditingChecklistItemsGrid: function (me) {
        var store = me.getStore(),
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            checklist_type = grid.down('combo[name=applicable_checklist]').getValue();
        store.getProxy().extraParams = {
            application_id: application_id,
            checklist_type: checklist_type
        };
    },

    uploadApplicationFile: function (btn) {
        var me = this,
            isWin = btn.isWin,
            form = btn.up('form'),
            win = form.up('window'),
            frm = form.getForm(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            uploads_store;
        if (isWin == 1 || isWin === 1) {
            uploads_store = Ext.getStore('foodpremdocuploadsstr');
        } else {
            uploads_store = activeTab.down('foodpremdocuploadsgrid').store
        }
        frm.submit({
            //clientValidation: false,
            url: 'premiseregistration/uploadApplicationFile',
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
    //New
    showNewReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            hasQueries = checkApplicationRaisedQueries(application_code, module_id),
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id),
            extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'has_queries',
                value: hasQueries
            }];
        valid = this.validateNewPremiseReceivingSubmission(btn);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID, extraParams);//workflowsubmissionsfrm
        } else {
            Ext.getBody().unmask();
        }
    },

    validateNewPremiseReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),
            premiseFrm = activeTab.down('premisedetailsfrm'),
            screeningGrid = activeTab.down('premisescreeninggrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!applicant_id) {
            toastr.warning('Please Select Applicant!!', 'Warning Response');
            return false;
        }
        if (!premiseFrm.isValid()) {
            toastr.warning('Please Enter All the required Facility Details!!', 'Warning Response');
            return false;
        }
        // this.savePremiseNewReceivingBaseDetails(btn);

        // if (screeningGrid.getStore().getModifiedRecords().length > 0) {
        //     // toastr.warning('There are unsaved screening data!!', 'Warning Response');
        //     // return false;
        // }
        return true;
    },

    //Renewal
    showRenewalReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
           
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);

        valid = this.validatePremiseRenewalReceivingSubmission(btn);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },

    validatePremiseRenewalReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),
            premiseFrm = activeTab.down('premisedetailsfrm'),
            //screeningGrid = activeTab.down('premisescreeninggrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!applicant_id) {
            toastr.warning('Please Select Applicant!!', 'Warning Response');
            return false;
        }
        if (!premiseFrm.isValid()) {
            toastr.warning('Please Enter All the required Facility Details!!', 'Warning Response');
            return false;
        }
        this.savePremiseRenewalReceivingBaseDetails(btn);
        // if (screeningGrid.getStore().getModifiedRecords().length > 0) {
        //     toastr.warning('There are unsaved screening data!!', 'Warning Response');
        //     return false;
        // }
        return true;
    },

    //Alteration
    showAlterationReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = this.validatePremiseAlterationReceivingSubmission(btn),
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },

    validatePremiseAlterationReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),
            premiseFrm = activeTab.down('premisedetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!applicant_id) {
            toastr.warning('Please Select Applicant!!', 'Warning Response');
            return false;
        }
        if (!premiseFrm.isValid()) {
            toastr.warning('Please Enter All the required Facility Details!!', 'Warning Response');
            return false;
        }
        this.savePremiseAlterationReceivingBaseDetails(btn);
        return true;
    },

    //Alteration
    showCancellationReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = this.validatePremiseCancellationReceivingSubmission(btn),
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },
    showSubmisionsReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = this.validatePremiseCancellationReceivingSubmission(btn),
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },
    validatePremiseCancellationReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),
            premiseFrm = activeTab.down('premisedetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!applicant_id) {
            toastr.warning('Please Select Applicant!!', 'Warning Response');
            return false;
        }
        if (!premiseFrm.isValid()) {
            toastr.warning('Please Enter All the required Facility Details!!', 'Warning Response');
            return false;
        }
        this.savePremiseCancellationReceivingBaseDetails(btn);
        return true;
    },

    //Common/Reused
    showInvoicingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = this.validatePremiseInvoicingSubmission(btn),
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },

    validatePremiseInvoicingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoiceDetailsGrid = activeTab.down('invoicingcostdetailsgrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!invoice_id) {
            toastr.warning('Please Save Invoice Details!!', 'Warning Response');
            return false;
        }
        if (invoiceDetailsGrid.getStore().data.length < 1) {
            toastr.warning('No Cost Elements Selected For Invoicing!!', 'Warning Response');
            return false;
        } else {
            this.saveNewPremiseInvoicingDetails(btn);
        }
        return true;
    },

    showPaymentApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = this.validatePremisePaymentSubmission(),
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },

    validatePremisePaymentSubmission: function () {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            // paymentDetailsGrid = activeTab.down('applicationpaymentsgrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            balance_str = activeTab.down('displayfield[name=running_balance]').getValue(),
            balance = balance_str.split("(")[0],
            bal_txt = balance.replace('-', ''),
            bal = balance.replace(',', '');
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        // if (paymentDetailsGrid.getStore().getTotalCount() < 1) {
        //     toastr.warning('No Payment Details Captured!!', 'Warning Response');
        //     return false;
        // }
        if (parseFloat(bal) > 0) {
            toastr.warning('The Application cannot be submitted until the applicant clears a balance of ' + balance_str, 'Warning Response');
            return false;
        }
        return true;
    },
    refreshRegisteredPremisesgrid: function (me) {

        var store = me.getStore(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            status_id = activeTab.down('hiddenfield[name=status_id]').getValue();

                store.getProxy().extraParams = {
                    section_id: section_id,
                    status_id: status_id
                };

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
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id,sub_module_id),
            table_name = btn.table_name;

            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsinspectionsfrm', winWidth, storeID, '', '', 'selected', workflow_stage_id);
            
    },

    validateManagerInspectionApplicationSubmission: function (btn) {
        var valid = true,
            saveInfo = this.saveInspectionDetails(btn);
        if (saveInfo == false || saveInfo === false) {
            valid = false;
        }
        return valid;
    },
    showPremisesInspectionApplicationSubmissionWin: function (btn) {
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
            implementation_id = activeTab.down('hiddenfield[name=implementation_id]'),
            storeID = getApplicationStore(module_id, section_id,sub_module_id),
            table_name = getApplicationTable(module_id),
            inspection_id = activeTab.down('form').down('hiddenfield[name=id]').getValue(),
            leadInspectorDetails = inspectorsStore.findRecord('role_id', 2);
            
        if(implementation_id){
            implementation_id = implementation_id.getValue();
        }
        if (!leadInspectorDetails) {
            Ext.getBody().unmask();
            toastr.warning('No lead inspector found!!', 'Warning Response');
            return false;
        }
        // var lead_inspector_id = leadInspectorDetails.get('inspector_id'),
        var extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'inspection_id',
                value: inspection_id,
            }];
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsinspectionsfrm', winWidth, storeID, extraParams, '', 'selected');
    },
    shownewPremisesInspectionApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            // inspectorsGrid = activeTab.down('inspectioninspectorsgrid'),
            // inspectorsStore = inspectorsGrid.getStore(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            storeID = getApplicationStore(module_id, section_id,sub_module_id),
            table_name = 'tra_premiseinspection_applications',
            inspection_id = activeTab.down('form').down('hiddenfield[name=id]').getValue();
            // leadInspectorDetails = inspectorsStore.findRecord('role_id', 2);
            
        // if (!leadInspectorDetails) {
        //     Ext.getBody().unmask();
        //     toastr.warning('No lead inspector found!!', 'Warning Response');
        //     return false;
        // }
        var extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'inspection_id',
                value: inspection_id,
            }];
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsinspectionsfrm', winWidth, storeID, extraParams, '', '', workflow_stage_id);
    },
    showManagerInspectionApplicationSubmissionWin: function (btn) {
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
            implementation_id = activeTab.down('hiddenfield[name=implementation_id]'),
            valid = this.validateManagerInspectionApplicationSubmission(btn),
            storeID = getApplicationStore(module_id, section_id,sub_module_id),
            table_name = getApplicationTable(module_id),
            inspection_id = activeTab.down('form').down('hiddenfield[name=id]').getValue(),
            leadInspectorDetails = inspectorsStore.findRecord('role_id', 2);
        if(implementation_id){
            implementation_id = implementation_id.getValue();
        }
        if (!leadInspectorDetails) {
            Ext.getBody().unmask();
            toastr.warning('No lead inspector found!!', 'Warning Response');
            return false;
        }
        // var lead_inspector_id = leadInspectorDetails.get('inspector_id'),
        var extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'inspection_id',
                value: inspection_id,
            }];
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsinspectionsfrm', winWidth, storeID, extraParams, '', 'selected');
        } else {
            Ext.getBody().unmask();
        }
    },

    validateManagerInspectionApplicationSubmission: function (btn) {
        var valid = true,
            saveInfo = this.saveInspectionDetails(btn);
        if (saveInfo == false || saveInfo === false) {
            valid = false;
        }
        return valid;
    },

    showInspectionApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            hasQueries = checkApplicationRaisedQueries(application_code, module_id),
            valid = true,
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id),
            extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'has_queries',
                value: hasQueries
            }];
        if(btn.isInspectionSubmit == 1){
            var pnl = btn.up('panel'),
                grid = pnl.down('premisescreeninggrid')
                store = grid.getStore();
                 for (var i = 0; i < store.data.items.length; i++) {
                    var record = store.data.items[i];

                    if (record.dirty) {
                        toastr.warning('Please save inspection details!!', 'Warning Response');
                        Ext.getBody().unmask();
                        return false;
                    }
        }
        }
        if (valid == true || valid === true) {
            showRecommendationWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsstrictrecommfrm', winWidth, storeID, 1, extraParams);
        } else {
            Ext.getBody().unmask();
        }
    },

    showEvaluationApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = true,
            hasQueries = checkApplicationRaisedQueries(application_code, module_id),
            hasRespondedUnclosedQueries = checkApplicationRespondedUnclosedQueries(application_code, module_id),
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id),
            extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'has_queries',
                value: hasQueries
            }];
        if (hasRespondedUnclosedQueries > 0) {
            Ext.getBody().unmask();
            toastr.warning('Please close responded queries to proceed!!', 'Warning Response');
            return false;
        }
        if (valid == true || valid === true) {
            showRecommendationWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsstrictrecommfrm', winWidth, storeID, 2, extraParams);
        } else {
            Ext.getBody().unmask();
        }
    },

    showAuditingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = true,
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },

    showSingleApprovalsApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = true,
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },

    showCommunicationsApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = true,
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagersgenericfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
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
            valid = true,
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagerqueryfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },

    onInvoiceFeeTypeChange: function (cmbo, newVal) {
        var mainTabPanel = this.getMainTabPanel(),
            grid = cmbo.up('grid'),
            costCategoriesStore = grid.down('combo[name=cost_category_id]').getStore(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            filter = {
                section_id: section_id,
                fee_type_id: newVal
            };
        filter = JSON.stringify(filter);
        costCategoriesStore.removeAll();
        costCategoriesStore.load({params: {filter: filter}});
        //costCategoriesStore.load({params: {section_id: section_id, fee_type_id: newVal}});
    },

    refreshInvoiceCostDetailsGrid: function (me) {
        var found = 0;
        if(me.up('paymentspanel')){
            if(me.up('paymentspanel').up('panel').down('hiddenfield[name=active_application_code]')){
                var store = me.getStore(),
                    popview = me.up('paymentspanel').up('panel'),
                    application_id = popview.down('hiddenfield[name=active_application_id]').getValue(),
                    //invoice_id = popview.down('hiddenfield[name=invoice_id]').getValue(),
                    application_code = popview.down('hiddenfield[name=active_application_code]').getValue();
                if(application_code){
                    found = 1;
                }
            }
            else if(me.up('paymentspanel').up('panel').up('panel').down('hiddenfield[name=active_application_code]')){
                var store = me.getStore(),
                    popview = me.up('paymentspanel').up('panel').up('panel'),
                    application_id = popview.down('hiddenfield[name=active_application_id]').getValue(),
                    //invoice_id = popview.down('hiddenfield[name=invoice_id]').getValue(),
                    application_code = popview.down('hiddenfield[name=active_application_code]').getValue();
                if(application_code){
                    found = 1;
                }
            }
        }

        if(found == 0 ){
            var store = me.store,
                mainTabPanel = this.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab();
            if(activeTab.down('hiddenfield[name=active_application_code]').getValue()){
                application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            }else{
                
                return false;
               // invoice_id = activeTab.down('hiddenfield[name=invoice_id]').getValue();
            }
                
        }
        this.fireEvent('func_check_balance', application_code);
        if(store){
            store.getProxy().extraParams = {
               // invoice_id: invoice_id,
                application_code: application_code
            };
        }
        
    },
    refreshOnlineInvoiceCostDetailsGrid: function (me) {
        var found = 0;
                var store = me.getStore(),
                popview = me.up('window'),
                application_id = popview.down('hiddenfield[name=active_application_id]').getValue(),
                //invoice_id = popview.down('hiddenfield[name=invoice_id]').getValue(),
                application_code = popview.down('hiddenfield[name=active_application_code]').getValue();
                if(application_code){
                    found = 1;
                }
         
        
      //  this.fireEvent('func_check_balance', application_code);
        if(store){
            store.getProxy().extraParams = {
               // invoice_id: invoice_id,
                application_code: application_code
            };
        }
        
    },
    
    removeApplicationPaymentDetails: function (btn) {
        Ext.getBody().mask('Please wait...');
        var grid = btn.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            panel = activeTab.down('foodnewpaymentspnl'),
            running_balance = panel.down('displayfield[name=running_balance]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]').getValue(),
            sm = grid.getSelectionModel(),
            records = sm.getSelection(),
            store = grid.getStore(),
            selected = [];
        Ext.each(records, function (record) {
            var id = record.get('id');
            if (id) {
                //var obj = {id: id};
                selected.push(id);
            }
        });
        Ext.MessageBox.confirm('Confirm', 'Are you sure to remove selected payment details?', function (button) {
            if (button === 'yes') {
                Ext.Ajax.request({
                    url: 'premiseregistration/removeApplicationPaymentDetails',
                    jsonData: selected,
                    params: {
                        application_id: application_id,
                        application_code: application_code,
                        invoice_id: invoice_id
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message,
                            balance = resp.balance,
                            invoice_amount = resp.invoice_amount,
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
                            store.load();
                            toastr.success(message, 'Success Response');
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

    saveApplicationAuditingChecklistDetails: function (btn) {
        btn.setLoading(true);
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            screeningGrid = activeTab.down('foodpremauditingcheckgrid'),
            checklist_type = screeningGrid.down('combo[name=applicable_checklist]').getValue(),
            store = screeningGrid.getStore(),
            params = [];
        for (var i = 0; i < store.data.items.length; i++) {
            var record = store.data.items [i],
                checklist_item_id = record.get('id'),
                pass_status = record.get('pass_status'),
                comment = record.get('comment'),
                item_resp_id = record.get('item_resp_id'),
                auditor_comment = record.get('auditor_comment');
            var obj = {
                application_id: application_id,
                item_resp_id: item_resp_id,
                created_by: user_id,
                checklist_item_id: checklist_item_id,
                pass_status: pass_status,
                comment: comment,
                auditor_comment: auditor_comment
            };
            if (record.dirty) {
                params.push(obj);
            }
        }
        if (params.length < 1) {
            btn.setLoading(false);
            toastr.warning('No records to save!!', 'Warning Response');
            return false;
        }
        params = JSON.stringify(params);
        Ext.Ajax.request({
            url: 'premiseregistration/saveNewAuditingChecklistDetails',
            params: {
                screening_details: params
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                    store.load();
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

    showApplicationEvaluationTemplate: function (btn) {
        // if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
        var me = this,
            childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            child = Ext.widget(childXtype),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        child.down('hiddenfield[name=application_id]').setValue(application_id);
        child.down('hiddenfield[name=application_code]').setValue(application_code);
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        Ext.Ajax.request({
            url: 'premiseregistration/getApplicationEvaluationTemplate',
            method: 'GET',
            params: {
                application_id: application_id,
                application_code: application_code
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    results = resp.results;
                if (success == true || success === true) {
                    if (results) {
                        child.down('hiddenfield[name=id]').setValue(results.id);
                        child.down('htmleditor[name=template]').setValue(results.template);
                    }
                    funcShowCustomizableWindow(winTitle, '', child, 'customizablewindow');
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
        /* } else {
             toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
             return false;
         }*/
    },

    getApplicationApprovalDetails: function (btn) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            table_name = btn.table_name,
            form = Ext.widget('approvalrecommendationfrm'),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        form.down('hiddenfield[name=table_name]').setValue(table_name);
        Ext.Ajax.request({
            method: 'GET',
            url: 'common/getApplicationApprovalDetails',
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
                    results = resp.results,
                    model = Ext.create('Ext.data.Model', results);
                if (success == true || success === true) {
                    form.loadRecord(model);
                    form.down('hiddenfield[name=application_id]').setValue(application_id);
                    form.down('hiddenfield[name=application_code]').setValue(application_code);
                    form.down('hiddenfield[name=process_id]').setValue(process_id);
                    form.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
                    funcShowCustomizableWindow('Recommendation', '40%', form, 'customizablewindow');
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

    saveOnlineApplicationDetails: function (bttn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            action_btn = activeTab.down('button[name=action]'),
            save_btn = activeTab.down('button[name=save_btn]'),
            submit_btn = activeTab.down('button[name=process_submission_btn]');
        Ext.MessageBox.confirm('Confirm', 'Are you sure to accept this application?', function (button) {
            if (button === 'yes') {
                Ext.MessageBox.show({
                    title: 'Remarks',
                    msg: 'Remarks/Coments:',
                    width: 320,
                    buttons: Ext.MessageBox.OKCANCEL,
                    multiline: true,
                    scope: this,
                    // fn: this.deactivateSystemUser(btn, me),
                    animateTarget: bttn,
                    fn: function (btn, text) {
                        var comment = text;
                        if (btn === 'ok') {
                            Ext.getBody().mask('Please wait...');
                            if (comment == '' || comment === '') {
                                Ext.getBody().unmask();
                                toastr.warning('Please Enter Remark!!', 'Warning Response');
                                return;
                            }
                            Ext.Ajax.request({
                                url: 'premiseregistration/saveOnlineApplicationDetails',
                                params: {
                                    application_id: application_id,
                                    comment: comment
                                },
                                headers: {
                                    'Authorization': 'Bearer ' + access_token,
                                    'X-CSRF-Token': token
                                },
                                success: function (response) {
                                    Ext.getBody().unmask();
                                    var resp = Ext.JSON.decode(response.responseText),
                                        success = resp.success,
                                        message = resp.message,
                                        details = resp.details;
                                    if (success == true || success === true) {
                                        toastr.success(message, 'Success Response');
                                        me.fireEvent('rePrepareAppBaseDetails', details);
                                        action_btn.setVisible(false);
                                        save_btn.setVisible(true);
                                        submit_btn.setVisible(true);
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
                    }
                });
            }
        });
    },
    showManagerApplicationSubmissionWinGeneric: function (btn) {
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
            is_dataammendment_request =0,
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
            if(activeTab.down('hiddenfield[name=is_dataammendment_request]')){
                is_dataammendment_request =activeTab.down('hiddenfield[name=is_dataammendment_request]').getValue();
            }
            
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagersgenericfrm', winWidth, storeID,'','','',workflow_stage_id,is_dataammendment_request);
         
        } else {
            Ext.getBody().unmask();
        }
    },
    rejectOnlineApplicationDetails: function (bttn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            store = Ext.getStore('onlinepremregistrationstr');
        Ext.MessageBox.confirm('Confirm', 'Are you sure to reject this application?', function (button) {
            if (button === 'yes') {
                Ext.MessageBox.show({
                    title: 'Remarks',
                    msg: 'Remarks/Coments:',
                    width: 320,
                    buttons: Ext.MessageBox.OKCANCEL,
                    multiline: true,
                    scope: this,
                    // fn: this.deactivateSystemUser(btn, me),
                    animateTarget: bttn,
                    fn: function (btn, text) {
                        var comment = text;
                        if (btn === 'ok') {
                            Ext.getBody().mask('Please wait...');
                            if (comment == '' || comment === '') {
                                Ext.getBody().unmask();
                                toastr.warning('Please Enter Remark!!', 'Warning Response');
                                return;
                            }
                            Ext.Ajax.request({
                                url: 'premiseregistration/rejectOnlineApplicationDetails',
                                params: {
                                    application_id: application_id,
                                    comment: comment
                                },
                                headers: {
                                    'Authorization': 'Bearer ' + access_token,
                                    'X-CSRF-Token': token
                                },
                                success: function (response) {
                                    Ext.getBody().unmask();
                                    var resp = Ext.JSON.decode(response.responseText),
                                        success = resp.success,
                                        message = resp.message,
                                        details = resp.details;
                                    if (success == true || success === true) {
                                        toastr.success(message, 'Success Response');
                                        mainTabPanel.remove(activeTab);
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
                                    toastr.error('Error: ' + errorThrown, 'Error Response');
                                }
                            });
                        }
                    }
                });
            }
        });
    },

    showAddPremiseOtherDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            premise_id = activeTab.down('hiddenfield[name=premise_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            business_type_id = activeTab.down('combo[name=business_type_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            title = btn.winTitle,
            form = Ext.widget('premiseotherdetailsfrm'),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length,
            filters = {section_id: section_id},
            filter = JSON.stringify(filters),
            busTypesStr = form.down('combo[name=business_type_id]').getStore();
        if (!application_id) {
            toastr.warning('Please save application first!!', 'Warning Response');
            return false;
        }
        if (!business_type_id) {
            toastr.warning('Please select business type first!!', 'Warning Response');
            return false;
        }
        form.down('hiddenfield[name=premise_id]').setValue(premise_id);
        form.down('combo[name=business_type_id]').setValue(business_type_id);
        busTypesStr.removeAll();
        busTypesStr.load({params: {filter: filter}});
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        funcShowCustomizableWindow(title, '35%', form, 'customizablewindow');
    },

    showAddPremisePersonnelDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            grid = btn.up('grid'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            premise_id = 0,
            manufacturing_site_id= 0;
        if(module_id == 2){
            var premise_id = activeTab.down('hiddenfield[name=premise_id]').getValue();
        }else{
            var manufacturing_site_id = activeTab.down('hiddenfield[name=manufacturing_site_id]').getValue();
        }
        var application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            title = btn.winTitle,
            winWidth = btn.winWidth,
            childObject = Ext.widget(btn.childXtype),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length,
            positionsStore = Ext.getStore('personnelpositionsstr');
        childObject.down('button[name=save_btn]').storeID = btn.storeID;
        childObject.down('button[name=save_btn]').action_url = btn.action_url;
        childObject.down('hiddenfield[name=premise_id]').setValue(premise_id);
        childObject.down('hiddenfield[name=module_id]').setValue(module_id);
        childObject.down('hiddenfield[name=manufacturing_site_id]').setValue(manufacturing_site_id);
        if (!application_id) {
            toastr.warning('Please save application first!!', 'Warning Response');
            return false;
        }
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        //for variations with flags
        childObject.is_variation = grid.is_variation;

        positionsStore.removeAll();
        positionsStore.load();
        funcShowCustomizableWindow(title, winWidth, childObject, 'customizablewindow');
    },

    savePremiseNewReceivingBaseDetails: function (btn) {
      //  Ext.getBody().mask('Please wait...');
        var me = this,
            // toaster = btn.toaster,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            applicantDetailsForm = activeTab.down('applicantdetailsfrm'),
            applicant_id = applicantDetailsForm.down('hiddenfield[name=applicant_id]').getValue(),
            premise_type_id=activeTab.down('hiddenfield[name=premise_type_id]').getValue(),
            premiseDetailsForm=activeTab.down('premisedetailsfrm'),
            premiseDetailsFrm = premiseDetailsForm.getForm(),
            contactPersonForm = activeTab.down('premisecontactpersonfrm'),
            contactPersonFrm = contactPersonForm.getForm(),
            applicant_contact_person = contactPersonForm.down('combo[name=applicant_contact_person]').getValue(),
            contact_person_id = contactPersonForm.down('hiddenfield[name=contact_person_id]').getValue(),
            contact_person_startdate = contactPersonForm.down('datefield[name=start_date]').getValue(),
            contact_person_enddate = contactPersonForm.down('datefield[name=end_date]').getValue();
        if (!applicant_id) {
            toastr.warning('Please select applicant!!', 'Warning Response');
            return false;
        }
        if (premiseDetailsFrm.isValid()) {
            if (!contactPersonFrm.isValid()) {
                toastr.warning('Please provide details of contact person!!', 'Warning Response');
                return false;
            }
            premiseDetailsFrm.submit({
                url: 'premiseregistration/saveNewReceivingBaseDetails',
                waitMsg: 'Please wait...',
                params: {
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    application_id: application_id,
                    applicant_id: applicant_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    section_id: section_id,
                    premise_type_id:premise_type_id,
                    applicant_contact_person: applicant_contact_person,
                    contact_person_id: contact_person_id,
                    contact_person_startdate: contact_person_startdate,
                    contact_person_enddate: contact_person_enddate
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (frm, action) {
                    Ext.getBody().unmask();
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success,
                        record_id = resp.record_id,
                        tracking_no = resp.tracking_no,
                        application_code = resp.application_code,
                        premise_id = resp.premise_id;
                    if (success == true || success === true) {
                            toastr.success(message, "Success Response");
                            activeTab.down('hiddenfield[name=active_application_id]').setValue(record_id);
                            activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
                            premiseDetailsForm.down('hiddenfield[name=premise_id]').setValue(premise_id);
                            activeTab.down('displayfield[name=tracking_no]').setValue(tracking_no);
                        
                    } else {
                        toastr.error(message, "Failure Response");
                        closeActiveWindow();
                    }
                },
                failure: function (frm, action) {
                    var resp = action.result,
                        message = resp.message;
                    toastr.error(message, "Failure Response");
                    closeActiveWindow();
                }
            });
        } else {
            toastr.warning('Please fill all the required fields!!', 'Warning Response');
            return false;
        }
    },

    savePremiseRenewalReceivingBaseDetails: function (btn) {
        var me = this,
            toaster = btn.toaster,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            premise_type_id = activeTab.down('hiddenfield[name=premise_type_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            applicantDetailsForm = activeTab.down('applicantdetailsfrm'),
            applicant_id = applicantDetailsForm.down('hiddenfield[name=applicant_id]').getValue(),
            premiseDetailsForm = activeTab.down('premisedetailsfrm'),
            premiseDetailsFrm = premiseDetailsForm.getForm();
        if (premiseDetailsFrm.isValid()) {
            if (!applicant_id) {
                toastr.warning('Please select applicant!!', 'Warning Response');
                return false;
            }
            premiseDetailsFrm.submit({
                url: 'premiseregistration/saveRenewalAlterationReceivingBaseDetails',
                waitMsg: 'Please wait...',
                params: {
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    application_id: application_id,
                    applicant_id: applicant_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    section_id: section_id,
                    premise_type_id: premise_type_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (frm, action) {
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success,
                        record_id = resp.record_id,
                        tracking_no = resp.tracking_no,
                        application_code = resp.application_code,
                        premise_id = resp.premise_id,
                        temporal_premise_id = resp.temporal_premise_id;
                    if (success == true || success === true) {
                        if (toaster == 1 || toaster === 1) {
                            btn.setDisabled(true);
                            toastr.success(message, "Success Response");
                            activeTab.down('hiddenfield[name=active_application_id]').setValue(record_id);
                            activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
                            premiseDetailsForm.down('hiddenfield[name=premise_id]').setValue(premise_id);
                            premiseDetailsForm.down('hiddenfield[name=temporal_premise_id]').setValue(temporal_premise_id);
                            activeTab.down('displayfield[name=tracking_no]').setValue(tracking_no);
                            premiseDetailsForm.down('button[action=search_premise]').setDisabled(true);
                            //zone_fld.setReadOnly(true);
                        }
                    } else {
                        toastr.error(message, "Failure Response");
                        closeActiveWindow();
                    }
                },
                failure: function (frm, action) {
                    var resp = action.result,
                        message = resp.message;
                    toastr.error(message, "Failure Response");
                    closeActiveWindow();
                }
            });
        } else {
            toastr.warning('Please fill all the required fields!!', 'Warning Response');
            return false;
        }
    },

    savePremiseAlterationReceivingBaseDetails: function (btn) {
        var me = this,
            toaster = btn.toaster,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            premise_type_id=activeTab.down('hiddenfield[name=premise_type_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            applicantDetailsForm = activeTab.down('applicantdetailsfrm'),
            applicant_id = applicantDetailsForm.down('hiddenfield[name=applicant_id]').getValue(),
            premiseDetailsForm = activeTab.down('premisedetailsfrm'),
            premise_id = premiseDetailsForm.down('hiddenfield[name=premise_id]').getValue(),
            premiseDetailsFrm = premiseDetailsForm.getForm(),
            contactPersonForm = activeTab.down('premisecontactpersonfrm'),
            contactPersonFrm = contactPersonForm.getForm(),
            applicant_contact_person = contactPersonForm.down('combo[name=applicant_contact_person]').getValue(),
            contact_person_id = contactPersonForm.down('hiddenfield[name=contact_person_id]').getValue(),
            contact_person_startdate = contactPersonForm.down('datefield[name=start_date]').getValue(),
            contact_person_enddate = contactPersonForm.down('datefield[name=end_date]').getValue();
        if (!premise_id) {
            toastr.warning('Please select facility to alter!!', 'Warning Response');
            return false;
        }
        if (premiseDetailsFrm.isValid()) {
            if (!applicant_id) {
                toastr.warning('Please select applicant!!', 'Warning Response');
                return false;
            }
            premiseDetailsFrm.submit({
                url: 'premiseregistration/saveRenewalAlterationReceivingBaseDetails',
                waitMsg: 'Please wait...',
                params: {
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    application_id: application_id,
                    applicant_id: applicant_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    section_id: section_id,
                    premise_type_id:premise_type_id,
                    applicant_contact_person: applicant_contact_person,
                    contact_person_id: contact_person_id,
                    contact_person_startdate: contact_person_startdate,
                    contact_person_enddate: contact_person_enddate
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (frm, action) {
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success,
                        record_id = resp.record_id,
                        tracking_no = resp.tracking_no,
                        application_code = resp.application_code,
                        premise_id = resp.premise_id,
                        temporal_premise_id = resp.temporal_premise_id;
                    if (success == true || success === true) {
                        if (toaster == 1 || toaster === 1) {
                            toastr.success(message, "Success Response");
                            activeTab.down('hiddenfield[name=active_application_id]').setValue(record_id);
                            activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
                            premiseDetailsForm.down('hiddenfield[name=premise_id]').setValue(premise_id);
                            premiseDetailsForm.down('hiddenfield[name=temporal_premise_id]').setValue(temporal_premise_id);
                            // premiseDetailsForm.down('button[action=search_premise]').setDisabled(true);
                            activeTab.down('displayfield[name=tracking_no]').setValue(tracking_no);
                            btn.setText('Save Facility Main Details');
                        }
                    } else {
                        toastr.error(message, "Failure Response");
                        closeActiveWindow();
                    }
                },
                failure: function (frm, action) {
                    var resp = action.result,
                        message = resp.message;
                    toastr.error(message, "Failure Response");
                    closeActiveWindow();
                }
            });
        } else {
            toastr.warning('Please fill all the required fields!!', 'Warning Response');
            return false;
        }
    },

    savePremiseCancellationReceivingBaseDetails: function (btn) {
        var me = this,
            toaster = btn.toaster,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            premise_type_id=activeTab.down('hiddenfield[name=premise_type_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            applicantDetailsForm = activeTab.down('applicantdetailsfrm'),
            applicant_id = applicantDetailsForm.down('hiddenfield[name=applicant_id]').getValue(),
            premiseDetailsForm = activeTab.down('premisedetailsfrm'),
            premiseDetailsFrm = premiseDetailsForm.getForm(), 
            contactPersonForm = activeTab.down('premisecontactpersonfrm'),
            contactPersonFrm = contactPersonForm.getForm(),
            applicant_contact_person = contactPersonForm.down('combo[name=applicant_contact_person]').getValue(),
            contact_person_id = contactPersonForm.down('hiddenfield[name=contact_person_id]').getValue(),
            contact_person_startdate = contactPersonForm.down('datefield[name=start_date]').getValue(),
            contact_person_enddate = contactPersonForm.down('datefield[name=end_date]').getValue();
            
        if (premiseDetailsFrm.isValid()) {
            if (!applicant_id) {
                toastr.warning('Please select applicant!!', 'Warning Response');
                return false;
            }
            premiseDetailsFrm.submit({
                url: 'premiseregistration/saveRenewalAlterationReceivingBaseDetails',
                waitMsg: 'Please wait...',
                params: {
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    application_id: application_id,
                    applicant_id: applicant_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    section_id: section_id,
                    premise_type_id:premise_type_id,
                    applicant_contact_person: applicant_contact_person,
                    contact_person_id: contact_person_id,
                    contact_person_startdate: contact_person_startdate,
                    contact_person_enddate: contact_person_enddate
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (frm, action) {
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success,
                        record_id = resp.record_id,
                        tracking_no = resp.tracking_no,
                        application_code = resp.application_code,
                        premise_id = resp.premise_id,
                        temporal_premise_id = resp.temporal_premise_id;
                    if (success == true || success === true) {
                        if (toaster == 1 || toaster === 1) {
                            toastr.success(message, "Success Response");
                            //zone_fld.setReadOnly(true);
                            activeTab.down('hiddenfield[name=active_application_id]').setValue(record_id);
                            activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
                            premiseDetailsForm.down('hiddenfield[name=premise_id]').setValue(premise_id);
                            premiseDetailsForm.down('hiddenfield[name=temporal_premise_id]').setValue(temporal_premise_id);
                            // premiseDetailsForm.down('button[action=search_premise]').setDisabled(true);
                            activeTab.down('displayfield[name=tracking_no]').setValue(tracking_no);
                            btn.setText('Save Facility Main Details');
                        }
                    } else {
                        toastr.error(message, "Failure Response");
                        closeActiveWindow();
                    }
                },
                failure: function (frm, action) {
                    var resp = action.result,
                        message = resp.message;
                    toastr.error(message, "Failure Response");
                    closeActiveWindow();
                }
            });
        } else {
            toastr.warning('Please fill all the required fields!!', 'Warning Response');
            return false;
        }
    },

    updatePremiseApplicationDetails: function (btn) {
        var me = this,
            toaster = btn.toaster,
            wizardPnl = btn.up('panel'),
            process_id = wizardPnl.down('hiddenfield[name=process_id]').getValue(),
            module_id = wizardPnl.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = wizardPnl.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = wizardPnl.down('hiddenfield[name=section_id]').getValue(),
            branch_id = wizardPnl.down('combo[name=branch_id]').getValue(),
            workflow_stage_id = wizardPnl.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = wizardPnl.down('hiddenfield[name=application_id]').getValue(),
            applicantDetailsForm = wizardPnl.down('applicantdetailsfrm'),
            applicant_id = applicantDetailsForm.down('hiddenfield[name=applicant_id]').getValue(),
            premiseDetailsForm = wizardPnl.down('premisedetailsfrm'),
            premiseDetailsFrm = premiseDetailsForm.getForm(),
            action_url = 'premiseregistration/saveRenewalAlterationReceivingBaseDetails';
        if (sub_module_id == 1 || sub_module_id === 1) {
            action_url = 'premiseregistration/saveNewReceivingBaseDetails';
        }
       /* if (!branch_id) {
            toastr.warning('Please select zone!!', 'Warning Response');
            return false;
        }
        */
        if (!applicant_id) {
            toastr.warning('Please select applicant!!', 'Warning Response');
            return false;
        }
        if (premiseDetailsFrm.isValid()) {
            premiseDetailsFrm.submit({
                url: action_url,
                waitMsg: 'Please wait...',
                params: {
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    application_id: application_id,
                    applicant_id: applicant_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    section_id: section_id,
                    branch_id: branch_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (frm, action) {
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success;
                    if (success == true || success === true) {
                        if (toaster == 1 || toaster === 1) {
                            toastr.success(message, "Success Response");
                        }
                    } else {
                        toastr.error(message, "Failure Response");
                    }
                },
                failure: function (frm, action) {
                    var resp = action.result,
                        message = resp.message;
                    toastr.error(message, "Failure Response");
                }
            });
        } else {
            toastr.warning('Please fill all the required fields!!', 'Warning Response');
            return false;
        }
    },

    showApplicationMoreDetails: function (btn) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            premise_id = activeTab.down('hiddenfield[name=premise_id]').getValue(),
            applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue(),
            ref_no = activeTab.down('displayfield[name=reference_no]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();

            
        this.showApplicationMoreDetailsGeneric(application_id, premise_id, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, active_application_code);
    },
   
    showApplicationMoreDetailsGeneric: function (application_id, premise_id, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, active_application_code=null,premise_type_id) {
        Ext.getBody().mask('Please wait...');
        var view = 'premiseappmoredetailswizard';
        if(sub_module_id == 78 || sub_module_id == 3){
            view = 'premiseAltappmoredetailswizard'
        }
        //set the active tab values
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        //set values
        if(activeTab.down('hiddenfield[name=premise_type_id]') && premise_type_id){
            activeTab.down('hiddenfield[name=premise_type_id]').setValue(premise_type_id);
        }
        //hide form variations save if its a variation


        var me = this,
            wizardPnl = Ext.widget(view),
            applicantPanel = wizardPnl.down('premiseapplicantpnl'),
            applicantFrm = applicantPanel.down('applicantdetailsfrm'),
            premiseFrm = wizardPnl.down('premisedetailsfrm'),
            contactFrm = wizardPnl.down('premisecontactpersonfrm'),
            personnelGrid = wizardPnl.down('premisepersonneldetailsgrid'),
            premiseproprietorsdetailsgrid = wizardPnl.down('premiseproprietorsdetailsgrid'),
            otherDetailsGrid = wizardPnl.down('premiseotherdetailswingrid');

        //hide form variations save if its a variation
        if(sub_module_id == 78){
            if(wizardPnl.down('button[name=save_changes]')){
                wizardPnl.down('button[name=save_changes]').destroy();
                wizardPnl.down('combo[name=variation_type]').setValue(2);
            }

        }
        if(sub_module_id == 3){
            if(wizardPnl.down('button[name=save_changes]')){
                wizardPnl.down('button[name=save_changes]').destroy();
                wizardPnl.down('combo[name=variation_type]').setValue(1);
            }

        }


        height = Ext.Element.getViewportHeight()-118;
        wizardPnl.setHeight(height);
        wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
        wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        wizardPnl.down('hiddenfield[name=application_id]').setValue(application_id);
        wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
        wizardPnl.down('hiddenfield[name=premise_type_id]').setValue(premise_type_id);
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
        //add application code 
        Ext.Ajax.request({
            method: 'GET',
            url: 'premiseregistration/getPremApplicationMoreDetails',
            params: {
                application_id: application_id,
                premise_id: premise_id,
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
                        console.log(premiseDetails);
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
    showPremisesInspectionDetailsWizard:function (application_id, app_inspection_id, premise_id,applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, is_temporal, application_code) {
        var me = this,
                wizardPnl = Ext.widget('premisesinspectionprocesswizard');

            wizardPnl.setHeight(500);
            wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
            wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
            wizardPnl.down('hiddenfield[name=application_id]').setValue(application_id);
            wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
            wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
            premisesinspectionrecommendationfrm = wizardPnl.down('premisesinspectionrecommendationfrm').getForm();
            // legalityofstockprdfrm = wizardPnl.down('legalityofstockprdfrm').getForm();
            
           // app_check_types_store = wizardPnl.down('combo[name=applicable_checklist]').store;

            if (application_id) {
                //set main view tab
                var mainTabPanel = this.getMainTabPanel(),
                    activeTab = mainTabPanel.getActiveTab();
                activeTab.down('hiddenfield[name=active_application_id]').setValue(application_id);
                activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
              /*  app_check_types_store.load({
                    params: {
                        process_id: process_id,
                        workflow_stage: workflow_stage_id
                    }
                });
                */
                // if(wizardPnl.down('legalityofstockprdgrid')){
                //     wizardPnl.down('legalityofstockprdgrid').down('hiddenfield[name=application_id]').setValue(application_id);
                // }
                
                Ext.Ajax.request({
                    method: 'GET',
                    url: 'premiseregistration/getPremisesInspectionRecommendationDetails',
                    params: {
                        app_inspection_id: app_inspection_id,
                        premise_id: premise_id
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
                            var model1 = Ext.create('Ext.data.Model', results);
                              
                            premisesinspectionrecommendationfrm.loadRecord(model1);
                            // legalityofstockprdfrm.loadRecord(model1);
                            
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
                
            }
            if(isReadOnly == 1 || isReadOnly == true){
                 // legalityofstockprdfrm.getFields().each (function (field) {
                 //      field.setReadOnly (true);
                 //    });
                 premisesinspectionrecommendationfrm.getFields().each (function (field) {
                      field.setReadOnly (true);
                    });
                if(wizardPnl.getViewModel()){
                    wizardPnl.getViewModel().set('isReadOnly', true);
                }
                //hide specific buttons
                // wizardPnl.down('button[handler=saveLegalityofStockprdRemarks]').setVisible(false);
                // wizardPnl.down('button[handler=addIllegalProductsSTocks]').setVisible(false);

                //disable grid events
                // if(wizardPnl.down('legalityofstockprdgrid')){
                //     legalityofstockprdgrid = wizardPnl.down('legalityofstockprdgrid');
                //     legalityofstockprdgrid.suspendEvent('itemdblclick');
                //     legalityofstockprdgrid.down('widgetcolumn').setVisible(false);
                // }
                
            }
            Ext.getBody().unmask();
    },
    deleteApplicationInvoice: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoice_id_fld = activeTab.down('hiddenfield[name=invoice_id]'),
            invoice_no = activeTab.down('displayfield[name=invoice_no]'),
            summaryStore = activeTab.down('invoicingcostdetailsgrid').getStore(),
            invoice_id = invoice_id_fld.getValue();
        if (!invoice_id) {
            toastr.warning('Nothing to delete, invoice details not saved yet!!', 'Warning Response');
            return false;
        }
        Ext.MessageBox.confirm('Confirm', 'Are you sure to delete this invoice?', function (button) {
            if (button === 'yes') {
                Ext.getBody().mask('Please wait...');
                Ext.Ajax.request({
                    url: 'premiseregistration/deleteApplicationInvoice',
                    params: {
                        invoice_id: invoice_id
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
                        if (success == true || success === true) {
                            invoice_id_fld.setValue('');
                            invoice_no.setValue('****');
                            summaryStore.load();
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

    showTraderPersonnel: function (btn) {
        var form = btn.up('form'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue(),
            tabPnl = form.up('tabpanel'),
            window = tabPnl.up('window'),
            childItem = Ext.widget(btn.childXtype);
        childItem.down('hiddenfield[name=trader_id]').setValue(applicant_id);
        tabPnl.hide();
        window.add(childItem);
    },

    showTraderPersonnelSelectionGrid: function (btn) {
        var form = btn.up('form'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue(),
            width = btn.winWidth,
            moreDetails = form.getMoreDetails(),
            personnel_type = form.down('hiddenfield[name=personnel_type]').getValue(),
            childItem = Ext.widget(btn.childXtype);
        childItem.setMoreDetails(moreDetails);
        childItem.down('hiddenfield[name=trader_id]').setValue(applicant_id);
        childItem.down('hiddenfield[name=personnel_type]').setValue(personnel_type);
        childItem.varFlag = form.getId();
        funcShowCustomizableWindow('Personnel', width, childItem, 'customizablewindow');
    },

    onTraderPersonnelItemdblclick: function (view, record) {
        var grid = view.grid,
            win = grid.up('window'),
            moreDetails = grid.getMoreDetails(),
            personnel_type = grid.down('hiddenfield[name=personnel_type]').getValue(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            basicFrm;
        win.close();
        //check if its a variation call
        caller = grid.varFlag;
        console.log(caller);
        if(caller){
            form = Ext.ComponentQuery.query("#"+caller)[0];
            if(form){
                // console.log(caller);
                // basicFrm = activeTab.down('*[id='+caller+']');
                form.loadRecord(record);
            }
        }
        else if(activeTab.down('premisecontactpersonfrm[is_variation=1]')){
            console.log('premisecontactpersonfrm');
            basicFrm = activeTab.down('premisecontactpersonfrm[is_variation=1]');
            basicFrm.loadRecord(record);
        }
        else if(activeTab.down('premisepersonnelabstractfrm[is_variation=1]')){
            console.log('premisepersonnelabstractfrm');
            basicFrm = activeTab.down('premisepersonnelabstractfrm[is_variation=1]');
            basicFrm.loadRecord(record);
        }
        else{//continue as it was 
            if (moreDetails == 1 || moreDetails === 1) {
                this.setContactPersonDetailsOnMoreDetailsWin(record);
            }
            if (personnel_type == 'contact_person') {
                basicFrm = activeTab.down('premisecontactpersonfrm');
                basicFrm.loadRecord(record);
            } else {
                var anotherWin = Ext.WindowManager.getActive();
                if (anotherWin) {
                    var form = anotherWin.down('form');
                    form.loadRecord(record);
                }
            }
        }
    },

    setContactPersonDetailsOnMoreDetailsWin: function (record) {
        var anotherWin = Ext.WindowManager.getActive();
        if (anotherWin) {
            var form = anotherWin.down('premisecontactpersonfrm');
            form.loadRecord(record);
        }
    },

    onManufacturerItemdblclick: function (view, record) {
        var grid = view.grid,
            win = grid.up('window'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            manufacturerFrm = activeTab.down('manufacturerdetailsfrm');
        manufacturerFrm.loadRecord(record);
        win.close();
    },

    addInvoiceCostElement: function (sel, record) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            summary_grid = activeTab.down('invoicingcostdetailsgrid'),
            isFastTrack = activeTab.down('checkbox[name=is_fast_track]'),
            summary_store = summary_grid.getStore(),
            index = summary_store.indexOf(record),
            quantity = 1;
        if (isFastTrack.checked) {
            quantity = 2;
        }
        if (index < 0) {
            record.set('quantity', quantity);
            summary_store.add(record);
        }
    },

    beforeCostElementSelect: function (sel, record) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            isLocked = activeTab.down('hiddenfield[name=isLocked]').getValue();
        if ((isLocked) && isLocked == 1) {
            return false;
        }
    },

    beforeCostElementEdit: function (editor) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            isLocked = activeTab.down('hiddenfield[name=isLocked]').getValue();
        if ((isLocked) && isLocked == 1) {
            return false;
        }
    },

    onInvoiceItemSelect: function (sel, record, index, eOpts) {
        var grid = sel.view.grid,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            selCount = grid.getSelectionModel().getCount();
        if (selCount > 0) {
            activeTab.down('button[name=remove_selected]').setDisabled(false);
        }
    },

    onInvoiceItemDeselect: function (sel, record, index, eOpts) {
        var grid = sel.view.grid,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            selCount = grid.getSelectionModel().getCount();
        if (selCount < 1) {
            activeTab.down('button[name=remove_selected]').setDisabled(true);
        }
    },

    showPreviousUploadedDocs: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            target_stage = btn.target_stage,
            static_stage = getPremiseRegModuleStaticStage(sub_module_id, section_id, target_stage);
        this.fireEvent('showPrevUploadedDocsWin', btn, section_id, module_id, sub_module_id, static_stage, application_code);
    },

    savePremisesInspectionDetails:function(btn){     
        var mainTabPanel = this.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
                form = activeTab.down('form'),
                toaster = btn.toaster,
                frm = form.getForm();
                console.log(activeTab);

            if (frm.isValid()) {
                
                frm.submit({
                    url: 'premiseregistration/savePremiseScheduleInspectionDetails',
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    params:{
                        section_id:section_id
                    },
                    waitMsg: 'Please wait...',
                    success: function (fm, action) {
                        var response = Ext.decode(action.response.responseText),
                            success = response.success,
                            message = response.message;
                        if (success == true || success === true) {
                            record_id = response.record_id;
                            inspection_reference_no = response.inspection_reference_no;
                            tracking_no = response.tracking_no;
                            form.down('hiddenfield[name=id]').setValue(record_id);
                            activeTab.down('displayfield[name=reference_no]').setValue(inspection_reference_no);   
                            //activeTab.down('displayfield[name=tracking_no]').setValue(tracking_no);         
                            upload_grid = activeTab.down('unstructureddocumentuploadsgrid');
                            upload_grid.down('hiddenfield[name=reference_record_id]').setValue(record_id);
                            if(activeTab.down('hiddenfield[name=inspection_id]')){
                                activeTab.down('hiddenfield[name=inspection_id]').setValue(record_id);
                            }
                            else{

                            }
                                toastr.success(message, "Success Response");
                            
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (fm, action) {
                        var resp = action.result;
                        toastr.error(resp.message, 'Failure Response');
                    }
                });
            } else {
                toastr.warning('Fill all required fields!!', 'Warning Response');
                return false;
            }


    },

    saveInspectionDetails: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form'),
            toaster = btn.toaster,
            frm = form.getForm(),
            applicationsGrid = btn.up('grid'),//activeTab.down('clinicaltrialmanagermeetinggrid'),
            sm = applicationsGrid.getSelectionModel(),
            selected_records = sm.getSelection(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            selected = [];

            
        Ext.each(selected_records, function (item) {
            application_code = item.data.application_code;
            premise_id = item.data.premise_id;
            
            obj = {
                application_code: application_code,
                premise_id: premise_id
            };
             selected.push(obj);
        });
        if (frm.isValid()) {
            if (!sm.hasSelection()) {
                toastr.warning('Please select at least one application!!', 'Warning Response');
                return false;
            }
            frm.submit({
                url: 'premiseregistration/savePremiseInspectionDetails',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                params: {
                    application_code: application_code,
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
                        if(form.down('hiddenfield[name=inspection_id]')){
                            form.down('hiddenfield[name=inspection_id]').setValue(record_id);
                        }
                        //applicationsStore.load();
                        if (toaster == 1 || toaster === 1) {
                            toastr.success(message, "Success Response");
                        }
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        } else {
            toastr.warning('Fill all required fields!!', 'Warning Response');
            return false;
        }
    },

    printInvoice: function (btn) {
        var report_type = btn.report_type,
            action_url = base_url + '/premiseregistration/getManagersReports?report_type=' + report_type,
            valid = this.validatePremiseInvoicingSubmission(btn);
        if (valid == true || valid === true) {
            print_report(action_url);
        }
    },

    // showApplicantSelectionList: function (item) {
    //     var childXtype = item.childXtype,
    //         winTitle = item.winTitle,
    //         winWidth = item.winWidth,
    //         childObject = Ext.widget(childXtype);
    //     funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');
    // },
    showApplicantSelectionList: function (btn) {
        var grid = Ext.widget('applicantselectiongrid');
        // if (btn.applicantType == 'local') {
        //     grid.applicantType = btn.applicantType;
        // } else {
        //     grid.applicantType = 'nonlocal';
        // }
        funcShowCustomizableWindow('Applicant Selection List', '90%', grid, 'customizablewindow');
    },

    showPremiseSelectionList: function (btn) {
        var me = this,
            childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            premise_type_id = 0,
            gmp_type_id = 0;
        if (module_id == 3 || module_id === 3) {//GMP
            if (sub_module_id == 5 || sub_module_id === 5) {//New
                gmp_type_id = activeTab.down('hiddenfield[name=gmp_type_id]').getValue();
            }
            if (sub_module_id == 6 || sub_module_id === 6) {//Renewal
                childXtype = 'mansitesselectiongrid';
            }
        }
        else if(module_id == 2){
            premise_type_id = activeTab.down('hiddenfield[name=premise_type_id]').getValue();
        }

        var childObject = Ext.widget(childXtype);
        childObject.down('hiddenfield[name=section_id]').setValue(section_id);
        childObject.down('hiddenfield[name=gmp_type_id]').setValue(gmp_type_id);
        childObject.down('hiddenfield[name=premise_type_id]').setValue(premise_type_id);
        funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');
    },
    showPremiseInspectionSelection:function(btn){
        var me = this,
            childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            
            id = activeTab.down('hiddenfield[name=id]').getValue();
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            premise_type_id = activeTab.down('hiddenfield[name=premise_type_id]').getValue();

        if(id != ''){
            var childObject = Ext.widget(childXtype);
            childObject.down('hiddenfield[name=section_id]').setValue(section_id);
            // childObject.down('hiddenfield[name=premise_type_id]').setValue(premise_type_id);
            funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');
        }
        else{

            toastr.warning('Please save Premises Inspection Details before Premises Selection!!', 'Warning Response');
        }
        

    },

    syncAlterationAmendmentFormParts: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            grid = btn.up('grid'),
            premiseFrm = activeTab.down('premisedetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            form_id = grid.down('hiddenfield[name=form_id]').getValue(),
            sm = grid.getSelectionModel(),
            selected_records = sm.getSelection(),
            selected = [],
            mask = new Ext.LoadMask(
                {
                    target: grid,
                    msg: 'Please wait...'
                }
            );
        if (!application_id) {
            toastr.warning('Please initialize the application first!!', 'Warning Response');
            return false;
        }
        Ext.each(selected_records, function (item) {
            selected.push(item.data.id);
        });
        Ext.MessageBox.confirm('Confirm', 'You wont be able to deselect the synced records, are you sure to continue?', function (button) {
            if (button === 'yes') {
                mask.show();
                Ext.Ajax.request({
                    url: 'premiseregistration/syncAlterationAmendmentFormParts',
                    params: {
                        selected: JSON.stringify(selected),
                        application_id: application_id,
                        application_code: application_code,
                        form_id: form_id
                    },
                    headers: {
                        'X-CSRF-Token': token,
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (response) {
                        mask.hide();
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message;
                        if (success || success == true || success === true) {
                            toastr.success(message, 'Success Response!!');
                            grid.getStore().load();
                            me.fireEvent('altFormAuth', application_id, application_code, premiseFrm);
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
            }
        });
    },

    syncAlterationAmendmentOtherParts: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            grid = btn.up('grid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sm = grid.getSelectionModel(),
            selected_records = sm.getSelection(),
            selected = [],
            mask = new Ext.LoadMask(
                {
                    target: grid,
                    msg: 'Please wait...'
                }
            );
        if (!application_id) {
            toastr.warning('Please initialize the application first!!', 'Warning Response');
            return false;
        }
        Ext.each(selected_records, function (item) {
            selected.push(item.data.id);
        });
        Ext.MessageBox.confirm('Confirm', 'You wont be able to deselect the synced records, are you sure to continue?', function (button) {
            if (button === 'yes') {
                mask.show();
                Ext.Ajax.request({
                    url: 'premiseregistration/syncAlterationAmendmentOtherParts',
                    params: {
                        selected: JSON.stringify(selected),
                        application_id: application_id,
                        application_code: application_code
                    },
                    headers: {
                        'X-CSRF-Token': token,
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (response) {
                        mask.hide();
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message;
                        if (success || success == true || success === true) {
                            toastr.success(message, 'Success Response!!');
                            grid.getStore().load();
                            me.alterationOtherPartsAuthentication(application_id, application_code);
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
            }
        });
    },

    alterationOtherPartsAuthentication: function (application_id, application_code) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            //premise_otherdetails = activeTab.down('premiseotherdetailsgrid'),
            premise_personneldetails = activeTab.down('premisepersonneldetailsgrid');
        Ext.Ajax.request({
            method: 'GET',
            url: 'workflow/getAlterationOtherPartsAuth',
            params: {
                application_id: application_id,
                application_code: application_code
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success,
                    results = resp.results,
                    field;
                if (success == true || success === true) {
                    Ext.each(results, function (item) {
                        if (item.part_id == 2 || item.part_id === 2) {
                            premise_personneldetails.down('hiddenfield[name=isReadOnly]').setValue(0);
                            me.redoPremisePersonnelDetailsGrid(premise_personneldetails);
                        } else if (item.part_id == 3 || item.part_id === 3) {
                            //premise_otherdetails.down('hiddenfield[name=isReadOnly]').setValue(0);
                            //me.redoPremiseOtherDetailsGrid(premise_otherdetails);
                        } else {
                            //premise_otherdetails.down('hiddenfield[name=isReadOnly]').setValue(1);
                            premise_personneldetails.down('hiddenfield[name=isReadOnly]').setValue(1);
                        }
                    });
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },

    redoPremiseOtherDetailsGrid: function (grid) {
        var isReadOnly = grid.down('hiddenfield[name=isReadOnly]').getValue(),
            add_btn = grid.down('button[name=add_details]'),
            widgetCol = grid.columns[grid.columns.length - 1];
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            add_btn.setVisible(false);
            widgetCol.setHidden(true);
            widgetCol.widget.menu.items = [];
        } else {
            add_btn.setVisible(true);
            widgetCol.setHidden(false);
            widgetCol.widget.menu.items = [{
                text: 'Edit',
                iconCls: 'x-fa fa-edit',
                tooltip: 'Edit Record',
                action: 'edit',
                childXtype: 'premiseotherdetailsfrm',
                winTitle: 'Premise Other Details',
                winWidth: '35%',
                handler: 'showEditPremiseRegParamWinFrm',
                stores: '[]'
            }, {
                text: 'Delete',
                iconCls: 'x-fa fa-trash',
                tooltip: 'Delete Record',
                table_name: 'tra_premises_otherdetails',
                storeID: 'premiseotherdetailsstr',
                action_url: 'premiseregistration/deletePremiseRegRecord',
                action: 'actual_delete',
                handler: 'doDeletePremiseRegWidgetParam',
                hidden: Admin.global.GlobalVars.checkForProcessVisibility('actual_delete')
            }
            ];
        }
    },

    redoPremisePersonnelDetailsGrid: function (grid) {
        var isReadOnly = grid.down('hiddenfield[name=isReadOnly]').getValue(),
            add_btn = grid.down('button[name=add_personnel]'),
            widgetCol = grid.columns[grid.columns.length - 1];
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            add_btn.setVisible(false);
            grid.columns[grid.columns.length - 1].widget.menu.items = [
                {
                    text: 'Personnel Details',
                    iconCls: 'x-fa fa-user',
                    winTitle: 'Premise Personnel Details',
                    childXtype: 'personneldetailstabpnl',
                    winWidth: '60%',
                    handler: 'showEditPremisePersonnelDetails',
                    stores: '[]'
                }];
        } else {
            add_btn.setVisible(true);
            widgetCol.widget.menu.items = [{
                text: 'Personnel Details',
                iconCls: 'x-fa fa-user',
                winTitle: 'Premise Personnel Details',
                childXtype: 'personneldetailstabpnl',
                winWidth: '60%',
                handler: 'showEditPremisePersonnelDetails',
                stores: '[]'
            }, {
                text: 'Remove',
                iconCls: 'x-fa fa-remove',
                table_name: 'tra_premises_personnel',
                storeID: 'premisepersonneldetailsstr',
                action_url: 'premiseregistration/deletePremiseRegRecord',
                action: 'actual_delete',
                handler: 'doDeletePremiseRegWidgetParam',
                hidden: Admin.global.GlobalVars.checkForProcessVisibility('actual_delete')
            }
            ];
        }
    },

    showEditPremisePersonnelDetails: function (item) {
        var me = this,
            btn = item.up('button'),
            grid = btn.up('grid'),
            isReadOnly = grid.down('hiddenfield[name=isReadOnly]').getValue(),
            record = btn.getWidgetRecord(),
            winTitle = item.winTitle,
            winWidth = item.winWidth,
            childItem = Ext.widget(item.childXtype),
            positionsStore = Ext.getStore('personnelpositionsstr'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (sub_module_id == 2 || sub_module_id === 2) {
            if (!application_id) {
                toastr.warning('Please save application first!!', 'Warning Response');
                return false;
            }
        }
        positionsStore.removeAll();
        positionsStore.load();
        childItem.loadRecord(record);
        if(childItem.down('hiddenfield[name=isReadOnly]')){
            childItem.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        }
        childItem.down('button[name=save_btn]').storeID = item.storeID;
        childItem.down('button[name=save_btn]').action_url = item.action_url;
        //for variations flag
        childItem.is_variation = grid.is_variation;
        funcShowCustomizableWindow(winTitle, winWidth, childItem, 'customizablewindow');
    },

    //CANCELLATION
    onPrevCardClickCancellation: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            wizardPnl = activeTab.down('cancelpremisereceivingwizard');
        wizardPnl.getViewModel().set('atEnd', false);
        this.navigateCancellation(btn, wizardPnl, 'prev');
    },

    onNextCardClickCancellation: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            wizardPnl = activeTab.down('cancelpremisereceivingwizard');
        wizardPnl.getViewModel().set('atBeginning', false);
        this.navigateCancellation(btn, wizardPnl, 'next');
    },

    navigateCancellation: function (button, wizardPanel, direction) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            layout = wizardPanel.getLayout(),
            progress = wizardPanel.down('#progress_tbar'), //this.lookupReference('progress'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            model = wizardPanel.getViewModel(),
            progressItems = progress.items.items,
            item, i, activeItem, activeIndex,
            nextStep = wizardPanel.items.indexOf(layout.getNext());
        if (nextStep > 1 && (direction == 'next' || direction === 'next')) {
            if (!application_id) {
                toastr.warning('Please save application details first!!', 'Warning Response');
                return false;
            }
        }
        layout[direction]();

        activeItem = layout.getActiveItem();
        activeIndex = wizardPanel.items.indexOf(activeItem);

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (activeIndex === item.step) {
                item.setPressed(true);
            } else {
                item.setPressed(false);
            }

            // IE8 has an odd bug with handling font icons in pseudo elements;
            // it will render the icon once and not update it when something
            // like text color is changed via style addition or removal.
            // We have to force icon repaint by adding a style with forced empty
            // pseudo element content, (x-sync-repaint) and removing it back to work
            // around this issue.
            // See this: https://github.com/FortAwesome/Font-Awesome/issues/954
            // and this: https://github.com/twbs/bootstrap/issues/13863
            if (Ext.isIE8) {
                item.btnIconEl.syncRepaint();
            }
        }
        activeItem.focus();

        // beginning disables previous
        if (activeIndex === 0) {
            //wizardPanel.down('button[name=save_btn]').setDisabled(true);
            model.set('atBeginning', true);
        } else {
            //wizardPanel.down('button[name=save_btn]').setDisabled(false);
            model.set('atBeginning', false);
        }
        if (activeIndex > 1) {
            wizardPanel.down('button[name=save_btn]').setVisible(false);
        } else {
            wizardPanel.down('button[name=save_btn]').setVisible(true);
        }
        if (activeIndex === 5) {
            // wizardPanel.down('button[name=save_screening_btn]').setVisible(true);
            model.set('atEnd', true);
        } else {
            // wizardPanel.down('button[name=save_screening_btn]').setVisible(false);
            model.set('atEnd', false);
        }
    },

    quickNavigationCancellation: function (btn) {
        var step = btn.step,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            wizardPnl = activeTab.down('cancelpremisereceivingwizard'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            progress = wizardPnl.down('#progress_tbar'),
            progressItems = progress.items.items;

        if (step > 1) {
            var thisItem = progressItems[step];
            if (!application_id) {
                thisItem.setPressed(false);
                toastr.warning('Please save application details first!!', 'Warning Response');
                //return false;
            }
        }
        if (step == 0) {
            //wizardPnl.down('button[name=save_btn]').setDisabled(true);
            wizardPnl.getViewModel().set('atBeginning', true);
        } else {
            //wizardPnl.down('button[name=save_btn]').setDisabled(false);
            wizardPnl.getViewModel().set('atBeginning', false);
        }
        if (step > 1) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
        } else {
            wizardPnl.down('button[name=save_btn]').setVisible(true);
        }
        if (step == 5) {
            // wizardPnl.down('button[name=save_screening_btn]').setVisible(true);
            wizardPnl.getViewModel().set('atEnd', true);
        } else {
            // wizardPnl.down('button[name=save_screening_btn]').setVisible(false);
            wizardPnl.getViewModel().set('atEnd', false);
        }
        wizardPnl.getLayout().setActiveItem(step);
        var layout = wizardPnl.getLayout(),
            item = null,
            i = 0,
            activeItem = layout.getActiveItem();

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (step === item.step) {
                item.setPressed(true);
            } else {
                item.setPressed(false);
            }

            if (Ext.isIE8) {
                item.btnIconEl.syncRepaint();
            }
        }
        activeItem.focus();
    },
    //SUSPENSION
    onPrevCardClickSuspension: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            wizardPnl = activeTab.down('suspensionpremisereceivingwizard');
        wizardPnl.getViewModel().set('atEnd', false);
        this.navigateSuspension(btn, wizardPnl, 'prev');
    },

    onNextCardClickSuspension: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            wizardPnl = activeTab.down('suspensionpremisereceivingwizard');
        wizardPnl.getViewModel().set('atBeginning', false);
        this.navigateSuspension(btn, wizardPnl, 'next');
    },

    navigateSuspension: function (button, wizardPanel, direction) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            layout = wizardPanel.getLayout(),
            progress = wizardPanel.down('#progress_tbar'), //this.lookupReference('progress'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            model = wizardPanel.getViewModel(),
            progressItems = progress.items.items,
            item, i, activeItem, activeIndex,
            nextStep = wizardPanel.items.indexOf(layout.getNext());
        if (nextStep > 1 && (direction == 'next' || direction === 'next')) {
            if (!application_id) {
                toastr.warning('Please save application details first!!', 'Warning Response');
                return false;
            }
        }
        layout[direction]();

        activeItem = layout.getActiveItem();
        activeIndex = wizardPanel.items.indexOf(activeItem);

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (activeIndex === item.step) {
                item.setPressed(true);
            } else {
                item.setPressed(false);
            }

            // IE8 has an odd bug with handling font icons in pseudo elements;
            // it will render the icon once and not update it when something
            // like text color is changed via style addition or removal.
            // We have to force icon repaint by adding a style with forced empty
            // pseudo element content, (x-sync-repaint) and removing it back to work
            // around this issue.
            // See this: https://github.com/FortAwesome/Font-Awesome/issues/954
            // and this: https://github.com/twbs/bootstrap/issues/13863
            if (Ext.isIE8) {
                item.btnIconEl.syncRepaint();
            }
        }
        activeItem.focus();

        // beginning disables previous
        if (activeIndex === 0) {
            //wizardPanel.down('button[name=save_btn]').setDisabled(true);
            model.set('atBeginning', true);
        } else {
            //wizardPanel.down('button[name=save_btn]').setDisabled(false);
            model.set('atBeginning', false);
        }
        if (activeIndex > 1) {
            wizardPanel.down('button[name=save_btn]').setVisible(false);
        } else {
            wizardPanel.down('button[name=save_btn]').setVisible(true);
        }
        if (activeIndex === 5) {
            // wizardPanel.down('button[name=save_screening_btn]').setVisible(true);
            model.set('atEnd', true);
        } else {
            // wizardPanel.down('button[name=save_screening_btn]').setVisible(false);
            model.set('atEnd', false);
        }
    },

    quickNavigationSuspension: function (btn) {
        var step = btn.step,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            wizardPnl = activeTab.down('suspensionpremisereceivingwizard'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            progress = wizardPnl.down('#progress_tbar'),
            progressItems = progress.items.items;

        if (step > 1) {
            var thisItem = progressItems[step];
            if (!application_id) {
                thisItem.setPressed(false);
                toastr.warning('Please save application details first!!', 'Warning Response');
                //return false;
            }
        }
        if (step == 0) {
            //wizardPnl.down('button[name=save_btn]').setDisabled(true);
            wizardPnl.getViewModel().set('atBeginning', true);
        } else {
            //wizardPnl.down('button[name=save_btn]').setDisabled(false);
            wizardPnl.getViewModel().set('atBeginning', false);
        }
        if (step > 1) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
        } else {
            wizardPnl.down('button[name=save_btn]').setVisible(true);
        }
        if (step == 5) {
            // wizardPnl.down('button[name=save_screening_btn]').setVisible(true);
            wizardPnl.getViewModel().set('atEnd', true);
        } else {
            // wizardPnl.down('button[name=save_screening_btn]').setVisible(false);
            wizardPnl.getViewModel().set('atEnd', false);
        }
        wizardPnl.getLayout().setActiveItem(step);
        var layout = wizardPnl.getLayout(),
            item = null,
            i = 0,
            activeItem = layout.getActiveItem();

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (step === item.step) {
                item.setPressed(true);
            } else {
                item.setPressed(false);
            }

            if (Ext.isIE8) {
                item.btnIconEl.syncRepaint();
            }
        }
        activeItem.focus();
    },
    showInspectionRecommendationDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length,
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            childObject = Ext.widget(btn.childXtype);
            Ext.getBody().mask('Please wait...');
            childObject.setHeight(450);
            if (arrayLength > 0) {
                me.fireEvent('refreshStores', storeArray);
            }
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
                                inspection_frm = childObject.down('#premiseinspectionrecommfrm');
                                inspection_frm.loadRecord(model);
                        }
                        funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');
                        //add the Documetn Upload Options
                        var docTypesStr = childObject.down('combo[name=applicable_documents]').getStore();
                        docTypesStr.removeAll();
                        docTypesStr.load({
                            params: {
                                section_id: section_id,
                                module_id: module_id,
                                sub_module_id: sub_module_id,
                                workflow_stage: workflow_stage
                            }
                        });
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
    preparePremiseManagerMeeting: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('premiseManagerMeetingGrid');
        this.preparePremiseMeetingDetailsGeneric(activeTab, applicationsGrid, 0);
    },
    preparePremiseTCMeeting: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('newpremisetcMeetingGrid');
        this.preparePremiseMeetingDetailsGeneric(activeTab, applicationsGrid, 0);
    },
    preparePremiseMeetingDetailsGeneric: function (activeTab, applicationsGrid, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            meetingDetailsFrm = activeTab.down('form'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            applicationsStore = applicationsGrid.getStore(),
            participantsGrid = activeTab.down('tcmeetingparticipantsgrid'),
            participantsStore = participantsGrid.getStore(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sm = applicationsGrid.getSelectionModel();
        participantsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            meetingDetailsFrm.getForm().getFields().each(function (field) {
                field.setReadOnly(true);
            });
        }
        if(sub_module_id == 50){
            table_name = 'tra_premiseinspection_applications';
        }else{
            table_name = 'tra_premises_applications';
        }
        this.redoTcMeetingParticipantsGrid(participantsGrid);
        if (application_id) {
            applicationsStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/preparePremiseRegMeetingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    workflow_stage_id: workflow_stage_id,
                    table_name: 'tra_premise_applications'
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
                            meetingDetailsFrm.loadRecord(model);
                        }
                        applicationsStore.load();
                        participantsStore.load();
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
    redoTcMeetingParticipantsGrid: function (grid) {
        var isReadOnly = grid.down('hiddenfield[name=isReadOnly]').getValue(),
            add_btn = grid.down('button[name=add_participant]'),
            widgetCol = grid.columns[grid.columns.length - 1];
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            add_btn.setVisible(false);
            widgetCol.setHidden(true);
            widgetCol.widget.menu.items = [];
        } else {
            add_btn.setVisible(true);
            widgetCol.setHidden(false);
            widgetCol.widget.menu.items = [
                {
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete Record',
                    table_name: 'tc_meeting_participants',
                    storeID: 'premiseTcMeetingParticipantsStr',
                    action_url: 'premiseregistration/deletePremiseRegRecord',
                    action: 'actual_delete',
                    handler: 'doDeletePremiseRegWidgetParam',
                    
                }
            ];
        }
    },
     //save meeting details 
    saveTCMeetingDetails: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form'),
            toaster = btn.toaster,
            frm = form.getForm(),
            applicationsGrid = activeTab.down('premiseManagerMeetingGrid') ? activeTab.down('premiseManagerMeetingGrid') : activeTab.down('premisesInspectionPeerReviewRecomGrid'),
            sm = applicationsGrid.getSelectionModel(),
            selected_records = sm.getSelection(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            applicationsStore = applicationsGrid.getStore(),
            selected = [];
        Ext.each(selected_records, function (item) {
            selected.push(item.data.application_code);
        });
        if (frm.isValid()) {
            if (!sm.hasSelection()) {
                toastr.warning('Please select at least one application!!', 'Warning Response');
                return false;
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
                    section_id: section_id,
                    workflow_stage_id: workflow_stage_id,
                    _token: token,
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
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        } else {
            toastr.warning('Fill all required fields!!', 'Warning Response');
            return false;
        }
    },
      //save meeting details 
      savePeerMeetingDetails: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form'),
            toaster = btn.toaster,
            frm = form.getForm(),
            applicationsGrid = activeTab.down('newpremisetcMeetingGrid'),
            sm = applicationsGrid.getSelectionModel(),
            selected_records = sm.getSelection(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            applicationsStore = activeTab.down('newpremisetcMeetingGrid').getStore(),
            selected = [];
        Ext.each(selected_records, function (item) {
            selected.push(item.data.application_code);
        });
        if (frm.isValid()) {
            if (!sm.hasSelection()) {
                toastr.warning('Please select at least one application!!', 'Warning Response');
                return false;
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
                    workflow_stage_id: workflow_stage_id,
                    section_id: section_id,
                    _token: token,
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
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        } else {
            toastr.warning('Fill all required fields!!', 'Warning Response');
            return false;
        }
    },
    managerMeetingRefreshGrid: function (me) {
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
    beforeManagerMeetingAppsGridDeselect: function (sel, record, index, eOpts) {
        var grid = sel.view.grid,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code1 = record.get('application_code'),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        if (application_code1 == application_code) {
            /* toastr.warning('Action not allowed on this application!!', 'Warning Response');
             return false;*/
        }
    },
    preparePremiseMeetingDetailsGeneric: function (activeTab, applicationsGrid, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        //console.log(meetingDetailsFrm);
        var me = this,
            meetingDetailsFrm = activeTab.down('form'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            applicationsStore = applicationsGrid.getStore(),
            participantsGrid = activeTab.down('tcmeetingparticipantsgrid'),
            participantsStore = participantsGrid.getStore(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sm = applicationsGrid.getSelectionModel();
            //isReadOnly=1;
        if(sub_module_id == 50){
            table_name = 'tra_premiseinspection_applications';
        }else{
            table_name = 'tra_premises_applications';
        }
        participantsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            meetingDetailsFrm.getForm().getFields().each(function (field) {
                field.setReadOnly(true);
               // console.log(meetingDetailsFrm);
            });
        }
        this.redoTcMeetingParticipantsGrid(participantsGrid);
        if (application_id) {
            applicationsStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/preparePremiseRegMeetingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    workflow_stage_id: workflow_stage_id,
                    table_name: table_name
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
                            meetingDetailsFrm.loadRecord(model);
                        }
                        applicationsStore.load();
                        participantsStore.load();
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
    preparePremiseRoutineInspectionPeerReviewSchedule: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('premisesInspectionPeerReviewRecomGrid');
        this.preparePremiseMeetingDetailsGeneric(activeTab, applicationsGrid, 0);
    },
    preparePremiseRoutineInspectionPeerReview: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('premisesInspectionPeerReviewRecomGrid');
        //hide save button
        activeTab.down('button[name=save_btn]').setVisible(false);
        this.preparePremiseMeetingDetailsGeneric(activeTab, applicationsGrid, 0);
    },
    preparePremiseRecommReview: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('newpremisetcMeetingGrid');
        this.preparePremiseMeetingDetailsGeneric(activeTab, applicationsGrid, 1);
    },
    preparePremiseTcRecommReview: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('premiseReviewTCMeetingGrid');
        this.preparePremiseMeetingDetailsGeneric(activeTab, applicationsGrid, 1);
    },
    preparePremiseRecommPeerReview: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('premisePeerReviewMeetingGrid');
        this.preparePremiseMeetingDetailsGeneric(activeTab, applicationsGrid, 1);
    },
    preparePremiseRecommApproval: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('premiseReviewTCMeetingApprovalGrid');
        this.preparePremiseMeetingDetailsGeneric(activeTab, applicationsGrid, 1);
    },
    funcGetApplicableChecklist:function(combo){
            var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            applicable_checklist=combo.getValue(),

            grid= combo.up('premiseinspectionscreeninggrid'),
            store= grid.getStore();
            store.removeAll();
            store.load({params: {
                application_code: application_code,
                 process_id: process_id,
                 workflow_stage:workflow_stage_id,
                 module_id:module_id,
                 section_id:section_id,
                 sub_module_id:sub_module_id
                }});            
    },
    funcGetApplicableEvaluationChecklist:function(combo){
        var mainTabPanel = this.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab(),
        module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
        section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
        sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
        process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
        workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
        application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
        applicable_checklist=combo.getValue(),

        grid= combo.up('premisescreeninggrid'),
        store= grid.getStore();
        store.removeAll();
        store.load({params: {
            application_code: application_code,
             process_id: process_id,
             workflow_stage:workflow_stage_id,
             module_id:module_id,
             section_id:section_id,
             sub_module_id:sub_module_id
            }});            
},
    refreshApplicableChecklist: function (me) {
        var store = me.getStore(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();
        store.getProxy().extraParams = {
            application_code: application_code,
            process_id: process_id,
            workflow_stage:workflow_stage_id,
             module_id:module_id,
            section_id:section_id,
            sub_module_id:sub_module_id
        };
    },
    getAllApplicationDetails:function(me){
        var store = me.getStore(),
        mainTabPanel = this.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab(),
        module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
        section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
        sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
        process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
        workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
        application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        store.getProxy().extraParams = {
            application_code: application_code,
            process_id: process_id,
            workflow_stage:workflow_stage_id,
             module_id:module_id,
            section_id:section_id,
            sub_module_id:sub_module_id
        };           
    },
    showInspectionInspectors:function () {

        // var grid = btn.up('grid'),
        // pnl = grid.up('panel'),//('newclinicaltrialmanagermeetingpanel'),
        // mainTabPnl = pnl.up('#contentPanel'),
        // activeTab = mainTabPnl.getActiveTab();
        // inspection_id= activeTab.up('hiddenfield[name=inspection_id]').getValue();
        // id =activeTab.up('hiddenfield[name=id]').getValue();

        // console.log(inspection_id),
        // console.log(id);

        var grid = this.up('grid'),
            isWin = grid.getIsWin(),
            mainTabPnl = grid.up('#contentPanel'),
            pnl;
        if (isWin == 1) {
            pnl = grid.up('window');
        } else {
            pnl = mainTabPnl.getActiveTab();
            //pnl = grid.up('newpremisemanagerinspectionpanel');
        }
        if(pnl.down('#premiseinspectionrecommfrm').down('hiddenfield[name=inspection_id]')){
            var inspection_id = pnl.down('#premiseinspectionrecommfrm').down('hiddenfield[name=inspection_id]').getValue();
            console.log('test')
            console.log(inspection_id)
        }
        else if(pnl.down('#premiseinspectionrecommfrm').down('hiddenfield[name=id]')){
            var inspection_id = pnl.down('#premiseinspectionrecommfrm').down('hiddenfield[name=id]').getValue();
            console.log('test12')
            console.log(inspection_id)
        }else{
            var inspection_id = 0;
        }
        //var inspection_id = pnl.down('form').down('hiddenfield[name=inspection_id]').getValue(),
        var store = this.getStore();
        store.getProxy().extraParams = {
            inspection_id: inspection_id
        };
    },
    saveContactPerson: function(btn){
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            form = btn.up('form'),
            is_variation = form.is_variation;
        btn.setLoading(true);
        form.submit({
            url: 'premiseregistration/saveContactPerson',
            waitMsg: 'Uploading...',
            params: {
                is_variation: is_variation,
                application_code: application_code,
                module_id: module_id
            },
            success: function (fm, action) {
                btn.setLoading(false);
                var response = Ext.decode(action.response.responseText),
                    message = response.message,
                    success = response.success;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (fm, action) {
                btn.setLoading(false);
                var response = Ext.decode(action.response.responseText),
                    message = response.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                btn.setLoading(false);
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });

    },
    updateIsWinProperty: function(grid){
        var varPnl = grid.up('variationReceivingPnl');
        if(varPnl){
            if(varPnl.up('panel')){
                if(varPnl.up('panel').down('premisealtdetailswintabpnl')){
                    var mainpnl = varPnl.up('panel').down('premisealtdetailswintabpnl'),
                        originalgrid = mainpnl.down('premisepersonneldetailsgrid');
                    grid.setIsWin(originalgrid.getIsWin());
                    grid.down('hiddenfield[name=isReadOnly]').setValue(1);

                }
            }
        }
    },
    updateIsWinPropertyonForm: function(form){
        var varPnl = form.up('variationReceivingPnl');
        if(varPnl){
            if(varPnl.up('panel')){
                if(varPnl.up('panel').down('premisealtdetailswintabpnl')){
                    var mainpnl = varPnl.up('panel').down('premisealtdetailswintabpnl'),
                        originalgrid = mainpnl.down('premisepersonneldetailsgrid'),
                        isWin = originalgrid.getIsWin();
                    console.log('here');
                    form.down('hiddenfield[name=isReadOnly]').setValue(1);
                    form.down('button[name=save_contact_person]').destroy(true);
                }
            }
        }
    },
    refreshVariationRecommendationGrid:function(me){
        var store = me.getStore(),
        mainTabPanel = this.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab(),
        application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
        module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
        grid = me.up('grid'),
        field_id = grid.down('hiddenfield[name=field_id]').getValue(),
        variation_type_id = grid.down('hiddenfield[name=variation_type_id]').getValue();
        store.getProxy().extraParams = {
            application_code: application_code,
            module_id:module_id,
            field_id:field_id,
            variation_type_id: variation_type_id
        };           
    },
    showAddViewVariationRecommendations: function(me){
        var grid = me.up('grid'),
            store = grid.getStore(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            grid = me.up('grid'),
            field_id = grid.down('hiddenfield[name=field_id]').getValue(),
            variation_type_id = grid.down('hiddenfield[name=variation_type_id]').getValue(),
            childXtype = me.childXtype,
            winTitle = me.winTitle,
            winWidth = me.winWidth,
            child = Ext.widget(childXtype);

        child.down('hiddenfield[name=application_code]').setValue(application_code);
        child.down('hiddenfield[name=field_id]').setValue(field_id);
        child.down('hiddenfield[name=variation_type_id]').setValue(variation_type_id);
        child.down('hiddenfield[name=module_id]').setValue(module_id);

       funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');       
    }, 

    savePremisesRoutineInspectionDetails:function(btn){     
        var mainTabPanel = this.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
                workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
                form = activeTab.down('form'),
                toaster = btn.toaster,
                frm = form.getForm(),
                applicationsGrid = btn.up('grid'),
                sm = applicationsGrid.getSelectionModel(),
                selected_records = sm.getSelection();
                selected = [];
                Ext.each(selected_records, function (item) {
                    application_code = item.data.application_code;
                    premise_id = item.data.premise_id;
                    
                    obj = {
                        application_code: application_code,
                        premise_id: premise_id
                    };
                     selected.push(obj);
                });

            if (frm.isValid()) {
                
                frm.submit({
                    url: 'premiseregistration/savePremiseScheduleInspectionDetails',
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    params:{
                        section_id:section_id,
                        workflow_stage_id: workflow_stage_id,
                        selected: JSON.stringify(selected),
                    },
                    waitMsg: 'Please wait...',
                    success: function (fm, action) {
                        var response = Ext.decode(action.response.responseText),
                            success = response.success,
                            message = response.message;
                        if (success == true || success === true) {
                            record_id = response.record_id;
                            application_id = response.application_id;
                            active_application_code = response.active_application_code;
                            inspection_reference_no = response.inspection_reference_no;
                            tracking_no = response.tracking_no;
                            form.down('hiddenfield[name=id]').setValue(record_id);
                            activeTab.down('displayfield[name=reference_no]').setValue(inspection_reference_no);   
                            activeTab.down('displayfield[name=tracking_no]').setValue(tracking_no);         
                            upload_grid = activeTab.down('unstructureddocumentuploadsgrid');
                            upload_grid.down('hiddenfield[name=reference_record_id]').setValue(record_id);
                            if(activeTab.down('hiddenfield[name=inspection_id]')){
                                activeTab.down('hiddenfield[name=inspection_id]').setValue(record_id);
                            }
                            else{

                            }
                            if(activeTab.down('hiddenfield[name=active_application_id]')){
                                activeTab.down('hiddenfield[name=active_application_id]').setValue(application_id);
                            }
                            if(activeTab.down('hiddenfield[name=active_application_code]')){
                                activeTab.down('hiddenfield[name=active_application_code]').setValue(active_application_code);
                            }
                            toastr.success(message, "Success Response");
                            
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (fm, action) {
                        var resp = action.result;
                        toastr.error(resp.message, 'Failure Response');
                    }
                });
            } else {
                toastr.warning('Fill all required fields!!', 'Warning Response');
                return false;
            }


    },
    preparePremisesInspectionReviewreComPnl: function(btn){     
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();

        Ext.Ajax.request({
                method: 'GET',
                url: 'premiseregistration/preparePremisesInspectionReviewreComPnl',
                params: {
                    application_id: application_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        inspection_id = resp.inspection_id;

                    if (success == true || success === true) {
                        activeTab.down('hiddenfield[name=inspection_id]').setValue(inspection_id);
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
    refreshmanagerquerygrid:function(me){
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        store.getProxy().extraParams = {
            workflow_stage_id: workflow_stage_id
        };
    },
    selectUpcomingScheduleOnDblClick: function(view, record){
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            grid = view.grid,
            win = grid.up('window'),
            inspectionbasicdetailsfrm = activeTab.down('inspectionbasicdetailsfrm');
        delete record.data.id;
        inspectionbasicdetailsfrm.loadRecord(record);
        console.log(inspectionbasicdetailsfrm.up('panel').getViewModel());
        win.close();
        //disable adding
        var vm = inspectionbasicdetailsfrm.up('panel').up('panel').getViewModel();
        vm.set('add_inspector_text', 'Inspectors will be as per selected schedule');
        vm.set('is_imp_schedule_hidden', false);
    }
});
