Ext.define("Admin.view.issuemanagement.viewcontroller.IssueManagementVctr", {
  extend: "Ext.app.ViewController",
  alias: "controller.issuemanagementvctr",

  init: function () {},

  setWorkflowCombosStore: function (obj, options) {
    this.fireEvent("setWorkflowCombosStore", obj, options);
  },
  setCompStore: function (obj, options) {
    this.fireEvent("setCompStore", obj, options);
  },

  setGridStore: function (obj, options) {
    this.fireEvent("setGridStore", obj, options);
  },
  setGridTreeStore: function (obj, options) {
    this.fireEvent("setGridTreeStore", obj, options);
  },

  reloadParentGridOnChange: function (combo) {
    var grid = combo.up("grid"),
      store = grid.getStore();
    store.load();
  },

  onViewIssueManagementApplication: function (grid, record) {
    this.fireEvent("viewApplicationDetails", record);
  },

  showIssueManagementSubmissionWin: function (btn) {
    this.fireEvent("showIssueManagementSubmissionWin", btn);
  },

  showIssueApplicationWorkflow: function (btn) {
    var application_type = btn.app_type,
      wrapper_xtype = btn.wrapper_xtype;
    this.fireEvent("showApplicationWorkflow", application_type, wrapper_xtype);
  },

  doCreateConfigParamWin: function (btn) {
    var me = this,
      url = btn.action_url,
      table = btn.table_name,
      form = btn.up("form"),
      win = form.up("window"),
      storeID = btn.storeID,
      store = Ext.getStore(storeID),
      frm = form.getForm();
    if (frm.isValid()) {
      frm.submit({
        url: url,
        params: { model: table },
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

  doDeleteConfigWidgetParam: function (item) {
    var me = this,
      btn = item.up("button"),
      record = btn.getWidgetRecord(),
      id = record.get("submission_id"),
      storeID = item.storeID,
      table_name = item.table_name,
      url = item.action_url;
    this.fireEvent("deleteRecord", id, table_name, storeID, url);
  },

  showIssueTypeConfigParam: function (item) {
    var me = this,
      btn = item.up("button"),
      childXtype = item.childXtype,
      winTitle = item.winTitle,
      winWidth = item.winWidth,
      form = Ext.widget(childXtype),
      storeArray = eval(item.stores),
      arrayLength = storeArray.length;
    if (arrayLength > 0) {
      me.fireEvent("refreshStores", storeArray);
    }
    funcShowCustomizableWindow(winTitle, winWidth, form, "customizablewindow");
  },

  showAddConfigParamWinFrm: function (btn) {
    var me = this,
      childXtype = btn.childXtype,
      winTitle = btn.winTitle,
      winWidth = btn.winWidth,
      child = Ext.widget(childXtype);

    if (btn.has_params) {
      var param_value = btn
        .up("grid")
        .down("hiddenfield[name=" + btn.param_name + "]")
        .getValue();
      child
        .down("hiddenfield[name=" + btn.param_name + "]")
        .setValue(param_value);
    }
    child.setHeight(600);
    funcShowCustomizableWindow(winTitle, winWidth, child, "customizablewindow");
  },

  showEditConfigParamWinFrm: function (item) {
    var me = this,
      btn = item.up("button"),
      record = btn.getWidgetRecord(),
      childXtype = item.childXtype,
      winTitle = item.winTitle,
      winWidth = item.winWidth,
      form = Ext.widget(childXtype),
      storeArray = eval(item.stores),
      arrayLength = storeArray.length;
    if (arrayLength > 0) {
      me.fireEvent("refreshStores", storeArray);
    }
    form.loadRecord(record);

    form.on("afterrender", function () {
      try {
        const property_ids = record.get("property_ids");
        if (property_ids) {
          const property_ids_array = JSON.parse(property_ids);
          form.down("tagfield[name=property_ids]").setValue(property_ids_array);
        }
      } catch (e) {
        console.error("Error parsing property_ids:", e);
      }
    });
    form.setHeight(650);
    funcShowCustomizableWindow(winTitle, winWidth, form, "customizablewindow");
  },
  onAddClick: function () {
    var view = this.getView(),
      rec =
        new Admin.view.issuemanagement.viewmodel.IssueStatusGroupsLifecycleVm({
          common: "",
          light: "Mostly Shady",
          price: 0,
          availDate: Ext.Date.clearTime(new Date()),
          indoor: false,
        });

    view.store.insert(0, rec);
    view.findPlugin("cellediting").startEdit(rec, 0);
  },
  onRemoveClick: function (view, recIndex, cellIndex, item, e, record) {
    record.drop();
  },

  showNewIssueApplication: function (btn) {
    var me = this,
      form = btn.up("form"),
      win = btn.up("window"),
      wrapper_xtype = btn.wrapper_xtype;
    // Get the selected Issue Type
    issue_type_id = form.query('combo[name="issue_type_id"]')[0].getValue();

    if (!isNaN(issue_type_id)) {
      //Find Application type and workflow using this
      //Make the form dynamic based on this issue type i.e Change Management, Customer Complaints, Deviation, Corrective Actions
      Ext.Ajax.request({
        url: "issuemanagement/getIssueProcessDetails",
        method: "GET",
        params: {
          issue_type_id: issue_type_id,
        },
        headers: {
          Authorization: "Bearer " + access_token,
          "X-CSRF-Token": token,
        },
        success: function (response) {
          var resp = Ext.JSON.decode(response.responseText),
            success = resp.success,
            results = resp.results;
          if (results != null && success === true) {
            var application_type = resp.results.sub_module_id,
              module_id = resp.results.module_id;
            me.fireEvent(
              "onNewIssueApplication",
              application_type,
              issue_type_id,
              wrapper_xtype,
              module_id
            );
            win.close();
          } else {
            win.close();
            toastr.error(
              "Problem encountered while fetching workflow details-->Possibly workflow not set!!",
              "Failure Response"
            );
          }
        },
        failure: function (response) {
          var resp = Ext.JSON.decode(response.responseText),
            message = resp.message;
          toastr.error(message, "Failure Response");
        },
        error: function (jqXHR, textStatus, errorThrown) {
          toastr.error(
            "Error downloading data: " + errorThrown,
            "Error Response"
          );
        },
      });
    }
  },

  quickNavigation: function (btn) {
    var step = btn.step,
      wizard = btn.wizard,
      max_step = btn.max_step,
      wizardPnl = btn.up(wizard);

    motherPnl = wizardPnl;
    (panel = motherPnl.up("panel")),
      (application_id = motherPnl
        .down("hiddenfield[name=sub_module_id]")
        .getValue()),
      (progress = wizardPnl.down("#progress_tbar")),
      (progressItems = progress.items.items);

    if (step == 1) {
      var thisItem = progressItems[step];
      if (!application_id) {
        thisItem.setPressed(false);
        toastr.warning("Please save issue details first!!", "Warning Response");
        return false;
      }
    }
    if (step == 0) {
      motherPnl.down("button[name=save]").setVisible(true);
      panel.getViewModel().set("atBeginning", false);
      panel.getViewModel().set("atEnd", true);
      // wizardPnl.down("button[name=process_submission_btn]").setVisible(false);
    } else if (step == max_step) {
      motherPnl.down("button[name=save]").setVisible(false);
      panel.getViewModel().set("atBeginning", true);
      // wizardPnl.down("button[name=process_submission_btn]").setVisible(true);
    } else {
      panel.getViewModel().set("atBeginning", false);
      panel.getViewModel().set("atEnd", false);
      if (wizardPnl.down("button[name=save]")) {
        wizardPnl.down("button[name=save]").setVisible(false);
      }

      // wizardPnl.down("button[name=process_submission_btn]").setVisible(false);
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

  onBackToListClick: function (btn) {
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
    var wizard = btn.wizard,
      wizardPnl = btn.up(wizard);
    wizardPnl.getViewModel().set("atEnd", false);
    this.navigate(btn, wizardPnl, "prev");
  },

  onNextCardClick: function (btn) {
    var wizard = btn.wizard,
      wizardPnl = btn.up(wizard);
    motherPnl = wizardPnl.up("panel");

    motherPnl.getViewModel().set("atBeginning", false);
    this.navigate(btn, wizardPnl, "next");
  },

  saveIssueManagementApplicationReceivingBaseDetails: function (btn) {
    var wizard = btn.wizardpnl,
      wizardPnl = btn.up(wizard),
      action_url = btn.action_url,
      form_panel = btn.form_panel,
      mainTabPnl = btn.up("#contentPanel"),
      containerPnl = mainTabPnl.getActiveTab();
    var process_id = containerPnl
        .down("hiddenfield[name=process_id]")
        .getValue(),
      module_id = containerPnl.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = containerPnl
        .down("hiddenfield[name=sub_module_id]")
        .getValue(),
      active_application_id = containerPnl
        .down("hiddenfield[name=active_application_id]")
        .getValue(),
      application_code = containerPnl
        .down("hiddenfield[name=active_application_code]")
        .getValue(),
      application_status_id = containerPnl
        .down("hiddenfield[name=application_status_id]")
        .getValue(),
      workflow_stage_id = containerPnl
        .down("hiddenfield[name=workflow_stage_id]")
        .getValue(),
      issuemanagementfrm = containerPnl.down("issuemanagementfrm"),
      complainantdetailsfrm = containerPnl.down("complainantdetailsfrm");

    // Validate both forms
    if (issuemanagementfrm.isValid() && complainantdetailsfrm.isValid()) {
      // Gather data from each form
      var issueManagementData = issuemanagementfrm.getValues();
      var complainantDetailsData = complainantdetailsfrm.getValues();

      // Combine the data
      var combinedData = {
        process_id: process_id,
        module_id: module_id,
        sub_module_id: sub_module_id,
        application_code: application_code,
        active_application_id: active_application_id,
        application_status_id: application_status_id,
        workflow_stage_id: workflow_stage_id,
      };

      for (var key in issueManagementData) {
        combinedData[key] = issueManagementData[key];
      }

      for (var key in complainantDetailsData) {
        combinedData[key] = complainantDetailsData[key];
      }

      // Submit the data to the endpoint
      Ext.Ajax.request({
        url: action_url,
        waitMsg: "Please wait...",
        method: "POST",
        params: combinedData,
        success: function (response) {
          var resp = Ext.decode(response.responseText),
            results = resp.results;
          if (resp.success) {
            containerPnl
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            containerPnl
              .down("hiddenfield[name=active_application_id]")
              .setValue(results.active_application_id);
            containerPnl
              .down("hiddenfield[name=active_application_code]")
              .setValue(results.application_code);
            toastr.success(resp.message, "Success Response");
          } else {
            toastr.error(resp.message, "Failure Response");
          }
        },
        failure: function (response) {
          toastr.error(response.message, "Failure Response");
        },
      });
    } else {
      toastr.warning(
        "Please fill all the required fields!!",
        "Warning Response"
      );
    }
  },

  saveIssueManagementInitialQualityReviewDetails: function (btn) {
    var wizard = btn.wizardpnl,
      wizardPnl = btn.up(wizard),
      action_url = btn.action_url,
      form_panel = btn.form_panel,
      mainTabPnl = btn.up("#contentPanel"),
      containerPnl = mainTabPnl.getActiveTab();
    var process_id = containerPnl
        .down("hiddenfield[name=process_id]")
        .getValue(),
      module_id = containerPnl.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = containerPnl
        .down("hiddenfield[name=sub_module_id]")
        .getValue(),
      active_application_id = containerPnl
        .down("hiddenfield[name=active_application_id]")
        .getValue(),
      application_code = containerPnl
        .down("hiddenfield[name=active_application_code]")
        .getValue(),
      application_status_id = containerPnl
        .down("hiddenfield[name=application_status_id]")
        .getValue(),
      workflow_stage_id = containerPnl
        .down("hiddenfield[name=workflow_stage_id]")
        .getValue(),
      issueinitialqualityreviewfrm = containerPnl.down(
        "issueinitialqualityreviewfrm"
      );

    if (issueinitialqualityreviewfrm.isValid()) {
      var issueManagementData = issueinitialqualityreviewfrm.getValues();

      // Combine the data
      var combinedData = {
        process_id: process_id,
        module_id: module_id,
        sub_module_id: sub_module_id,
        application_code: application_code,
        active_application_id: active_application_id,
        application_status_id: application_status_id,
        workflow_stage_id: workflow_stage_id,
      };

      for (var key in issueManagementData) {
        combinedData[key] = issueManagementData[key];
      }

      // Submit the data to the endpoint
      Ext.Ajax.request({
        url: action_url,
        waitMsg: "Please wait...",
        method: "POST",
        params: combinedData,
        success: function (response) {
          var resp = Ext.decode(response.responseText),
            results = resp.results;
          if (resp.success) {
            containerPnl
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            containerPnl
              .down("hiddenfield[name=active_application_id]")
              .setValue(results.active_application_id);
            containerPnl
              .down("hiddenfield[name=active_application_code]")
              .setValue(results.application_code);
            toastr.success(resp.message, "Success Response");
          } else {
            toastr.error(resp.message, "Failure Response");
          }
        },
        failure: function (response) {
          toastr.error(response.message, "Failure Response");
        },
      });
    } else {
      toastr.error("Please fill all the required fields!!", "Warning Response");
    }
  },

  saveIssueRCAeviewDetails: function (btn) {
    var wizard = btn.wizardpnl,
      action_url = btn.action_url,
      form_panel = btn.form_panel,
      mainTabPnl = btn.up("#contentPanel"),
      containerPnl = mainTabPnl.getActiveTab();
    var process_id = containerPnl
        .down("hiddenfield[name=process_id]")
        .getValue(),
      module_id = containerPnl.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = containerPnl
        .down("hiddenfield[name=sub_module_id]")
        .getValue(),
      active_application_id = containerPnl
        .down("hiddenfield[name=active_application_id]")
        .getValue(),
      application_code = containerPnl
        .down("hiddenfield[name=active_application_code]")
        .getValue(),
      application_status_id = containerPnl
        .down("hiddenfield[name=application_status_id]")
        .getValue(),
      workflow_stage_id = containerPnl
        .down("hiddenfield[name=workflow_stage_id]")
        .getValue();
    issuerootcauseanalysisfrm = containerPnl.down("issuerootcauseanalysisfrm");

    if (issuerootcauseanalysisfrm.isValid()) {
      var issueManagementData = issuerootcauseanalysisfrm.getValues();

      // Combine the data
      var combinedData = {
        process_id: process_id,
        module_id: module_id,
        sub_module_id: sub_module_id,
        application_code: application_code,
        active_application_id: active_application_id,
        application_status_id: application_status_id,
        workflow_stage_id: workflow_stage_id,
      };

      for (var key in issueManagementData) {
        combinedData[key] = issueManagementData[key];
      }

      // Submit the data to the endpoint
      Ext.Ajax.request({
        url: action_url,
        waitMsg: "Please wait...",
        method: "POST",
        params: combinedData,
        success: function (response) {
          var resp = Ext.decode(response.responseText),
            results = resp.results;
          if (resp.success) {
            containerPnl
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            containerPnl
              .down("hiddenfield[name=active_application_id]")
              .setValue(results.active_application_id);
            containerPnl
              .down("hiddenfield[name=active_application_code]")
              .setValue(results.application_code);
            toastr.success(resp.message, "Success Response");
          } else {
            toastr.error(resp.message, "Failure Response");
          }
        },
        failure: function (response) {
          toastr.error(response.message, "Failure Response");
        },
      });
    } else {
      toastr.error("Please fill all the required fields!!", "Warning Response");
    }
  },
  saveIssueResolutionwDetails: function (btn) {
    var wizard = btn.wizardpnl,
      action_url = btn.action_url,
      form_panel = btn.form_panel,
      mainTabPnl = btn.up("#contentPanel"),
      containerPnl = mainTabPnl.getActiveTab();
    var process_id = containerPnl
        .down("hiddenfield[name=process_id]")
        .getValue(),
      module_id = containerPnl.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = containerPnl
        .down("hiddenfield[name=sub_module_id]")
        .getValue(),
      active_application_id = containerPnl
        .down("hiddenfield[name=active_application_id]")
        .getValue(),
      application_code = containerPnl
        .down("hiddenfield[name=active_application_code]")
        .getValue(),
      application_status_id = containerPnl
        .down("hiddenfield[name=application_status_id]")
        .getValue(),
      workflow_stage_id = containerPnl
        .down("hiddenfield[name=workflow_stage_id]")
        .getValue();
    issueresolutionfrm = containerPnl.down("issueresolutionfrm");

    if (issueresolutionfrm.isValid()) {
      var issueManagementData = issueresolutionfrm.getValues();

      // Combine the data
      var combinedData = {
        process_id: process_id,
        module_id: module_id,
        sub_module_id: sub_module_id,
        application_code: application_code,
        active_application_id: active_application_id,
        application_status_id: application_status_id,
        workflow_stage_id: workflow_stage_id,
      };

      for (var key in issueManagementData) {
        combinedData[key] = issueManagementData[key];
      }

      // Submit the data to the endpoint
      Ext.Ajax.request({
        url: action_url,
        waitMsg: "Please wait...",
        method: "POST",
        params: combinedData,
        success: function (response) {
          var resp = Ext.decode(response.responseText),
            results = resp.results;
          if (resp.success) {
            containerPnl
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            containerPnl
              .down("hiddenfield[name=active_application_id]")
              .setValue(results.active_application_id);
            containerPnl
              .down("hiddenfield[name=active_application_code]")
              .setValue(results.application_code);
            toastr.success(resp.message, "Success Response");
          } else {
            toastr.error(resp.message, "Failure Response");
          }
        },
        failure: function (response) {
          toastr.error(response.message, "Failure Response");
        },
      });
    } else {
      toastr.error("Please fill all the required fields!!", "Warning Response");
    }
  },
  saveIssueQualityReviewDetails: function (btn) {
    var wizard = btn.wizardpnl,
      action_url = btn.action_url,
      form_panel = btn.form_panel,
      mainTabPnl = btn.up("#contentPanel"),
      containerPnl = mainTabPnl.getActiveTab();
    var process_id = containerPnl
        .down("hiddenfield[name=process_id]")
        .getValue(),
      module_id = containerPnl.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = containerPnl
        .down("hiddenfield[name=sub_module_id]")
        .getValue(),
      active_application_id = containerPnl
        .down("hiddenfield[name=active_application_id]")
        .getValue(),
      application_code = containerPnl
        .down("hiddenfield[name=active_application_code]")
        .getValue(),
      application_status_id = containerPnl
        .down("hiddenfield[name=application_status_id]")
        .getValue(),
      workflow_stage_id = containerPnl
        .down("hiddenfield[name=workflow_stage_id]")
        .getValue();
    issuequalityreviewfrm = containerPnl.down("issuequalityreviewfrm");

    if (issuequalityreviewfrm.isValid()) {
      var issueManagementData = issuequalityreviewfrm.getValues();

      // Combine the data
      var combinedData = {
        process_id: process_id,
        module_id: module_id,
        sub_module_id: sub_module_id,
        application_code: application_code,
        active_application_id: active_application_id,
        application_status_id: application_status_id,
        workflow_stage_id: workflow_stage_id,
      };

      for (var key in issueManagementData) {
        combinedData[key] = issueManagementData[key];
      }

      // Submit the data to the endpoint
      Ext.Ajax.request({
        url: action_url,
        waitMsg: "Please wait...",
        method: "POST",
        params: combinedData,
        success: function (response) {
          var resp = Ext.decode(response.responseText),
            results = resp.results;
          if (resp.success) {
            containerPnl
              .down("displayfield[name=tracking_no]")
              .setValue(results.reference_no);
            containerPnl
              .down("hiddenfield[name=active_application_id]")
              .setValue(results.active_application_id);
            containerPnl
              .down("hiddenfield[name=active_application_code]")
              .setValue(results.application_code);
            toastr.success(resp.message, "Success Response");
          } else {
            toastr.error(resp.message, "Failure Response");
          }
        },
        failure: function (response) {
          toastr.error(response.message, "Failure Response");
        },
      });
    } else {
      toastr.error("Please fill all the required fields!!", "Warning Response");
    }
  },
});
