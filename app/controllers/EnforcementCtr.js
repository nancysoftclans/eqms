Ext.define('Admin.controller.EnforcementCtr', {
    extend: 'Ext.app.Controller',

    stores: [],
    config: {
        refs: [{
            ref: 'mainPanel',
            selector: 'maincontainerwrap'
        }, {
            ref: 'mainTabPanel',
            selector: '#contentPanel'
        }
        ],
        control: {
            'enforcementb button[name=enforcementRegHomeBtn]': {
                click: 'enforcementHome'
            },
            'enforcementgrid': {
                refresh: 'refreshEnforcementMainGrid'
            },
            'workplanapplicationgrid': {
                refresh: 'addInvestigationApplicationWorkflowParams',
                // moveRowTop: 'moveSelectedRecordRowToTop'
            },
            'workplanapplicationgrid button[name=save_btn]': {
                click: 'saveWorkplanDetails'
            },
            'exhibitionRequestGrid button[name=save_btn]': {
                click: 'saveExhibitRequesitionDetails'
            },
            'destructionProductsGrid button[name=save_btn]': {
                click: 'saveDestructionPlanDetails'
            },
            'seizureWorkPlanGrid button[name=save_btn]': {
                click: 'saveSeizureWorkPlanDetails'
            },
            'jointOperationWorkPlanGrid button[name=save_btn]': {
                click: 'saveJointOperationsWorkPlanDetails'
            },
            'workplanapplicationgrid button[action=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'seizureWorkPlanGrid button[action=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'jointOperationWorkPlanGrid button[action=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'conductjointoperation button[name=process_submission_btn]': {
                click: 'showJointOperationSubmissionWin'
            },
            ///
            'exhibitionRequestGrid button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'executionPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'destructionProductsGrid button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'exhibitionRequestEvaluationGrid button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'seizurePnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'releasedGoodsPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'seizureManagerReviewPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'enforcementpeerReviewScheduling button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'reportapprovalWizard button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'managerevaluationWizard button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'officerEvaluationPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },

            // Preparing 
            'newreportreceiving':{
                afterrender: 'prepareNewReportReceiving'
            },
            'newinvestigationreceiving':{
               afterrender: 'prepareNewInvestigationReceiving'
            },
            'exhibitionRequestPnl':{
                afterrender: 'prepareExhibitionRequestsReceiving'   
             },
               'executionPnl':{
                afterrender: 'prepareExecutionDetails'   
             },
             
             'exhibitionRequestEvaluationPnl':{
                afterrender: 'prepareExhibitionRequestsReceiving'   
             },
             'destructionPlan':{
                afterrender: 'prepareDestructionReceiving'   
             },
             'destructionPnl':{
                afterrender: 'prepareDestructionReceiving'   
             },
             'seizureWorkPlanPnl':{
                afterrender: 'prepareSeizureWorkPlanReceiving'   
             },

            'enforcementinvestigationpnl':{
                afterrender: 'prepareInvestigationDairy'
            },
            'monitoringreceiving':{
                afterrender: 'prepareMonitoringReceiving'
            },
            'jointOperationreceiving':{
                afterrender: 'prepareJointOperationReceiving'
            },
            // 'healthcareassesmentwizard':{
            //     afterrender: 'prepareHealthAssemsmentReceiving'
            // },
            'seizurePnl':{
                afterrender: 'prepareSeizure'
            },
            'newworkplanreceiving':{
                afterrender: 'prepareWorkplanReceiving'
            },
            'enforcementpeerReviewScheduling': {
                afterrender: 'prepareEnforcementManagerMeeting'
            },
            'enforcementPeerReviewMeetingPnl': {
                afterrender: 'prepareEnforcementManagerMeeting'
            },
            'monitoringPeerReviewMeetingPnl': {
                afterrender: 'prepareEnforcementManagerMeeting'
            },
            'monitoringPeerReviewSchedulingPnl': {
                afterrender: 'prepareEnforcementManagerMeeting'
            },
            'monitoringDeskReviewSchedulingPnl': {
                afterrender: 'prepareEnforcementManagerMeeting'
            },
            'monitoringDeskReviewMeetingPnl': {
                afterrender: 'prepareEnforcementManagerMeeting'
            },
            //
            'debriefschedulingWizard': {
                afterrender: 'prepareEnforcementManagerMeeting'
            },
            'debriefMeetingWizard': {
                afterrender: 'prepareEnforcementDebriefingMeeting'
            },
            'directDebriefMeetingWizard': {
                afterrender: 'prepareEnforcementDebriefingMeeting'
            },
            'jointPeerReviewScheduling': {
                afterrender: 'prepareEnforcementManagerMeeting'
            },
            'jointPeerReviewMeeting': {
                afterrender: 'prepareEnforcementManagerMeeting'
            },
            'monitoringreceivingwizard button[action=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'newreportreceivingwizard  button[name=process_submission_btn]': {
                click: 'showNewEnforcementReceivingApplicationSubmissionWin'
            },
            'healthcareassesmentwizard button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'newworkplanreceivingwizard button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'managerInvestigationWizard  button[name=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWin'
            },
            'enforcementinvestigationpnl  button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'enforcementWorkPlanPnl  button[name=process_submission_btn]': {
                click: 'showNewEnforcementReceivingApplicationSubmissionWin'
            },
            'debriefMeetingWizard  button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'directDebriefMeetingWizard  button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'debriefschedulingWizard  button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'destructionPnl  button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'suspectedoffencegrid': {
                refresh: 'refreshSuspectedOffencegridGrid'
            },
            'offenceChargeGrid': {
                refresh: 'refreshSuspectedOffencegridGrid'
            },
            'witnessgrid': {
                refresh: 'refreshSuspectedOffencegridGrid'
            },
            'suspectedoffenceform button[action=save_suspected_offence_details]':{
				click:'saveSuspectedOffenceDetails'	
			},
            'newOffenceFrm button[action=save_suspected_offence_details]':{
				click:'saveSuspectedOffenceDetails'	
			},
            'casechargesfrm button[action=save_caseCharges_details]':{
				click:'submitFrm'	
			},
            'witnessfrm button[action=save_caseCharges_details]':{
				click:'submitFrm'	
			},
            'chargefrm button[action=save_investigation_diary]':{
				click:'submitDiaryFrm'	
			},
            'operativesfrm button[action=save_operatives_details]':{
				click:'submitDiaryFrm'	
			},
            'newWitnessFrm button[action=save_caseCharges_details]':{
				click:'submitDiaryFrm'	
			},
            'newDairyFrm button[action=save_caseCharges_details]':{
				click:'submitDiaryFrm'	
			},
            'timelineFrm button[action=save_caseCharges_details]':{
				click:'submitDiaryFrm'	
			},
            'offenceChargesFrm button[action=save_caseCharges_details]':{
				click:'submitFrm'	
			},
            'investigationdiaryfrm button[action=save_investigation_diary]':{
				click:'submitDiaryFrm'	
			},
            'workplanfrm button[action=save_investigation_diary]':{
				click:'submitWorkPlanFrm'	
			},
            'investigationReportFrm button[action=save_execution_details]':{
				click:'saveInvestigationReportFrm'	
			},
            'witnessfrm button[action=save_investigation_diary]':{
				click:'submitUpdatedOffenceWitnessFrm'	
			},
          
            'seizureInspectionFrm button[action=save_caseCharges_details]':{
				click:'submitDiaryFrm'	
			},
            'seizureWitnessFrm button[action=save_caseCharges_details]':{
				click:'submitDiaryFrm'	
			},
            'addSeizureProductsFrm button[action=save_caseCharges_details]':{
				click:'submitDiaryFrm'	
			},
            'jointOperationOffencefrm button[action=save_joint_offence_details]':{
				click:'submitDiaryFrm'	
			},
            'summaryfrm button[action=save_summary_details]':{
				click:'submitDiaryFrm'	
			},
            'jointOperationProductfrm button[action=save_joint_product_details]':{
				click:'submitDiaryFrm'	
			},
            'inquiryFrm button[action=save_inquiry_details]':{
				click:'submitDiaryFrm'	
			},
            // 'managerApprovalFrm button[action=save]':{
			// 	click:'submitApproveFrm'	
			// },
            'investigationdiarygrid button[action=addWitnessFrm]':{
				click:'addWitnessFrm'	
			},
            'diaryPnl button[action=addWitnessFrm]':{
				click:'addWitnessFrm'	
			},
            'witnessgrid button[action=showOffenceChargeFrm]':{
				click:'showOffenceChargeFrm'	
			},
            'investigationdiarygrid button[action=showOffenceChargeFrm]':{
				click:'showOffenceChargeFrm'	
			},
            'newWitnessGrid button[action=showOffenceChargeFrm]':{
				click:'showOffenceChargeFrm'	
			},
            'inquiryGrid button[action=showOffenceChargeFrm]':{
				click:'showOffenceChargeFrm'	
			},
            'timelineGrid button[action=showCaseInvestigatorsFrm]':{
				click:'showCaseInvestigatorsFrm'	
			},
            'jointOperationProductGrid button[action=showJointOffenceProductFrm]':{
				click:'showJointOffenceProductFrm'	
			},
            'enforcementApplicantSelectionGrid': {
                itemdblclick: 'onApplicantSelectionListDblClick'
            },
            'internalUsersSelectionGrid': {
                itemdblclick: 'onApplicantSelectionListDblClick'
            },
           
            'newinvestigationreceivingwizard  button[name=process_submission_btn]': {
                click: 'showNewInvestigationReceivingApplicationSubmissionWin'
            },
            'newinvestigationreceivingwizard button[name=save_btn]': {//renewal
                click: 'saveInvestigationReceivingDetails'
            },
              
            'peerMeetingEnforcementApplicationListGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            'peerJointOperationsApplicationsGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            'deskMeetingMonitoringApplicationListGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            'peerMeetingMonitoringApplicationListGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            // 'managerapporvalWizard button[name=process_submission_btn]': {
            //     click: 'showApplicationSubmissionWin'
            // },
            'managerapporvalWizard button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'managerInvestigationReportReviewPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'directorapporvalWizard button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'communicationPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'enforcementPeerReviewMeetingPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'monitoringDeskReviewMeetingPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'monitoringDeskReviewSchedulingPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'officerReviewPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'monitoringManagerApproval button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'monitoringPeerReviewMeetingPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'monitoringPeerReviewSchedulingPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'complainceRegisterPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'viewInvestigationdiaryGrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid' 
            },
            'operativesGrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'jointOperationProductGrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'   
            },
            'viewProductSeizureReportGrid': {
                refresh: 'viewProductSeizureRefreshGrid'
               
            },
            'exhibitReportGrid': {
                refresh: 'viewProductSeizureRefreshGrid'
               
            },
            'caseDecisionsGrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'investigationcommentsgrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'executionReportGrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'timelineGrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'seizurepersonnelgrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'investigationdiarygrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'newWitnessGrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'inquiryGrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'jointOperationOffenceGrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'summaryGrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'viewActivityGrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },
            'viewlogisticsgrid': {
                refresh: 'viewInvestigationDiaryRefreshGrid'
            },

            'newDairyGrid': {
                refresh: 'viewNewRefreshGrid'
            },
            //
            'destructionProductsGrid': {
                refresh: 'viewProductDestructionRefreshGrid'
               
            },
            //
            'casedecisionFrm button[name=save_comment]': {
                click: 'saveCaseDecisions'
            }, 
            'investigationcommentsFrm button[name=save_comment]': {
                click: 'saveInvestigationComments'
            }, 
            // 'enforcementregisteredproductsdetailsgrid': {
            //     refresh: 'refreshRegisteredProductsgrid'
            // },
            'enforcementregisteredproductsdetailsgrid': {
                itemdblclick: 'onRegisteredProductGridDoubleClick'
            },
            'enforcementregisteredfacilitydetailsgrids': {
                itemdblclick: 'onRegisteredFacilitygridDblClick'
            },
            // 'monitoringworkplangrid': {
            //     itemdblclick: 'onAnnualWorkplanDblClick'
            // },
            'productInformationGrid': {
                refresh: 'viewApplicationDetails' 
            },
            'productInformationFrm button[action=genericsaveDetails]': {
                click: 'genericsaveDetails'
            },
            'dispensingComplianceGrid': {
                refresh: 'viewApplicationDetails' 
            },
            'dispensingcomplianceFrm button[action=saveDetails]': {
                click: 'genericsaveDetails'
            },
            'prescribingComplianceGrid': {
                refresh: 'viewApplicationDetails' 
            },
            'prescribingComplianceGrid button[action=save_prescribing_data]': {
                click: 'savePrescribingComplianceInformation' 
            },
            'dispensingComplianceGrid button[action=save_dispensing_data]': {
                click: 'saveDispensingComplianceInformation' 
            },
            'monitoringenforcementActionGrid': {
                refresh: 'viewApplicationDetails' 
            },
            'prescribingcomplianceFrm button[action=saveDetails]': {
                click: 'genericsaveDetails'
            },
            'monitoringpremisepersonnelgrid': {
                refresh: 'viewApplicationDetails' 
            },
            'controlledDispensingDataGrid': {
                refresh: 'viewApplicationDetails' 
            },
            'monitoringpremisepersonnelfrm button[action=genericsaveDetails]': {
                click: 'genericsaveDetails'
            },
            'controlledDispensingfrm button[action=genericsaveDetails]': {
                click: 'genericsaveDetails'
            },
            'monitoringreceivingwizard button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'enforcementDecisionFrm button[action=saveMonitoringApproval]': {
                click: 'saveMonitoringApprovaldetails'
            },
            'monitoringreceivingwizard button[name=save_btn]': {
                click: 'saveMonitoringReceivingDetails'
            },
            'jointOperationsWorkPlan button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'jointOperationsWorkPlan button[name=save_btn]': {
                click: 'saveJointOperationReceivingDetails'
            },
            'jointActivitiesform button[action=genericsaveDetails]': {
                click: 'genericsaveDetails'
            },
            'logisticsform button[action=genericsaveDetails]': {
                click: 'genericsaveDetails'
            },
            'mysteryshoppingEvaluationwizard button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'mysteryShoppingwizard button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'mystreyShoppingFrm button[action=genericsaveDetails]': {
                click: 'genericsaveDetails'
            },
            'debriefApplicationGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            'directdebriefApplicationGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            'suspectinforFrm button[action=link_annual_workplan]': {
                click: 'showAnnualWorkPlansSelectionList'
            },
            'productInformationFrm button[action=genericsaveDetails]': {
                click: 'genericsaveDetails'
            },
            'healthassesmentFrm button[action=genericsaveDetails]': {
                click: 'genericsaveDetails'
            },
            'monitoringrecommendationfrm button[action=genericsaveDetails]': {
                click: 'genericsaveDetails'
            },
            'jointPeerReviewScheduling button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'jointPeerReviewMeeting button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'jointmanagerapprovalWizard button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
             'chargefrm': {
                afterrender: 'prepareCaseOffences'
            },
            'newWitnessFrm': {
                afterrender: 'prepareCaseOffences'
            },
            'inquiryFrm': {
                afterrender: 'prepareCaseOffences'
            },
            'jointOperationProductfrm': {
                afterrender: 'prepareJointFacilityOffences'
            },
            'participantsgrid button[name=save_selected]': {
                click: 'saveJoinOperationsParticipants'
            },            
            'externalparticipantsfrm button[action=save_selected]': {
                click: 'saveJoinOperationsParticipants'
            },
            'timelineFrm': {
                afterrender: 'prepareCaseInvestigators'
            },
            
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
                onNewEnforcementApplication:'onNewEnforcementApplication',
                onMonitoringComplianceApplication:'onMonitoringComplianceApplication',
                onNewJointOperationsApplication:'onNewJointOperationsApplication',
                //deleteRecord:'deleteRecordUsingID',
                showWorkplanDetails:'showWorkplanDetails',
                funcActiveOtherEnforcementInformationTab: 'funcActiveOtherEnforcementInformationTab',
                loadEnforcementReportingWizardFromRecord:'EnforcementReportingApplication',
                loadMonitoringComplianceWizardFromRecord:'MonitoringComplianceApplication',
                getEnforcementApplicationApprovalDetails: 'getApplicationApprovalDetails',
                showCaseRegister:'showCaseRegister',
                showMonitoringComplianceRegister:'showMonitoringComplianceRegister',
                showMonitoringEnforcementAction:'showMonitoringEnforcementAction',
                showJointOperationsRegister:'showJointOperationsRegister',
                onPremisePersonnelDblClick:'onPremisePersonnelDblClick',
                showApplicationComplianceDetails: 'showApplicationComplianceDetails',
                signPlanDetails:'signPlanDetails'
            }
        } 
    },
    enforcementHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#enforcementDashWrapper');
            
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: sec_dashboard});
        }
    },
    
    refreshEnforcementMainGrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = (activeTab.down('hiddenfield[name=section_id]')) ? grid.down('combo[name=section_id]').getValue() : null,
            sub_module_id = (grid.down('combo[name=sub_module_id]')) ? grid.down('combo[name=sub_module_id]').getValue() : null,
            workflow_stage_id = (grid.down('combo[name=workflow_stage_id]')) ? grid.down('combo[name=workflow_stage_id]').getValue() : null;
          
            store.getProxy().extraParams = {
                module_id: module_id,
                sub_module_id: sub_module_id,
                section_id: section_id,
                workflow_stage_id: workflow_stage_id
            };

    },
    prepareNewReportReceiving: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            report_type_id =activeTab.down('hiddenfield[name=report_type_id]').getValue(),
            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            complainantfrm = activeTab.down('complainantfrm'),
            suspectinfoFrm = activeTab.down('suspectinforFrm'),
            suspectedoffencegrid = activeTab.down('suspectedoffencegrid'),
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            // console.log(enforcement_id)
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/prepareNewReportReceiving',
                params: {
                    application_id: application_id,
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
                    // ltr_model = Ext.create('Ext.data.Model', ltrResults);
                    //console.log(results);
                    if (success == true || success === true) {
                        complainantfrm.loadRecord(model);
                        suspectinfoFrm.loadRecord(model);
                        activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
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
    onRegisteredProductGridDoubleClick: function (view, record, item, index, e, eOpts)
    {
       var me = this,
           grid = view.grid,
           win = grid.up('window'),
           form=win.object_1,
           mainTabPanel = me.getMainTabPanel(),
           activeTab = mainTabPanel.getActiveTab(),
           mask = new Ext.LoadMask({
               msg: 'Please wait...',
               target: win
           });
       mask.show();

       suspectinforFrm = activeTab.down('#suspectinforFrm');
       
       if(activeTab.down('#suspectinforFrm')){
        form.down('textfield[name=certificate_no]').setValue(record.get('certificate_no'));
        form.down('textfield[name=brand_name]').setValue(record.get('brand_name'));
        form.down('textfield[name=common_name]').setValue(record.get('common_name'));
        form.down('textfield[name=section_id]').setValue(record.get('section_id'));
        form.down('textfield[name=prodclass_category_id]').setValue(record.get('prodclass_category_id'));
       }else{
        form.down('textfield[name=certificate_no]').setValue(record.get('certificate_no'));
        form.down('textfield[name=brand_name]').setValue(record.get('brand_name'));

        if( form.down('textfield[name=common_name]')){
            form.down('textfield[name=common_name]').setValue(record.get('common_name'));
        }
        if( form.down('textfield[name=product_description]')){
            form.down('textfield[name=product_description]').setValue(record.get('product_description'));
        }
        if( form.down('datefield[name=expiry_date]')){
            form.down('datefield[name=expiry_date]').setValue(record.get('expiry_date'));
        }
        if( form.down('textfield[name=dosage_form]')){
            form.down('textfield[name=dosage_form]').setValue(record.get('dosage_form'));
        }
        if( form.down('textfield[name=manufacturer]')){
            form.down('textfield[name=manufacturer]').setValue(record.get('manufacturer'));
        }
        //product_description
        else{

        }
       
      
       
       }
       
       Ext.Function.defer(function () {
           mask.hide();
            win.close();
       }, 200);
        
    },
    onRegisteredFacilitygridDblClick: function (view, record)
    {
       var me = this,
           grid = view.grid,
           win = grid.up('window'),
           form=win.object_1,
           mainTabPanel = me.getMainTabPanel(),
           activeTab = mainTabPanel.getActiveTab(),
           mask = new Ext.LoadMask({
               msg: 'Please wait...',
               target: win
           });
       mask.show();
       console.log(form);
       if (activeTab.down('licenseInformationFrm')){
        form.down('hiddenfield[name=reg_premise_id]').setValue(record.get('reg_premise_id'));
        form.down('hiddenfield[name=premise_id]').setValue(record.get('premise_id'));
        form.down('textfield[name=permit_no]').setValue(record.get('certificate_no'));
        form.down('textfield[name=premise_name]').setValue(record.get('name'));
        form.down('combo[name=premise_type]').setValue(record.get('premise_type_id'));
        form.down('combo[name=country_id]').setValue(record.get('country_id'));
        form.down('combo[name=region_id]').setValue(record.get('region_id'));
        form.down('combo[name=district_id]').setValue(record.get('district_id'));
        form.down('textfield[name=physical_address]').setValue(record.get('physical_address'));
        form.down('textfield[name=postal_address]').setValue(record.get('postal_address'));
       }else{
        form.down('textfield[name=permit_no]').setValue(record.get('certificate_no'));
        form.down('textfield[name=premise_name]').setValue(record.get('name'));
        form.down('textfield[name=physical_address]').setValue(record.get('physical_address'));
       // form.down('numberfield[name=telephone]').setValue(record.get('telephone'));
        if(form.down('combo[name=premise_type]')){
            form.down('combo[name=premise_type]').setValue(record.get('premise_type_id')); 
        }
        else{

        }
       
       }
       
       Ext.Function.defer(function () {
           mask.hide();
            win.close();
       }, 200);
        
    },
    
    onPremisePersonnelDblClick: function (view, record, item, index, e, eOpts)
    {
       var me = this,
           grid = view.grid,
           win = grid.up('window'),
           form=win.object_1,
           mainTabPanel = me.getMainTabPanel(),
           activeTab = mainTabPanel.getActiveTab(),
        //    name = record.get('name'),monitoringpremisepersonnelgrid
           
           mask = new Ext.LoadMask({
               msg: 'Please wait...',
               target: win
           });
       mask.show();
    //    console.log(name);
       console.log(grid);
       form.down('textfield[name=responsible_personnel]').setValue(record.get('name'));

       Ext.Function.defer(function () {
           mask.hide();
            win.close();
       }, 200);
        
    },
    onAnnualWorkplanDblClick: function (grid, record) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            annual_workplan_id = record.get('id'),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]');
            suspectinforFrm = activeTab.down('#suspectinforFrm');

        if (annual_workplan_id || sub_module_id == 88) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/getAnnualWorkplanDetails',
                params: {
                    annual_workplan_id: annual_workplan_id,
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results,
                        model = Ext.create('Ext.data.Model', results);
                    if (success == true || success === true) {
                        suspectinforFrm.loadRecord(model);

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
    refreshRegisteredProductsgrid: function (me) {

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
    prepareNewInvestigationReceiving: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            report_type_id =activeTab.down('hiddenfield[name=report_type_id]').getValue(),
            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
            complainantfrm = activeTab.down('complainantfrm'),
            suspectinfoFrm = activeTab.down('suspectinforFrm'),
            suspectedoffencegrid = activeTab.down('suspectedoffencegrid'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/prepareNewInvestigationReceiving',
                params: {
                    application_id: application_id,
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
                        complainantfrm.loadRecord(model);
                        suspectinfoFrm.loadRecord(model);
                        activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        // activeTab.down('hiddenfield[name=application_id]').setValue(application_id);
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
    prepareWorkplanReceiving: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
            joint_investigation_id = activeTab.down('hiddenfield[name=joint_investigation_id]').getValue(),
            workplanfrm = activeTab.down('workplanfrm'),
            workplan_id = workplanfrm.down('hiddenfield[name=workplan_id]'),
            complainantfrm = activeTab.down('complainantfrm'),
            suspectinfoFrm = activeTab.down('suspectinforFrm'),
            workplanapplicationgrid = activeTab.down('workplanapplicationgrid'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
         console.log(workplanfrm);
         console.log(activeTab);

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/prepareWorkplan',
                params: {
                    application_id: application_id,
                    application_code: application_code,
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
                        // ltrResults = resp.ltrDetails,
                        ///joint_investigation_id
                        model = Ext.create('Ext.data.Model', results);
                       console.log(results);
                       console.log(results.joint_investigation_id);
                       console.log(results.enforcement_id);
                    if (success == true || success === true) {
                          //complainantfrm.loadRecord(model);
                          //suspectinfoFrm.loadRecord(model);
                        workplanfrm.loadRecord(model);
                        activeTab.down('hiddenfield[name=enforcement_id]').setValue(results.enforcement_id);
                        activeTab.down('hiddenfield[name=joint_investigation_id]').setValue(results.joint_investigation_id);
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
    // prepareInvestigationReceiving: function (me) {
    //         Ext.getBody().mask('Please wait...');
    //         var me = this,
    //             mainTabPanel = me.getMainTabPanel(),
    //             activeTab = mainTabPanel.getActiveTab(),
    //             application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
    //             report_type_id =activeTab.down('hiddenfield[name=report_type_id]').getValue(),
    //             app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
    //             application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
    //             enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
    //             complainantfrm = activeTab.down('complainantfrm'),
    //             suspectinfoFrm = activeTab.down('suspectinforFrm'),
    //             viewWorkPlanFrm = activeTab.down('viewWorkPlanFrm'),
    //             suspectedoffencegrid = activeTab.down('suspectedoffencegrid'),
    //            // enforcement_id = suspectinfoFrm.down('hiddenfield[name=enforcement_id]').getValue(),
    //             process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
    //             section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
    //             sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
    //             filter = {section_id: section_id},
    //             workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
    //             console.log(enforcement_id)
    //         app_doc_types_store.removeAll();
    //         app_doc_types_store.load({
    //             params: {
    //                 process_id: process_id,
    //                 workflow_stage: workflow_stage_id
    //             }
    //         });
    
    //         if (application_id) {
    //             Ext.Ajax.request({
    //                 method: 'GET',
    //                 url: 'enforcement/prepareNewInvestigationReceiving',
    //                 params: {
    //                     application_id: application_id,
    //                 },
    //                 headers: {
    //                     'Authorization': 'Bearer ' + access_token
    //                 },
    //                 success: function (response) {
    //                     Ext.getBody().unmask();
    //                     var resp = Ext.JSON.decode(response.responseText),
    //                         message = resp.message,
    //                         success = resp.success,
    //                         results = resp.results,
    //                         // ltrResults = resp.ltrDetails,
    //                         model = Ext.create('Ext.data.Model', results);
    //                     // ltr_model = Ext.create('Ext.data.Model', ltrResults);
    //                     //console.log(results);
    //                     if (success == true || success === true) {
    //                         complainantfrm.loadRecord(model);
    //                         suspectinfoFrm.loadRecord(model);
    //                         viewWorkPlanFrm.loadRecord(model);
                           
    //                         // localagentFrm.loadRecord(ltr_model);
    //                         // products_detailsfrm.loadRecord(model);
    //                     } else {
    //                         toastr.error(message, 'Failure Response');
    //                     }
    //                 },
    //                 failure: function (response) {
    //                     Ext.getBody().unmask();
    //                     var resp = Ext.JSON.decode(response.responseText),
    //                         message = resp.message,
    //                         success = resp.success;
    //                     toastr.error(message, 'Failure Response');
    //                 },
    //                 error: function (jqXHR, textStatus, errorThrown) {
    //                     Ext.getBody().unmask();
    //                     toastr.error('Error: ' + errorThrown, 'Error Response');
    //                 }
    //             });
    //         } else {
    //             Ext.getBody().unmask();
    //             //It's a new application
    //         }
    //     },
    onNewEnforcementApplication: function (sub_module_id,btn) {
        Ext.getBody().mask('Please wait...');

        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#enforcementDashWrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id =2,
            
            workflow_details = getInitialWorkflowDetails(module_id,section_id,sub_module_id,null,null,null,null);
           
        if (!workflow_details || workflow_details.length === 0) {
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
        dashboardWrapper.add(workflowContainer);
        //reload Stores 
        //console.log(section_id);
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
    onMonitoringComplianceApplication: function (sub_module_id,btn) {
        Ext.getBody().mask('Please wait...');

        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#enforcementDashWrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id =2,
            
            workflow_details = getInitialWorkflowDetails(module_id,section_id,sub_module_id,null,null,null,null);
           
        if (!workflow_details || workflow_details.length === 0) {
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
        dashboardWrapper.add(workflowContainer);
        //reload Stores 
        //console.log(section_id);
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
    showNewEnforcementReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            // = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            is_dataammendment_request =0,
            
            storeID = 'enforcementStr';
            console.log(application_code);
            if(activeTab.down('hiddenfield[name=is_dataammendment_request]')){
                is_dataammendment_request = activeTab.down('hiddenfield[name=is_dataammendment_request]').getValue();
            }
            
        valid = this.validateNewReportReceivingSubmission();
        if (valid) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
          
        } else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Details!!', 'Warning Response');
            return;
        }
    },
    showEnforcementApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            // = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            valid = true;
           
            is_investigation_submission = 1;

            extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'is_investigation_submission',
                value: is_investigation_submission,
            }];

            storeID = 'enforcementStr';
       
            if (valid == true){
                showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsstrictrecommfrm', winWidth, storeID,extraParams);
                console.log(is_investigation_submission);
            } else {
                Ext.getBody().unmask();
                toastr.warning('Please Enter All the required Enforcment Details!!', 'Warning Response');
                return;
            }
    },
    validateNewReportReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            complainantFrm = activeTab.down('complainantfrm'),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
           applicant_id = complainantFrm.down('hiddenfield[name=applicant_id]').getValue(),
            suspectInfoFrm = activeTab.down('#suspectinforFrm'),
            suspectedoffenceGrid = activeTab.down('suspectedoffencegrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();

        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }if(!suspectInfoFrm.isValid){
            toastr.warning('Please Save Suspect Details!!', 'Warning Response');
            return false;
        }if(suspectedoffenceGrid.getStore().data.length < 1){
            toastr.warning('Please Add an Offence!!', 'Warning Response');
            return false;
        }
        // if (!applicant_id) {
        //     toastr.warning('Please Select Applicant!!', 'Warning Response');
        //     return false;
        // }
        return true;
    },
    showNewInvestigationReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            // = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            
            storeID = 'enforcementStr';

        valid = this.validateNewInvestigationReceivingSubmission();
        if (valid){
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Enforcement Details!!', 'Warning Response');
            return;
        }
    },
    validateNewInvestigationReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            complainantFrm = activeTab.down('complainantfrm'),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
           // applicant_id = complainantFrm.down('hiddenfield[name=applicant_id]').getValue(),
            suspectInfoFrm = activeTab.down('#suspectinforFrm'),
            screeningGrid = activeTab.down('foodpremscreeninggrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!suspectInfoFrm.isValid()) {
            toastr.warning('Please Enter All the required Details!!', 'Warning Response');
            return false;
        }
        this.saveInvestigationReceivingDetails(btn);

        return true;
    },
    refreshSuspectedOffencegridGrid: function (me) {
        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        //check if has been set or use window 
        if (activeTab.down('hiddenfield[name=active_application_id]')) {
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();

        } else {
            var panel = me.up('window'),
            application_id = panel.down('hiddenfield[name=active_application_id]').getValue();
        }
        store.getProxy().extraParams = {
            application_id: application_id,

        };
    },

    saveSuspectedOffenceDetails:function (btn) {
        var me = this,
		    mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            url = btn.action_url,
            table_name = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm();

        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {
                    table_name: table_name,
                    application_id: application_id,
                    _token: token
                },
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        // record_id = response.record_id,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        store.load({params:{application_id:application_id}});
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    submitFrm:function (btn) {
        var me = this,
		    mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
            url = btn.action_url,
            table_name = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm();
            console.log(enforcement_id);
        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {
                    table_name: table_name,
                    application_id: application_id,
                    enforcement_id: enforcement_id,
                    _token: token
                },
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        // record_id = response.record_id,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        store.load({params:{application_id:application_id}});
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    deleteRecordUsingID: function (id, table_name, storeID, url, method,record) {	
        var me = this,
            store = Ext.getStore(storeID);
        Ext.MessageBox.confirm('Delete', 'Are you sure to perform this action ?', function (btn) {
            if (btn === 'yes') {
                Ext.getBody().mask('Deleting record...');
                if (!method) {
                    method = "POST";
                }
                Ext.Ajax.request({
                    url: url,
                    method: method,
                    params: {
                        table_name: table_name,
                        id: id
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
                            toastr.success(message, 'Success Response');
                            store.removeAll();
                            store.load({params:{

					workflow_stage_id:record.get('workflow_stage_id'),
                    application_code:record.get('application_code'),
					application_id:record.get('active_application_id'),
                    table_name:'tra_applications_comments'
					}});
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
    saveMonitoringApprovaldetails: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            frm = form.getForm();
            

        if (frm.isValid()) {
            frm.submit({
                url: url,
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message; 
                    if (success == true || success === true) {
                        store.removeAll();
                        store.load();
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    showApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = true,
            // storeID = getApplicationStore(module_id, section_id),
            storeID = 'enforcementStr',
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },
    showManagerApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = true,
            // storeID = getApplicationStore(module_id, section_id),
            storeID = 'enforcementStr',
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowinvestigationsubmissionsfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },
    
    saveWorkplanDetails: function (btn) {
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
            console.log(form);
        Ext.each(selected_records, function (item) {
            application_code = item.data.application_code;
            enforcement_id = item.data.enforcement_id;
            
            obj = {
                application_code: application_code,
                enforcement_id: enforcement_id
            };
             selected.push(obj);
        });
        if (frm.isValid()) {
            if (!sm.hasSelection()) {
                toastr.warning('Please select at least one application!!', 'Warning Response');
                return false;
            }
            frm.submit({
                url: 'enforcement/saveWorkplanApplicationDetails',
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
                        workpan_id = response.workpan_id;
                    if (success == true || success === true) {
                        form.down('hiddenfield[name=workplan_id]').setValue(workpan_id);
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
    onApplicantSelectionListDblClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            win = grid.up('window'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: win
            });
        mask.show();
        if (grid.applicantType === 'nonlocal') {
            if(activeTab.down('complainantfrm')){
                var applicantForm = activeTab.down('complainantfrm');
                applicantForm.loadRecord(record);
            }else if(activeTab.down('complainantfrm')){
                var applicantForm = activeTab.down('complainantfrm');
                applicantForm.loadRecord(record);
            }
            else{
                jointOperationsWorkPlanFrm = activeTab.down('jointOperationsWorkPlanFrm');
                jointOperationsWorkPlanFrm.loadRecord(record);
            }  
        } 
        //else {
        //     applicantForm = activeTab.down('productlocalapplicantdetailsfrm');
        //     if (applicantForm != null) {
        //         applicantForm.loadRecord(record);
        //     }
        // }

        Ext.Function.defer(function () {
            mask.hide();
            win.close();
        }, 200);
    },
    funcActiveOtherEnforcementInformationTab: function (tab) {

        var mainTabPnl = this.getMainTabPanel(),
            activeTab = mainTabPnl.getActiveTab(),
            enforcement_id;
        if(tab.down('hiddenfield[name=enforcement_id]')){
            enforcement_id = tab.down('hiddenfield[name=enforcement_id]').getValue();
            if(activeTab.down('hiddenfield[name=enforcement_id]')){
                activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
            }
        }
        if (activeTab.down('hiddenfield[name=enforcement_id]') && enforcement_id == '') {
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue();
        }
        if (enforcement_id == '') {
            tab.setActiveTab(0);
            toastr.error('Save Enforcement Details to proceed', 'Failure Response');
            return;
        }
    },
    EnforcementReportingApplication: function (view, record) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            grid = view.grid,
            process_id = record.get('process_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            sub_module_id = grid.sub_module_id,
            module_id = record.get('module_id'),
            section_id = record.get('section_id'),
            enforcement_id=record.get('enforcement_id'),
            workflow_stage = record.get('workflow_stage'),
            reference_no = record.get('reference_no'),
             view_id = record.get('view_id'),
            title = 'Investigation';
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id,null,null,null,null);
            
        if (!workflow_details) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        var tab = mainTabPanel.getComponent(view_id);
        if(sub_module_id ==  87){
            title = "Siezure";
        }else if(sub_module_id == 88){
            title = 'Monitoring & Compliance';
        }else if(sub_module_id == 89){
            title = 'Joint Operations';
        }else if(sub_module_id == 91){
            title = 'Destruction';
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
        me.prepareReportingApplicationBaseDetails(newTab, record);
        if(sub_module_id == 86){
            newTab.getViewModel().set('isReadOnly', true);
        }
         if(sub_module_id == 85){
            newTab.getViewModel().set('isReadOnly', false);
        }
        // if(sub_module_id != 85){
        //     this.saveInvestigationReceivingDetails(btn);
        //     newTab.down('button[name=save_btn]').action_url = 'saveInvetsigationReceivingDetails';
        //     saveInvestigationReceivingDetails
        // }
        //load form
            mainTabPanel.add(newTab);
            var lastTab = mainTabPanel.items.length - 1;
            mainTabPanel.setActiveTab(lastTab);
        } else {
            mainTabPanel.setActiveTab(tab);
        }
    
        //loading prefilled form
        me.onApprovedInvestigationDblClick(newTab, record);
    
        //close pop up if there
        grid = Ext.ComponentQuery.query("#investigationApprovedListGrid")[0];
        if(grid){
            grid.up('window').close();
        }
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    MonitoringComplianceApplication: function (view, record) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            grid = view.grid,
            process_id = record.get('process_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            sub_module_id = grid.sub_module_id,
            module_id = record.get('module_id'),
            section_id = record.get('section_id'),
            enforcement_id=record.get('enforcement_id'),
            workflow_stage = record.get('workflow_stage'),
            reference_no = record.get('reference_no'),
            view_id = record.get('view_id'),
            title = 'Monitoring & Compliance';

            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id);
    
        if (!workflow_details) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        var tab = mainTabPanel.getComponent(view_id);
        if(sub_module_id ==  87){
            title = "Siezure";
        }else if(sub_module_id == 88){
            title = 'Monitoring & Compliance';
        }else if(sub_module_id == 89){
            title = 'Joint Operations';
        }else if(sub_module_id == 91){
            title = 'Destruction';
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
        me.prepareMonitoringComplianceBaseDetails(newTab, record);
        if(sub_module_id == 86){
            newTab.getViewModel().set('isReadOnly', true);
        }
         if(sub_module_id == 85){
            newTab.getViewModel().set('isReadOnly', false);
        }
        // if(sub_module_id != 85){
        //     this.saveInvestigationReceivingDetails(btn);
        //     newTab.down('button[name=save_btn]').action_url = 'saveInvetsigationReceivingDetails';
        //     saveInvestigationReceivingDetails
        // }
        //load form
            mainTabPanel.add(newTab);
            var lastTab = mainTabPanel.items.length - 1;
            mainTabPanel.setActiveTab(lastTab);
        } else {
            mainTabPanel.setActiveTab(tab);
        }
    
        //loading prefilled form
        me.onMonitoringComplianceDblClick(newTab, record);
    
        //close pop up if there
        grid = Ext.ComponentQuery.query("#monitoringComplianceGrid")[0];
        if(grid){
            grid.up('window').close();
        }
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    prepareReportingApplicationBaseDetails: function (tab, record) {
        var me = this,
            process_name = record.get('process_name'),
            workflow_stage = record.get('workflow_stage'),
            application_status = record.get('application_status'),
            reference_no = record.get('reference_no'),
            process_id = record.get('process_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            enforcement_id=record.get('enforcement_id'),
            workflow_stage_id = record.get('workflow_stage_id');
     
        if(tab.down('hiddenfield[name=enforcement_id]')){
             tab.down('hiddenfield[name=enforcement_id]').setValue(record.get('enforcement_id'));
        }
        tab.down('hiddenfield[name=process_id]').setValue(process_id);
        tab.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        tab.down('hiddenfield[name=module_id]').setValue(module_id);
        tab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        tab.down('hiddenfield[name=section_id]').setValue(section_id);
        tab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
        tab.down('displayfield[name=process_name]').setValue(process_name);
        tab.down('displayfield[name=workflow_stage]').setValue(workflow_stage);
        tab.down('displayfield[name=application_status]').setValue(application_status);
        tab.down('displayfield[name=reference_no]').setValue(reference_no);
    },
    onApprovedInvestigationDblClick: function (grid, record) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            // win = grid.up('window'),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            enforcement_id = record.get('enforcement_id'),
            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            complainantfrm = activeTab.down('complainantfrm'),
            suspectinfoFrm = activeTab.down('suspectinforFrm'),
            // is_populate_primaryappdata = false,
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        
            activeTab.down('hiddenfield[name=module_id]').setValue(module_id);
            activeTab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            activeTab.down('hiddenfield[name=section_id]').setValue(section_id);
            activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
            activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);

        filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        if (enforcement_id || sub_module_id == 85) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/onApprovedInvestigationDetails',
                params: {
                    enforcement_id: enforcement_id,
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results,
                        
                        // branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                 
                    if (success == true || success === true) {

                        complainantfrm.loadRecord(model);
                        suspectinfoFrm.loadRecord(model);

                        // if(is_populate_primaryappdata == 1){
                        //     activeTab.down('hiddenfield[name=active_application_code]').setValue(results.active_application_code);
                        //     activeTab.down('hiddenfield[name=active_application_id]').setValue(results.active_application_id);
                        //     activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                        //     activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                        // }

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
    prepareMonitoringComplianceBaseDetails: function (tab, record) {
        var me = this,
            process_name = record.get('process_name'),
            workflow_stage = record.get('workflow_stage'),
            application_status = record.get('application_status'),
            reference_no = record.get('reference_no'),
            process_id = record.get('process_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            enforcement_id=record.get('enforcement_id'),
            workflow_stage_id = record.get('workflow_stage_id');
     
        if(tab.down('hiddenfield[name=enforcement_id]')){
             tab.down('hiddenfield[name=enforcement_id]').setValue(record.get('enforcement_id'));
        }
        tab.down('hiddenfield[name=process_id]').setValue(process_id);
        tab.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        tab.down('hiddenfield[name=module_id]').setValue(module_id);
        tab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        tab.down('hiddenfield[name=section_id]').setValue(section_id);
        tab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
        tab.down('displayfield[name=process_name]').setValue(process_name);
        tab.down('displayfield[name=workflow_stage]').setValue(workflow_stage);
        tab.down('displayfield[name=application_status]').setValue(application_status);
        tab.down('displayfield[name=reference_no]').setValue(reference_no);
    },
    onMonitoringComplianceDblClick: function (grid, record) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            // win = grid.up('window'),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            enforcement_id = record.get('enforcement_id'),
            // app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            licenseInformationFrm = activeTab.down('licenseInformationFrm'),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
    
            
            activeTab.down('hiddenfield[name=module_id]').setValue(module_id);
            activeTab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            activeTab.down('hiddenfield[name=section_id]').setValue(section_id);
            activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
            licenseInformationFrm.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
            // activeTab.down('combo[name=annual_workplan_id]').setVisible(true);
            console.log(enforcement_id);
        filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        // app_doc_types_store.removeAll();
        // app_doc_types_store.load({
        //     params: {
        //         process_id: process_id,
        //         workflow_stage: workflow_stage_id
        //     }
        // });
        if (enforcement_id || sub_module_id == 85) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/onMonitoringComplianceDetails',
                params: {
                    enforcement_id: enforcement_id,
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results,
                        model = Ext.create('Ext.data.Model', results);
                 
                    if (success == true || success === true) {
                        suspectinfoFrm.loadRecord(model);
                        licenseInformationFrm.loadRecord(model);
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
    addInvestigationApplicationWorkflowParams: function (me) {
        var store = me.store,
            workplanScheduling = me.workplanScheduling,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            table_name = getApplicationTable(module_id);
            workplan_id = null;

            if((workplanScheduling) && workplanScheduling == 1){
                workplan_id = activeTab.down('workplanfrm').down('hiddenfield[name=workplan_id]').getValue();
                console.log(workplan_id);
            }
        
        store.getProxy().extraParams = {
            table_name: table_name,
            workplan_id:workplan_id,
            workflow_stage_id: workflow_stage_id,
            section_id: section_id,
            module_id:module_id
        };
    },
    saveInvestigationReceivingDetails: function (btn) {
        var me = this,
            // toaster = btn.toaster,
            mainTabPnl =me.getMainTabPanel(),
            activeTab = mainTabPnl.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            active_application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue();
            console.log(enforcement_id);
            complainantfrm=activeTab.down('complainantfrm'),
            applicant_id = complainantfrm.down('hiddenfield[name=applicant_id]').getValue(),
            report_type_id = complainantfrm.down('combo[name=report_type_id]').getValue(),
            suspectinforfrm =activeTab.down('suspectinforFrm');
            suspect_name = suspectinforfrm.down('textfield[name=suspect_name]').getValue(),
            suspect_business = suspectinforfrm.down('textfield[name=suspect_business]').getValue(),
            suspect_address = suspectinforfrm.down('textfield[name=suspect_address]').getValue(),
            suspect_omang = suspectinforfrm.down('numberfield[name=suspect_omang]').getValue(),
            suspect_occupation = suspectinforfrm.down('textfield[name=suspect_occupation]').getValue(),
            // place_of_offence = suspectinforfrm.down('textfield[name=place_of_offence]').getValue(),
            // car_reg_no = suspectinforfrm.down('textfield[name=car_reg_no]').getValue(),
            entity_type_id = suspectinforfrm.down('combo[name=entity_type_id]').getValue(),
            brand_name = suspectinforfrm.down('textfield[name=brand_name]').getValue(),
            common_name = suspectinforfrm.down('textfield[name=common_name]').getValue(),
            product_section_id = suspectinforfrm.down('combo[name=section_id]').getValue(),
            prodclass_category_id = suspectinforfrm.down('combo[name=prodclass_category_id]').getValue(),
            premise_name = suspectinforfrm.down('textfield[name=premise_name]').getValue(),
            premise_type = suspectinforfrm.down('combo[name=premise_type]').getValue(),
            country_id = suspectinforfrm.down('combo[name=country_id]').getValue(),
            region_id = suspectinforfrm.down('combo[name=region_id]').getValue(),
            district_id = suspectinforfrm.down('combo[name=district_id]').getValue(),
            suspect_physical_address = suspectinforfrm.down('textfield[name=suspect_physical_address]').getValue(),
            suspect_postal_address = suspectinforfrm.down('textfield[name=suspect_postal_address]').getValue(),
            suspect_telephone = suspectinforfrm.down('numberfield[name=suspect_telephone]').getValue(),
            other_details = suspectinforfrm.down('htmleditor[name=other_details]').getValue();
            batch_number = suspectinforfrm.down('textfield[name=batch_number]').getValue();
            expiry_date = suspectinforfrm.down('datefield[name=expiry_date]').getValue();
           
            // suspectinfoFrm =suspectinforfrm.getForm();

        if (!report_type_id) {
            toastr.warning('Please fill the complainant form!!', 'Warning Response');
            return false;
        }if(!suspectinforfrm.isValid()){
            toastr.warning('Please fill the Suspect Information form!!', 'Warning Response');
            return false;
        }

        if (complainantfrm.isValid()) {
            complainantfrm.submit({
                url: 'enforcement/saveInvetsigationReceivingDetails',
                waitMsg: 'Please wait...',
                params: {
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    active_application_id: active_application_id,
                    report_type_id: report_type_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    section_id: section_id,
                    enforcement_id: enforcement_id,
                    applicant_id: applicant_id,
                    suspect_name: suspect_name,
                    suspect_business:suspect_business,
                    suspect_address: suspect_address,
                    suspect_omang: suspect_omang,
                    suspect_occupation: suspect_occupation,
                    // place_of_offence:place_of_offence,
                    // car_reg_no:car_reg_no,
                    entity_type_id: entity_type_id,
                    brand_name: brand_name,
                    common_name: common_name,
                    product_section_id:product_section_id,
                    prodclass_category_id:prodclass_category_id,
                    premise_name:premise_name,
                    premise_type:premise_type,
                    country_id:country_id,
                    region_id:region_id,
                    district_id:district_id,
                    suspect_physical_address:suspect_physical_address,
                    suspect_postal_address:suspect_postal_address,
                    suspect_telephone:suspect_telephone,
                    other_details:other_details,
                    batch_number:batch_number,
                    expiry_date:expiry_date,
                   
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
                        active_application_code = resp.application_code,
                        active_application_id = resp.active_application_id,
                        enforcement_id = resp.enforcement_id,
                        reference_no = resp.reference_no;
                        tracking_no = resp.tracking_no;
                        console.log(record_id);
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        suspectinforfrm.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        
                        if(complainantfrm.down('hiddenfield[name=enforcement_id]')){
                            complainantfrm.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        }
                        activeTab.down('hiddenfield[name=active_application_id]').setValue(active_application_id);
                        activeTab.down('hiddenfield[name=active_application_code]').setValue(active_application_code);
                        activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        activeTab.down('displayfield[name=reference_no]').setValue(reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(tracking_no);
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
    },
    prepareEnforcementManagerMeeting: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('#application_list');
        this.prepareEnforcementMeetingDetailsGeneric(activeTab, applicationsGrid, 0);
    },
    prepareEnforcementMeetingDetailsGeneric: function (activeTab, applicationsGrid, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            meetingDetailsFrm = activeTab.down('form'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            applicationsStore = applicationsGrid.getStore(),
            participantsGrid = activeTab.down('tcmeetingparticipantsgrid'),
            participantsStore = participantsGrid.getStore(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sm = applicationsGrid.getSelectionModel();
        participantsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            meetingDetailsFrm.getForm().getFields().each(function (field) {
                field.setReadOnly(true);
            });
        }
        // this.redoTcMeetingParticipantsGrid(participantsGrid);
        if (application_id) {
            applicationsStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/prepareEnforcementRegMeetingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    workflow_stage_id: workflow_stage_id,
                    table_name: 'tra_enforcement_applications'
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
    prepareEnforcementDebriefingMeeting: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('#application_list');
        this.prepareDebriefingMeetingDetails(activeTab, applicationsGrid, 0);
    },
    prepareDebriefingMeetingDetails: function (activeTab, applicationsGrid, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            meetingDetailsFrm = activeTab.down('form'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            applicationsStore = applicationsGrid.getStore(),
            participantsGrid = activeTab.down('tcdebriefmeetingparticipantsgrid'),
            participantsStore = participantsGrid.getStore(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sm = applicationsGrid.getSelectionModel();
        participantsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            meetingDetailsFrm.getForm().getFields().each(function (field) {
                field.setReadOnly(true);
            });
        }
        // this.redoTcMeetingParticipantsGrid(participantsGrid);
        if (application_id) {
            applicationsStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/prepareEnforcementRegMeetingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    workflow_stage_id: workflow_stage_id,
                    table_name: 'tra_enforcement_applications'
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
    saveTCMeetingDetails: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('meetingdetailsfrm'),
            toaster = btn.toaster,
            frm = form.getForm(),
            applicationsGrid = activeTab.down('#application_list'),
            sm = applicationsGrid.getSelectionModel(),
            selected_records = sm.getSelection(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
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
                url: 'enforcement/saveTCMeetingDetails',
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
    getApplicationApprovalDetails: function (item) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            is_update = item.is_update,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            application_id = record.get('active_application_id'),
            application_code = record.get('application_code'),
            process_id = record.get('process_id'),
            module_id = record.get('module_id'),
            recommendation_id=record.get('recommendation_id'),
            // reg_product_id = record.get('reg_product_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            table_name = item.table_name,
            approval_frm = item.approval_frm,
            form = Ext.widget(approval_frm),
            storeArray = eval(item.stores),
            arrayLength = storeArray.length;
            console.log(form);
        form.setController('enforcementvctr');
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        if( form.down('datefield[name=expiry_date]')){
            form.down('datefield[name=expiry_date]').setReadOnly(true); 
        }
        if (is_update > 0) {
            form.down('combo[name=decision_id]').setReadOnly(true);
            form.down('datefield[name=approval_date]').setReadOnly(true);
           
            form.down('textarea[name=comment]').setReadOnly(true);
            form.down('button[name=save_recommendation]').setText('Update Recommendation');
        }
        form.down('hiddenfield[name=table_name]').setValue(table_name);
        form.down('hiddenfield[name=module_id]').setValue(module_id);
        //form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        // form.down('hiddenfield[name=reg_product_id]').setValue(reg_product_id);
        Ext.Ajax.request({
            method: 'GET',
            url: 'common/getApplicationApprovalDetails',
            params: {
                application_id: application_id,
                application_code: application_code,
                module_id:module_id,
                // sub_module_id:sub_module_id,
                recommendation_id:recommendation_id
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
                   // console.log(results)
                if (success == true || success === true) {
                    form.loadRecord(model);
                    form.down('hiddenfield[name=application_id]').setValue(application_id);
                    form.down('hiddenfield[name=application_code]').setValue(application_code);
                    form.down('hiddenfield[name=process_id]').setValue(process_id);
                    form.down('hiddenfield[name=module_id]').setValue(module_id);
                    //form.down('hiddenfield[name=recommendation_id]').setValue(recommendation_id);
                    form.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
                    funcShowCustomizableWindow('Recommendation', '60%', form, 'customizablewindow', item);
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
    prepareInvestigationDairy: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            report_type_id =activeTab.down('hiddenfield[name=report_type_id]').getValue(),
            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
            complainantfrm = activeTab.down('complainantfrm'),
            suspectinfoFrm = activeTab.down('suspectinforFrm'),
            viewWorkPlanFrm = activeTab.down('viewWorkPlanFrm'),
            witnessgrid = activeTab.down('witnessgrid'),
            investigationdiarygrid = activeTab.down('investigationdiarygrid'),
            newWitnessGrid = activeTab.down('newWitnessGrid'),
            timelineGrid = activeTab.down('timelineGrid'),
            inquiryGrid= activeTab.down('inquiryGrid'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            witnessgrid.down('button[name=add_offence]').setDisabled(true);
            investigationdiarygrid.down('button[name=add_charge]').setDisabled(true);
            newWitnessGrid.down('button[name=add_witness]').setDisabled(true);
            timelineGrid.down('button[name=add_timeline]').setDisabled(true);
            inquiryGrid.down('button[name=add_inquiry]').setDisabled(true);
            console.log(enforcement_id)
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/prepareInvestigationDairy',
                params: {
                    application_id: application_id,
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
                        // ltrResults = resp.ltrDetails,
                        model = Ext.create('Ext.data.Model', results);
                    // ltr_model = Ext.create('Ext.data.Model', ltrResults);
                    //console.log(results);
                    if (success == true || success === true) {
                        //complainantfrm.loadRecord(model);
                        //suspectinfoFrm.loadRecord(model);
                        viewWorkPlanFrm.loadRecord(model);
                        viewWorkPlanFrm.getForm().getFields().each(function (field) {
                            field.setReadOnly(true);
                        });
                        // activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        activeTab.down('hiddenfield[name=active_application_id]').setValue(application_id);
                        activeTab.down('hiddenfield[name=enforcement_id]').setValue(results.enforcement_id);
                        activeTab.down('hiddenfield[name=joint_investigation_id]').setValue(results.joint_investigation_id);
                        //
                        // localagentFrm.loadRecord(ltr_model);
                        // products_detailsfrm.loadRecord(model);
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
    submitDiaryFrm:function (btn) {
        var me = this,
		    mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            url = btn.action_url,
            table_name = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm();
            console.log(form);
            id = form.down('hiddenfield[name=id]');
        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {
                    table_name: table_name,
                   // application_id: application_id,
                    active_application_code: active_application_code,
                    _token: token
                },
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        record_id = response.record_id,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        //id.setValue(record_id);
                        store.removeAll();
                        store.load({params:{active_application_code:active_application_code}});
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    viewInvestigationDiaryRefreshGrid: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
           store.getProxy().extraParams = {
            active_application_code: active_application_code,
        }
    },
    viewNewRefreshGrid: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
           store.getProxy().extraParams = {
            active_application_code: active_application_code,
        }
    },
    viewProductDestructionRefreshGrid: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
           store.getProxy().extraParams = {
            application_code: active_application_code,
        }
    },
    viewProductSeizureRefreshGrid: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
           store.getProxy().extraParams = {
            application_code: active_application_code,
        }
    },
    viewApplicationDetails: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
           store.getProxy().extraParams = {
            application_code: active_application_code,
            workflow_stage_id: workflow_stage_id,
        }
    },
    saveCaseDecisions: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(), 
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(), 
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(), 
            formPnl = btn.up('form'),
            frm = formPnl.getForm(),
            store = Ext.getStore(btn.storeID),
            win = formPnl.up('window');

        if (frm.isValid()) {
            frm.submit({
                url: 'enforcement/saveCaseDecisions',
                params: {
                    application_code: application_code,
                    module_id: module_id,
                    workflow_stage_id: workflow_stage_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                waitMsg: 'Please wait...',
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        store.load();
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    saveExhibitRequesitionDetails: function (btn) {
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
            console.log(form);
        Ext.each(selected_records, function (item) {
            application_code = item.data.application_code;
            enforcement_id = item.data.enforcement_id;
            
            obj = {
                application_code: application_code,
                enforcement_id: enforcement_id
            };
             selected.push(obj);
        });
        if (frm.isValid()) {
            if (!sm.hasSelection()) {
                toastr.warning('Please select at least one application!!', 'Warning Response');
                return false;
            }
            frm.submit({
                //url: 'enforcement/saveWorkplanApplicationDetails',
                url: 'enforcement/saveExhibitRequisitionDetails',
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
                        request_id = response.request_id;
                    if (success == true || success === true) {
                        form.down('hiddenfield[name=request_id]').setValue(request_id);
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
    prepareExhibitionRequestsReceiving: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            // app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
            ExhibitionRequestfrm = activeTab.down('exhibitionRequestFrm'),
            request_id = ExhibitionRequestfrm.down('hiddenfield[name=request_id]'),
            workplanapplicationgrid = activeTab.down('workplanapplicationgrid'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        //     console.log(enforcement_id)
        // app_doc_types_store.removeAll();
        // app_doc_types_store.load({
        //     params: {
        //         process_id: process_id,
        //         workflow_stage: workflow_stage_id
        //     }
        // });

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                //url: 'enforcement/prepareWorkplan',
                url: 'enforcement/prepareExhibitRequest',
                params: {
                    application_id: application_id,
                    application_code: application_code,
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
                        // ltrResults = resp.ltrDetails,
                        model = Ext.create('Ext.data.Model', results);

                    //console.log(results);
                    if (success == true || success === true) {
                        ExhibitionRequestfrm.loadRecord(model);
                        activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        activeTab.down('hiddenfield[name=request_id]').setValue(request_id);
                        //
                        // localagentFrm.loadRecord(ltr_model);
                        // products_detailsfrm.loadRecord(model);
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
    prepareMonitoringReceiving: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            licenseInformationFrm = activeTab.down('licenseInformationFrm'),
            reg_premise_id = licenseInformationFrm.down('hiddenfield[name=reg_premise_id]').getValue(),
            premise_id = licenseInformationFrm.down('hiddenfield[name=premise_id]').getValue(),
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            console.log(reg_premise_id);
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/prepareMonitoringComplianceDetails',
                params: {
                    application_id: application_id,
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
                        enforcement_id =results['enforcement_id'];
                        reg_premise_id =results['reg_premise_id'];
                        premise_id =results['premise_id'];
                    
                        model = Ext.create('Ext.data.Model', results);
                    if (success == true || success === true) {
                        licenseInformationFrm.loadRecord(model);
                        licenseInformationFrm.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        licenseInformationFrm.down('hiddenfield[name=reg_premise_id]').setValue(reg_premise_id);
                        activeTab.down('hiddenfield[name=reg_premise_id]').setValue(reg_premise_id);
                        licenseInformationFrm.down('hiddenfield[name=premise_id]').setValue(premise_id);
                        activeTab.down('hiddenfield[name=premise_id]').setValue(premise_id);

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
    prepareHealthAssemsmentReceiving: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            // report_type_id =activeTab.down('hiddenfield[name=report_type_id]').getValue(),
            // app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            
console.log(application_code);
        // app_doc_types_store.removeAll();
        // app_doc_types_store.load({
        //     params: {
        //         process_id: process_id,
        //         workflow_stage: workflow_stage_id
        //     }
        // });

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/prepareHealthAssesmentDetails',
                params: {
                    application_id: application_id,
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

                        // activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
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
    saveMonitoringReceivingDetails: function (btn) {
        var me = this,
            mainTabPnl =me.getMainTabPanel(),
            activeTab = mainTabPnl.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            active_application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            licenseInformationFrm =activeTab.down('licenseInformationFrm'),
            enforcement_id = licenseInformationFrm.down('hiddenfield[name=enforcement_id]').getValue(),
            reg_premise_id = licenseInformationFrm.down('hiddenfield[name=reg_premise_id]').getValue(),
            premise_id = licenseInformationFrm.down('hiddenfield[name=premise_id]').getValue(),
            facility_reg =licenseInformationFrm.down('combo[name=is_facility_registered]').getValue();

            monitoringpremisepersonnelgrid= activeTab.down('monitoringpremisepersonnelgrid');
            myStore= monitoringpremisepersonnelgrid.getStore();

            console.log(myStore);
            if(facility_reg ==1 && reg_premise_id ==''){
                toastr.warning('Entity Registration No Not Found', 'Warning Response');
                return false;
            }
            console.log(enforcement_id);
           
        if (licenseInformationFrm.isValid()) {
            licenseInformationFrm.submit({
                url: 'enforcement/saveMonitoringReceivingDetails',
                waitMsg: 'Please wait...',
                params: {
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    active_application_id: active_application_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    section_id: section_id,
                    enforcement_id:enforcement_id,
                    reg_premise_id:reg_premise_id,
                    premise_id:premise_id
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
                        active_application_code = resp.application_code,
                        active_application_id = resp.active_application_id,
                        enforcement_id = resp.enforcement_id,
                        reference_no = resp.reference_no;
                        tracking_no = resp.tracking_no;
                        console.log(record_id);
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        licenseInformationFrm.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);    
                        licenseInformationFrm.down('hiddenfield[name=reg_premise_id]').setValue(reg_premise_id); 
                        licenseInformationFrm.down('hiddenfield[name=premise_id]').setValue(premise_id);   

                        activeTab.down('hiddenfield[name=active_application_id]').setValue(active_application_id);
                        activeTab.down('hiddenfield[name=active_application_code]').setValue(active_application_code);
                        activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        activeTab.down('displayfield[name=reference_no]').setValue(reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(tracking_no);
                        myStore.load();
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
    },
    showAnnualWorkPlansSelectionList: function (btn) {
        var me = this,
            childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            childObject = Ext.widget(childXtype),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(activeTab.down('applicationpmsplandetailsfrm')){
               var program_id = activeTab.down('hiddenfield[name=program_id]');
               //console.log('used normal loop');
            }else{
                var planProgramForm = Ext.ComponentQuery.query("#applicationpmsplandetailsfrmRefID")[0],
                    program_id = planProgramForm.down('hiddenfield[name=program_id]').getValue();
                    //console.log('reached the second loop for pms');
            }
           
            var section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),

            
            dosageFormCol = childObject.getColumnManager().getHeaderByDataIndex('dosage_form'),
            productFormCol = childObject.getColumnManager().getHeaderByDataIndex('product_form'),
            deviceTypeCol = childObject.getColumnManager().getHeaderByDataIndex('device_type');
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
        childObject.down('hiddenfield[name=section_id]').setValue(section_id);
        
        funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');
    },
    genericsaveDetails:function (btn) {
        var me = this,
		    mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            url = btn.action_url,
            table_name = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm();

        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {
                    table_name: table_name,
                    application_id: application_id,
                    application_code:application_code,
                    _token: token
                },
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        // record_id = response.record_id,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        store.load({params:{application_id:application_id}});
                        if(frm == 'monitoringpremisepersonnelfrm'){
                            dispensingComplianceGrid = activeTab.down('dispensingComplianceGrid'),
                            dispensStore = dispensingComplianceGrid.getStore();
                            dispensStore.load();
                        }
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    savePrescribingComplianceInformation:function (btn)
    {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            prescribingGrid = activeTab.down('prescribingComplianceGrid');
        this.commitPrescribingComplianceDetails(btn, application_id, application_code, prescribingGrid);
    },
    commitPrescribingComplianceDetails: function (btn, application_id, application_code, prescribingGrid) {
        // var checklist_type = prescribingGrid.down('combo[name=applicable_checklist]').getValue(),
            store = prescribingGrid.getStore(),
            params = [];
            
        for (var i = 0; i < store.data.items.length; i++) {
            var record = store.data.items [i],
                product_id = record.get('product_id');
                medicine_name = record.get('medicine_name'),
                patient_particulars = record.get('patient_particulars'),
                medicine_details = record.get('medicine_details'),
                prescriber_details = record.get('prescriber_details'),
                prescription_date = record.get('prescription_date'),
                facility_stamp = record.get('facility_stamp');
                console.log(product_id);
            var obj = {
                product_id:product_id,
                application_id: application_id,
                application_code: application_code,
                medicine_name: medicine_name,
                patient_particulars: patient_particulars,
                medicine_details: medicine_details,
                prescriber_details: prescriber_details,
                prescription_date:prescription_date,
                facility_stamp: facility_stamp,
                created_by: user_id,
            };
            if (record.dirty) {
                params.push(obj);
            }
        }
        console.log(params);
        if (params.length < 1) {
            toastr.warning('No records to save!!', 'Warning Response');
            return false;
        }
        params = JSON.stringify(params);
        Ext.Ajax.request({
            url: 'enforcement/savePrescribingComplianceDetails',
            params: {
                application_id: application_id,
                application_code: application_code,
                _token: token,
                prescribing_details: params
            },
            success: function (response) {
                Ext.getBody().unmask();
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
    saveDispensingComplianceInformation:function (btn)
    {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            dispensingGrid = activeTab.down('dispensingComplianceGrid');
        this.commitDispensingComplianceDetails(btn, application_id, application_code, dispensingGrid);
    },
    commitDispensingComplianceDetails: function (btn, application_id, application_code, dispensingGrid) {
        // var checklist_type = prescribingGrid.down('combo[name=applicable_checklist]').getValue(),
            store = dispensingGrid.getStore(),
            params = [];
        for (var i = 0; i < store.data.items.length; i++) {
            var record = store.data.items [i],
                personnel_id = record.get('personnel_id');
                dispensing_name = record.get('dispensing_name'),
                reg_number = record.get('reg_number'),
                invoice_no = record.get('invoice_no'),
                patient_name = record.get('patient_name'),
                dispensing_date = record.get('dispensing_date'),
                dispensed_packsize = record.get('dispensed_packsize'),
                dispenser_name_signature = record.get('dispenser_name_signature');
                
            var obj = {
                personnel_id:personnel_id,
                application_id: application_id,
                application_code: application_code,
                dispensing_name: dispensing_name,
                reg_number: reg_number,
                invoice_no: invoice_no,
                patient_name: patient_name,
                dispensing_date:dispensing_date,
                dispensed_packsize:dispensed_packsize,
                dispenser_name_signature: dispenser_name_signature,
                created_by: user_id,
            };
            if (record.dirty) {
                params.push(obj);
            }
        }
        console.log(params);
        if (params.length < 1) {
            toastr.warning('No records to save!!', 'Warning Response');
            return false;
        }
        params = JSON.stringify(params);
        Ext.Ajax.request({
            url: 'enforcement/saveDispensingComplianceDetails',
            params: {
                application_id: application_id,
                application_code: application_code,
                _token: token,
                dispensing_details: params
            },
            success: function (response) {
                Ext.getBody().unmask();
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
    addWitnessFrm:function (btn) {
        var me = this,
		    mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            pnl = activeTab.down('diaryPnl');
            console.log(activeTab);
            console.log(pnl);
            grid=pnl.down('investigationdiarygrid');
            console.log(grid);
            //pnl = Ext.widget('diaryPnl');
            //application_code = grid.down('hiddenfield[name=application_code]').getValue()
            application_id = pnl.down('hiddenfield[name=application_id]').getValue(),
            offence_id = grid.down('displayfield[name=offence_id]').getValue(),
            offennce_type = pnl.down('hiddenfield[name=offennce_type]').getValue();
           // active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            console.log(activeTab);
            console.log(offence_id);
            console.log(pnl);
            form = Ext.widget(btn.childXtype);
            winTitle=btn.winTitle,
            winWidth=btn.winWidth,
                childXtype = btn.childXtype,
                winTitle=btn.winTitle,
                winWidth=btn.winWidth,
            form.down('hiddenfield[name=application_id]').setValue(application_id);
            form.down('hiddenfield[name=offence_id]').setValue(offence_id);
            form.down('textfield[name=offennce_type]').setValue(offennce_type);
            funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
    },
    submitUpdatedOffenceWitnessFrm:function (btn) {
        var me = this,
		    mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            pnl = Ext.widget('diaryPnl');
            offence_id = pnl.down('displayfield[name=offence_id]').getValue();
            offennce_type = pnl.down('hiddenfield[name=offennce_type]').getValue();
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            url = btn.action_url,
            table_name = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm();
            console.log(active_application_code);
        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {
                    table_name: table_name,
                   application_id: application_id,
                    active_application_code: active_application_code,
                    offence_id:offence_id,
                    offennce_type:offennce_type,
                    _token: token
                },
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        // record_id = response.record_id,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        store.load({params:{active_application_code:active_application_code}});
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    saveSeizureWorkPlanDetails: function (btn) {
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
            console.log(form);
        Ext.each(selected_records, function (item) {
            application_code = item.data.application_code;
            enforcement_id = item.data.enforcement_id;
            
            obj = {
                application_code: application_code,
                enforcement_id: enforcement_id
            };
             selected.push(obj);
        });
        if (frm.isValid()) {
            if (!sm.hasSelection()) {
                toastr.warning('Please select at least one application!!', 'Warning Response');
                return false;
            }
            frm.submit({
                url: 'enforcement/saveSeizureWorkPlanDetails',
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
                        seizureplan_id = response.seizureplan_id;
                    if (success == true || success === true) {
                        form.down('hiddenfield[name=seizureplan_id]').setValue(seizureplan_id);
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
    prepareSeizureWorkPlanReceiving: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            // app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
             SeizureWorkPlamfrm = activeTab.down('seizureWorkPlanFrm'),
             seizureplan_id = SeizureWorkPlamfrm.down('hiddenfield[name=seizureplan_id]'),
            workplanapplicationgrid = activeTab.down('workplanapplicationgrid'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        //     console.log(enforcement_id)
        // app_doc_types_store.removeAll();
        // app_doc_types_store.load({
        //     params: {
        //         process_id: process_id,
        //         workflow_stage: workflow_stage_id
        //     }
        // });

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                //url: 'enforcement/prepareWorkplan',
                url: 'enforcement/prepareSeizureWorkPlan',
                params: {
                    application_id: application_id,
                    application_code: application_code,
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
                        // ltrResults = resp.ltrDetails,
                        model = Ext.create('Ext.data.Model', results);

                    //console.log(results);
                    if (success == true || success === true) {
                        SeizureWorkPlamfrm.loadRecord(model);
                        activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        activeTab.down('hiddenfield[name=seizureplan_id]').setValue(seizureplan_id);
                        //
                        // localagentFrm.loadRecord(ltr_model);
                        // products_detailsfrm.loadRecord(model);
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
    prepareSeizure: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            report_type_id =activeTab.down('hiddenfield[name=report_type_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
            complainantfrm = activeTab.down('complainantfrm'),
            suspectinfoFrm = activeTab.down('suspectinforFrm'),
            seizureWorkPlanFrm = activeTab.down('seizureWorkPlanFrm'),
            suspectedoffencegrid = activeTab.down('suspectedoffencegrid'),
           // enforcement_id = suspectinfoFrm.down('hiddenfield[name=enforcement_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            console.log(enforcement_id)

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/prepareSeizurePlanDetails',
                params: {
                    application_id: application_id,
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
                        // ltrResults = resp.ltrDetails,
                        model = Ext.create('Ext.data.Model', results);
                    // ltr_model = Ext.create('Ext.data.Model', ltrResults);
                    //console.log(results);
                    if (success == true || success === true) {
                        //complainantfrm.loadRecord(model);
                        //suspectinfoFrm.loadRecord(model);
                        seizureWorkPlanFrm.loadRecord(model);
                        seizureWorkPlanFrm.getForm().getFields().each(function (field) {
                            field.setReadOnly(true);
                        });
                        activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        activeTab.down('hiddenfield[name=active_application_id]').setValue(application_id);
                        //
                        // localagentFrm.loadRecord(ltr_model);
                        // products_detailsfrm.loadRecord(model);
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
    saveDestructionPlanDetails: function (btn) {
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
            console.log(form);
        Ext.each(selected_records, function (item) {
            application_code = item.data.application_code;
            enforcement_id = item.data.enforcement_id;
            product_id = item.data.id;
            
            obj = {
                application_code: application_code,
                enforcement_id: enforcement_id,
                product_id: product_id
            };
             selected.push(obj);
        });
        if (frm.isValid()) {
            if (!sm.hasSelection()) {
                toastr.warning('Please select at least one product!!', 'Warning Response');
                return false;
            }
            frm.submit({
                //url: 'enforcement/saveWorkplanApplicationDetails',
                url: 'enforcement/saveDestructionPlanDetails',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                params: {
                    application_code: application_code,
                    product_id:product_id,
                    selected: JSON.stringify(selected),
                },
                waitMsg: 'Please wait...',
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message,
                        request_id = response.request_id;
                    if (success == true || success === true) {
                        form.down('hiddenfield[name=request_id]').setValue(request_id);
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
    prepareDestructionReceiving: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            // app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
            destructionPlanFrm = activeTab.down('destructionPlanFrm'),
            request_id = destructionPlanFrm.down('hiddenfield[name=request_id]'),
            workplanapplicationgrid = activeTab.down('workplanapplicationgrid'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/prepareProductDestruction',
                params: {
                    application_id: application_id,
                    application_code: application_code,
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
                        // ltrResults = resp.ltrDetails,
                        model = Ext.create('Ext.data.Model', results);

                    //console.log(results);
                    if (success == true || success === true) {
                        destructionPlanFrm.loadRecord(model);
                        activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
                        activeTab.down('hiddenfield[name=request_id]').setValue(request_id);
                        //
                        // localagentFrm.loadRecord(ltr_model);
                        // products_detailsfrm.loadRecord(model);
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
    onNewJointOperationsApplication: function (sub_module_id,btn) {
        Ext.getBody().mask('Please wait...');

        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#enforcementDashWrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id =2,
            
            workflow_details = getInitialWorkflowDetails(module_id,section_id,sub_module_id,null,null,null,null);
           
        if (!workflow_details || workflow_details.length === 0) {
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
        dashboardWrapper.add(workflowContainer);
        //reload Stores 
        //console.log(section_id);
              Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    saveJointOperationsWorkPlanDetails: function (btn) {
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
            console.log(form);
        Ext.each(selected_records, function (item) {
            application_code = item.data.application_code;
            enforcement_id = item.data.enforcement_id;
            
            obj = {
                application_code: application_code,
                enforcement_id: enforcement_id
            };
             selected.push(obj);
        });
        if (frm.isValid()) {
            if (!sm.hasSelection()) {
                toastr.warning('Please select at least one application!!', 'Warning Response');
                return false;
            }
            frm.submit({
                url: 'enforcement/saveJointOperationsWorkPlanDetails',
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
                        seizureplan_id = response.seizureplan_id;
                    if (success == true || success === true) {
                        form.down('hiddenfield[name=seizureplan_id]').setValue(seizureplan_id);
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

    // prepareWorkplanReceiving: function (me) {
    //     Ext.getBody().mask('Please wait...');
    //     var me = this,
    //         mainTabPanel = me.getMainTabPanel(),
    //         activeTab = mainTabPanel.getActiveTab(),
    //         application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
    //         report_type_id =activeTab.down('hiddenfield[name=report_type_id]').getValue(),
    //         app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
    //         application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
    //         enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
    //         complainantfrm = activeTab.down('complainantfrm'),
    //         suspectinfoFrm = activeTab.down('suspectinforFrm'),
    //         viewWorkPlanFrm = activeTab.down('viewWorkPlanFrm'),
    //         suspectedoffencegrid = activeTab.down('suspectedoffencegrid'),
    //        // enforcement_id = suspectinfoFrm.down('hiddenfield[name=enforcement_id]').getValue(),
    //         process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
    //         section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
    //         sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
    //         filter = {section_id: section_id},
    //         workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
    //         console.log(enforcement_id)
    //     app_doc_types_store.removeAll();
    //     app_doc_types_store.load({
    //         params: {
    //             process_id: process_id,
    //             workflow_stage: workflow_stage_id
    //         }
    //     });

    //     if (application_id) {
    //         Ext.Ajax.request({
    //             method: 'GET',
    //             url: 'enforcement/prepareInvestigationDairy',
    //             params: {
    //                 application_id: application_id,
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
    //                     // ltrResults = resp.ltrDetails,
    //                     model = Ext.create('Ext.data.Model', results);
    //                 // ltr_model = Ext.create('Ext.data.Model', ltrResults);
    //                 //console.log(results);
    //                 if (success == true || success === true) {
    //                     //complainantfrm.loadRecord(model);
    //                     //suspectinfoFrm.loadRecord(model);
    //                     viewWorkPlanFrm.loadRecord(model);
    //                     viewWorkPlanFrm.getForm().getFields().each(function (field) {
    //                         field.setReadOnly(true);
    //                     });
    //                     activeTab.down('hiddenfield[name=enforcement_id]').setValue(enforcement_id);
    //                     activeTab.down('hiddenfield[name=active_application_id]').setValue(application_id);
    //                     //
    //                     // localagentFrm.loadRecord(ltr_model);
    //                     // products_detailsfrm.loadRecord(model);
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
    showCaseRegister: function (sub_module_id, wrapper_xtype) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down(wrapper_xtype);
            dashboardWrapper.removeAll();
        var enforcementRegisteredCasesGrid = Ext.widget('enforcementRegisteredCasesGrid');
        dashboardWrapper.add(enforcementRegisteredCasesGrid);
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    showjointOperationRegister: function (sub_module_id, wrapper_xtype) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down(wrapper_xtype);
            dashboardWrapper.removeAll();
        var jointOperationRegisterGrid = Ext.widget('jointOperationRegisterGrid');
        dashboardWrapper.add(jointOperationRegisterGrid);
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    showOffenceChargeFrm:function (btn) {
        var me = this,
		    mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            // pnl=Ext.widget('newworkplanreceiving');
            // pnl=activeTab.up('panel');
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            // console.log(pnl);
            console.log(application_id);
            form = Ext.widget(btn.childXtype);
            winTitle=btn.winTitle,
            winWidth=btn.winWidth,
            form.down('hiddenfield[name=application_id]').setValue(application_id);
            // form.down('hiddenfield[name=offence_id]').setValue(offence_id);
            OffenceStr = form.down('combo[name=offence_id]').getStore(),
            filters = JSON.stringify({application_id: application_id});
            OffenceStr.removeAll();
            OffenceStr.load({
                params:{
                    application_id:application_id
            }
        });
           
            funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
    },
    prepareCaseOffences: function(me){//me - the form
        application_id = me.down('hiddenfield[name=application_id]').getValue(),
        console.log(application_id);
        console.log(application_id);
        OffenceStr = me.down('combo[name=offence_id]').getStore(),
        filters = JSON.stringify({application_id: application_id});
        OffenceStr.removeAll();
        OffenceStr.load({
               params:{
                   application_id:application_id
           }
        });
    },
        prepareOffencesCharges: function(me){//me - the form
            pnl=me.up('panel');
            console.log(pnl);
            grid=pnl.down('grid');
            console.log(grid);
            offence_id = grid.down('displayfield[name=offence_id]').getValue(),
           console.log(offence_id);
          me.down('displayfield[name=offence_id]').setValue(offence_id);
        },
        showApplicationComplianceDetails : function(btn){
            var isReadOnly = btn.isReadOnly,
               is_temporal = btn.is_temporal,
               mainTabPanel = this.getMainTabPanel(),
               activeTab = mainTabPanel.getActiveTab();
               // console.log(activeTab);
               application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
               //  console.log(application_code);
               //product_id = activeTab.down('hiddenfield[name=product_id]').getValue(),
               application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
               ref_no = activeTab.down('displayfield[name=reference_no]').getValue(),
               process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
               workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
               module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
               sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
               section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
 
               //premise_type_id = activeTab.down('hiddenfield[name=premise_type_id]').getValue(),
               view = 'drugsProductsDetailsPnl';
               enforcement_view = 'enforcementDetailsPnl';
               if(module_id == 8){
                   this.showApplicationComplianceGenericDetails(application_code, 'complianceAssesmentDataPnl',module_id, sub_module_id,section_id,isReadOnly);
               }        
       },
       showApplicationComplianceGenericDetails: function (application_code,details_panel,module_id, sub_module_id,section_id,isReadOnly) {
           Ext.getBody().mask('Please wait...');
           var mainTabPanel = this.getMainTabPanel(),
               activeTab = mainTabPanel.getActiveTab(),
               ref_no = activeTab.down('displayfield[name=tracking_no]').getValue(),
               is_dataammendment_request =0;
           var me = this,
               details_panel = Ext.widget('complianceAssesmentDataPnl');
               details_panel.down('hiddenfield[name=module_id]').setValue(module_id);
               details_panel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
               details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
               details_panel.down('button[name=add_controlled_personnel]').setVisible(false);
               
           details_panel.height = Ext.Element.getViewportHeight() - 118;

           Ext.Ajax.request({
               method: 'GET',
               url: 'enforcement/getMonitoringComplianceData',
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
                       funcShowCustomizableWindow(ref_no, '60%', details_panel, 'customizablewindow');
                       if (enforcement_details) {
                           var model2 = Ext.create('Ext.data.Model', enforcement_details);
                           details_panel.getViewModel().set('model', model2);
                           details_panel.getViewModel().set('isReadOnly', true);
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
        showMonitoringComplianceRegister: function (sub_module_id, wrapper_xtype) {
            Ext.getBody().mask('Please wait...');
            var me = this,
                mainTabPanel = me.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                dashboardWrapper = activeTab.down(wrapper_xtype);
                dashboardWrapper.removeAll();
            var enforcementRegisteredCasesGrid = Ext.widget('complainceRegisterGrid');
            dashboardWrapper.add(enforcementRegisteredCasesGrid);
            Ext.Function.defer(function () {
                Ext.getBody().unmask();
            }, 300);
        },
        showMonitoringEnforcementAction: function (sub_module_id, wrapper_xtype) {
            Ext.getBody().mask('Please wait...');
            var me = this,
                mainTabPanel = me.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                dashboardWrapper = activeTab.down(wrapper_xtype);
                dashboardWrapper.removeAll();
            var monitoringenforcementActionGrid = Ext.widget('monitoringenforcementActionGrid');
            dashboardWrapper.add(monitoringenforcementActionGrid);
            Ext.Function.defer(function () {
                Ext.getBody().unmask();
            }, 300);
        },
        showJointOperationsRegister: function (sub_module_id, wrapper_xtype) {
            Ext.getBody().mask('Please wait...');
            var me = this,
                mainTabPanel = me.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                dashboardWrapper = activeTab.down(wrapper_xtype);
                dashboardWrapper.removeAll();
            var enforcementRegisteredCasesGrid = Ext.widget('jointOperationRegisterGrid');
            dashboardWrapper.add(enforcementRegisteredCasesGrid);
            Ext.Function.defer(function () {
                Ext.getBody().unmask();
            }, 300);
        },
        saveJointOperationReceivingDetails: function (btn) {
            var me = this,
                mainTabPnl =me.getMainTabPanel(),
                activeTab = mainTabPnl.getActiveTab(),
                process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
                module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
                sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
                workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
                active_application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
                //enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
                joint_operation_id = activeTab.down('hiddenfield[name=joint_operation_id]').getValue(),
                //
                //joint_operation_id
                // suspectinforfrm =activeTab.down('suspectinforFrm');
                jointOperationsWorkPlanFrm =activeTab.down('jointOperationsWorkPlanFrm');
               console.log(joint_operation_id);
    
            if (jointOperationsWorkPlanFrm.isValid()) {
                jointOperationsWorkPlanFrm.submit({
                    url: 'enforcement/saveJointOperationReceivingDetails',
                    waitMsg: 'Please wait...',
                    params: {
                        process_id: process_id,
                        workflow_stage_id: workflow_stage_id,
                        active_application_id: active_application_id,
                        module_id: module_id,
                        sub_module_id: sub_module_id,
                        section_id: section_id,
                        joint_operation_id:joint_operation_id
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
                            active_application_code = resp.application_code,
                            active_application_id = resp.active_application_id,
                            joint_operation_id = resp.joint_operation_id,
                            reference_no = resp.reference_no;
                            tracking_no = resp.tracking_no;
                            console.log(record_id);
                        if (success == true || success === true) {
                            toastr.success(message, "Success Response");
                            jointOperationsWorkPlanFrm.down('hiddenfield[name=joint_operation_id]').setValue(joint_operation_id);    

                            activeTab.down('hiddenfield[name=active_application_id]').setValue(active_application_id);
                            activeTab.down('hiddenfield[name=active_application_code]').setValue(active_application_code);
                            activeTab.down('hiddenfield[name=joint_operation_id]').setValue(joint_operation_id);
                            activeTab.down('displayfield[name=reference_no]').setValue(reference_no);
                            activeTab.down('displayfield[name=tracking_no]').setValue(tracking_no);
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
        },
        prepareJointOperationReceiving: function (me) {
            Ext.getBody().mask('Please wait...');
            var me = this,
                mainTabPanel = me.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
                app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
                application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                jointOperationsWorkPlanFrm = activeTab.down('jointOperationsWorkPlanFrm'),
                joint_operation_id = activeTab.down('hiddenfield[name=joint_operation_id]').getValue(),
                process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
                sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
                filter = {section_id: section_id},
                workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
    
            app_doc_types_store.removeAll();
            app_doc_types_store.load({
                params: {
                    process_id: process_id,
                    workflow_stage: workflow_stage_id
                }
            });
    
            if (application_id) {
                Ext.Ajax.request({
                    method: 'GET',
                    url: 'enforcement/prepareJointOperationReceiving',
                    params: {
                        application_id: application_id,
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
                            jointOperationsWorkPlanFrm.loadRecord(model);
                            activeTab.down('hiddenfield[name=joint_operation_id]').setValue(joint_operation_id);
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
        saveJoinOperationsParticipants: function (btn) {
            var grid = btn.up('grid'),
                win = grid.up('window'),
                mainTabPanel = this.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
                // form = activeTab.down('form'),
                // enforcement_id = form.down('hiddenfield[name=id]').getValue(),
                store = Ext.getStore('jointOperationActivitiesGridStr'),
                sm = grid.getSelectionModel(),
                selected_records = sm.getSelection(),
                selected = [],
                mask = new Ext.LoadMask(
                    {
                        target: grid,
                        msg: 'Please wait...'
                    }
                );
            // if (!enforcement_id) {
            //     toastr.warning('Please save plan details first!!', 'Warning Response');
            //     return false;
            // }
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
                url: 'enforcement/saveJointOperatiionsParticipants',
                params: {
                    selected: JSON.stringify(selected),
                    application_code: application_code,
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


        saveInvestigationComments: function (btn) {
            var mainTabPanel = this.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(), 
                module_id = activeTab.down('hiddenfield[name=module_id]').getValue(), 
                workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(), 
                formPnl = btn.up('form'),
                frm = formPnl.getForm(),
                store = Ext.getStore(btn.storeID),
                win = formPnl.up('window');
    
            if (frm.isValid()) {
                frm.submit({
                    url: 'enforcement/saveInvestigationComments',
                    params: {
                        application_code: application_code,
                        module_id: module_id,
                        workflow_stage_id: workflow_stage_id
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    waitMsg: 'Please wait...',
                    success: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            success = response.success,
                            message = response.message;
                        if (success == true || success === true) {
                            toastr.success(message, "Success Response");
                            store.removeAll();
                            store.load();
                            win.close();
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (form, action) {
                        var resp = action.result;
                        toastr.error(resp.message, 'Failure Response');
                    }
                });
            }
        },
        submitApproveFrm:function (btn) {
            var me = this,
                mainTabPanel = me.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
                url = btn.action_url,
                table_name = btn.table_name,
                form = btn.up('form'),
                win = form.up('window'),
                storeID = btn.storeID,
                store = Ext.getStore(storeID),
                frm = form.getForm();
                console.log(form);
                id = form.down('hiddenfield[name=approval_id]');
            if (frm.isValid()) {
                frm.submit({
                    url: url,
                    params: {
                        table_name: table_name,
                       // application_id: application_id,
                        active_application_code: active_application_code,
                        _token: token
                    },
                    waitMsg: 'Please wait...',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            success = response.success,
                            record_id = response.record_id,
                            message = response.message;
                        if (success == true || success === true) {
                            toastr.success(message, "Success Response");
                            id.setValue(record_id);
                            store.removeAll();
                            store.load({params:{active_application_code:active_application_code}});
                            win.close();
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (form, action) {
                        var resp = action.result;
                        toastr.error(resp.message, 'Failure Response');
                    }
                });
            }
        },
        showJointOffenceProductFrm:function (btn) {
            var me = this,
                mainTabPanel = me.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab();
               // pnl=Ext.widget('newworkplanreceiving');
                pnl=activeTab.up('panel');
                console.log(activeTab);
                console.log(pnl);
                active_application_code = pnl.down('hiddenfield[name=active_application_code]').getValue(),
                //
                console.log(activeTab);
                form = Ext.widget(btn.childXtype);
                winTitle=btn.winTitle,
                winWidth=btn.winWidth,
                form.down('hiddenfield[name=active_application_code]').setValue(active_application_code);
                // form.down('hiddenfield[name=offence_id]').setValue(offence_id);
                OffenceStr = form.down('combo[name=joint_offence_id]').getStore(),
                filters = JSON.stringify({active_application_code: active_application_code});
                OffenceStr.removeAll();
                OffenceStr.load({
                    params:{
                        active_application_code:active_application_code
                }
            });
                console.log(OffenceStr);
                console.log(filters);
                funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
        },

        prepareJointFacilityOffences: function(me){//me - the form
            active_application_code = me.down('hiddenfield[name=active_application_code]').getValue(),
            console.log(active_application_code);
           OffenceStr = me.down('combo[name=joint_offence_id]').getStore(),
           filters = JSON.stringify({active_application_code: active_application_code});
           OffenceStr.removeAll();
           OffenceStr.load({
               params:{
                active_application_code:active_application_code
           }
       });
           console.log(OffenceStr);
           console.log(filters);
        },
        showJointOperationSubmissionWin: function (btn) {
            btn.setLoading(true);
            //Ext.getBody().mask('Please wait...');
            var mainTabPanel = this.getMainTabPanel(),
                winWidth = btn.winWidth,
                activeTab = mainTabPanel.getActiveTab(),
                module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
                application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
                valid = true,
                // storeID = getApplicationStore(module_id, section_id),
                storeID = 'enforcementStr',
                table_name = getApplicationTable(module_id);
                summaryGrid =activeTab.down('summaryGrid');
                if(activeTab.down('summaryGrid')){
                    store = summaryGrid.getStore();
                    if(store.getTotalCount() < 1){
                        toastr.warning('Please enter the final decision', 'Warning Response');
                        btn.setLoading(false);
                        return false;
                    }
                    else{
                        showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
                    } 
                    btn.setLoading(false);
                }
                
        },
        signPlanDetails: function (item) {
            Ext.getBody().mask('Please wait...');
            var me = this;
                //is_update = item.is_update;
                var mainTabPanel = this.getMainTabPanel();
                //winWidth = btn.winWidth,
                activeTab = mainTabPanel.getActiveTab(),
                module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
                application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
                process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
                //btn = item.up('button'),
               // record = btn.getWidgetRecord(),
                //application_id = record.get('active_application_id'),
                //application_code = record.get('application_code'),
                //process_id = record.get('process_id'),
                //module_id = record.get('module_id'),
                //recommendation_id=record.get('recommendation_id'),
                // reg_product_id = record.get('reg_product_id'),
                //workflow_stage_id = record.get('workflow_stage_id'),
                table_name = item.table_name,
                approval_frm = item.approval_frm,
                form = Ext.widget(approval_frm),
                storeArray = eval(item.stores),
                arrayLength = storeArray.length;
              
            form.setController('enforcementvctr');
            if (arrayLength > 0) {
                me.fireEvent('refreshStores', storeArray);
            }
            if( form.down('datefield[name=expiry_date]')){
                form.down('datefield[name=expiry_date]').setReadOnly(true); 
            }
            form.down('hiddenfield[name=table_name]').setValue(table_name);
            form.down('hiddenfield[name=module_id]').setValue(module_id);
            //form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            // form.down('hiddenfield[name=reg_product_id]').setValue(reg_product_id);
            Ext.Ajax.request({
                method: 'GET',
                url: 'common/getApplicationApprovalDetails',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    module_id:module_id,
                    // sub_module_id:sub_module_id,
                    //recommendation_id:recommendation_id
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
                        form.down('hiddenfield[name=module_id]').setValue(module_id);
                       // form.down('hiddenfield[name=recommendation_id]').setValue(recommendation_id);
                       // form.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
                        funcShowCustomizableWindow('Recommendation', '60%', form, 'customizablewindow', item);
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
        submitWorkPlanFrm:function (btn) {
            var me = this,
                mainTabPanel = me.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
                url = btn.action_url,
                table_name = btn.table_name,
                form = btn.up('form'),
                win = form.up('window'),
                storeID = btn.storeID,
                store = Ext.getStore(storeID),
                frm = form.getForm();
                console.log(form);
                workplan_id = form.down('hiddenfield[name=workplan_id]');
            if (frm.isValid()) {
                frm.submit({
                    url: url,
                    params: {
                        table_name: table_name,
                       // application_id: application_id,
                        active_application_code: active_application_code,
                        _token: token
                    },
                    waitMsg: 'Please wait...',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            success = response.success,
                            record_id = response.record_id,
                            message = response.message;
                        if (success == true || success === true) {
                            toastr.success(message, "Success Response");
                            workplan_id.setValue(record_id);
                            store.removeAll();
                            store.load({params:{active_application_code:active_application_code}});
                            win.close();
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (form, action) {
                        var resp = action.result;
                        toastr.error(resp.message, 'Failure Response');
                    }
                });
            }
        },
        saveInvestigationReportFrm:function (btn) {
            var me = this,
                mainTabPanel = me.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
                url = btn.action_url,
                table_name = btn.table_name,
                form = btn.up('form'),
                win = form.up('window'),
                storeID = btn.storeID,
                store = Ext.getStore(storeID),
                frm = form.getForm();
            
               
            if (frm.isValid()) {
                frm.submit({
                    url: url,
                    params: {
                        table_name: table_name,
                        active_application_code: active_application_code,
                        _token: token
                    },
                    waitMsg: 'Please wait...',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            success = response.success,
                            record_id = response.record_id,
                            message = response.message;
                        if (success == true || success === true) {
                            toastr.success(message, "Success Response");
                          
                            store.removeAll();
                            store.load({params:{active_application_code:active_application_code}});
                            win.close();
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (form, action) {
                        var resp = action.result;
                        toastr.error(resp.message, 'Failure Response');
                    }
                });
            }
        },
        prepareExecutionDetails: function (me) {
            Ext.getBody().mask('Please wait...');
            var me = this,
                mainTabPanel = me.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
                report_type_id =activeTab.down('hiddenfield[name=report_type_id]').getValue(),
                application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                enforcement_id = activeTab.down('hiddenfield[name=enforcement_id]').getValue(),
               // enforcement_id = suspectinfoFrm.down('hiddenfield[name=enforcement_id]').getValue(),
                process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
                sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
                filter = {section_id: section_id},
                workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
                investigationReportFrm = activeTab.down('investigationReportFrm');
                
            if (application_id) {
                Ext.Ajax.request({
                    method: 'GET',
                    url: 'enforcement/prepareExecutionDetails',
                    params: {
                        application_id: application_id,
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success,
                            results = resp.results
                            model = Ext.create('Ext.data.Model', results);
                        if (success == true || success === true) {
                            activeTab.down('hiddenfield[name=enforcement_id]').setValue(results.enforcement_id);
                            activeTab.down('hiddenfield[name=joint_investigation_id]').setValue(results.joint_investigation_id);
                            investigationReportFrm.loadRecord(model);
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

    showCaseInvestigatorsFrm:function (btn) {
            var me = this,
                mainTabPanel = me.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab();
                // pnl=Ext.widget('newworkplanreceiving');
                // pnl=activeTab.up('panel');
                application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                // console.log(pnl);
                console.log(application_id);
                form = Ext.widget(btn.childXtype);
                winTitle=btn.winTitle,
                winWidth=btn.winWidth,
                form.down('hiddenfield[name=application_id]').setValue(application_id);
                // form.down('hiddenfield[name=offence_id]').setValue(offence_id);
                investigatorsStr = form.down('combo[name=assigned_officer]').getStore(),
                filters = JSON.stringify({application_id: application_id});
                investigatorsStr.removeAll();
                investigatorsStr.load({
                    params:{
                        application_id:application_id
                }
            });
               
                funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
        },

  prepareCaseInvestigators: function(me){//me - the form
   // var me = this,
    // mainTabPanel = me.getMainTabPanel(),
    // activeTab = mainTabPanel.getActiveTab();
    // application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            application_id = me.down('hiddenfield[name=application_id]').getValue(),
            console.log(application_id);
            //console.log(activeTab);
           investigatorsStr = me.down('combo[name=assigned_officer]').getStore(),
           filters = JSON.stringify({application_id: application_id});
           investigatorsStr.removeAll();
           investigatorsStr.load({
               params:{
                   application_id:application_id
           }
       });
           console.log(investigatorsStr);
           console.log(filters);
        },
        showWorkplanDetails: function (btn) {    
            var isReadOnly = btn.isReadOnly,
                mainTabPanel = this.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue(),
                is_dataammendment_request =0;
                application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
                application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
                module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
                sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
                

                view = 'drugsProductsDetailsPnl';
                enforcement_view = 'enforcementDetailsPnl'; 

                if(module_id=8){
                    this.showWorkplanDetailsGeneric(application_code,'newworkplanPnl',module_id, sub_module_id,section_id,isReadOnly);
                }
        },
        showWorkplanDetailsGeneric: function (application_code,details_panel,module_id, sub_module_id,section_id,isReadOnly) {
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
                workplanfrm =  details_panel.down('viewWorkPlanFrm');
               
            details_panel.height = Ext.Element.getViewportHeight() - 118;
            
            Ext.Ajax.request({
                method: 'GET',
                url: 'enforcement/prepareWorkplan',
                params: {
                    application_code: application_code,
                    application_id: application_id,
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results;
          
                    if (success == true || success === true) {
                        funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                        
                        if(results){
                            var model = Ext.create('Ext.data.Model', results);
        
                            workplanfrm.loadRecord(model);
                            details_panel.getViewModel().set('model', model);
                            details_panel.getViewModel().set('isReadOnly', false);
                        }
                        console.log(results);
                        // activeTab.down('hiddenfield[name=enforcement_id]').setValue(results.enforcement_id);    

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
    

});