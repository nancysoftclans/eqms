Ext.define('Admin.controller.RMUCtr', {
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
            'newRMUReceivingWizard': {
                afterrender: 'prepareRMUReceiving'
            },
            'newRMUReceivingWizard button[name=process_submission_btn]': {
                click: 'showReceivingApplicationSubmissionWin'
            },
            'rmuTb button[name=rmuHomeBtn]': {
                click: 'RMUHome'
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
                InitiateNewRMUReceiving: 'InitiateNewRMUReceiving',
                addRMUAction:'addRMUAction',
                doSaveRMUResponseDetails: 'doSaveRMUResponseDetails',
                printSignedRMUResponse: 'printSignedRMUResponse'
            }
        }
    },
    InitiateNewRMUReceiving: function (btn) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            is_dataammendment_request = btn.is_dataammendment_request,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#rmuReceivingDashWrapperPnl'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, 8, 96);

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
        workflowContainer.down('hiddenfield[name=sub_module_id]').setValue(96);
        workflowContainer.down('hiddenfield[name=prodclass_category_id]').setValue(workflow_details.prodclass_category_id);
        workflowContainer.down('hiddenfield[name=section_id]').setValue(8);
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
     prepareRMUReceiving: function (me) {
        // this.updateVisibilityAccess(me);
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),

            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            // applicantFrm = activeTab.down('productapplicantdetailsfrm'),
            // localagentFrm = activeTab.down('productlocalapplicantdetailsfrm'),
            detailsFrm = activeTab.down('#rmuSubmissionDetailsFrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
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
        

        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'rmu/prepareNewRMUReceivingStage',
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
                        ltrResults = resp.ltrDetails,
                        model = Ext.create('Ext.data.Model', results);
                        // ltr_model = Ext.create('Ext.data.Model', ltrResults);

                    if (success == true || success === true) {
                        detailsFrm.loadRecord(model);
                        // applicantFrm.loadRecord(model);
                        //hide buttons for processing stages
                        if(model.get('stage_category_id') > 1){
                            vmodel = activeTab.down('rmuSubmissionDetailsPnl').getViewModel();
                            vmodel2 = activeTab.getViewModel();
                            vmodel.set('isReadOnly', true);
                            vmodel2.set('isReadOnly', true);
                            activeTab.down('button[name=add_action]').setVisible(true);
                        }
                        // localagentFrm.loadRecord(ltr_model);
                        activeTab.down('hiddenfield[name=invoice_id]').setValue(results.invoice_id);

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
    showReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            is_dataammendment_request =0,
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            storeID = 'intraystr';
            if(activeTab.down('hiddenfield[name=is_dataammendment_request]')){
                is_dataammendment_request = activeTab.down('hiddenfield[name=is_dataammendment_request]').getValue();
            }
        valid = this.validateNewRMUReceivingSubmission();
        if (valid) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID,'','','',workflow_stage_id,is_dataammendment_request);
          
        } else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Request Details!!', 'Warning Response');
            return;
        }
    },
     RMUHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#rmuReceivingDashWrapperPnl');
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: sec_dashboard});
        }
    },
    validateNewRMUReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            // applicantFrm = activeTab.down('productapplicantdetailsfrm'),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            // applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),

            productsDetailsFrm = activeTab.down('#rmuSubmissionDetailsFrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        // if (!applicant_id) {
        //     toastr.warning('Please Select Applicant!!', 'Warning Response');
        //     return false;
        // }
        if (!productsDetailsFrm.isValid()) {
            toastr.warning('Please Enter All the required Request Details!!', 'Warning Response');
            return false;
        }
        return true;
    },
    addRMUAction: function(btn){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            grid = Ext.widget('rmuSubmissionActionsGrid'),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
       
        grid.down('hiddenfield[name=application_code]').setValue(application_code);

        funcShowCustomizableWindow('Submission Actions', '50%', grid, 'customizablewindow', btn);

    },
    doSaveRMUResponseDetails: function(btn){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = btn.up('form'),
            frm = form.getForm(),
            mainStore = Ext.getStore(btn.storeID),
            win = form.up('window'),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
       
       if (frm.isValid()) {
            frm.submit({
                url: btn.action_url,
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                params: {
                    application_code: application_code
                },
                waitMsg: 'Please wait...',
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        mainStore.load();
                        toastr.success(message, "Success Response");
                        // win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error('Failure Response');
                }
            });
        }else{
            toastr.warning('Please provide a response first!!', 'Warning Response'); 
        }

    },
    printSignedRMUResponse: function(btn){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            
            
        previewCorrespondence(application_code, module_id,'RMU_Correspodences');
    },
});