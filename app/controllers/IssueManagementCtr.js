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
      "issuereceivingwizard button[name=prev_btn]": {
        click: "onPrevCardClick",
      },
      issuemanagementfrm: {
        beforerender: "prepareInterfaceBasedonConfig",
      },
      issuereceivingwizard: {
        afterrender: "launchissuereceivingWizard",
      },
      issueresolutiongwizard: {
        afterrender: "prepapreIssueResolutionReview",
      },
      issuequalityreviewwizard: {
        afterrender: "prepapreIssueQualityOfficeReview",
      },
      issuemanagementwwizard: {
        afterrender: "prepapreIssueManagementPreview",
      },
      "issuemanagementorgareasgrid button[name=select_orgarea_btn]": {
        click: "showIssueManagementAssociatedWin",
      },
      "issuemanagementdocgrid button[name=select_document]": {
        click: "showIssueManagementAssociatedWin",
      },
      "issuemanagementdocgrid button[name=add_upload]": {
        click: "showIssueManagementAssociatedDocWin",
      },
      "issuemanagementissuegrid button[name=select_issue_btn]": {
        click: "showIssueManagementAssociatedWin",
      },
      "issuemanagementauditgrid button[name=select_audit_btn]": {
        click: "showIssueManagementAssociatedWin",
      },
      "issueactionplangrid button[name=add_action_plan_btn]": {
        click: "showIssueManagementAssociatedWin",
      },
      "issueselectdocumentfrm button[name=save_issuedocument_btn]": {
        click: "saveIssueManagementAssociatedDetails",
      },
      "selectissueform button[name=save_issue_btn]": {
        click: "saveIssueManagementAssociatedDetails",
      },
      "issueauditform button[name=save_audit_btn]": {
        click: "saveIssueManagementAssociatedDetails",
      },
      "issueselectorgareafrm button[name=save_orgarea_btn]": {
        click: "saveIssueManagementAssociatedDetails",
      },
      "addactionplanform button[name=save_action_plan_btn]": {
        click: "saveIssueManagementAssociatedDetails",
      },
      issuemanagementorgareasgrid: {
        refresh: "refreshGrid",
      },
      issuemanagementdocgrid: {
        refresh: "refreshGrid",
      },
      issuemanagementissuegrid: {
        refresh: "refreshGrid",
      },
      issuemanagementauditgrid: {
        refresh: "refreshGrid",
      },
      issueactivitygrid: {
        refresh: "refreshGrid",
      },
      issueactionplangrid: {
        refresh: "refreshGrid"
      },
      issuechecklistgrid: {
        refresh: "refreshGrid"
      },
      'issuechecklistgrid button[name=savegrid_screening_btn]': {
        click: 'saveApplicationChecklistDetails'
      },
    },
  },

  init: function () { },

  listen: {
    controller: {
      "*": {
        onNewIssueApplication: "onNewIssueApplication",
        showIssueManagementSubmissionWin: "showIssueManagementSubmissionWin",
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

  AddGeneralComment: function (argument) {
    var form = Ext.widget("applicationcommentsFrm");
    funcShowCustomizableWindow(
      "Issue Recommendation",
      "50%",
      form,
      "customizablewindow"
    );
  },

  onPrevCardClick: function (btn) {
    var mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      wizardPnl = activeTab.down("issuereceivingwizard");
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
    workflowContainer
      .down("hiddenfield[name=issue_type_id]")
      .setValue(issue_type_id);

    dashboardWrapper.add(workflowContainer);

    Ext.Function.defer(function () {
      Ext.getBody().unmask();
    }, 300);
  },

  launchissuereceivingWizard: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var activeTab = pnl,
      issuemanagementfrm = activeTab.down("issuemanagementfrm"),
      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue();

    activeTab.down("button[name=recommendation]").setVisible(false);
    active_application_id = parseInt(active_application_id);
    if (!isNaN(active_application_id)) {
      Ext.Ajax.request({
        method: "GET",
        url:
          "issuemanagement/getIssueManagementDetailsById/" +
          active_application_id,
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
            activeTab
              .down("displayfield[name=workflow_stage]")
              .setValue(results.workflow_stage);
            activeTab
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            if (
              issuemanagementfrm.down(
                "radiogroup[name=complaint_direct_or_indirect]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=complaint_direct_or_indirect]")
                .setValue({
                  complaint_direct_or_indirect:
                    results.complaint_direct_or_indirect,
                });
            }
            if (
              issuemanagementfrm.down(
                "radiogroup[name=deviation_plannedorunplanned]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=deviation_plannedorunplanned]")
                .setValue({
                  deviation_plannedorunplanned:
                    results.deviation_plannedorunplanned,
                });
            }
            if (
              issuemanagementfrm.down(
                "radiogroup[name=complaint_fully_addressed]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=complaint_fully_addressed]")
                .setValue({
                  complaint_fully_addressed: results.complaint_fully_addressed,
                });
            }
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

  showIssueManagementSubmissionWin: function (btn) {
    Ext.getBody().mask("Please wait...");
    var mainTabPanel = this.getMainTabPanel(),
      storeID = btn.storeID,
      table_name = btn.table_name,
      winWidth = btn.winWidth,
      activeTab = mainTabPanel.getActiveTab(),
      workflow_stage_id = activeTab
        .down("hiddenfield[name=workflow_stage_id]")
        .getValue(),
      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue(),
      application_code = activeTab
        .down("hiddenfield[name=active_application_code]")
        .getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = activeTab
        .down("hiddenfield[name=sub_module_id]")
        .getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      valid = this.validateNewReceivingSubmission();

    if (valid === true) {
      showWorkflowSubmissionWin(
        active_application_id,
        application_code,
        table_name,
        "workflowsubmissionsreceivingfrm",
        winWidth,
        storeID,
        "",
        "",
        "",
        workflow_stage_id
      );
    } else {
      Ext.getBody().unmask();
      toastr.warning(
        "Please Enter All the required Details!!",
        "Warning Response"
      );
      return;
    }
  },

  validateNewReceivingSubmission: function (btn) {
    var mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue();

    if (!active_application_id) {
      toastr.error("Please Save Application Details!!", "Warning Response");
      return false;
    }

    return true;
  },

  prepapreIssueResolutionReview: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var activeTab = pnl,
      issuemanagementfrm = activeTab.down("issuemanagementfrm"),
      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue();

    if (active_application_id) {
      Ext.Ajax.request({
        method: "GET",
        url:
          "issuemanagement/getIssueManagementDetailsById/" +
          active_application_id,
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
            activeTab
              .down("displayfield[name=workflow_stage]")
              .setValue(results.workflow_stage);
            activeTab
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            if (
              issuemanagementfrm.down(
                "radiogroup[name=complaint_direct_or_indirect]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=complaint_direct_or_indirect]")
                .setValue({
                  complaint_direct_or_indirect:
                    results.complaint_direct_or_indirect,
                });
            }
            if (
              issuemanagementfrm.down(
                "radiogroup[name=deviation_plannedorunplanned]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=deviation_plannedorunplanned]")
                .setValue({
                  deviation_plannedorunplanned:
                    results.deviation_plannedorunplanned,
                });
            }
            if (
              issuemanagementfrm.down(
                "radiogroup[name=complaint_fully_addressed]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=complaint_fully_addressed]")
                .setValue({
                  complaint_fully_addressed: results.complaint_fully_addressed,
                });
            }
            // issuemanagementfrm
            //   .getForm()
            //   .getFields()
            //   .each(function (field) {
            //     field.setReadOnly(true);
            //   });
          } else {
            toastr.error(message, "Failure Response");
          }
        },
        failure: function (response) {
          Ext.getBody().unmask();
          var resp = Ext.JSON.decode(response.responseText),
            message = resp.message;
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

  prepapreIssueQualityOfficeReview: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var activeTab = pnl,
      issuemanagementfrm = activeTab.down("issuemanagementfrm"),
      issuechecklistgrid = activeTab.down("issuechecklistgrid"),
      issueactionplangrid = activeTab.down("issueactionplangrid"),
      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue();

    if (active_application_id) {
      Ext.Ajax.request({
        method: "GET",
        url:
          "issuemanagement/getIssueManagementDetailsById/" +
          active_application_id,
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
            activeTab
              .down("displayfield[name=workflow_stage]")
              .setValue(results.workflow_stage);
            activeTab
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            if (
              issuemanagementfrm.down(
                "radiogroup[name=complaint_direct_or_indirect]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=complaint_direct_or_indirect]")
                .setValue({
                  complaint_direct_or_indirect:
                    results.complaint_direct_or_indirect,
                });
            }
            if (
              issuemanagementfrm.down(
                "radiogroup[name=deviation_plannedorunplanned]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=deviation_plannedorunplanned]")
                .setValue({
                  deviation_plannedorunplanned:
                    results.deviation_plannedorunplanned,
                });
            }
            if (
              issuemanagementfrm.down(
                "radiogroup[name=complaint_fully_addressed]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=complaint_fully_addressed]")
                .setValue({
                  complaint_fully_addressed: results.complaint_fully_addressed,
                });
            }
            //Enable/Disable Action Plans/Checlists
            Ext.Ajax.request({
              method: "GET",
              url:
                "issuemanagement/issue_types/" +
                results.issue_type_id,
              headers: {
                Authorization: "Bearer " + access_token,
              },
              success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText);

                if (resp.is_checklist_tied != 1) {
                  issuechecklistgrid.destroy();
                }
                if (resp.has_action_plan != 1) {
                  issueactionplangrid.destroy();
                }
              },
              failure: function (response) {
              },
              error: function (jqXHR, textStatus, errorThrown) {
              },
            });
          } else {
            toastr.error(message, "Failure Response");
          }
        },
        failure: function (response) {
          Ext.getBody().unmask();
          var resp = Ext.JSON.decode(response.responseText),
            message = resp.message;
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
  prepapreIssueManagementPreview: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var activeTab = pnl,
      issuemanagementfrm = activeTab.down("issuemanagementfrm"),
      issuemanagementdocgrid = activeTab.down("issuemanagementdocgrid"),
      issuemanagementissuegrid = activeTab.down("issuemanagementissuegrid"),
      issuemanagementauditgrid = activeTab.down("issuemanagementauditgrid"),
      issuemanagementorgareasgrid = activeTab.down("issuemanagementorgareasgrid"),

      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue();
    issuemanagementdocgrid.down("button[name=add_upload]").setVisible(false);
    issuemanagementdocgrid.down("button[name=select_document]").setVisible(false);
    issuemanagementissuegrid.down("button[name=select_issue_btn]").setVisible(false);
    issuemanagementauditgrid.down("button[name=select_audit_btn]").setVisible(false);
    issuemanagementorgareasgrid.down("button[name=select_orgarea_btn]").setVisible(false);
    issuemanagementfrm
      .getForm()
      .getFields()
      .each(function (field) {
        field.setReadOnly(true);
      });
    if (active_application_id) {
      Ext.Ajax.request({
        method: "GET",
        url:
          "issuemanagement/getIssueManagementDetailsById/" +
          active_application_id,
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
            activeTab
              .down("displayfield[name=workflow_stage]")
              .setValue(results.workflow_stage);
            activeTab
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            if (
              issuemanagementfrm.down(
                "radiogroup[name=complaint_direct_or_indirect]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=complaint_direct_or_indirect]")
                .setValue({
                  complaint_direct_or_indirect:
                    results.complaint_direct_or_indirect,
                });
            }
            if (
              issuemanagementfrm.down(
                "radiogroup[name=deviation_plannedorunplanned]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=deviation_plannedorunplanned]")
                .setValue({
                  deviation_plannedorunplanned:
                    results.deviation_plannedorunplanned,
                });
            }
            if (
              issuemanagementfrm.down(
                "radiogroup[name=complaint_fully_addressed]"
              )
            ) {
              issuemanagementfrm
                .down("radiogroup[name=complaint_fully_addressed]")
                .setValue({
                  complaint_fully_addressed: results.complaint_fully_addressed,
                });
            }
            issuemanagementfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });
          } else {
            toastr.error(message, "Failure Response");
          }
        },
        failure: function (response) {
          Ext.getBody().unmask();
          var resp = Ext.JSON.decode(response.responseText),
            message = resp.message;
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
  prepareInterfaceBasedonConfig: function (me) {
    //me - the form
    var frm_cont = me.up("panel"),
      wizard = frm_cont.up("panel"),
      mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      is_register = me.is_register,
      premise_type_id,
      prodclass_category_id,
      importexport_permittype_id,
      start_index = 1;

    if (wizard.down("hiddenfield[name=module_id]")) {
      if (wizard.down("hiddenfield[name=module_id]").getValue()) {
        var module_id = wizard.down("hiddenfield[name=module_id]").getValue(),
          sub_module_id = wizard
            .down("hiddenfield[name=sub_module_id]")
            .getValue(),
          // section_id = wizard.down('hiddenfield[name=section_id]').getValue(),
          issue_type_id = wizard
            .down("hiddenfield[name=issue_type_id]")
            .getValue(),
          active_application_id = wizard
            .down("hiddenfield[name=active_application_id]")
            .getValue();
        if (wizard.down("hiddenfield[name=prodclass_category_id]")) {
          prodclass_category_id = wizard
            .down("hiddenfield[name=prodclass_category_id]")
            .getValue();
        }
        if (wizard.down("hiddenfield[name=importexport_permittype_id]")) {
          importexport_permittype_id = wizard
            .down("hiddenfield[name=importexport_permittype_id]")
            .getValue();
        }
      } else {
        var wizard = wizard.up(),
          module_id = wizard.down("hiddenfield[name=module_id]").getValue(),
          sub_module_id = wizard
            .down("hiddenfield[name=sub_module_id]")
            .getValue(),
          section_id = wizard.down("hiddenfield[name=section_id]").getValue();

        if (wizard.down("hiddenfield[name=prodclass_category_id]")) {
          prodclass_category_id = wizard
            .down("hiddenfield[name=prodclass_category_id]")
            .getValue();
        }
        if (wizard.down("hiddenfield[name=importexport_permittype_id]")) {
          importexport_permittype_id = wizard
            .down("hiddenfield[name=importexport_permittype_id]")
            .getValue();
        }
      }
    } else if (activeTab.down("hiddenfield[name=module_id]")) {
      var mainTabPanel = this.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab(),
        module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
        sub_module_id = activeTab
          .down("hiddenfield[name=sub_module_id]")
          .getValue(),
        section_id = activeTab.down("hiddenfield[name=section_id]").getValue();
      if (activeTab.down("hiddenfield[name=importexport_permittype_id]")) {
        importexport_permittype_id = activeTab
          .down("hiddenfield[name=importexport_permittype_id]")
          .getValue();
      }
    } else {
      var win = wizard.up("window"),
        module_id,
        sub_module_id,
        section_id;
      if (win.down("hiddenfield[name=module_id]")) {
        module_id = win.down("hiddenfield[name=module_id]").getValue();
      }
      if (win.down("hiddenfield[name=sub_module_id]")) {
        sub_module_id = win.down("hiddenfield[name=sub_module_id]").getValue();
      }
      if (win.down("hiddenfield[name=section_id]")) {
        section_id = win.down("hiddenfield[name=section_id]").getValue();
      }

      if (win.down("hiddenfield[name=importexport_permittype_id]")) {
        importexport_permittype_id = win
          .down("hiddenfield[name=importexport_permittype_id]")
          .getValue();
      }
    }

    if (
      module_id == 1 &&
      me.down("hiddenfield[name=prodclass_category_id]") &&
      me.down("hiddenfield[name=prodclass_category_id]").getValue()
    ) {
      prodclass_category_id = me
        .down("hiddenfield[name=prodclass_category_id]")
        .getValue();
    } else if (
      activeTab &&
      module_id == 1 &&
      activeTab.down("hiddenfield[name=prodclass_category_id]") &&
      activeTab.down("hiddenfield[name=prodclass_category_id]").getValue()
    ) {
      prodclass_category_id = activeTab
        .down("hiddenfield[name=prodclass_category_id]")
        .getValue();
    }
    if (module_id == 2) {
      premise_type_id = wizard
        .down("hiddenfield[name=premise_type_id]")
        .getValue();
    }

    Ext.Ajax.request({
      url: "configurations/prepareInterfaceBasedonConfig",
      params: {
        module_id: module_id,
        sub_module_id: sub_module_id,
        section_id: section_id,
        prodclass_category_id: prodclass_category_id,
        premise_type_id: premise_type_id,
        importexport_permittype_id: importexport_permittype_id,
        // report_type_id:report_type_id
      },
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
        "X-CSRF-Token": token,
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

          // Sort the fields by group
          result.sort(function (a, b) {
            return (a.group || '').localeCompare(b.group || '');
          });

          // Process each field in the sorted result
          result.forEach(function (base_result) {
            var field_name = base_result.field_name;
            var label = base_result.label;
            var is_enabled = base_result.is_enabled;
            var is_mandatory = base_result.is_mandatory;
            var is_readOnly = base_result.is_readOnly;
            var has_relation = base_result.has_relation;
            var bind_column = base_result.bind_column;
            var child_combo = base_result.child_combo;
            var parent_combo = base_result.parent_combo;
            var xtype = base_result.xtype;
            var table = base_result.combo_table;
            var displayfield = base_result.displayfield;
            var valuefield = base_result.valuefield;
            var is_parent = base_result.is_parent;
            var is_hidden = base_result.is_hidden;
            var is_multiparent = base_result.is_multiparent;
            var total_children = base_result.total_children;
            var has_logic = base_result.has_logic;
            var tpl_block = base_result.tpl_block;
            var other_logic = base_result.other_logic;
            var def_id = base_result.def_id;
            var column_width = base_result.column_width;
            var formfield = base_result.formfield;
            var group = base_result.group;
            var group_title = base_result.group_title;
            var default_value = base_result.default_value;
            var form_field_type_id = base_result.form_field_type_id;
            var options = base_result.options;
            //for registers
            if (is_register == 1111) {
              is_readOnly = false;
              is_mandatory = false;
            }
            // Check if the group already has a fieldset
            if (!group_tracker.includes(group)) {
              // Create new fieldset for the group
              var fieldset = Ext.create("Ext.form.FieldSet", {
                xtype: "fieldset",
                columnWidth: 1,
                title: group_title,
                collapsible: true,
                layout: "column",
                defaults: {
                  allowBlank: false,
                  labelAlign: "top",
                  columnWidth: 0.33,
                  margin: 5,
                },
                items: []
              });

              // Store the fieldset in the tracker
              live_group_tracker[group] = fieldset;
              group_tracker.push(group);
            } else {
              // Use existing fieldset
              var fieldset = live_group_tracker[group];
            }

            if (is_mandatory == 1) {
              is_mandatory = false;
            } else {
              is_mandatory = true;
            }
            if (is_hidden == 1) {
              is_hidden = true;
            } else {
              is_hidden = false;
            }
            //for tag experiamental
            if (form_field_type_id == 10) {
              if (is_multiparent) {
                if (is_readOnly == 1) {
                  var configs = {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    filterPickList: true,
                    encodeSubmitValue: true,
                    growMax: 80,
                    queryMode: "local",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 1000,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        // //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              total_children = me.total_children;
                            //console.log(me);
                            for (var i = total_children - 1; i >= 0; i--) {
                              //console.log(me);
                              var child_combo = "child_combo" + i,
                                bind_column = "bind_column" + i,
                                store = form
                                  .down("combo[name=" + me[child_combo] + "]")
                                  .getStore(),
                                filters = JSON.stringify({
                                  [me[bind_column]]: newVal,
                                });

                              store.removeAll();
                              store.load({ params: { filters: filters } });
                            }
                            // if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                        // me.fireEvent('addListenerToConfig', me);
                      },
                    },
                  };
                } else {
                  var configs = {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                      readOnly: "{isReadOnly}",
                    },
                    forceSelection: true,
                    filterPickList: true,
                    encodeSubmitValue: true,
                    growMax: 80,
                    queryMode: "local",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 1000,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        // //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              total_children = me.total_children;
                            //console.log(me);
                            for (var i = total_children - 1; i >= 0; i--) {
                              //console.log(me);
                              var child_combo = "child_combo" + i,
                                bind_column = "bind_column" + i,
                                store = form
                                  .down("combo[name=" + me[child_combo] + "]")
                                  .getStore(),
                                filters = JSON.stringify({
                                  [me[bind_column]]: newVal,
                                });

                              store.removeAll();
                              store.load({ params: { filters: filters } });
                            }
                            // if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                        // me.fireEvent('addListenerToConfig', me);
                      },
                    },
                  };
                }

                for (var i = total_children - 1; i >= 0; i--) {
                  var child_combo = "child_combo" + i;
                  var bind_column = "bind_column" + i;
                  configs[child_combo] = base_result[child_combo];
                  configs[bind_column] = base_result[bind_column];
                }
                var field = Ext.create("Ext.form.field.Tag", configs);
              } else if (is_parent) {
                if (is_readOnly == 1) {
                  var field = Ext.create("Ext.form.field.Tag", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    filterPickList: true,
                    encodeSubmitValue: true,
                    growMax: 80,
                    readOnly: true,
                    forceSelection: true,
                    queryMode: "local",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 1000,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              store = form
                                .down("combo[name=" + me.child_combo + "]")
                                .getStore(),
                              filters = JSON.stringify({
                                [me.bind_column]: newVal,
                              });
                            store.removeAll();
                            store.load({ params: { filters: filters } });
                            //  if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                } else {
                  var field = Ext.create("Ext.form.field.Tag", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                      readOnly: "{isReadOnly}",
                    },
                    forceSelection: true,
                    filterPickList: true,
                    encodeSubmitValue: true,
                    growMax: 80,
                    queryMode: "local",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 1000,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              store = form
                                .down("combo[name=" + me.child_combo + "]")
                                .getStore(),
                              filters = JSON.stringify({
                                [me.bind_column]: newVal,
                              });
                            store.removeAll();
                            store.load({ params: { filters: filters } });
                            //  if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                }
              } else {
                if (is_readOnly == 1) {
                  var field = Ext.create("Ext.form.field.Tag", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
                    allowBlank: is_mandatory,
                    valueField: valuefield,
                    displayField: displayfield,
                    anyMatch: true,
                    hidden: is_hidden,
                    columnWidth: column_width,
                    forceSelection: true,
                    has_logic: has_logic,
                    other_logic: other_logic,
                    queryMode: "local",
                    readOnly: true,
                    filterPickList: true,
                    encodeSubmitValue: true,
                    growMax: 80,
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 1000,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        if (me.has_logic == 1) {
                          // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                          //    var form = combo.up('form');
                          //     eval(combo.other_logic);
                          //  });
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                } else {
                  var field = Ext.create("Ext.form.field.Tag", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
                    allowBlank: is_mandatory,
                    valueField: valuefield,
                    displayField: displayfield,
                    hidden: is_hidden,
                    columnWidth: column_width,
                    forceSelection: true,
                    anyMatch: true,
                    filterPickList: true,
                    encodeSubmitValue: true,
                    growMax: 80,
                    has_logic: has_logic,
                    other_logic: other_logic,
                    queryMode: "local",
                    bind: {
                      readOnly: "{isReadOnly}",
                    },
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 100,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        if (me.has_logic == 1) {
                          // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                          //    var form = combo.up('form');
                          //     eval(combo.other_logic);
                          //  });
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                }
              }
            }

            //end of experients
            else if (form_field_type_id == 6) {
              if (is_multiparent) {
                if (is_readOnly == 1) {
                  var configs = {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    queryMode: "local",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 1000,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        // //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              total_children = me.total_children;
                            //console.log(me);
                            for (var i = total_children - 1; i >= 0; i--) {
                              //console.log(me);
                              var child_combo = "child_combo" + i,
                                bind_column = "bind_column" + i,
                                store = form
                                  .down("combo[name=" + me[child_combo] + "]")
                                  .getStore(),
                                filters = JSON.stringify({
                                  [me[bind_column]]: newVal,
                                });

                              store.removeAll();
                              store.load({ params: { filters: filters } });
                            }
                            // if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                        // me.fireEvent('addListenerToConfig', me);
                      },
                    },
                  };
                } else {
                  var configs = {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                      readOnly: "{isReadOnly}",
                    },
                    forceSelection: true,
                    queryMode: "local",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 1000,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        // //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              total_children = me.total_children;
                            //console.log(me);
                            for (var i = total_children - 1; i >= 0; i--) {
                              //console.log(me);
                              var child_combo = "child_combo" + i,
                                bind_column = "bind_column" + i,
                                store = form
                                  .down("combo[name=" + me[child_combo] + "]")
                                  .getStore(),
                                filters = JSON.stringify({
                                  [me[bind_column]]: newVal,
                                });

                              store.removeAll();
                              store.load({ params: { filters: filters } });
                            }
                            // if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                        // me.fireEvent('addListenerToConfig', me);
                      },
                    },
                  };
                }

                for (var i = total_children - 1; i >= 0; i--) {
                  var child_combo = "child_combo" + i;
                  var bind_column = "bind_column" + i;
                  configs[child_combo] = base_result[child_combo];
                  configs[bind_column] = base_result[bind_column];
                }
                var field = Ext.create("Ext.form.ComboBox", configs);
              } else if (is_parent) {
                if (is_readOnly == 1) {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    queryMode: "local",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 1000,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              store = form
                                .down("combo[name=" + me.child_combo + "]")
                                .getStore(),
                              filters = JSON.stringify({
                                [me.bind_column]: newVal,
                              });
                            store.removeAll();
                            store.load({ params: { filters: filters } });
                            //  if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                } else {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                      readOnly: "{isReadOnly}",
                    },
                    forceSelection: true,
                    queryMode: "local",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 1000,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              store = form
                                .down("combo[name=" + me.child_combo + "]")
                                .getStore(),
                              filters = JSON.stringify({
                                [me.bind_column]: newVal,
                              });
                            store.removeAll();
                            store.load({ params: { filters: filters } });
                            //  if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                }
              } else {
                if (is_readOnly == 1) {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
                    allowBlank: is_mandatory,
                    valueField: valuefield,
                    displayField: displayfield,
                    anyMatch: true,
                    hidden: is_hidden,
                    columnWidth: column_width,
                    forceSelection: true,
                    has_logic: has_logic,
                    other_logic: other_logic,
                    queryMode: "local",
                    readOnly: true,
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 1000,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        if (me.has_logic == 1) {
                          // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                          //    var form = combo.up('form');
                          //     eval(combo.other_logic);
                          //  });
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                } else {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
                    allowBlank: is_mandatory,
                    valueField: valuefield,
                    displayField: displayfield,
                    hidden: is_hidden,
                    columnWidth: column_width,
                    forceSelection: true,
                    anyMatch: true,
                    has_logic: has_logic,
                    other_logic: other_logic,
                    queryMode: "local",
                    bind: {
                      readOnly: "{isReadOnly}",
                    },
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 1000,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        if (me.has_logic == 1) {
                          // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                          //    var form = combo.up('form');
                          //     eval(combo.other_logic);
                          //  });
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                }
              }
            }
            //for filterable combo
            else if (form_field_type_id == 9) {
              if (is_multiparent) {
                if (is_readOnly == 1) {
                  var configs = {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    queryMode: "remote",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 100,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        // //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              total_children = me.total_children;
                            //console.log(me);
                            for (var i = total_children - 1; i >= 0; i--) {
                              //console.log(me);
                              var child_combo = "child_combo" + i,
                                bind_column = "bind_column" + i,
                                store = form
                                  .down("combo[name=" + me[child_combo] + "]")
                                  .getStore(),
                                filters = JSON.stringify({
                                  [me[bind_column]]: newVal,
                                });

                              store.removeAll();
                              store.load({ params: { filters: filters } });
                            }
                            // if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                        // me.fireEvent('addListenerToConfig', me);
                      },
                    },
                    triggers: {
                      refresh: {
                        weight: 1,
                        cls: "x-fa fa-search",
                        handler: function () {
                          // this is the ComboBox
                          var filter = this.getValue();
                          this.mask();
                          this.getStore().reload({
                            params: { comboFilter: filter },
                          });
                          this.unmask();
                        },
                      },
                    },
                  };
                } else {
                  var configs = {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                      readOnly: "{isReadOnly}",
                    },
                    forceSelection: false,
                    queryMode: "remote",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 100,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        // //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              total_children = me.total_children;
                            //console.log(me);
                            for (var i = total_children - 1; i >= 0; i--) {
                              //console.log(me);
                              var child_combo = "child_combo" + i,
                                bind_column = "bind_column" + i,
                                store = form
                                  .down("combo[name=" + me[child_combo] + "]")
                                  .getStore(),
                                filters = JSON.stringify({
                                  [me[bind_column]]: newVal,
                                });

                              store.removeAll();
                              store.load({ params: { filters: filters } });
                            }
                            // if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                        // me.fireEvent('addListenerToConfig', me);
                      },
                    },
                    triggers: {
                      refresh: {
                        weight: 1,
                        cls: "x-fa fa-search",
                        handler: function () {
                          // this is the ComboBox
                          var filter = this.getValue();
                          this.mask();
                          this.getStore().reload({
                            params: { comboFilter: filter },
                          });
                          this.unmask();
                        },
                      },
                    },
                  };
                }

                for (var i = total_children - 1; i >= 0; i--) {
                  var child_combo = "child_combo" + i;
                  var bind_column = "bind_column" + i;
                  configs[child_combo] = base_result[child_combo];
                  configs[bind_column] = base_result[bind_column];
                }
                var field = Ext.create("Ext.form.ComboBox", configs);
              } else if (is_parent) {
                if (is_readOnly == 1) {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    queryMode: "remote",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 100,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              store = form
                                .down("combo[name=" + me.child_combo + "]")
                                .getStore(),
                              filters = JSON.stringify({
                                [me.bind_column]: newVal,
                              });
                            store.removeAll();
                            store.load({ params: { filters: filters } });
                            //  if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                      },
                    },
                    triggers: {
                      refresh: {
                        weight: 1,
                        cls: "x-fa fa-search",
                        handler: function () {
                          // this is the ComboBox
                          var filter = this.getValue();
                          this.mask();
                          this.getStore().reload({
                            params: { comboFilter: filter },
                          });
                          this.unmask();
                        },
                      },
                    },
                  });
                } else {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
                    allowBlank: is_mandatory,
                    valueField: valuefield,
                    child_combo: child_combo,
                    bind_column: bind_column,
                    hidden: is_hidden,
                    anyMatch: true,
                    //tpl: eval(tpl_block),
                    pageSize: 100,
                    columnWidth: column_width,
                    displayField: displayfield,
                    has_logic: has_logic,
                    other_logic: other_logic,
                    bind: {
                      readOnly: "{isReadOnly}",
                    },
                    forceSelection: false,
                    queryMode: "remote",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 100,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              store = form
                                .down("combo[name=" + me.child_combo + "]")
                                .getStore(),
                              filters = JSON.stringify({
                                [me.bind_column]: newVal,
                              });
                            store.removeAll();
                            store.load({ params: { filters: filters } });
                            //  if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                      },
                    },
                    triggers: {
                      refresh: {
                        weight: 1,
                        cls: "x-fa fa-search",
                        handler: function () {
                          // this is the ComboBox
                          var filter = this.getValue();
                          this.mask();
                          this.getStore().reload({
                            params: { comboFilter: filter },
                          });
                          this.unmask();
                        },
                      },
                    },
                  });
                }
              } else {
                if (is_readOnly == 1) {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    queryMode: "remote",
                    readOnly: true,
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 100,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        if (me.has_logic == 1) {
                          // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                          //    var form = combo.up('form');
                          //     eval(combo.other_logic);
                          //  });
                          eval(me.other_logic);
                        }
                      },
                    },
                    triggers: {
                      refresh: {
                        weight: 1,
                        cls: "x-fa fa-search",
                        handler: function () {
                          // this is the ComboBox
                          var filter = this.getValue();
                          this.mask();
                          this.getStore().reload({
                            params: { comboFilter: filter },
                          });
                          this.unmask();
                        },
                      },
                    },
                  });
                } else {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    queryMode: "remote",
                    bind: {
                      readOnly: "{isReadOnly}",
                    },
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          pageSize: 100,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        if (me.has_logic == 1) {
                          // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                          //    var form = combo.up('form');
                          //     eval(combo.other_logic);
                          //  });
                          eval(me.other_logic);
                        }
                      },
                    },
                    triggers: {
                      refresh: {
                        weight: 1,
                        cls: "x-fa fa-search",
                        handler: function () {
                          // this is the ComboBox
                          var filter = this.getValue();
                          this.mask();
                          this.getStore().reload({
                            params: { comboFilter: filter },
                          });
                          this.unmask();
                        },
                      },
                    },
                  });
                }
              }
            }
            //for grid combo
            else if (form_field_type_id == 7) {
              if (is_multiparent) {
                if (is_readOnly == 1) {
                  var configs = {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    queryMode: "remote",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          // enablePaging:true,
                          // remoteFilter: true,
                          pageSize: 20,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        // //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              total_children = me.total_children;
                            //console.log(me);
                            for (var i = total_children - 1; i >= 0; i--) {
                              var child_combo = "child_combo" + i,
                                bind_column = "bind_column" + i,
                                store = form
                                  .down("combo[name=" + me[child_combo] + "]")
                                  .getStore(),
                                filters = JSON.stringify({
                                  [me[bind_column]]: newVal,
                                });

                              store.removeAll();
                              store.load({ params: { filters: filters } });
                            }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                        // me.fireEvent('addListenerToConfig', me);
                      },
                    },
                  };
                } else {
                  var configs = {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                      readOnly: "{isReadOnly}",
                    },
                    pageSize: 20,
                    // listConfig:{
                    //     minWidth:400,
                    //     loadingText: 'Searching...',
                    //     emptyText: 'No match found.',
                    // },
                    forceSelection: true,
                    queryMode: "remote",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          // enablePaging:true,
                          // remoteFilter: true,
                          pageSize: 20,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        // //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              total_children = me.total_children;
                            //console.log(me);
                            for (var i = total_children - 1; i >= 0; i--) {
                              var child_combo = "child_combo" + i,
                                bind_column = "bind_column" + i,
                                store = form
                                  .down("combo[name=" + me[child_combo] + "]")
                                  .getStore(),
                                filters = JSON.stringify({
                                  [me[bind_column]]: newVal,
                                });

                              store.removeAll();
                              store.load({ params: { filters: filters } });
                            }
                            // if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                        // me.fireEvent('addListenerToConfig', me);
                      },
                    },
                  };
                }
                for (var i = total_children - 1; i >= 0; i--) {
                  var child_combo = "child_combo" + i;
                  var bind_column = "bind_column" + i;
                  configs[child_combo] = base_result[child_combo];
                  configs[bind_column] = base_result[bind_column];
                }
                var field = Ext.create("Ext.form.ComboBox", configs);
              } else if (is_parent) {
                if (is_readOnly == 1) {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    queryMode: "remote",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          // enablePaging:true,
                          // remoteFilter: true,
                          pageSize: 20,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              store = form
                                .down("combo[name=" + me.child_combo + "]")
                                .getStore(),
                              filters = JSON.stringify({
                                [me.bind_column]: newVal,
                              });
                            store.removeAll();
                            store.load({ params: { filters: filters } });
                            //  if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                } else {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                      readOnly: "{isReadOnly}",
                    },
                    forceSelection: true,
                    pageSize: 20,
                    // listConfig:{
                    //     minWidth:400,
                    //     loadingText: 'Searching...',
                    //     emptyText: 'No match found.',
                    // },
                    queryMode: "remote",
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          // enablePaging:true,
                          // remoteFilter: true,
                          pageSize: 20,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        me.addListener(
                          "change",
                          function (combo, newVal, oldvalue, eopts) {
                            var form = combo.up("form"),
                              store = form
                                .down("combo[name=" + me.child_combo + "]")
                                .getStore(),
                              filters = JSON.stringify({
                                [me.bind_column]: newVal,
                              });
                            store.removeAll();
                            store.load({ params: { filters: filters } });
                            //  if(combo.has_logic == 1){
                            //      eval(combo.other_logic);
                            // }
                          }
                        );
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                }
              } else {
                if (is_readOnly == 1) {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    queryMode: "remote",
                    readOnly: true,
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          // enablePaging:true,
                          // remoteFilter: true,
                          pageSize: 20,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        // if(me.has_logic == 1){
                        //     me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                        //        var form = combo.up('form');
                        //         eval(combo.other_logic);
                        //      });
                        // }
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                } else {
                  var field = Ext.create("Ext.form.ComboBox", {
                    name: field_name,
                    fieldLabel: label,
                    value: default_value,
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
                    queryMode: "remote",
                    bind: {
                      readOnly: "{isReadOnly}",
                    },
                    listeners: {
                      beforerender: {
                        fn: "setCompStore",
                        config: {
                          // enablePaging:true,
                          // remoteFilter: true,
                          pageSize: 20,
                          proxy: {
                            extraParams: {
                              table_name: table,
                            },
                          },
                        },
                        isLoad: true,
                      },
                      afterrender: function (me) {
                        //console.log('rendered');
                        // if(me.has_logic == 1){
                        //     me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                        //        var form = combo.up('form');
                        //         eval(combo.other_logic);
                        //      });
                        // }
                        if (me.has_logic == 1) {
                          eval(me.other_logic);
                        }
                      },
                    },
                  });
                }
              }
            }
            //other fields
            else if (form_field_type_id == 8) {
              if (is_readOnly == 1) {
                var field = Ext.create("Ext.form." + xtype, {
                  layout: "column",
                  // name: field_name,
                  fieldLabel: label,
                  value: default_value,
                  columnWidth: column_width,
                  // hidden: is_hidden,
                  // allowBlank: is_mandatory,
                  readOnly: true,
                  items: [
                    {
                      xtype: "textfield",
                      name: field_name,
                      columnWidth: 0.9,
                      allowBlank: is_mandatory,
                    },
                    {
                      xtype: "hiddenfield",
                      name: formfield,
                      columnWidth: 0.9,
                      allowBlank: false,
                    },
                    {
                      xtype: "button",
                      iconCls: "x-fa fa-search",
                      columnWidth: 0.1,
                      tooltip: "Click to search",
                      action: "link_personnel",
                      winTitle: "Search Details",
                      disabled: true,
                      table_name: table,
                      def_id: def_id,
                      handler: function (btn) {
                        var panel = btn.up("panel"),
                          ctr =
                            Ext.getApplication().getController("DashboardCtr");
                        Ext.getBody().mask("Loading List");
                        ctr.fireEvent("showDynamicSelectionList", btn);
                      }, //'showDynamicSelectionList',
                      winWidth: "70%",
                    },
                  ],
                });
              } else {
                var field = Ext.create("Ext.form." + xtype, {
                  layout: "column",
                  // name: field_name,
                  fieldLabel: label,
                  value: default_value,
                  columnWidth: column_width,
                  // hidden: is_hidden,
                  // allowBlank: is_mandatory,
                  // readOnly: is_readOnly,
                  items: [
                    {
                      xtype: "textfield",
                      name: displayfield,
                      columnWidth: 0.9,
                      readOnly: true,
                      allowBlank: is_mandatory,
                    },
                    {
                      xtype: "hiddenfield",
                      name: formfield,
                      columnWidth: 0.9,
                      allowBlank: false,
                    },
                    {
                      xtype: "button",
                      iconCls: "x-fa fa-search",
                      columnWidth: 0.1,
                      tooltip: "Click to search",
                      action: "link_personnel",
                      valuefield: valuefield,
                      displayfield: displayfield,
                      formfield: formfield,
                      table_name: table,
                      winTitle: "Search Details",
                      def_id: def_id,
                      bind: {
                        hidden: "{isReadOnly}",
                      },
                      handler: function (btn) {
                        var panel = btn.up("panel"),
                          ctr =
                            Ext.getApplication().getController("DashboardCtr");
                        Ext.getBody().mask("Loading List");
                        ctr.fireEvent("showDynamicSelectionList", btn);
                      },
                      // handler: 'showDynamicSelectionList',
                      winWidth: "70%",
                    },
                  ],
                });
              }
            } else if (form_field_type_id == 5) {
              if (is_readOnly == 1) {
                var field = Ext.create("Ext.form." + xtype, {
                  name: field_name,
                  fieldLabel: label,
                  value: default_value,
                  format: "Y-m-d",
                  altFormats:
                    "d,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00",
                  hidden: is_hidden,
                  columnWidth: column_width,
                  allowBlank: is_mandatory,
                  readOnly: true,
                });
              } else {
                var field = Ext.create("Ext.form." + xtype, {
                  name: field_name,
                  fieldLabel: label,
                  value: default_value,
                  format: "Y-m-d",
                  altFormats:
                    "d,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00",
                  hidden: is_hidden,
                  columnWidth: column_width,
                  allowBlank: is_mandatory,
                  bind: {
                    readOnly: "{isReadOnly}",
                  },
                });
              }
            } else if (form_field_type_id == 12) {
              if (options) {
                var items = options;
                items = JSON.parse(items);
                // Map the array of strings to an array of objects
                var items = items.map((object, index) => ({
                  boxLabel: object.label,
                  name: object.name,
                  inputValue: index + 1,
                }));

                if (is_readOnly == 1) {
                  var field = Ext.create("Ext.form." + xtype, {
                    name: field_name,
                    fieldLabel: label,
                    hidden: is_hidden,
                    columnWidth: column_width,
                    allowBlank: is_mandatory,
                    readOnly: true,
                    columns: 1,
                    items: items,
                  });
                } else {
                  var field = Ext.create("Ext.form." + xtype, {
                    name: field_name,
                    fieldLabel: label,
                    hidden: is_hidden,
                    columnWidth: column_width,
                    columns: 1,
                    allowBlank: is_mandatory,
                    bind: {
                      readOnly: "{isReadOnly}",
                    },
                    items: items,
                  });
                }
              }
            } else if (form_field_type_id == 13) {
              if (options) {
                var items = options;
                items = JSON.parse(items);

                // Map the array of strings to an array of objects
                var items = items.map((object, index) => ({
                  boxLabel: object.label,
                  name: object.name,
                }));

                if (is_readOnly == 1) {
                  var field = Ext.create("Ext.form." + xtype, {
                    fieldLabel: label,
                    hidden: is_hidden,
                    columnWidth: column_width,
                    allowBlank: is_mandatory,
                    readOnly: true,
                    columns: 1,
                    items: items,
                  });
                } else {
                  var field = Ext.create("Ext.form." + xtype, {
                    fieldLabel: label,
                    hidden: is_hidden,
                    columnWidth: column_width,
                    allowBlank: is_mandatory,
                    columns: 1,
                    bind: {
                      readOnly: "{isReadOnly}",
                    },
                    items: items,
                  });
                }
              }
            } else {
              if (is_readOnly == 1) {
                var field = Ext.create("Ext.form." + xtype, {
                  name: field_name,
                  fieldLabel: label,
                  value: default_value,
                  hidden: is_hidden,
                  columnWidth: column_width,
                  allowBlank: is_mandatory,
                  readOnly: true,
                });
              } else {
                var field = Ext.create("Ext.form." + xtype, {
                  name: field_name,
                  fieldLabel: label,
                  value: default_value,
                  hidden: is_hidden,
                  columnWidth: column_width,
                  allowBlank: is_mandatory,
                  bind: {
                    readOnly: "{isReadOnly}",
                  },
                });
              }
            }

            // Add the field to the fieldset
            fieldset.add(field);
          });
          // console.log(live_group_tracker);
          // Insert fieldsets into the form in the sorted group order
          group_tracker.forEach(function (group) {
            me.add(live_group_tracker[group]);
          });
          var found = false;
          if (me.up().up().getViewModel()) {
            var vmodel = me.up().up().getViewModel();
            model = vmodel.get("model");
            if (!Ext.Object.isEmpty(model)) {
              me.loadRecord(model);
              found = true;
            }
          }
          if (!found && activeTab.getViewModel()) {
            var vmodel = activeTab.getViewModel();
            model = vmodel.get("model");
            if (!Ext.Object.isEmpty(model)) {
              me.loadRecord(model);
            }
          }
          if (module_id == 2) {
            //  me.down('combo[name=premise_type_id]').setValue(premise_type_id);
          } else {
            // me.down('combo[name=prodclass_category_id]').setValue(prodclass_category_id);
          }

          if (me.down("combo[name=section_id]")) {
            me.down("combo[name=section_id]").setValue(section_id);
          }
          //CHRIS
          active_application_id = parseInt(active_application_id);
          if (!isNaN(active_application_id)) {
            Ext.Ajax.request({
              method: "GET",
              url:
                "issuemanagement/getIssueManagementDetailsById/" +
                active_application_id,
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
                  me.loadRecord(model);
                  // Parse the string using JSON.parse() (assuming valid JSON format)
                  var section_ids_array = JSON.parse(results.section_ids);
                  if (section_ids_array) {
                    section_ids_array = section_ids_array.join();
                    if (me.down("tagfield[name=section_ids]")) {
                      me.down("tagfield[name=section_ids]").setValue(
                        section_ids_array
                      );
                    }
                  }
                  if (
                    me.down("radiogroup[name=complaint_direct_or_indirect]")
                  ) {
                    me.down(
                      "radiogroup[name=complaint_direct_or_indirect]"
                    ).setValue({
                      complaint_direct_or_indirect:
                        results.complaint_direct_or_indirect,
                    });
                  }
                  if (
                    me.down(
                      "radiogroup[name=deviation_plannedorunplanned]"
                    )
                  ) {
                    me
                      .down("radiogroup[name=deviation_plannedorunplanned]")
                      .setValue({
                        deviation_plannedorunplanned:
                          results.deviation_plannedorunplanned,
                      });
                  }
                  if (me.down("radiogroup[name=complaint_fully_addressed]")) {
                    me.down(
                      "radiogroup[name=complaint_fully_addressed]"
                    ).setValue({
                      complaint_fully_addressed:
                        results.complaint_fully_addressed,
                    });
                  }
                  if (
                    me.down(
                      "radiogroup[name=deviation_approved]"
                    )
                  ) {
                    me
                      .down("radiogroup[name=deviation_approved]")
                      .setValue({
                        deviation_approved:
                          results.deviation_approved,
                      });
                  }
                  if (
                    me.down(
                      "radiogroup[name=deviation_notified]"
                    )
                  ) {
                    me
                      .down("radiogroup[name=deviation_notified]")
                      .setValue({
                        deviation_notified:
                          results.deviation_notified,
                      });
                  }
                  if (
                    me.down(
                      "radiogroup[name=deviation_addressed]"
                    )
                  ) {
                    me
                      .down("radiogroup[name=deviation_addressed]")
                      .setValue({
                        deviation_addressed:
                          results.deviation_addressed,
                      });
                  }
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
            if (
              me.down("combo[name=issue_type_id]") &&
              me.down("combo[name=issue_status_id]")
            ) {
              me.down("combo[name=issue_type_id]").setValue(issue_type_id);
              me.down("combo[name=issue_status_id]").setValue(1);
            }
            if (me.down("datefield[name=creation_date]")) {
              me.down("datefield[name=creation_date]").setValue(new Date());
            }
            if (me.down("datefield[name=target_resolution_date]")) {
              var targetDate = new Date();
              var target_period = me
                .down("numberfield[name=target_period]")
                .getValue();
              targetDate.setDate(targetDate.getDate() + target_period);
              me.down("datefield[name=target_resolution_date]").setValue(
                targetDate
              );
            }
            if (me.down("datefield[name=follow_up_on]")) {
              var followupDate = new Date();
              var follow_up_period = me
                .down("numberfield[name=follow_up_period]")
                .getValue();
              followupDate.setDate(followupDate.getDate() + follow_up_period);
              me.down("datefield[name=follow_up_on]").setValue(
                followupDate
              );
            }
          }
          if (me.down("combo[name=issue_status_id]")) {
            const issue_type_id = parseInt(me
              .down("combo[name=issue_type_id]")
              .getValue());
            if (!isNaN(issue_type_id)) {
              Ext.Ajax.request({
                method: "GET",
                url: "issuemanagement/issue_types/" + issue_type_id,
                headers: {
                  Authorization: "Bearer " + access_token,
                },
                success: function (response) {
                  var resp = Ext.JSON.decode(response.responseText),
                    results = resp,
                    issue_status_ids = JSON.parse(results.issue_status_ids);
                  if (issue_status_ids && Array.isArray(issue_status_ids)) {
                    // Get the issue_status_id combo
                    var issueStatusCombo = me.down("combo[name=issue_status_id]");
                    var store = issueStatusCombo.getStore();
                    // Filter the store by issue_status_ids
                    store.clearFilter();
                    store.filterBy(function (record) {
                      return issue_status_ids.includes(record.get("id"));
                    });
                  }
                },
                failure: function (response) { },
                error: function (jqXHR, textStatus, errorThrown) { },
              });
            }
          }
          //CHRIS
        } else {
          toastr.error(message, "Failure Response");
        }
      },
      failure: function (response) {
        btn.setLoading(false);
        var resp = Ext.JSON.decode(response.responseText),
          message = resp.message;
        toastr.error(message, "Failure Response");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        btn.setLoading(false);
        toastr.error("Error: " + errorThrown, "Error Response");
      },
    });
  },
  showIssueManagementAssociatedWin: function (btn) {
    var mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      childXtype = btn.childXtype,
      form = Ext.widget(childXtype),
      winTitle = btn.winTitle,
      winWidth = btn.winWidth,
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = activeTab
        .down("hiddenfield[name=sub_module_id]")
        .getValue(),
      workflow_stage = activeTab
        .down("hiddenfield[name=workflow_stage_id]")
        .getValue(),
      application_code = activeTab
        .down("hiddenfield[name=active_application_code]")
        .getValue();
    if (application_code != "") {
      form.setHeight(400);
      funcShowCustomizableWindow(
        winTitle,
        winWidth,
        form,
        "customizablewindow"
      );
    } else {
      toastr.error(
        "Application details not found, save application to select!!",
        "Failure Response"
      );
    }
  },
  showIssueManagementAssociatedDocWin: function (btn) {
    var mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      childXtype = btn.childXtype,
      form = Ext.widget(childXtype),
      winTitle = btn.winTitle,
      winWidth = btn.winWidth,
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      section_id = activeTab.down("hiddenfield[name=section_id]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = activeTab
        .down("hiddenfield[name=sub_module_id]")
        .getValue(),
      workflow_stage = activeTab
        .down("hiddenfield[name=workflow_stage_id]")
        .getValue(),
      application_code = activeTab
        .down("hiddenfield[name=active_application_code]")
        .getValue();
    if (application_code != "") {
      form.setHeight(400);
      this.showApplicationDocUploadWinGeneric(
        btn,
        section_id,
      module_id,
      sub_module_id,
      workflow_stage,
      application_code,
      query_id = null
      );
    } else {
      toastr.error(
        "Application details not found, save application to select!!",
        "Failure Response"
      );
    }
  },
  showApplicationDocUploadWinGeneric: function (
    btn,
    section_id,
    module_id,
    sub_module_id,
    workflow_stage,
    application_code,
    query_id = null
  ) {
    var childXtype = btn.childXtype,
      winTitle = btn.winTitle,
      winWidth = btn.winWidth,
      storeID = btn.storeID,
      mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      prodclass_category = activeTab.down(
        "hiddenfield[name=prodclass_category_id]"
      ),
      premise_type_id = activeTab.down("hiddenfield[name=premise_type_id]"),
      form = Ext.widget(childXtype),
      prodclass_category_id;
    if (prodclass_category) {
      prodclass_category_id = prodclass_category.getValue();
    }
    if (premise_type_id) {
      premise_type_id = premise_type_id.getValue();
    }
    form.down("hiddenfield[name=application_code]").setValue(application_code);
    form.down("hiddenfield[name=section_id]").setValue(section_id);
    form.down("hiddenfield[name=module_id]").setValue(module_id);
    form.down("hiddenfield[name=sub_module_id]").setValue(sub_module_id);
    form.down("hiddenfield[name=query_ref_id]").setValue(query_id);
    form
      .down("hiddenfield[name=prodclass_category_id]")
      .setValue(prodclass_category_id); //for products only
    form.down("hiddenfield[name=premise_type_id]").setValue(premise_type_id); //for premises only
    form.down("hiddenfield[name=process_id]").setValue(process_id); //added for clean filtering of required docs
    form.down("button[name=upload_file_btn]").storeID = storeID;
    // if (!btn.show_assessor) {
    //   form.down("combo[name=assessment_by]").setVisible(false);
    // }
    funcShowCustomizableWindow(winTitle, winWidth, form, "customizablewindow");
    var docTypesStr = form.down("combo[name=doctype_id]").getStore();
    docTypesStr.removeAll();
    docTypesStr.load({
      params: {
        section_id: section_id,
        module_id: module_id,
        sub_module_id: sub_module_id,
        query_id: query_id,
        process_id: process_id,
        workflow_stage: workflow_stage,
      },
    });
  },
  refreshGrid: function (me) {
    var store = me.store,
      grid = me.up("grid"),
      mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      application_id = activeTab.down("hiddenfield[name=active_application_id]").getValue(),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      issue_id = activeTab.down("hiddenfield[name=active_application_id]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      workflow_stage = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue();

    store.getProxy().extraParams = {
      application_id: application_id,
      issue_id: issue_id,
      application_code: application_code,
      process_id: process_id,
      workflow_stage: workflow_stage
    };
  },
  saveIssueManagementAssociatedDetails: function (btn) {
    var me = this,
      url = btn.action_url,
      table = btn.table_name,
      form = btn.up("form"),
      win = form.up("window"),
      storeID = btn.storeID,
      store = Ext.getStore(storeID),
      frm = form.getForm(),
      mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue();
    if (frm.isValid()) {
      frm.submit({
        url: url,
        params: { active_application_id: active_application_id, type: 'Document' },
        waitMsg: "Please wait...",
        headers: {
          Authorization: "Bearer " + access_token,
        },
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
            toastr.error(message, "Failure Response");
          }
        },
        failure: function (form, action) {
          var resp = action.result;
          toastr.error(resp.message, "Failure Response");
        },
      });
    }
  },
  saveApplicationChecklistDetails: function (btn) {
    btn.setLoading(true);
    var mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
      application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
      screeningGrid = activeTab.down('issuechecklistgrid');
    this.commitApplicationChecklistDetails(btn, application_id, application_code, screeningGrid);
  },

  commitApplicationChecklistDetails: function (btn, application_id, application_code, screeningGrid) {
    var checklist_type = screeningGrid.down('combo[name=applicable_checklist]').getValue(),
      store = screeningGrid.getStore(),
      params = [];
    for (var i = 0; i < store.data.items.length; i++) {
      var record = store.data.items[i],
        item_resp_id = record.get('item_resp_id'),
        checklist_item_id = record.get('checklist_item_id'),
        pass_status = record.get('pass_status'),
        comment = record.get('comment'),
        observation = record.get('observation'),
        auditor_comment = record.get('auditor_comment'),
        auditorpass_status = record.get('auditorpass_status'),
        item_resp_id = record.get('item_resp_id'),
        risk_type = record.get('risk_type'),
        risk_type_remarks = record.get('risk_type_remarks');
      var obj = {
        application_id: application_id,
        item_resp_id: item_resp_id,
        application_code: application_code,
        item_resp_id: item_resp_id,
        created_by: user_id,
        checklist_item_id: checklist_item_id,
        pass_status: pass_status,
        comment: comment,
        auditor_comment: auditor_comment,
        auditorpass_status: auditorpass_status,
        observation: observation,
        risk_type: risk_type,
        risk_type_remarks: risk_type_remarks
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
      url: 'api/saveApplicationChecklistDetails',
      params: {
        application_id: application_id,
        item_resp_id: item_resp_id,
        application_code: application_code,
        checklist_type: checklist_type,
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

});
