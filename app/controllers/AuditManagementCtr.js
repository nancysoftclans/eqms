Ext.define('Admin.controller.AuditManagementCtr',{
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
    control: {
        "auditPlanMainDetailsFrm button[action=search_audit_type]": {
        click: "showAuditTypes",
     },
        audittypesgrid: {
        itemdblclick: "onAuditTypesGridClick",
    },
    },

    /**
     * Called when the view is created
     */
    init: function () {

    },
    listen: {
        controller: {
            '*': {
                onInitiateNewAuditPlan:'onInitiateNewAuditPlan',
            }
        }
    },
   

    onInitiateNewAuditPlan: function(sub_module_id) {
        Ext.getBody().mask('Please wait...');

        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down("#auditManagementDashWrapperPnl"),
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

    showAuditTypes: function (btn) {
    var me = this,
      childXtype = btn.childXtype,
      winTitle = btn.winTitle,
      winWidth = btn.winWidth,
      mainTabPanel = me.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      activeTab = mainTabPanel.getActiveTab();

    if (activeTab.down("hiddenfield[name=section_id]")) {
      section_id = activeTab.down("hiddenfield[name=section_id]").getValue();
    }
    if (activeTab.down("hiddenfield[name=active_application_code]")) {
      section_id = activeTab
        .down("hiddenfield[name=active_application_code]")
        .getValue();
    }
    gmp_type_id = 0;
    var childObject = Ext.widget(childXtype);
    childObject.setHeight(450);

    if (childObject.down("hiddenfield[name=application_code]")) {
      childObject
        .down("hiddenfield[name=application_code]")
        .setValue(application_code);
    }
    funcShowCustomizableWindow(
      winTitle,
      winWidth,
      childObject,
      "customizablewindow"
    );
  },

  onAuditTypesGridClick: function (view, record, item, index, e, eOpts) {
    var me = this,
      grid = view.grid,
      folder_id = record.get("id"),
      win = grid.up("window"),
      mainTabPanel = me.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      mask = new Ext.LoadMask({
        msg: "Please wait...",
        target: win,
      });
    mask.show();
    var auditPlanMainDetailsFrm = activeTab.down("auditPlanMainDetailsFrm");

       auditPlanMainDetailsFrm.loadRecord(record);
   


    Ext.Function.defer(function () {
      mask.hide();
      win.close();
    }, 200);
  },
});