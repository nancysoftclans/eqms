Ext.define('Admin.controller.RevenueManagementCtr', {
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
            'revenueManagementTb button[name=AdvancedCustomerHomeBtn]': {
                click: 'AdvancedCustomerHome'
            },
            'revenueRefundTb button[name=refundHomeBtn]': {
                click: 'RefundCustomerHome'
            },
            'pvgrid': {
                refresh: 'refreshPvMainGrids'
            },
            'refundInvoicesGrid': {
                refresh: 'refreshRefundInvoiceGrid'
            },
              'appliedRefundInvoicesGrid': {
                refresh: 'refreshAppliedRefundInvoiceGrid'
            },
            'invoicesReadyForApprovalGrid': {
                refresh: 'refreshAppliedRefundInvoiceGrid'
            },
            'pvSuspectedDrugGrid': {
                refresh: 'refreshGridsWithAppDetails'
            },
            'advancedCustomerApplicantSelectionGrid': {
                itemdblclick: 'onApplicantSelectionListDblClick'
            },
            'customerSelectionGrid': {
                itemdblclick: 'onCustomerSelectionListDblClick'
            },
            //meeting panel 
         
            'pvPeerMeetingApplicationListGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            'pvRcMeetingApplicationListGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            'advancedApplicationReceivingPnl button[name=save_btn]': {
                click: 'saveAdvancedCustomerReceivingDetails'
            },
            'refundApplicationReceivingPnl button[name=save_btn]': {
                click: 'saveInvoiceRefundReceivingDetails'
            },
            'advancedApplicationReceivingPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'refundApplicationReceivingPnl button[name=process_submission_btn]': {
                click: 'showRefundRequestSubmissionWin'
            },
            'advancedApplicationReceivingPnl':{
                afterrender: 'prepareadvancedApplicationReceiving'
            },
            'refundInvoicesGrid button[name=save_details]': {
                click: 'saveRefundInvoiceDetails'
            },
            'refundInvoicesGrid': {
                afterrender: 'prepareCustomerInvoices'
            },
            'advancedCustomerApplicationReceivingPnl':{
                afterrender: 'prepareadvancedCustomerApplicationReceiving'
            },
            'refundApplicationReceivingPnl':{
                afterrender: 'prepareRefundApplicationReceiving'
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
                showNewApplication: 'showNewApplication',
                getCustomerApplicationApprovalDetails:'getApplicationApprovalDetails',
                showNewRefundApplication: 'showNewRefundApplication',
               // funcActiveOtherPvInformationTab: 'funcActiveOtherPvInformationTab'
                // showDynamicSelectionList: 'showDynamicSelectionList',
                // LoadCallerForm: 'LoadCallerForm',
                // viewApplicationRecommendationLogs: 'viewApplicationRecommendationLogs',
                // onReProductRegApplication: 'onReProductRegApplication',
                // doSaveResearchFindings: 'doSaveResearchFindings'
              
            }
        }
    },
    showNewApplication: function (sub_module_id, btn, section_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            is_dataammendment_request = btn.is_dataammendment_request,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#revenueManagementWrapperPnl'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id, is_dataammendment_request);

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
        workflowContainer.down('hiddenfield[name=prodclass_category_id]').setValue(workflow_details.prodclass_category_id);
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
    showNewRefundApplication: function (sub_module_id, btn, section_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            is_dataammendment_request = btn.is_dataammendment_request,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#revenueRefundWrapperPnl'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id, is_dataammendment_request);

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
        workflowContainer.down('hiddenfield[name=prodclass_category_id]').setValue(workflow_details.prodclass_category_id);
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
     AdvancedCustomerHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#revenueManagementWrapperPnl');
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: sec_dashboard});
        }
    },
    RefundCustomerHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#revenueRefundWrapperPnl');
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: sec_dashboard});
        }
    },
    refreshPvMainGrids: function (me) {

        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
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
    refreshGridsWithAppDetails: function (me) {

        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            is_other_drugs_used = grid.is_other_drugs_used;

            store.getProxy().extraParams = {
                module_id: module_id,
                sub_module_id: sub_module_id,
                section_id: section_id,
                workflow_stage_id: workflow_stage_id,
                application_code: application_code,
                is_other_drugs_used: is_other_drugs_used
            };

    },
  
    preparePvMeetingDetailsGeneric: function (activeTab, applicationsGrid, isReadOnly) {
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
                url: 'common/prepareRegMeetingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    workflow_stage_id: workflow_stage_id,
                    table_name: 'tra_pv_applications'
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
    //save meeting details 
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
                toastr.warning('Please select at least one report!!', 'Warning Response');
                return false;
            }
            frm.submit({
                url: 'common/saveTCMeetingDetails',
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
    onApplicantSelectionListDblClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            win = grid.up('window'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantForm = activeTab.down('advancedCustomerApplicantDetailsfrm'),
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
    onCustomerSelectionListDblClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            win = grid.up('window'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            customerFrm = activeTab.down('#customerFrm'),
            mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: win
            });
        mask.show();
        customerFrm.loadRecord(record);
        Ext.Function.defer(function () {
            mask.hide();
            win.close();
        }, 200);
    },

    saveAdvancedCustomerReceivingDetails: function (btn) {
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
            advancedCustomerApplicantDetailsfrm =activeTab.down('#customerFrm');

        if (advancedCustomerApplicantDetailsfrm.isValid()) {
            advancedCustomerApplicantDetailsfrm.submit({
                url: 'revenuemanagement/saveAdvancedCustomerReceivingDetails',
                waitMsg: 'Please wait...',
                params: {
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    active_application_id: active_application_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    section_id: section_id,
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
                        reference_no = resp.reference_no;
                        tracking_no = resp.tracking_no;
                        console.log(record_id);
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        activeTab.down('hiddenfield[name=active_application_id]').setValue(active_application_id);
                        activeTab.down('hiddenfield[name=active_application_code]').setValue(active_application_code);
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
    
    prepareadvancedApplicationReceiving: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            customerFrm = activeTab.down('#customerFrm'),
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
                url: 'revenuemanagement/prepareadvancedApplicationReceiving',
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
                        customerFrm.loadRecord(model);
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
                if (success == true || success === true) {
                    form.loadRecord(model);
                    form.down('hiddenfield[name=application_id]').setValue(application_id);
                    form.down('hiddenfield[name=application_code]').setValue(application_code);
                    form.down('hiddenfield[name=process_id]').setValue(process_id);
                    form.down('hiddenfield[name=module_id]').setValue(module_id);
                    form.down('hiddenfield[name=recommendation_id]').setValue(recommendation_id);
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
    
    saveInvoiceRefundReceivingDetails: function (btn) {
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
            CustomerApplicantDetailsfrm =activeTab.down('#customerFrm');
            invoicesGrid =activeTab.down('refundInvoicesGrid');
            applicant_id = CustomerApplicantDetailsfrm.down('hiddenfield[name=applicant_id]').getValue();

        if (CustomerApplicantDetailsfrm.isValid()) {
            CustomerApplicantDetailsfrm.submit({
                url: 'revenuemanagement/saveInvoiceRefundReceivingDetails',
                waitMsg: 'Please wait...',
                params: {
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    active_application_id: active_application_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    section_id: section_id,
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
                        reference_no = resp.reference_no;
                        tracking_no = resp.tracking_no;
                        console.log(record_id);
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        activeTab.down('hiddenfield[name=active_application_id]').setValue(active_application_id);
                        activeTab.down('hiddenfield[name=active_application_code]').setValue(active_application_code);
                        activeTab.down('displayfield[name=reference_no]').setValue(reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(tracking_no);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(applicant_id);
                        invoicesGrid.down('hiddenfield[name=applicant_id]').setValue(applicant_id);
                        gridStr = invoicesGrid.store;
                        gridStr.removeAll();
                        gridStr.load({
                            params:{
                             applicant_id:applicant_id
                        }
                    });
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
    refreshRefundInvoiceGrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicant_id =activeTab.down('hiddenfield[name=applicant_id]').getValue();
            console.log(applicant_id);
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue();
            store.getProxy().extraParams = {
                applicant_id: applicant_id,

            };

    },
    refreshAppliedRefundInvoiceGrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            active_application_code =activeTab.down('hiddenfield[name=active_application_code]').getValue();
            console.log(active_application_code);
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue();
            store.getProxy().extraParams = {
                active_application_code: active_application_code,

            };

    },

    saveRefundInvoiceDetails: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('#customerFrm'),
            toaster = btn.toaster,
            frm = form.getForm(),
            invoicesGrid = activeTab.down('refundInvoicesGrid'),
            sm = invoicesGrid.getSelectionModel(),
            selected_records = sm.getSelection(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            applicationsStore = invoicesGrid.getStore(),
            selected = [];
        Ext.each(selected_records, function (item) {
            //selected.push(item.data.application_code);
            //application_code = item.data.application_code;
            invoice_id = item.data.invoice_id;
            invoice_no = item.data.invoice_no;
            obj = {
                //application_code: application_code,
                invoice_id: invoice_id,
                invoice_no: invoice_no
            };
             selected.push(obj);
        });
        if (frm.isValid()) {
            if (!sm.hasSelection()) {
                toastr.warning('Please select at least one application!!', 'Warning Response');
                return false;
            }
            frm.submit({
               // url: 'enforcement/saveTCMeetingDetails',
                url: 'revenuemanagement/saveRefundInvoicesDetails',
                params: {
                    application_code: application_code,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    workflow_stage_id: workflow_stage_id,
                    section_id: section_id,
                    _token: token,
                    selected: JSON.stringify(selected),
                },
                waitMsg: 'Please wait...refund_invoicesGrid',
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
    prepareCustomerInvoices: function(me){//me - the form
        mainTabPanel = this.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab(),
        applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue(),
        console.log(applicant_id);
       //gridStr = me.down.getStore(),
       gridStr = me.store,
       //filters = JSON.stringify({applicant_id: applicant_id});
       gridStr.removeAll();
       gridStr.load({
           params:{
            applicant_id:applicant_id
       }
   });
       console.log(gridStr);
       //console.log(filters);
    },

    showRefundRequestSubmissionWin: function (btn) {
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

    prepareadvancedCustomerApplicationReceiving: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            customerFrm = activeTab.down('#customerFrm');
           console.log(customerFrm);
            console.log(activeTab);

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'revenuemanagement/prepareadvancedCustomerApplicationReceiving',
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
                        model = Ext.create('Ext.data.Model', results);
                       console.log(results);
                    if (success == true || success === true) {
                        customerFrm.loadRecord(model);
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
    prepareRefundApplicationReceiving: function (me) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            customerFrm = activeTab.down('#customerFrm');
         

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'revenuemanagement/prepareadvancedCustomerApplicationReceiving',
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
                        model = Ext.create('Ext.data.Model', results);
                       console.log(results);
                    if (success == true || success === true) {
                        customerFrm.loadRecord(model);
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
});