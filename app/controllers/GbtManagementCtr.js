Ext.define('Admin.controller.GbtManagementCtr',{
    extend: 'Ext.app.Controller',
    stores: [],
    config: {
        refs: [{
            ref: 'mainPanel',
            selector: 'maincontainerwrap'
        },{
            ref: 'mainTabPanel',
            selector: '#contentPanel'
        }],
        
    },
    

    /**
     * Called when the view is created
     */
    init: function () {

    },
    listen: {
        controller: {
            '*': {
                onInitiateNewGbt:'onInitiateNewGbt',
                
            }
        }
    },
   

    onInitiateNewGbt: function(sub_module_id) {
        Ext.getBody().mask('Please wait...');

        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down("#gbtDashWrapperPnl"),
            module_id = activeTab.down("hiddenfield[name=module_id]").getValue();
        
            workflow_details = getInitialWorkflowDetails(module_id, sub_module_id);
            if (!workflow_details) {
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
            dashboardWrapper.add(workflowContainer);
            Ext.Function.defer(function () {
                Ext.getBody().unmask();
            }, 300);
            // workflowContainer.getViewModel().set({readOnly:false});
    },
})