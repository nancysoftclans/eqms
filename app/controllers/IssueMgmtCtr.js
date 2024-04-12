Ext.define('Admin.controller.IssueMgmtCtr', {
    extend: 'Ext.app.Controller',

    config: {
        refs: [{
            ref: 'mainPanel',
            selector: 'maincontainerwrap'
        }, {
            ref: 'mainTabPanel',
            selector: '#contentPanel'
        }],


        
        control: {
           
            'customercomplaintreceivingwizard button[name=save-complaint-button]':{
                click: 'saveComplaintDetails'
            },
            'customercomplaintreceivingwizard button[action=process_submission_btn]': {
                click: 'saveComplaintApplicationSubmissionWin'
            },
            'customercomplaintbasicinfofrm': {
                afterrender: 'prepareNewComplaintAssessment',
            }
        }  
    },

    init: function () {

    },
  
    listen: {
        controller: {
            // This selector matches any originating Controller, you can specify controller name instead of *
            '*': {
                onNewIssueApplication: 'onNewIssueApplication',
            }
        }
    },


    onNewIssueApplication: function (sub_module_id, wrapper_xtype) {

        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down(wrapper_xtype),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = 0,
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id);
            
            // console.log(workflow_details, module_id, sub_module_id, section_id);

        if (!workflow_details || workflow_details.length < 1) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        dashboardWrapper.removeAll();

        
        var workflowContainer = Ext.widget(workflow_details.viewtype);
        // console.log(workflowContainer);
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

    saveComplaintDetails: function(){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            complaints_details_form = activeTab.down('customercomplaintbasicinfofrm').getForm(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            meeting_id = activeTab.down('hiddenfield[name=complaint_id]').getValue();


        //console.log(module_id, workflow_stage_id, process_id, complaints_details_form, sub_module_id);
        // console.log(application_id, meeting_id);

    if(complaints_details_form.isValid()) {
        complaints_details_form.submit({
            url: 'issuemanagement/saveNewReceivingBaseDetails',
            waitMsg: 'Please wait...',
            async: false,
            params: {
                workflow_stage_id: workflow_stage_id,
                application_id: application_id,
                module_id: module_id,
                sub_module_id: sub_module_id,
                process_id: process_id,
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
                    ref_no = resp.reference_no,
                    application_code = resp.application_code,
                    complaint_id = resp.complaint_id;
                if (success == true || success === true) {
                    
                        toastr.success(message, "Success Response");
                        activeTab.down('hiddenfield[name=active_application_id]').setValue(record_id);
                        activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
                        activeTab.down('displayfield[name=reference_no]').setValue(ref_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(ref_no);
                        activeTab.down('hiddenfield[name=complaint_id]').setValue(complaint_id);

                } else {
                    toastr.error(message, "Failure Response");
                    closeActiveWindow();
                }
            },
        })
    }
    },

    saveComplaintApplicationSubmissionWin: function(btn){
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            complaint_id = activeTab.down('hiddenfield[name=complaint_id]').getValue(),

            valid = true,
            storeID = 'drugproductregistrationstr',
            table_name = 'tra_issuemanagement_applications';

            if (!complaint_id) {
                Ext.getBody().unmask();
                toastr.warning('Save Complaint details first!!', 'Warning Response');
                return false;
            }
            
            if (valid == true || valid === true) {
               showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
            } else {
                Ext.getBody().unmask();
         }
    },

    prepareNewComplaintAssessment: function(){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        this.prepareComplaintForm(activeTab, 1);

    },

    prepareComplaintForm: function(activeTab, isReadOnly){
        var me = this,
            complaints_details_form = activeTab.down('customercomplaintbasicinfofrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            if (workflow_stage_id === 1443){
            complaints_details_form.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
           if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            complaints_details_form.getForm().getFields().each(function (field) {
                field.setReadOnly(true);
            });
            }
        }

            Ext.Ajax.request({
                method: 'GET',
                url: 'issuemanagement/getComplaintFormDetails',
                params: {
                    application_id: application_id,
                    table_name: 'tra_issuemanagement_applications'
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
                            var complaint_id = results.id;
                            complaints_details_form.loadRecord(model);
                            participantsStore.load();
                            activeTab.down('hiddenfield[name=complaint_id]').setValue(complaint_id);

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
    },








});