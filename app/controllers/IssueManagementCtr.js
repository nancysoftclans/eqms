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
      issuereceivingwizard: {
        afterrender: "launchissuereceivingWizard",
      },
      issueinitialqualityreviewwizard: {
        afterrender: "prepapreIssueApplicationReview",
      },
      "issueinitialqualityreviewwizard button[name=recommendation]": {
        click: "AddGeneralComment",
      },
      issuerootcauseanalysiswizard: {
        afterrender: "prepapreIssueRCAReview",
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

    var issuemanagementfrm = workflowContainer.down("issuemanagementfrm");

    // issuemanagementfrm
    //   .down("combo[name=issue_type_id]")
    //   .setValue(issue_type_id);
    // issuemanagementfrm.down("combo[name=issue_status_id]").setValue(1);
    // issuemanagementfrm
    //   .down("datefield[name=creation_date]")
    //   .setValue(new Date());

    // // Calculate the date 10 days from now
    // var targetDate = new Date();
    // targetDate.setDate(targetDate.getDate() + 10);

    // // Set the target resolution date field to 10 days from now
    // issuemanagementfrm
    //   .down("datefield[name=target_resolution_date]")
    //   .setValue(targetDate);

    dashboardWrapper.add(workflowContainer);

    Ext.Function.defer(function () {
      Ext.getBody().unmask();
    }, 300);
  },

  launchissuereceivingWizard: function (pnl) {
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
    // activeTab.down("button[name=approval]").setVisible(false);

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

            // Parse the string using JSON.parse() (assuming valid JSON format)
            const section_ids_array = JSON.parse(results.section_ids);
            issuemanagementfrm
              .down("tagfield[name=section_ids]")
              .setValue(section_ids_array);
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

    if (valid) {
      Ext.Ajax.request({
        method: "POST",
        url: "issuemanagement/submitIssueManagementApplication",
        params: {
          application_code: application_code,
          workflow_stage_id: workflow_stage_id,
          active_application_id: active_application_id,
          _token: token,
        },
        headers: {
          Authorization: "Bearer " + access_token,
        },
        success: function (response) {
          Ext.getBody().unmask();
          var resp = Ext.JSON.decode(response.responseText),
            message = resp.message,
            success = resp.success;
          if (success == true || success === true) {
            extraParams = [
              {
                field_type: "hiddenfield",
                field_name: "has_queries",
                // value: hasQueries
              },
            ];
            showWorkflowSubmissionWin(
              active_application_id,
              application_code,
              table_name,
              "workflowsubmissionsreceivingfrm",
              winWidth,
              storeID,
              extraParams,
              "",
              "",
              workflow_stage_id
            );
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
      toastr.warning("Please Save Application Details!!", "Warning Response");
      return false;
    }

    return true;
  },

  prepapreIssueApplicationReview: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl,
      application_status_id = activeTab
        .down("hiddenfield[name=application_status_id]")
        .getValue(),
      issuemanagementfrm = activeTab.down("issuemanagementfrm"),
      complainantdetailsfrm = activeTab.down("complainantdetailsfrm"),
      issueinitialqualityreviewfrm = activeTab.down(
        "issueinitialqualityreviewfrm"
      ),
      issuemanagementdocuploadsgrid = activeTab.down(
        "issuemanagementdocuploadsgrid"
      ),
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

    // activeTab.down("button[name=recommendation]").setVisible(true);
    // activeTab.down("button[name=approval]").setVisible(false);
    // activeTab.down("textfield[name=recommendation_id]").setVisible(true);
    // activeTab.down("textfield[name=approval_id]").setVisible(false);
    issuemanagementdocuploadsgrid
      .down("button[name=add_upload]")
      .setVisible(false);

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
            complainantdetailsfrm.loadRecord(model);
            issueinitialqualityreviewfrm.loadRecord(model);
            activeTab
              .down("displayfield[name=workflow_stage]")
              .setValue(results.workflow_stage);
            activeTab
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            issuemanagementfrm
              .down("datefield[name=creation_date]")
              .setValue(new Date(results.creation_date));

            issuemanagementfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });
            complainantdetailsfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });

            // Parse the string using JSON.parse() (assuming valid JSON format)
            const section_ids_array = JSON.parse(results.section_ids);
            issuemanagementfrm
              .down("tagfield[name=section_ids]")
              .setValue(section_ids_array);

            issueinitialqualityreviewfrm
              .down("radiogroup[name=complaint_direct_or_indirect]")
              .setValue({
                complaint_direct_or_indirect:
                  results.complaint_direct_or_indirect,
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

  prepapreIssueRCAReview: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var activeTab = pnl,
      issuemanagementfrm = activeTab.down("issuemanagementfrm"),
      complainantdetailsfrm = activeTab.down("complainantdetailsfrm"),
      issueinitialqualityreviewfrm = activeTab.down(
        "issueinitialqualityreviewfrm"
      ),
      issuerootcauseanalysisfrm = activeTab.down("issuerootcauseanalysisfrm"),
      issuemanagementdocuploadsgrid = activeTab.down(
        "issuemanagementdocuploadsgrid"
      ),
      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue();
    issuemanagementdocuploadsgrid
      .down("button[name=add_upload]")
      .setVisible(false);

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
            complainantdetailsfrm.loadRecord(model);
            issueinitialqualityreviewfrm.loadRecord(model);
            issuerootcauseanalysisfrm.loadRecord(model);
            activeTab
              .down("displayfield[name=workflow_stage]")
              .setValue(results.workflow_stage);
            activeTab
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            issuemanagementfrm
              .down("datefield[name=creation_date]")
              .setValue(new Date(results.creation_date));

            issuemanagementfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });
            complainantdetailsfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });

            issueinitialqualityreviewfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });

            // Parse the string using JSON.parse() (assuming valid JSON format)
            const section_ids_array = JSON.parse(results.section_ids);
            issuemanagementfrm
              .down("tagfield[name=section_ids]")
              .setValue(section_ids_array);

            issueinitialqualityreviewfrm
              .down("radiogroup[name=complaint_direct_or_indirect]")
              .setValue({
                complaint_direct_or_indirect:
                  results.complaint_direct_or_indirect,
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

  prepapreIssueResolutionReview: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var activeTab = pnl,
      issuemanagementfrm = activeTab.down("issuemanagementfrm"),
      complainantdetailsfrm = activeTab.down("complainantdetailsfrm"),
      issueinitialqualityreviewfrm = activeTab.down(
        "issueinitialqualityreviewfrm"
      ),
      issuerootcauseanalysisfrm = activeTab.down("issuerootcauseanalysisfrm"),
      issueresolutionfrm = activeTab.down("issueresolutionfrm"),
      issuemanagementdocuploadsgrid = activeTab.down(
        "issuemanagementdocuploadsgrid"
      ),
      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue();
    issuemanagementdocuploadsgrid
      .down("button[name=add_upload]")
      .setVisible(false);

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
            complainantdetailsfrm.loadRecord(model);
            issueinitialqualityreviewfrm.loadRecord(model);
            issuerootcauseanalysisfrm.loadRecord(model);
            issueresolutionfrm.loadRecord(model);
            activeTab
              .down("displayfield[name=workflow_stage]")
              .setValue(results.workflow_stage);
            activeTab
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            issuemanagementfrm
              .down("datefield[name=creation_date]")
              .setValue(new Date(results.creation_date));

            issuemanagementfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });
            complainantdetailsfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });

            issueinitialqualityreviewfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });

            issuerootcauseanalysisfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });
            // Parse the string using JSON.parse() (assuming valid JSON format)
            const section_ids_array = JSON.parse(results.section_ids);
            issuemanagementfrm
              .down("tagfield[name=section_ids]")
              .setValue(section_ids_array);

            issueinitialqualityreviewfrm
              .down("radiogroup[name=complaint_direct_or_indirect]")
              .setValue({
                complaint_direct_or_indirect:
                  results.complaint_direct_or_indirect,
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

  prepapreIssueQualityOfficeReview: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var activeTab = pnl,
      issuemanagementfrm = activeTab.down("issuemanagementfrm"),
      complainantdetailsfrm = activeTab.down("complainantdetailsfrm"),
      issueinitialqualityreviewfrm = activeTab.down(
        "issueinitialqualityreviewfrm"
      ),
      issuerootcauseanalysisfrm = activeTab.down("issuerootcauseanalysisfrm"),
      issueresolutionfrm = activeTab.down("issueresolutionfrm"),
      issuequalityreviewfrm = activeTab.down("issuequalityreviewfrm"),
      issuemanagementdocuploadsgrid = activeTab.down(
        "issuemanagementdocuploadsgrid"
      ),
      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue();
    issuemanagementdocuploadsgrid
      .down("button[name=add_upload]")
      .setVisible(false);

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
            complainantdetailsfrm.loadRecord(model);
            issueinitialqualityreviewfrm.loadRecord(model);
            issuerootcauseanalysisfrm.loadRecord(model);
            issueresolutionfrm.loadRecord(model);
            issuequalityreviewfrm.loadRecord(model);
            activeTab
              .down("displayfield[name=workflow_stage]")
              .setValue(results.workflow_stage);
            activeTab
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            issuemanagementfrm
              .down("datefield[name=creation_date]")
              .setValue(new Date(results.creation_date));

            issuemanagementfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });
            complainantdetailsfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });

            issueinitialqualityreviewfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });

            issuerootcauseanalysisfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });

            issueresolutionfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });
            // Parse the string using JSON.parse() (assuming valid JSON format)
            const section_ids_array = JSON.parse(results.section_ids);
            issuemanagementfrm
              .down("tagfield[name=section_ids]")
              .setValue(section_ids_array);

            issueinitialqualityreviewfrm
              .down("radiogroup[name=complaint_direct_or_indirect]")
              .setValue({
                complaint_direct_or_indirect:
                  results.complaint_direct_or_indirect,
              });
            issuequalityreviewfrm
              .down("radiogroup[name=complaint_fully_addressed]")
              .setValue({
                complaint_fully_addressed:
                  results.complaint_fully_addressed,
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
      complainantdetailsfrm = activeTab.down("complainantdetailsfrm"),
      issueinitialqualityreviewfrm = activeTab.down(
        "issueinitialqualityreviewfrm"
      ),
      issuerootcauseanalysisfrm = activeTab.down("issuerootcauseanalysisfrm"),
      issueresolutionfrm = activeTab.down("issueresolutionfrm"),
      issuequalityreviewfrm = activeTab.down("issuequalityreviewfrm"),
      issuemanagementdocuploadsgrid = activeTab.down(
        "issuemanagementdocuploadsgrid"
      ),
      active_application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue();
    issuemanagementdocuploadsgrid
      .down("button[name=add_upload]")
      .setVisible(false);

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
            complainantdetailsfrm.loadRecord(model);
            issueinitialqualityreviewfrm.loadRecord(model);
            issuerootcauseanalysisfrm.loadRecord(model);
            issueresolutionfrm.loadRecord(model);
            issuequalityreviewfrm.loadRecord(model);
            activeTab
              .down("displayfield[name=workflow_stage]")
              .setValue(results.workflow_stage);
            activeTab
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            issuemanagementfrm
              .down("datefield[name=creation_date]")
              .setValue(new Date(results.creation_date));

            issuemanagementfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });
            complainantdetailsfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });

            issueinitialqualityreviewfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });

            issuerootcauseanalysisfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });

            issueresolutionfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });
              issuequalityreviewfrm
              .getForm()
              .getFields()
              .each(function (field) {
                field.setReadOnly(true);
              });
            // Parse the string using JSON.parse() (assuming valid JSON format)
            const section_ids_array = JSON.parse(results.section_ids);
            issuemanagementfrm
              .down("tagfield[name=section_ids]")
              .setValue(section_ids_array);

            issueinitialqualityreviewfrm
              .down("radiogroup[name=complaint_direct_or_indirect]")
              .setValue({
                complaint_direct_or_indirect:
                  results.complaint_direct_or_indirect,
              });
            issuequalityreviewfrm
              .down("radiogroup[name=complaint_fully_addressed]")
              .setValue({
                complaint_fully_addressed:
                  results.complaint_fully_addressed,
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
});
