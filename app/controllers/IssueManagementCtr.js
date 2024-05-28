Ext.define("Admin.controller.IssueManagementCtr", {
  extend: "Ext.app.Controller",

  config: {
    refs: [
      {
        ref: "mainPanel",
        selector: "maincontainerwrap",
      },
      {
        ref: "mainTabPanel",
        selector: "#contentPanel",
      },
    ],

    control: {
      "issuemanagementtb button[name=issuemanagementHomeBtn]": {
        click: "issueManagementHome",
      },
      "issuemanagementreceivingapplicationwizard button[name=prev_btn]": {
        click: "onPrevCardClick",
      },
      issuemanagementreceivingapplicationwizard: {
        afterrender: "launchIssueManagementReceivingApplicationWizard",
      },
    },
  },

  init: function () {},

  listen: {
    controller: {
      // This selector matches any originating Controller, you can specify controller name instead of *
      "*": {
        onNewIssueApplication: "onNewIssueApplication",
      },
    },
  },

  issueManagementHome: function (btn) {
    var me = this,
      mainTabPanel = me.getMainTabPanel(),
      sec_dashboard = btn.sec_dashboard,
      activeTab = mainTabPanel.getActiveTab(),
      dashboardWrapper = activeTab.down(btn.homeDashWrapper);
    if (!dashboardWrapper.down(sec_dashboard)) {
      dashboardWrapper.removeAll();
      dashboardWrapper.add({ xtype: sec_dashboard });
    }
  },

  onPrevCardClick: function (btn) {
    var mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      wizardPnl = activeTab.down("issuemanagementreceivingapplicationwizard");
    wizardPnl.getViewModel().set("atEnd", false);
    this.navigate(btn, wizardPnl, "prev");
  },

  onNewIssueApplication: function (
    sub_module_id,
    issue_type_id,
    wrapper_xtype,
    module_id
  ) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      mainTabPanel = me.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      dashboardWrapper = activeTab.down(wrapper_xtype),
      module_id = module_id;

    workflow_details = getIssueManagementWorkflowDetails(
      module_id,
      issue_type_id,
      sub_module_id
    );

    if (!workflow_details || workflow_details.length < 1) {
      Ext.getBody().unmask();
      toastr.warning(
        "Problem encountered while fetching workflow details-->Possibly workflow not set!!",
        "Warning Response"
      );
      return false;
    }

    dashboardWrapper.removeAll();

    var workflowContainer = Ext.widget(workflow_details.viewtype);

    workflowContainer
      .down("displayfield[name=process_name]")
      .setValue(workflow_details.processName);
    workflowContainer
      .down("displayfield[name=workflow_stage]")
      .setValue(workflow_details.initialStageName);
    workflowContainer
      .down("displayfield[name=application_status]")
      .setValue(workflow_details.initialAppStatus);
    workflowContainer
      .down("hiddenfield[name=process_id]")
      .setValue(workflow_details.processId);
    workflowContainer
      .down("hiddenfield[name=workflow_stage_id]")
      .setValue(workflow_details.initialStageId);
    workflowContainer.down("hiddenfield[name=module_id]").setValue(module_id);
    workflowContainer
      .down("hiddenfield[name=sub_module_id]")
      .setValue(sub_module_id);

    var issuemanagementfrm = workflowContainer.down("issuemanagementfrm");

    issuemanagementfrm
      .down("combo[name=issue_type_id]")
      .setValue(issue_type_id);
    issuemanagementfrm.down("combo[name=issue_status_id]").setValue(1);
    issuemanagementfrm
      .down("datefield[name=creation_date]")
      .setValue(new Date());
      
    // Calculate the date 10 days from now
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);

    // Set the target resolution date field to 10 days from now
    issuemanagementfrm
      .down("datefield[name=target_resolution_date]")
      .setValue(targetDate);

    dashboardWrapper.add(workflowContainer);

    Ext.Function.defer(function () {
      Ext.getBody().unmask();
    }, 300);
  },

  launchIssueManagementReceivingApplicationWizard: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl,
      application_status_id = activeTab
        .down("hiddenfield[name=application_status_id]")
        .getValue(),
      issuemanagementfrm = activeTab.down("issuemanagementfrm"),
      complainantdetailsfrm = activeTab.down("complainantdetailsfrm"),
      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab
        .down("hiddenfield[name=sub_module_id]")
        .getValue(),
      workflow_stage_id = activeTab
        .down("hiddenfield[name=workflow_stage_id]")
        .getValue();

    activeTab.down("button[name=recommendation]").setVisible(false);
    activeTab.down("button[name=approval]").setVisible(false);

    if (active_application_id) {
      Ext.Ajax.request({
        method: "GET",
        url: "issuemanagement/getIssueManagementDetailsById",
        params: {
          active_application_id: active_application_id,
        },
        headers: {
          Authorization: "Bearer " + access_token,
        },
        success: function (response) {
          Ext.getBody().unmask();
          var resp = Ext.JSON.decode(response.responseText),
            message = resp.message,
            success = resp.success,
            results = resp.results,
            model = Ext.create("Ext.data.Model", results);

          if (success == true || success === true) {
            issuemanagementfrm.loadRecord(model);
            complainantdetailsfrm.loadRecord(model);
            activeTab
              .down("displayfield[name=workflow_stage]")
              .setValue(results.workflow_stage);
            activeTab
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            issuemanagementfrm
              .down("datefield[name=creation_date]")
              .setValue(new Date(results.creation_date));
          } else {
            toastr.error(message, "Failure Response");
          }
        },
        failure: function (response) {
          Ext.getBody().unmask();
          var resp = Ext.JSON.decode(response.responseText),
            message = resp.message,
            success = resp.success;
          toastr.error(message, "Failure Response");
        },
        error: function (jqXHR, textStatus, errorThrown) {
          Ext.getBody().unmask();
          toastr.error("Error: " + errorThrown, "Error Response");
        },
      });
    } else {
      Ext.getBody().unmask();
    }
  },
});
