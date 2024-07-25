Ext.define("Admin.controller.SharedUtilitiesCtr", {
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
  },
  stores: [
    "Admin.store.administration.NavigationStr",
    "Admin.store.abstract.AbstractStore",
    "Admin.store.administration.SystemMenusStr",
    "Admin.store.administration.OnlineMenusStr",
    "Admin.store.ConfirmationStr",
    "Admin.store.abstract.AbstractTreeStr",
    "Admin.store.administration.UsershareditemsStr",
    "Admin.store.AgreeConfirmationStr",
    "Admin.store.ComplianceRiskScaleStr",
  ],
  control: {
    applicationdocuploadsgrid: {
      refresh: "refreshApplicationDocUploadsGrid",
    },
    applicationdocreleasegrid: {
      refresh: "refreshApplicationDocUploadsGrid",
    },
    soptemplatedocuploadgrid: {
      refresh: "refreshApplicationDocUploadsGrid",
    },
    formformatdocuploadgrid: {
      refresh: "refreshApplicationDocUploadsGrid",
    },
    logdatabasesdocuploadgrid: {
      refresh: "refreshApplicationDocUploadsGrid",
    },
    applicationdocpreviewnavigatorgrid: {
      refresh: "refreshApplicationDocUploadsGrid",
    },
    applicationdocpreviewnavigatorgrid: {
      refresh: "refreshApplicationDocPreviewNavigatorGrid",
    },
    "documentsubmissionpnl button[name=recommendation]": {
      click: "AddGeneralComment",
    },
    "soptemplatereviewpnl button[name=recommendation]": {
      click: "AddGeneralComment",
    },
    "applicationdocuploadsgrid button[name=add_upload]": {
      click: "showApplicationDocUploadWin",
    },

    "soptemplatedocuploadgrid button[name=add_upload]": {
      click: "showApplicationDocUploadWin",
    },
    "formformatdocuploadgrid button[name=add_upload]": {
      click: "showApplicationDocUploadWin",
    },
    "logdatabasesdocuploadgrid button[name=add_upload]": {
      click: "showApplicationDocUploadWin",
    },
    "peerReviewMeetingPnl button[name=process_submission_btn]": {
      click: "showManagerApplicationSubmissionWinGeneric",
    },
    "documentapprovalfrm button[name=save_recommendation]": {
      click: "saveDocumentReviewRecommendationDetails",
    },
    "approvalrecommendationfrm button[name=save_recommendation]": {
      click: "saveApplicationApprovalDetails",
    },
    documentapplicationreceivingwizard: {
      afterrender: "prepapreDocumentApplicationReceiving",
    },
    documentrenewalwizard: {
      afterrender: "prepapreDocumentApplicationRenewal",
    },
    documentsubmissionpnl: {
      afterrender: "prepapreDocumentApplicationScreening",
    },
    soptemplatereviewpnl: {
      afterrender: "prepapreSOPTemplateApplicationScreening",
    },
    documentsviewpnl: {
      afterrender: "prepapreDocumentApplicationNavigator",
    },
    documentsubmissionapprovalpnl: {
      afterrender: "prepapreDocumentApplicationApproval",
    },
    soptemplateapprovalpnl: {
      afterrender: "prepapreSOPTemplateApplicationApproval",
    },
    documentreleasepnl: {
      afterrender: "prepapreDocumentApplicationRelease",
    },
    soptemplatereleasepnl: {
      afterrender: "prepapreSOPTemplateApplicationRelease",
    },
    "documenttypetb button[name=disposalpermitstbRegHomeBtn]": {
      click: "documenttypeRegHome",
    },
    "applicationcommentsFrm button[name=save_comment]": {
      click: "saveApplicationComment",
    },
    "qmsdoclistfrm button[action=search_navigator]": {
      click: "showNavigatorSelectionList",
    },
    navigatorselectfoldergrid: {
      itemdblclick: "onNavigatorSelectionListDblClick",
    },
    receivingsoptemplatepnl: {
      afterrender: "prepareSOPTemplateApplication",
    },
    formformatreceivingpnl: {
      afterrender: "prepareSOPTemplateApplication",
    },
    logdatabasesreceivingpnl: {
      afterrender: "prepareSOPTemplateApplication",
    },
    "soptemplatedoclistfrm button[action=search_navigator]": {
      click: "showNavigatorSelectionList",
    },
  
    "button[name=upload_file_btn]": {
      click: "uploadApplicationFile",
      afterrender: "initializeResumableUpload",
    },
    // "button[name=upload_excel_btn]": {
    //   click: "uploadExcelFile",
    //   // sendExcelToBD
    //   afterrender: "initializeResumableExcelUpload",
    // },
  },
  listen: {
    controller: {
      "*": {
        setGridStore: "setGridStore",
        setGridTreeStore: "setGridTreeStore",
        viewApplicationDetails: "onViewApplicationDetails",
        setCompStore: "setCompStore",
        deleteRecord: "deleteRecordByID",
        onInitiateDocumentApplication: "onInitiateDocumentApplication",
        onInitiateNavigatorApplication: "onInitiateNavigatorApplication",
        showReceivingApplicationSubmissionWin:"showReceivingApplicationSubmissionWin",
        getDocumentReleaseRecommendationDetails: "getDocumentReleaseRecommendationDetails",    
        viewNavigatorDocDetails: "onViewNavigatorDocDetails", 
        onInitiateLiveDocumentApplication: "onInitiateLiveDocumentApplication",
        viewLiveDocumentDetails: "onViewLiveDocumentDetails",
        downloadsopTemplate: "downloadsopTemplate",
        downloadFormFormat: "downloadFormFormat",
        downloadlogdatabasesTemplate: "downloadlogdatabasesTemplate",
        renderParameterMenu: "renderParameterMenu",
      },
    },
  },
  setGridStore: function (me, options) {
    // console.log(me);
    var config = options.config,
      isLoad = options.isLoad,
      toolbar = me.down("pagingtoolbar"),
      store = Ext.create("Admin.store.abstract.AbstractStore", config);
    me.setStore(store);
    toolbar.setStore(store);
    if (isLoad === true || isLoad == true) {
      store.removeAll();
      store.load();
    }
  },
  documenttypeRegHome: function (btn) {
    var me = this,
      mainTabPanel = me.getMainTabPanel(),
      sec_dashboard = btn.sec_dashboard,
      activeTab = mainTabPanel.getActiveTab(),
      dashboardWrapper = activeTab.down("#documentapplicationwrapper");
    if (!dashboardWrapper.down(sec_dashboard)) {
      dashboardWrapper.removeAll();
      dashboardWrapper.add({ xtype: sec_dashboard });
    }
  },
 
  setGridTreeStore: function (me, options) {
    // console.log(me);
    var config = options.config,
      isLoad = options.isLoad,
      toolbar = me.down("pagingtoolbar"),
      store = Ext.create("Admin.store.abstract.AbstractTreeStr", config);
    me.setStore(store);
    toolbar.setStore(store);
    if (isLoad === true || isLoad == true) {
      store.removeAll();
      store.load();
    }
  },
  setCompStore: function (me, options) {
    var config = options.config,
      isLoad = options.isLoad,
      store = Ext.create("Admin.store.abstract.AbstractStore", config);
    me.setStore(store);
    if (isLoad === true || isLoad == true) {
      store.removeAll();
      store.load();
    }
  },
  getDocumentReleaseRecommendationDetails: function (btn) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      application_id = activeTab.down("hiddenfield[name=active_application_id]").getValue(),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      reference_no = activeTab.down("displayfield[name=reference_no]").getValue(),
      tracking_no = activeTab.down("displayfield[name=tracking_no]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue(),
      is_siginig = btn.is_siginig,
      approval_frm = "documentapprovalfrm",
      table_name = "tra_documentmanager_application",
      vwcontroller = "documentsManagementvctr",
      stores = '["productApprovalDecisionsStr"]',
      form = Ext.widget(approval_frm),
      storeArray = eval(stores),
      arrayLength = storeArray.length;

    if (arrayLength > 0) {
      me.fireEvent("refreshStores", storeArray);
    }
    if (is_siginig == 1) {
      hasApprovalRec = checkApprovalRecDetails(
        application_code,
        application_id
      );
      if (!hasApprovalRec) {
        toastr.warning("Add recommendation First!!", "Warning Response");
        Ext.getBody().unmask();
        return false;
      }
    }
    form.down("hiddenfield[name=table_name]").setValue(table_name);
    Ext.Ajax.request({
      method: "GET",
      url: "common/getPermitReleaseRecommendationDetails",
      params: {
        application_id: application_id,
        application_code: application_code,
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
      success: function (response) {
        Ext.getBody().unmask();
        var resp = Ext.JSON.decode(response.responseText),
          success = resp.success,
          message = resp.message,
          results = resp.results,
          model = Ext.create("Ext.data.Model", results);
        if (success == true || success === true) {
          if (results) {
            permit_no = results.permit_no;
            expiry_date = results.expiry_date;
          } else {
            permit_no = "";
            expiry_date = "";
          }
          form.loadRecord(model);
          form.down("hiddenfield[name=application_id]").setValue(application_id);
          form.down("hiddenfield[name=application_code]").setValue(application_code);
          form.down("textfield[name=certificate_no]").setValue(permit_no);
          form.down("datefield[name=expiry_date]").setValue(expiry_date);
          form.down("hiddenfield[name=process_id]").setValue(process_id);
          form.down("hiddenfield[name=workflow_stage_id]").setValue(workflow_stage_id);
          //hide fields
          if (is_siginig == 0) {
            form.down("textfield[name=certificate_no]").setHidden(true);
            form.down("textfield[name=sign_file]").setHidden(true);
            form.down("combo[name=dg_signatory]").setHidden(true);
            form.down("combo[name=permit_signatory]").setHidden(true);
            form.down("button[name=signature_btn]").setHidden(true);
            form.down("fieldset[name=sign_container]").setHidden(true);
            form.down("datefield[name=expiry_date]").setHidden(true);
          } else if (is_siginig == 1) {
            form.down("button[name=save_recommendation]").setHidden(true);
            form.down("combo[name=permit_signatory]").setHidden(true);
            form.down("combo[name=dg_signatory]").setHidden(true);
          }
          funcShowCustomizableWindow(
            "Document Approval Recommendation",
            "40%",
            form,
            "customizablewindow"
          );
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
  },
  onViewApplicationDetails: function (record) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      mainTabPanel = me.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      process_id = record.get("process_id"),
      workflow_stage_id = record.get("workflow_stage_id"),
      workflow_stage = record.get("workflow_stage"),
      ref_no = record.get("reference_no"),
      tracking_no = record.get("tracking_no"),
      isGeneral = record.get("is_general"),
      view_id = record.get("view_id"),
      html_id = record.get("destination_html_id"),
      title_suffix = ref_no;

    workflow_details = getAllWorkflowDetails(process_id, workflow_stage_id);

    //console.log(stage_category_id);
    if (!workflow_details || workflow_details.length < 1) {
      Ext.getBody().unmask();
      toastr.warning(
        "Problem encountered while fetching workflow details-->Possibly workflow not set!!",
        "Warning Response"
      );
      return false;
    }
    if (!ref_no || ref_no == "" || ref_no == null) {
      title_suffix = tracking_no;
    }

    var tab = mainTabPanel.getComponent(view_id),
      title = workflow_stage + "-" + title_suffix;
    title = workflow_stage; //+ '-' + title_suffix;
    if (isGeneral && (isGeneral == 1 || isGeneral === 1)) {
      title = workflow_stage;
      view_id = view_id + Math.floor(Math.random() * 100015);
    }
    if (!tab) {
      //
      var newTab = Ext.widget(workflow_details.viewtype, {
        title: "Document",
        id: view_id,
        closable: true,
      });

      //updates the access control on the interface to be rendered.
      //me.updateVisibilityAccess(newTab, workflow_stage_id);
      me.updateVisibilityAccess(newTab, workflow_stage_id);
      //prepare the interface and populates it accordingly
      me.prepareApplicationBaseDetails(newTab, record);
      mainTabPanel.add(newTab);
      var sub_module_id = record.get("sub_module_id");
      // if(sub_module_id == 8 && newTab.down('button[name=save_btn]')){
      //     newTab.getViewModel().set('isReadOnly', true);
      //     newTab.down('button[name=save_btn]').action_url = 'saveRenAltProductReceivingBaseDetails';
      // }
      // if(sub_module_id == 9 && newTab.down('button[name=save_btn]')){
      //     newTab.getViewModel().set('isReadOnly', true);
      //     newTab.down('button[name=save_btn]').action_url = 'saveRenAltProductReceivingBaseDetails';
      // }
      var lastTab = mainTabPanel.items.length - 1;
      mainTabPanel.setActiveTab(lastTab);
    } else {
      me.prepareApplicationBaseDetails(tab, record);
      mainTabPanel.setActiveTab(tab);
    }

    Ext.Function.defer(function () {
      Ext.getBody().unmask();
      me.updateSubmissionsTable(record, "isRead");
    }, 300);
  },

  updateVisibilityAccess: function (me, workflow_stage_id) {
    Ext.Ajax.request({
      url: "workflow/checkWorkflowStageInformationVisibilityMode",
      params: {
        stage_id: workflow_stage_id,
        _token: token,
      },
      headers: {
        Authorization: "Bearer " + access_token,
      },
      success: function (response) {
        var resp = Ext.JSON.decode(response.responseText),
          success = resp.success,
          message = resp.message;
        if (success || success == true || success === true) {
          var right = resp.access_level;

          if (me.getViewModel()) {
            /*
                        if(right == 2){
                            me.getViewModel().set('isReadOnly', true);
                            me.getViewModel().set('hideDeleteButton', false);
                        }
                        if(right == 3){
                           me.getViewModel().set('isReadOnly', false);
                           me.getViewModel().set('hideDeleteButton', false); 
                        }
                        if(right == 4){
                            me.getViewModel().set('hideDeleteButton', true); 
                            me.getViewModel().set('isReadOnly', false); 
                        }
                        if(right == 1){
                            me.getViewModel().set('isReadOnly', true); 
                            me.getViewModel().set('hideDeleteButton', false); 
                        }
*/
          }
        } else {
          // disable the warning
          //toastr.error(message, 'Failure Response!!');
        }
      },
      failure: function (response) {
        var resp = Ext.JSON.decode(response.responseText),
          message = resp.message;
        toastr.warning(message, "Failure Response!!");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        toastr.error("Error: " + errorThrown, "Error Response");
      },
    });
  },

  prepareApplicationBaseDetails: function (tab, record) {
    var me = this,
      applicant_id = record.get("applicant_id"),
      application_id = record.get("active_application_id"),
      application_code = record.get("application_code"),
      process_name = record.get("process_name"),
      workflow_stage = record.get("workflow_stage"),
      application_status = record.get("application_status"),
      tracking_no = record.get("tracking_no"),
      reference_no = record.get("reference_no"),
      process_id = record.get("process_id"),
      module_id = record.get("module_id"),
      sub_module_id = record.get("sub_module_id"),
      workflow_stage_id = record.get("workflow_stage_id"),
      application_status_id = record.get("application_status_id");

    if (tab.down("hiddenfield[name=applicant_id]")) {
      tab.down("hiddenfield[name=applicant_id]").setValue(applicant_id);
    }
    if (tab.down("hiddenfield[name=workflow_stage_id]")) {
      tab
        .down("hiddenfield[name=workflow_stage_id]")
        .setValue(workflow_stage_id);
    }

    tab
      .down("hiddenfield[name=active_application_id]")
      .setValue(application_id);
    tab
      .down("hiddenfield[name=active_application_code]")
      .setValue(application_code);
    tab.down("hiddenfield[name=process_id]").setValue(process_id);
    tab.down("hiddenfield[name=workflow_stage_id]").setValue(workflow_stage_id);
    tab
      .down("hiddenfield[name=application_status_id]")
      .setValue(application_status_id);
    tab.down("hiddenfield[name=module_id]").setValue(module_id);
    tab.down("displayfield[name=tracking_no]").setValue(tracking_no);
    tab.down("hiddenfield[name=sub_module_id]").setValue(sub_module_id);
    tab.down("displayfield[name=process_name]").setValue(process_name);
    tab.down("displayfield[name=workflow_stage]").setValue(workflow_stage);
    tab
      .down("displayfield[name=application_status]")
      .setValue(application_status);
    tab.down("displayfield[name=tracking_no]").setValue(tracking_no);
    tab.down("hiddenfield[name=application_code]").setValue(application_code);
    //tab.down('displayfield[name=reference_no]').setValue(reference_no);;;;;;
  },
   updateSubmissionsTable: function (record, update_type) {
    var application_id = record.get("active_application_id"),
      application_code = record.get("application_code"),
      current_stage = record.get("workflow_stage_id");
    Ext.Ajax.request({
      url: "workflow/updateInTrayReading",
      params: {
        application_id: application_id,
        application_code: application_code,
        current_stage: current_stage,
        update_type: update_type,
      },
      headers: {
        Authorization: "Bearer " + access_token,
        "X-CSRF-Token": token,
      },
      success: function (response) {
        Ext.getBody().unmask();
        var resp = Ext.JSON.decode(response.responseText),
          message = resp.message,
          success = resp.success;
        if (success == true || success === true) {
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
  },
  showPreviousUploadedDocsGeneric: function (
    btn,
    section_id,
    module_id,
    sub_module_id,
    workflow_stage,
    application_code
  ) {
    var childXtype = btn.childXtype,
      winTitle = btn.winTitle,
      winWidth = btn.winWidth,
      childObject = Ext.widget(childXtype);

    childObject.setHeight(450);
    childObject.down("hiddenfield[name=section_id]").setValue(section_id);
    childObject.down("hiddenfield[name=module_id]").setValue(module_id);
    childObject.down("hiddenfield[name=sub_module_id]").setValue(sub_module_id);
    childObject
      .down("hiddenfield[name=workflow_stage_id]")
      .setValue(workflow_stage);
    childObject
      .down("hiddenfield[name=application_code]")
      .setValue(application_code);
    funcShowCustomizableWindow(
      winTitle,
      winWidth,
      childObject,
      "customizablewindow"
    );
  },
  onInitiateDocumentApplication: function (sub_module_id, btn) {
    Ext.getBody().mask("Loading Please wait...");
    var me = this,
      is_dataammendment_request = btn.is_dataammendment_request,
      mainTabPanel = me.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      dashboardWrapper = activeTab.down("#documentapplicationwrapper"),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue();

    workflow_details = getInitialDocumentCreationWorkflowDetails(
      module_id,
      sub_module_id,
      is_dataammendment_request,
      ""
    );

    if (!workflow_details) {
      Ext.getBody().unmask();
      toastr.warning(
        "Problem encountered while fetching workflow details-->Possibly workflow not set!!",
        "Warning Response"
      );
      return false;
    }
    dashboardWrapper.removeAll();
    var workflowContainer = Ext.widget(workflow_details.viewtype);
    workflowContainer.down("displayfield[name=process_name]").setValue(workflow_details.processName);
    workflowContainer.down("displayfield[name=workflow_stage]").setValue(workflow_details.initialStageName);
    workflowContainer.down("displayfield[name=application_status]").setValue(workflow_details.initialStageName);
    workflowContainer.down("hiddenfield[name=process_id]").setValue(workflow_details.processId);
    workflowContainer.down("hiddenfield[name=workflow_stage_id]").setValue(workflow_details.initialStageId);
    workflowContainer.down("hiddenfield[name=module_id]").setValue(module_id);
    workflowContainer.down("hiddenfield[name=sub_module_id]").setValue(sub_module_id);
    workflowContainer.down("hiddenfield[name=application_status_id]").setValue(workflow_details.initialStageId);


    dashboardWrapper.add(workflowContainer);

    Ext.Function.defer(function () {
      Ext.getBody().unmask();
    }, 300);

    //load the stores
  },

  onInitiateNavigatorApplication: function (sub_module_id, btn) {
    Ext.getBody().mask("Loading Please wait...");
    var me = this,
      is_dataammendment_request = btn.is_dataammendment_request,
      mainTabPanel = me.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      dashboardWrapper = activeTab.down("#navigatorapplicationwrapper"),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue();

    workflow_details = getInitialDocumentCreationWorkflowDetails(
      module_id,
      sub_module_id,
      is_dataammendment_request,
      ""
    );

    if (!workflow_details) {
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
      .setValue(workflow_details.initialStageName);
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
      .down("hiddenfield[name=application_status_id]")
      .setValue(workflow_details.initialStageId);
    dashboardWrapper.add(workflowContainer);

    Ext.Function.defer(function () {
      Ext.getBody().unmask();
    }, 300);

    //load the stores
  },
  showManagerApplicationSubmissionWinGeneric: function (btn) {
    Ext.getBody().mask("Please wait...");
    var mainTabPanel = this.getMainTabPanel(),
      winWidth = btn.winWidth,
      categorize_selected = btn.categorize_selected,
      activeTab = mainTabPanel.getActiveTab(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      section_id = activeTab.down("hiddenfield[name=section_id]").getValue(),
      application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue(),
      application_code = activeTab
        .down("hiddenfield[name=active_application_code]")
        .getValue(),
      workflow_stage_id = activeTab
        .down("hiddenfield[name=workflow_stage_id]")
        .getValue(),
      valid = true,
      is_dataammendment_request = 0,
      storeID = btn.storeID,
      table_name = getApplicationTable(module_id);
    if (activeTab.down("hiddenfield[name=is_dataammendment_request]")) {
      is_dataammendment_request = activeTab
        .down("hiddenfield[name=is_dataammendment_request]")
        .getValue();
    }
    if (btn.table_name != "") {
      table_name = btn.table_name;
    }
    if (categorize_selected) {
      //check if inspections type set
    }

    if (valid == true || valid === true) {
      showWorkflowSubmissionWin(
        application_id,
        application_code,
        table_name,
        "workflowsubmissionmanagersgenericfrm",
        winWidth,
        storeID,
        "",
        "",
        "",
        workflow_stage_id,
        is_dataammendment_request
      );
    } else {
      Ext.getBody().unmask();
    }
  },
  refreshApplicationDocUploadsGrid: function (me) {
    var store = me.store,
      grid = me.up("treepanel"),
      decision_id = grid.down("textfield[name=approval_id]").getValue(),
      approval_id = grid.down("textfield[name=recommendation_id]").getValue(),
      mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      section_id = activeTab.down("hiddenfield[name=section_id]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      workflow_stage = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue(),
      stage_category_id = activeTab.down("hiddenfield[name=stage_category_id]").getValue();


    if (stage_category_id == 1 || stage_category_id === 1) {
      activeTab.down("button[name=recommendation]").setVisible(false);
      activeTab.down("button[name=approval]").setVisible(false);
      activeTab.down("textfield[name=recommendation_id]").setVisible(false);
      activeTab.down("textfield[name=approval_id]").setVisible(false);
      activeTab.down("button[name=add_upload]").setHidden(true);
    }

    store.getProxy().extraParams = {
      application_code: application_code,
      // table_name: table_name,
      // document_type_id: document_type_id,
      process_id: process_id,
      section_id: section_id,
      module_id: module_id,
      sub_module_id: sub_module_id,
      workflow_stage: workflow_stage,
    };
  },
  refreshApplicationDocPreviewNavigatorGrid: function (pnl) {
    var me = this,
        store = me.store,
        previewPnl = pnl.down('applicationdocpreviewnavigatorgrid'); // Correctly reference the grid within the panel

    if (!previewPnl) {
        console.error("Error: previewPnl not found. Ensure 'applicationdocpreviewnavigatorgrid' exists within the panel.");
        return;
    }

    var application_code = pnl.down("hiddenfield[name=application_code]").getValue(),
        module_id = pnl.down("hiddenfield[name=module_id]").getValue(),
        sub_module_id = pnl.down("hiddenfield[name=sub_module_id]").getValue(),
        workflow_stage = pnl.down("hiddenfield[name=workflow_stage_id]").getValue();

    if (!application_code || !module_id || !sub_module_id || !workflow_stage) {
        console.error("Error: One or more hidden fields not found within the panel.");
        return;
    }

    store.getProxy().extraParams = {
        application_code: application_code,
        module_id: module_id,
        sub_module_id: sub_module_id,
        workflow_stage: workflow_stage
    };

    store.load(); // Load the store with the new parameters
},
  showApplicationDocUploadWin: function (btn) {
  var mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      section_id = activeTab.down("hiddenfield[name=section_id]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      workflow_stage = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue(),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      grid = btn.up("treepanel"),
      query_id;
    if (grid.down("hiddenfield[name=query_ref_id]")) {
      query_id = grid.down("hiddenfield[name=query_ref_id]").getValue();
    }
    if (application_code != "") {
      this.showApplicationDocUploadWinGeneric(
        btn,
        section_id,
        module_id,
        sub_module_id,
        workflow_stage,
        application_code,
        query_id
      );
    } else {
      toastr.error(
        "Application details not found, save application to upload!!",
        "Failure Response"
      );
    }
  },

  prepapreDocumentApplicationApproval: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      qmsdoclistfrm = activeTab.down("qmsdoclistfrm"),
      grid = activeTab.down("applicationdocuploadsgrid"),
      // grid = activeTab.down('docuploadsgrid'),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      reference_no = activeTab.down("displayfield[name=reference_no]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue();

      
    activeTab.down("textfield[name=recommendation_id]").setVisible(false);
    activeTab.down("textfield[name=approval_id]").setVisible(true);
    activeTab.down("button[name=add_upload]").setHidden(true);

    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "documentmanagement/prepapreDocumentApplicationScreening",
        params: {
          application_code: application_code,
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
            qmsdoclistfrm.loadRecord(model);
            grid.down("button[name=add_upload]").setHidden(true);
            activeTab.down("textfield[name=approval_id]").setValue(results.approval);
            activeTab.down("displayfield[name=workflow_stage]").setValue(results.workflow_stage);
            qmsdoclistfrm.down("textfield[name=navigator_name]").setValue(results.navigator_name);
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

  prepapreSOPTemplateApplicationApproval: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      qmsdoclistfrm = activeTab.down("soptemplatedoclistfrm"),
      grid = activeTab.down("soptemplatedocuploadgrid"),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      reference_no = activeTab.down("displayfield[name=reference_no]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue();

      
    activeTab.down("textfield[name=recommendation_id]").setVisible(false);
    activeTab.down("textfield[name=approval_id]").setVisible(true);
    activeTab.down("button[name=add_upload]").setHidden(true);

    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "documentmanagement/prepapreDocumentApplicationScreening",
        params: {
          application_code: application_code,
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
            qmsdoclistfrm.loadRecord(model);
            grid.down("button[name=add_upload]").setHidden(true);
            grid.down("button[name=download]").setHidden(true);
            activeTab.down("textfield[name=approval_id]").setValue(results.approval);
            activeTab.down("displayfield[name=workflow_stage]").setValue(results.workflow_stage);

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
  prepapreDocumentApplicationScreening: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      qmsdoclistfrm = activeTab.down("qmsdoclistfrm"),
      grid = activeTab.down("docuploadsgrid"),
      // grid = activeTab.down('docuploadsgrid'),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      reference_no = activeTab.down("displayfield[name=reference_no]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue();

    activeTab.down("button[name=recommendation]").setVisible(true);
    activeTab.down("button[name=approval]").setVisible(false);
    activeTab.down("textfield[name=recommendation_id]").setVisible(true);
    activeTab.down("textfield[name=approval_id]").setVisible(false);

    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "documentmanagement/prepapreDocumentApplicationScreening",
        params: {
          application_code: application_code,
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
            qmsdoclistfrm.loadRecord(model);
            grid.down("button[name=add_upload]").setHidden(true);
            activeTab.down("textfield[name=recommendation_id]").setValue(results.recommendation);
            activeTab.down("displayfield[name=workflow_stage]").setValue(results.workflow_stage);
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

  prepapreSOPTemplateApplicationScreening: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      qmsdoclistfrm = activeTab.down("soptemplatedoclistfrm"),
      grid = activeTab.down("soptemplategrid"),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      reference_no = activeTab.down("displayfield[name=reference_no]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue();

    activeTab.down("button[name=recommendation]").setVisible(true);
    activeTab.down("button[name=approval]").setVisible(false);
    activeTab.down("textfield[name=recommendation_id]").setVisible(true);
    activeTab.down("textfield[name=approval_id]").setVisible(false);

    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "documentmanagement/prepapreDocumentApplicationScreening",
        params: {
          application_code: application_code,
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
            qmsdoclistfrm.loadRecord(model);
            grid.down("button[name=add_upload]").setHidden(true);
            grid.down("button[name=download]").setHidden(true);
            activeTab.down("textfield[name=recommendation_id]").setValue(results.recommendation);
            activeTab.down("displayfield[name=workflow_stage]").setValue(results.workflow_stage);
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

  prepapreDocumentApplicationNavigator: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      qmsdoclistfrm = activeTab.down("qmsdoclistfrm"),
      grid = activeTab.down("docuploadsgrid"),
      // grid = activeTab.down('docuploadsgrid'),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      reference_no = activeTab.down("displayfield[name=reference_no]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue();

    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "documentmanagement/prepapreDocumentApplicationScreening",
        params: {
          application_code: application_code,
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
            grid.down("button[name=add_upload]").setHidden(true);
            grid.down("textfield[name=recommendation_id]").setHidden(true);
            grid.down("textfield[name=approval_id]").setHidden(true);
      
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

  prepapreDocumentApplicationRelease: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      grid = Ext.widget("applicationdocuploadsgrid"),
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      qmsdoclistfrm = activeTab.down("qmsdoclistfrm"),
      grid = activeTab.down("docreleasegrid"),
      // grid = activeTab.down('docuploadsgrid'),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      reference_no = activeTab.down("displayfield[name=reference_no]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue();

    activeTab.down("button[name=recommendation]").setVisible(false);
    activeTab.down("button[name=approval]").setVisible(false);
    activeTab.down("textfield[name=recommendation_id]").setVisible(false);
    activeTab.down("textfield[name=approval_id]").setVisible(false);
    activeTab.down("button[name=add_upload]").setHidden(true);

    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "documentmanagement/prepapreDocumentApplicationScreening",
        params: {
          application_code: application_code,
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
            qmsdoclistfrm.loadRecord(model);
            grid.down("button[name=add_upload]").setHidden(true);
            activeTab.down("displayfield[name=workflow_stage]").setValue(results.workflow_stage);
            qmsdoclistfrm.down("textfield[name=navigator_name]").setValue(results.navigator_name);
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

  prepapreSOPTemplateApplicationRelease: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      qmsdoclistfrm = activeTab.down("soptemplatedoclistfrm"),
      grid = activeTab.down("docreleasegrid"),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      reference_no = activeTab.down("displayfield[name=reference_no]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue();

    activeTab.down("button[name=recommendation]").setVisible(false);
    activeTab.down("button[name=approval]").setVisible(false);
    activeTab.down("textfield[name=recommendation_id]").setVisible(false);
    activeTab.down("textfield[name=approval_id]").setVisible(false);
    activeTab.down("button[name=add_upload]").setHidden(true);

    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "documentmanagement/prepapreDocumentApplicationScreening",
        params: {
          application_code: application_code,
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
            qmsdoclistfrm.loadRecord(model);
            grid.down("button[name=add_upload]").setHidden(true);
            activeTab.down("displayfield[name=workflow_stage]").setValue(results.workflow_stage);
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

  prepapreDocumentApplicationReceiving: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      qmsdoclistfrm = activeTab.down("qmsdoclistfrm"),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue(),
      stage_category_id = activeTab.down("hiddenfield[name=stage_category_id]").getValue();

    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "documentmanagement/prepapreDocumentApplicationReceiving",
        params: {
          application_code: application_code,
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
            qmsdoclistfrm.loadRecord(model);
            activeTab.down("displayfield[name=workflow_stage]").setValue(results.workflow_stage);
            activeTab.down('hiddenfield[name=stage_category_id]').setValue(results.stage_category_id);
            activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
            activeTab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            activeTab.down('hiddenfield[name=module_id]').setValue(module_id);
            activeTab.down("displayfield[name=tracking_no]").setValue(results.tracking_no);
            qmsdoclistfrm.down("textfield[name=navigator_name]").setValue(results.navigator_name);

          
                activeTab.down("button[name=recommendation]").setVisible(false);
                activeTab.down("button[name=approval]").setVisible(false);
                activeTab.down("textfield[name=recommendation_id]").setVisible(false);
                activeTab.down("textfield[name=approval_id]").setVisible(false);
                activeTab.down("button[name=add_upload]").setHidden(false);
          
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

  prepapreDocumentApplicationRenewal: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      qmsdoclistfrm = activeTab.down("docrenewalfrm"),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue(),
      stage_category_id = activeTab.down("hiddenfield[name=stage_category_id]").getValue();

    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "documentmanagement/prepapreDocumentApplicationReceiving",
        params: {
          application_code: application_code,
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
            qmsdoclistfrm.loadRecord(model);
            activeTab.down("displayfield[name=workflow_stage]").setValue(results.workflow_stage);
            activeTab.down('hiddenfield[name=stage_category_id]').setValue(results.stage_category_id);
            activeTab.down('hiddenfield[name=active_application_code]').setValue(results.application_code);
            activeTab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            activeTab.down('hiddenfield[name=module_id]').setValue(module_id);
            activeTab.down("displayfield[name=tracking_no]").setValue(results.tracking_no);
            qmsdoclistfrm.down("textfield[name=navigator_name]").setValue(results.navigator_name);

                activeTab.down("button[name=recommendation]").setVisible(false);
                activeTab.down("button[name=approval]").setVisible(false);
                activeTab.down("textfield[name=recommendation_id]").setVisible(false);
                activeTab.down("textfield[name=approval_id]").setVisible(false);
                activeTab.down("button[name=add_upload]").setHidden(false);
          
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
  uploadApplicationFile: function (btn) {
    var me = this,
      form = btn.up("form"),
      win = form.up("window"),
      frm = form.getForm(),
      formValues = form.getValues(),
      storeID = btn.storeID,
      mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      uploads_store = Ext.getStore(storeID),
      resumable = btn.resumable,
      progressBar = btn.progressBar;
    if (resumable != "") {
      //add parameters
      resumable.opts.query.id = formValues.id;
      resumable.opts.query.application_id = formValues.application_id;
      resumable.opts.query.application_code = formValues.application_code;
      resumable.opts.query.process_id = formValues.process_id;
      resumable.opts.query.section_id = formValues.section_id;
      resumable.opts.query.module_id = formValues.module_id;
      resumable.opts.query.sub_module_id = formValues.sub_module_id;
      resumable.opts.query.workflow_stage_id = formValues.workflow_stage_id;
      resumable.opts.query.document_type_id = formValues.document_type_id;
      resumable.opts.query.prodclass_category_id =
        formValues.prodclass_category_id;
      resumable.opts.query.importexport_permittype_id =
        formValues.importexport_permittype_id;
      resumable.opts.query.premise_type_id = formValues.premise_type_id;
      resumable.opts.query.query_ref_id = formValues.query_ref_id;
      resumable.opts.query.node_ref = formValues.node_ref;
      resumable.opts.query.doctype_id = formValues.doctype_id;
      resumable.opts.query.document_requirement_id =
        formValues.document_requirement_id;
      resumable.opts.query.assessment_by = formValues.assessment_by;
      resumable.opts.query.assessment_start_date =
        formValues.assessment_start_date;
      resumable.opts.query.assessment_end_date = formValues.assessment_end_date;
      resumable.opts.query.description = formValues.description;

      funcShowCustomizableWindow(
        "Upload Progress",
        "20%",
        progressBar,
        "customizablewindow",
        btn
      );
      resumable.upload();
    } else {
      toastr.error("Please select a file/document to upload!", "Missing File");
    }
  },
  initializeResumableUpload: function (btn) {
    var me = this,
      mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      form = btn.up("form"),
      win = form.up("window"),
      rec = form.getValues(),
      id = rec.application_id,
      application_id = rec.application_id,
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      uploads_store = Ext.getStore("applicationDocumentsUploadsStr"),
      progressBar = Ext.widget("progress");
    // let browseFile = $('#browseFile');
    let resumable = new Resumable({
      target: "documentmanagement/resumableuploadApplicationDocumentFile",
      query: {
        _token: token,
        view_module_id: module_id,
        id: id,
        application_id: application_id,
        application_code: "",
        process_id: "",
        section_id: "",
        module_id: "",
        sub_module_id: "",
        workflow_stage_id: "",
        document_type_id: "",
        prodclass_category_id: "",
        importexport_permittype_id: "",
        premise_type_id: "",
        query_ref_id: "",
        node_ref: "",
        doctype_id: "",
        document_requirement_id: "",
        assessment_by: "",
        assessment_start_date: "",
        assessment_end_date: "",
        description: "",
      },
      fileType: [],
      chunkSize: 10 * 1024 * 1024, // 10mbs
      headers: {
        Authorization: "Bearer " + access_token,
        Accept: "application/json",
      },
      testChunks: false,
      throttleProgressCallbacks: 1,
    });
    // console.log(browseFile);
    resumable.assignBrowse(document.getElementById("browseButton"));

    resumable.on("fileAdded", function (file) {
      // trigger when file picked
      document.getElementById("fileName").value = file.relativePath;
      btn.resumable = resumable;
      btn.progressBar = progressBar;
      //resumable.upload() // to actually start uploading.
    });

    resumable.on("fileProgress", function (file) {
      // trigger when file progress update
      me.updateProgress(Math.floor(file.progress() * 100), progressBar);
    });

    resumable.on("fileSuccess", function (file, response) {
      // trigger when file upload complete
      response = JSON.parse(response);
      uploads_store.load();
      success = response.success;
      if (success == true) {
        toastr.success("Uploaded Successfully", "Success Response");
        uploads_store.load();
      } else {
        toastr.error(
          response.message + " If problem persist contact system admin",
          "Failure Response!!"
        );
      }
      progressBar.up("window").close();
      win.close();
      delete resumable;
    });

    resumable.on("fileError", function (file, response) {
      // trigger when there is any error
      progressBar.up("window").close();
      res = JSON.parse(response);
      uploads_store.load();
      win.close();
      toastr.error(
        res.message + " If problem persist contact system admin",
        "Failure Response!!"
      );
    });
  },
  showReceivingApplicationSubmissionWin: function (btn) {
    Ext.getBody().mask("Please wait...");
    var mainTabPanel = this.getMainTabPanel(),
      storeID = btn.storeID,
      table_name = btn.table_name,
      winWidth = btn.winWidth,
      activeTab = mainTabPanel.getActiveTab(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue(),
      document_id = activeTab.down("combo[name=document_type_id]").getValue(),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      //section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
      // premise_id = activeTab.down('hiddenfield[name=premise_id]').getValue(),
      // storeID = getApplicationStore(module_id, section_id),
      valid = this.validateNewReceivingSubmission(),
      validateHasDocuments = validateHasUploadedDocumentsDetils(application_code);

    if (!validateHasDocuments) {
      toastr.error(  
        "Response: Please Upload the required documents to proceed."
      );
      Ext.getBody().unmask();
      return;
    }
    if (valid) {
      Ext.Ajax.request({
        method: "POST",
        url: "documentmanagement/validateDocumentAppReceivingDetails",
        params: {
          application_code: application_code,
          workflow_stage_id: workflow_stage_id,
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
            showWorkflowSubmissionWin(document_id, application_code, table_name,"workflowsubmissionsreceivingfrm",
              winWidth,
              storeID,
              extraParams,
              ""
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
        "Please Enter All the required Product Details!!",
        "Warning Response"
      );
      return;
    }
  },

  validateNewReceivingSubmission: function (btn) {
    var mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab();

    if(activeTab.down("qmsdoclistfrm")){
      var applicantFrm = activeTab.down("qmsdoclistfrm"),
       document_id = applicantFrm.down("combo[name=document_type_id]").getValue();
    }else{
      var applicantFrm = activeTab.down("soptemplatedoclistfrm"),
       document_id = applicantFrm.down("combo[name=document_type_id]").getValue();

    }
 
    if (!document_id) {
      toastr.warning("Please Save Application Details!!", "Warning Response");
      return false;
    }
    if (!applicantFrm.isValid()) {
      // toastr.warning('Please Enter All the required Permits Details!!', 'Warning Response');
      // return false;
    }

    return true;
  },

  saveDocumentReviewRecommendationDetails: function (btn) {
    var me = this,
      mainTabPanel = me.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      form = btn.up("form"),
      decision_id = form.down("combo[name=decision_id]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue();
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue();
      (frm = form.getForm()),
      (win = form.up("window")),
      (action_url = "documentmanagement/saveDocumentApplicationApprovalDetails");

      if(activeTab.down("docuploadsgrid")){
        var  grid = activeTab.down("docuploadsgrid");
      }else{
        var grid = activeTab.down("soptemplatedocuploadgrid");
      }
    if (frm.isValid()) {
      frm.submit({
        url: action_url,
        headers: {
          Authorization: "Bearer " + access_token,
          "X-CSRF-Token": token,
        },
        params: {
          sub_module_id: sub_module_id
        },
        waitMsg: "Please wait...",
        success: function (fm, action) {
          var response = Ext.decode(action.response.responseText),
            success = response.success,
            message = response.message;
            approval = response.results;
          if (success == true || success === true) {
            toastr.success(message, "Success Response");
             grid.down("textfield[name=approval_id]").setValue(approval);
            win.close();
          } else {
            toastr.error(message, "Failure Response");
          }
        },
        failure: function (fm, action) {
          var resp = action.result;
          toastr.error(resp.message, "Failure Response");
        },
      });
    }
  },
  saveApplicationApprovalDetails: function (btn) {
    var me = this,
      mainTabPanel = me.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      mainStore = activeTab.down("grid").getStore(),
      form = btn.up("form"),
      frm = form.getForm(),
      win = form.up("window");
    action_url = "common/saveApplicationApprovalDetails";
    if (frm.isValid()) {
      frm.submit({
        url: action_url,
        headers: {
          Authorization: "Bearer " + access_token,
          "X-CSRF-Token": token,
        },
        waitMsg: "Please wait...",
        success: function (fm, action) {
          var response = Ext.decode(action.response.responseText),
            success = response.success,
            message = response.message;
          if (success == true || success === true) {
            mainStore.load();
            toastr.success(message, "Success Response");
            win.close();
          } else {
            toastr.error(message, "Failure Response");
          }
        },
        failure: function (fm, action) {
          var resp = action.result;
          toastr.error("Failure Response");
        },
      });
    }
  },

  prepapreDocumentCreationReceiving: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
    (application_status_id = activeTab
      .down("hiddenfield[name=application_status_id]")
      .getValue()),
      (documentdetailsfrm = activeTab.down("qmsdoclistfrm")),
      (process_id = activeTab.down("hiddenfield[name=process_id]").getValue()),
      (sub_module_id = activeTab
        .down("hiddenfield[name=sub_module_id]")
        .getValue()),
      (section_id = activeTab.down("hiddenfield[name=section_id]").getValue()),
      (zone_cbo = activeTab.down("combo[name=zone_id]"));
    (filter = { section_id: section_id }),
      (workflow_stage_id = activeTab
        .down("hiddenfield[name=workflow_stage_id]")
        .getValue());

    if (application_status_id == 4 || application_status_id === 4) {
      activeTab.down("button[name=queries_responses]").setVisible(true);
    }
    if (sub_module_id) {
      Ext.Ajax.request({
        method: "GET",
        url: "documentmanagement/prepareDocumentCreationReceivingStage",
        params: {
          sub_module_id: sub_module_id,
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
            zone_id = results.zone_id,
            model = Ext.create("Ext.data.Model", results);

          if (success == true || success === true) {
            documentdetailsfrm.loadRecord(model);

            zone_cbo.setValue(zone_id);

            activeTab
              .down("displayfield[name=application_status]")
              .setValue(results.application_status);

            activeTab
              .down("displayfield[name=reference_no]")
              .setValue(results.reference_no);
            activeTab
              .down("displayfield[name=tracking_no]")
              .setValue(results.tracking_no);

            var parent_pnl = pnl.up("panel");
            parent_pnl.getViewModel().set("isReadOnly", false);
            if (activeTab.down("button[action=search_premise]")) {
              activeTab.down("button[action=search_premise]").setDisabled(true);
            }

            if (activeTab.down("button[action=link_applicant]")) {
              activeTab.down("button[action=link_applicant]").setDisabled(true);
            }

            if (activeTab.down("combo[name=sub_module_id]")) {
              activeTab.down("combo[name=sub_module_id]").setDisabled(true);
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
      //It's a new application
    }
  },
  showManagerApplicationMeetingSubmissionWinGeneric: function (btn) {
    Ext.getBody().mask("Please wait...");
    var mainTabPanel = this.getMainTabPanel(),
      winWidth = btn.winWidth,
      activeTab = mainTabPanel.getActiveTab(),
      gridXtype = btn.gridXtype,
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      section_id = activeTab.down("hiddenfield[name=section_id]").getValue(),
      application_id = activeTab
        .down("hiddenfield[name=active_application_id]")
        .getValue(),
      application_code = activeTab
        .down("hiddenfield[name=active_application_code]")
        .getValue(),
      valid = this.validateApplicationTcMeetingDetails(btn),
      storeID = getApplicationStore(module_id, section_id),
      table_name = getApplicationTable(module_id);
    if (valid == true || valid === true) {
      showWorkflowSubmissionWin(
        application_id,
        application_code,
        table_name,
        "workflowsubmissionmanagersgenericfrm",
        winWidth,
        storeID,
        "",
        gridXtype
      );
    } else {
      toastr.error("Enter meeting Details to proceed!!", "Failure Response");
      Ext.getBody().unmask();
    }
  },
  showNavigatorSelectionList: function (btn) {
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
  onNavigatorSelectionListDblClick: function (
    view,
    record,
    item,
    index,
    e,
    eOpts
  ) {
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
    var qmsdoclistfrm = activeTab.down("qmsdoclistfrm");
    var soptemplatedoclistfrm = activeTab.down("soptemplatedoclistfrm");

    if(qmsdoclistfrm){
       qmsdoclistfrm.loadRecord(record);
    }else{
      soptemplatedoclistfrm.loadRecord(record);      
    }


    Ext.Function.defer(function () {
      mask.hide();
      win.close();
    }, 200);
  },
   AddGeneralComment: function (argument) {
        var form = Ext.widget('applicationcommentsFrm');
        funcShowCustomizableWindow('Application Recommendation', '50%', form, 'customizablewindow');
    },

  onViewNavigatorDocDetails: function (record) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      // mainTabPanel = me.getMainTabPanel(),
      // activeTab = mainTabPanel.getActiveTab(),
      mainTabPanel = this.getMainTabPanel(), // Assuming this method returns the main tab panel
      viewtype = mainTabPanel.down("#documentsviewpnl"),
      process_id = record.get("process_id"),
      workflow_stage_id = record.get("workflow_stage_id"),
      workflow_stage = record.get("workflow_stage"),
      ref_no = record.get("reference_no"),
      tracking_no = record.get("tracking_no"),
      isGeneral = record.get("is_general"),
      view_id = record.get("view_id");


    workflow_details = getAllWorkflowDetails(process_id, workflow_stage_id);

    //console.log(stage_category_id);
    if (!workflow_details || workflow_details.length < 1) {
      Ext.getBody().unmask();
      toastr.warning(
        "Warning Response",
        "You're attempting to open a folder, drop the folder down to open a document!!"
        
      );
      return false;
    }
    if (!ref_no || ref_no == "" || ref_no == null) {
      title_suffix = tracking_no;
    }

    var tab = mainTabPanel.getComponent(view_id),
      title = workflow_stage + "-" + title_suffix;
    title = workflow_stage; //+ '-' + title_suffix;
    if (isGeneral && (isGeneral == 1 || isGeneral === 1)) {
      title = workflow_stage;
      view_id = view_id + Math.floor(Math.random() * 100015);
    }
    if (!tab) {
   // Assuming this method returns the main tab panel
      viewtype = "documentsviewpnl";
      //
      var newTab = Ext.widget(viewtype, {
        title: "Preview Doc",
        id: view_id,
        closable: true,
      });

      //updates the access control on the interface to be rendered.
      me.updateVisibilityAccess(newTab, workflow_stage_id);
      me.updateVisibilityAccess(newTab, workflow_stage_id);
      //prepare the interface and populates it accordingly
      me.prepareApplicationBaseDetails(newTab, record);
      mainTabPanel.add(newTab);
      var sub_module_id = record.get("sub_module_id");
    
      var lastTab = mainTabPanel.items.length - 1;
      mainTabPanel.setActiveTab(lastTab);
    } else {
      me.prepareApplicationBaseDetails(tab, record);
      mainTabPanel.setActiveTab(tab);
    }

    Ext.Function.defer(function () {
      Ext.getBody().unmask();
      me.updateSubmissionsTable(record, "isRead");
    }, 300);
  },


  onInitiateLiveDocumentApplication: function (application_type, sub_module_id) {
    Ext.getBody().mask("Loading Please wait...");
    var me = this,
      mainTabPanel = me.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      dashboardWrapper = activeTab.down("#livedocumentapplicationwrapper"),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue();

    workflow_details = getInitialLiveDocumentCreationWorkflowDetails(
      module_id,
      application_type,
      sub_module_id,
    );

    if (!workflow_details) {
      Ext.getBody().unmask();
      toastr.warning(
        "Problem encountered while fetching workflow details-->Possibly workflow not set!!",
        "Warning Response"
      );
      return false;
    }
    dashboardWrapper.removeAll();
    var workflowContainer = Ext.widget(workflow_details.viewtype);
    workflowContainer.down("displayfield[name=process_name]").setValue(workflow_details.processName);
    workflowContainer.down("displayfield[name=workflow_stage]").setValue(workflow_details.initialStageName);
    workflowContainer.down("displayfield[name=application_status]").setValue(workflow_details.initialStageName);
    workflowContainer.down("hiddenfield[name=process_id]").setValue(workflow_details.processId);
    workflowContainer.down("hiddenfield[name=workflow_stage_id]").setValue(workflow_details.initialStageId);
    workflowContainer.down("hiddenfield[name=module_id]").setValue(module_id);
    workflowContainer.down("hiddenfield[name=sub_module_id]").setValue(sub_module_id);
    workflowContainer.down("hiddenfield[name=application_status_id]").setValue(workflow_details.initialStageId);
    workflowContainer.down("hiddenfield[name=stage_category_id]").setValue(workflow_details.stage_category_id);


    dashboardWrapper.add(workflowContainer);

    Ext.Function.defer(function () {
      Ext.getBody().unmask();
    }, 300);

    //load the stores
  },

  onViewLiveDocumentDetails: function (record) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      mainTabPanel = me.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      process_id = record.get("process_id"),
      workflow_stage_id = record.get("workflow_stage_id"),
      workflow_stage = record.get("workflow_stage"),
      ref_no = record.get("reference_no"),
      tracking_no = record.get("tracking_no"),
      isGeneral = record.get("is_general"),
      view_id = record.get("view_id"),
      html_id = record.get("destination_html_id"),
      renewal = '',
      module_id = 26,
      sub_module_id = 105,
      application_type = 1,
      title_suffix = ref_no;


    workflow_details = getInitialLiveDocumentCreationWorkflowDetails(
      module_id,
      sub_module_id,
    );

    console.log(workflow_details);

    //console.log(stage_category_id);
    if (!workflow_details || workflow_details.length < 1) {
      Ext.getBody().unmask();
      toastr.warning(
        "Problem encountered while fetching workflow details-->Possibly workflow not set!!",
        "Warning Response"
      );
      return false;
    }
    if (!ref_no || ref_no == "" || ref_no == null) {
      title_suffix = tracking_no;
    }

    var tab = mainTabPanel.getComponent(view_id),
      title = workflow_stage + "-" + title_suffix;
    title = workflow_stage; //+ '-' + title_suffix;
    if (isGeneral && (isGeneral == 1 || isGeneral === 1)) {
      title = workflow_stage;
      view_id = view_id + Math.floor(Math.random() * 100015);
    }
    if (!tab) {
      //
      var newTab = Ext.widget(workflow_details.viewtype, {
        title: "Document Renewal",
        id: view_id,
        closable: true,
      });

      //updates the access control on the interface to be rendered.
      //me.updateVisibilityAccess(newTab, workflow_stage_id);
      me.updateVisibilityAccess(newTab, workflow_stage_id);
      //prepare the interface and populates it accordingly
      me.prepareApplicationBaseDetails(newTab, record);
      mainTabPanel.add(newTab);
      var sub_module_id = record.get("sub_module_id");
      // if(sub_module_id == 8 && newTab.down('button[name=save_btn]')){
      //     newTab.getViewModel().set('isReadOnly', true);
      //     newTab.down('button[name=save_btn]').action_url = 'saveRenAltProductReceivingBaseDetails';
      // }
      // if(sub_module_id == 9 && newTab.down('button[name=save_btn]')){
      //     newTab.getViewModel().set('isReadOnly', true);
      //     newTab.down('button[name=save_btn]').action_url = 'saveRenAltProductReceivingBaseDetails';
      // }
      var lastTab = mainTabPanel.items.length - 1;
      mainTabPanel.setActiveTab(lastTab);
    } else {
      me.prepareApplicationBaseDetails(tab, record);
      mainTabPanel.setActiveTab(tab);
    }

    Ext.Function.defer(function () {
      Ext.getBody().unmask();
      me.updateSubmissionsTable(record, "isRead");
    }, 300);
  },

  prepareSOPTemplateApplication: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      soptemplatedoclistfrm = activeTab.down("soptemplatedoclistfrm"),
      grid = activeTab.down("soptemplategrid"),
      // grid = activeTab.down('docuploadsgrid'),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      reference_no = activeTab.down("displayfield[name=reference_no]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue();



    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "documentmanagement/prepapreDocumentApplicationScreening",
        params: {
          application_code: application_code,
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
            activeTab.down("displayfield[name=workflow_stage]").setValue(results.workflow_stage);
            soptemplatedoclistfrm.loadRecord(model);
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
      downloadsopTemplate:function(module_id){
                var action_url = 'documentmanagement/downloadsopTemplate?module_id=' + module_id;
               // print_report(action_url);
                this.print_report(action_url, function() {
                  setTimeout(function() {
                     window.close();
                  }, 5); 
                });

    },

    downloadFormFormat:function(module_id){
                var action_url = 'documentmanagement/downloadFormFormat?module_id=' + module_id;
               //print_report(action_url);
               this.print_report(action_url, function() {
                  setTimeout(function() {
                     window.close();
                  }, 5); 
                });

    },

    downloadlogdatabasesTemplate:function(module_id){
                var action_url = 'documentmanagement/downloadlogdatabasesTemplate?module_id=' + module_id;
               //print_report(action_url);
               this.print_report(action_url, function() {
                  setTimeout(function() {
                     window.close();
                  }, 5); 
                });

    },

     print_report(action_url, callback) {
    var printWindow = window.open(action_url, 'Print', 'width=800,height=600');
    printWindow.onload = function() {
        printWindow.print();
        var checkPrintComplete = setInterval(function() {
            if (printWindow.closed) {
                clearInterval(checkPrintComplete);
                if (callback) {
                    callback();
                }
            }
        }, 100);
    };
},

    saveApplicationComment: function (btn) {
    var mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue(),
      formPnl = btn.up("form"),
      frm = formPnl.getForm(),
      store = Ext.getStore(btn.storeID),
      win = formPnl.up("window");

      if(activeTab.down("docuploadsgrid")){
       var grid = activeTab.down("docuploadsgrid");
      }else{
       var grid = activeTab.down("soptemplatedocuploadgrid");
      }

    if (frm.isValid()) {
      frm.submit({
        url: "documentmanagement/saveDocumentRecommendationComments",
        params: {
          application_code: application_code,
          module_id: module_id,
          workflow_stage_id: workflow_stage_id,
        },
        waitMsg: "Please wait...",
        success: function (form, action) {
          var response = Ext.decode(action.response.responseText),
            success = response.success,
            message = response.message;
            reccomendation = response.results;

            console.log(reccomendation);
          if (success == true || success === true) {
            toastr.success(message, "Success Response");
            grid.down("textfield[name=recommendation_id]").setValue(reccomendation);
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
      grid = btn.up("treepanel"),
      storeID = grid.storeID,
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
   uploadExcelFile: function (btn) {
    var me = this,
      form = btn.up("form"),
      win = form.up("window"),
      frm = form.getForm(),
      formValues = form.getValues(),
      storeID = btn.storeID,
      mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      resumable = btn.resumable,
      progressBar = btn.progressBar;
    if (resumable != "") {
      resumable.opts.query.module_id = formValues.module_id;
      resumable.opts.query.application_code = formValues.application_code;
      resumable.opts.query.process_id = formValues.process_id;
      resumable.opts.query.workflow_stage_id = formValues.workflow_stage_id;
      resumable.opts.query.start_column = formValues.start_column;
      resumable.opts.query.upload_type_id = formValues.upload_type_id;
      funcShowCustomizableWindow(
        "Upload Progress",
        "20%",
        progressBar,
        "customizablewindow",
        btn
      );
      resumable.upload();
    } else {
      toastr.error("Please select a file/document to upload!", "Missing File");
    }
  },
  initializeResumableExcelUpload: function (btn) {
    var me = this,
      mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      form = btn.up("form"),
      win = form.up("window"),
      uploads_store = Ext.getStore(btn.storeID),
      progressBar = Ext.widget("progress");
    // let browseFile = $('#browseFile');
    let resumable = new Resumable({
      target: "documentmanagement/importExcelFile",
      query: {
        _token: token,
        module_id: "",
        process_id: "",
        workflow_stage_id: "",
        application_code: "",
        start_column: "",
        upload_type_id: "",
      },
      fileType: ["xlsx", "csv", "xls"],
      chunkSize: 10 * 1024 * 1024, // 10mbs
      headers: {
        Authorization: "Bearer " + access_token,
        Accept: "application/json",
      },
      testChunks: false,
      throttleProgressCallbacks: 1,
    });
    // console.log(browseFile);
    resumable.assignBrowse(document.getElementById("browseButton"));

    resumable.on("fileAdded", function (file) {
      // trigger when file picked
      document.getElementById("fileName").value = file.relativePath;
      btn.resumable = resumable;
      btn.progressBar = progressBar;
      //resumable.upload() // to actually start uploading.
    });

    resumable.on("fileProgress", function (file) {
      // trigger when file progress update
      me.updateProgress(Math.floor(file.progress() * 100), progressBar);
    });

    resumable.on("fileSuccess", function (file, response) {
      // trigger when file upload complete
      response = JSON.parse(response);
      success = response.success;
      if (success == true) {
        toastr.success("Uploaded Successfully", "Success Response");
        if (uploads_store) {
          uploads_store.load();
        }
      } else {
        toastr.error(
          response.message + " If problem persist contact system admin",
          "Failure Response!!"
        );
      }
      progressBar.up("window").close();
      win.close();
      delete resumable;
    });

    resumable.on("fileError", function (file, response) {
      // trigger when there is any error
      progressBar.up("window").close();
      res = JSON.parse(response);
      win.close();
      toastr.error(
        res.message + " If problem persist contact system admin",
        "Failure Response!!"
      );
    });
  },

  updateProgress: function (value, progressBar) {
    progressBar.setValue(value * 0.01);
    progressBar.updateText(value + " %");
  },

  renderParameterMenu: function (parameter_id) {
    var def_id = parameter_id,
      contentPnl = this.getMainTabPanel();
    Ext.getBody().mask("Loading...");
    //check if tab item is currently open
    if (contentPnl.getComponent("item_id" + def_id)) {
      //set it as active and close
      var index = contentPnl.items.indexOf(
        contentPnl.getComponent("item_id" + def_id)
      );
      contentPnl.setActiveTab(index);
      Ext.getBody().unmask();
      return false;
    }
    //render interface
    else {
      Ext.Ajax.request({
        url: "configurations/getParameterGridColumnsConfig",
        method: "GET",
        params: {
          def_id: def_id,
        },
        headers: {
          Authorization: "Bearer " + access_token,
          "X-CSRF-Token": token,
        },
        success: function (response) {
          var resp = Ext.JSON.decode(response.responseText),
            success = resp.success,
            message = resp.message,
            result = resp.results,
            title = resp.title;
          table_name = resp.table_name;
          if (success == true || success === true) {
            var panel = Ext.create("Ext.panel.Panel", {
              viewModel: "configurationsvm",
              controller: "configurationsvctr",
              title: title,
              itemId: "item_id" + def_id,
              closable: true,
              userCls: "big-100 small-100",
              height: Ext.Element.getViewportHeight() - 118,
              layout: {
                type: "fit",
              },
              items: [],
            });
            var grid = Ext.create("Ext.grid.Panel", {
              cls: "dashboard-todo-list",
              autoScroll: true,
              autoHeight: true,
              width: "100%",
              //height: Ext.Element.getViewportHeight() - 118,
              viewConfig: {
                deferEmptyText: false,
                emptyText: "Nothing to display",
                getRowClass: function (record, rowIndex, rowParams, store) {
                  var is_enabled = record.get("is_enabled");
                  if (is_enabled == 0 || is_enabled === 0) {
                    return "invalid-row";
                  }
                },
              },
              tbar: [
                {
                  xtype: "button",
                  text: "Add",
                  iconCls: "x-fa fa-plus",
                  action: "add",
                  ui: "soft-blue",
                  //childXtype: 'actingreasonFrm',
                  winTitle: title + "",
                  winWidth: "40%",
                  handler: "renderParameterForm",
                  stores: "[]",
                },
                {
                  xtype: "hiddenfield",
                  name: "def_id",
                  fieldLabel: "def_id",
                  allowBlank: true,
                },
                {
                  xtype: "hiddenfield",
                  name: "db_con",
                  fieldLabel: "db_con",
                  allowBlank: true,
                },
                {
                  xtype: "exportbtn",
                },
              ],
              plugins: [
                {
                  ptype: "gridexporter",
                },
              ],
              export_title: title + "",
              bbar: [
                {
                  xtype: "pagingtoolbar",
                  width: "100%",
                  displayInfo: true,
                  displayMsg: "Showing {0} - {1} of {2} total records",
                  emptyMsg: "No Records",
                  beforeLoad: function () {
                    var grid = this.up("grid"),
                      store = grid.getStore(),
                      def_id = grid.down("hiddenfield[name=def_id]").getValue();

                    var store = this.getStore();
                    store.getProxy().extraParams = {
                      def_id: def_id,
                    };
                  },
                },
              ],
              features: [
                {
                  ftype: "searching",
                  minChars: 2,
                  mode: "local",
                },
              ],
              listeners: {
                beforerender: {
                  fn: "setGridStore",
                  config: {
                    pageSize: 1000,
                    storeId: table_name + "Str",
                    proxy: {
                      url: "configurations/getParameterGridConfig",
                    },
                  },
                  isLoad: true,
                },
              },

              columns: [
                {
                  xtype: "gridcolumn",
                  dataIndex: "id",
                  text: "Ref ID",
                },
                {
                  xtype: "gridcolumn",
                  dataIndex: "is_enabled",
                  text: "Enable",
                  width: 150,
                  renderer: function (value, metaData) {
                    if (value) {
                      metaData.tdStyle = "color:white;background-color:green";
                      return "True";
                    }

                    metaData.tdStyle = "color:white;background-color:red";
                    return "False";
                  },
                },
                {
                  text: "Options",
                  xtype: "widgetcolumn",
                  width: 90,
                  widget: {
                    width: 75,
                    textAlign: "left",
                    xtype: "splitbutton",
                    iconCls: "x-fa fa-th-list",
                    ui: "gray",
                    menu: {
                      xtype: "menu",
                      items: [
                        {
                          text: "Edit",
                          iconCls: "x-fa fa-edit",
                          tooltip: "Edit Record",
                          action: "edit",
                          //childXtype: 'actingreasonFrm',
                          winTitle: title + "",
                          winWidth: "40%",
                          handler: "renderParameterForm",
                          stores: "[]",
                        },
                        {
                          text: "Disable",
                          iconCls: "x-fa fa-repeat",
                          table_name: table_name,
                          storeID: table_name + "Str",
                          db_con: resp.db_con_name,
                          action_url: "configurations/softDeleteConfigRecord",
                          action: "soft_delete",
                          handler: "deleteRecordFromIDByConnection",
                        },
                        {
                          text: "Delete",
                          iconCls: "x-fa fa-trash",
                          tooltip: "Delete Record",
                          db_con: resp.db_con_name,
                          table_name: table_name,
                          storeID: table_name + "Str",
                          action_url: "configurations/deleteConfigRecord",
                          action: "actual_delete",
                          handler: "deleteRecordFromIDByConnection",
                        },
                        {
                          text: "Enable",
                          iconCls: "x-fa fa-undo",
                          tooltip: "Enable Record",
                          db_con: resp.db_con_name,
                          table_name: table_name,
                          storeID: table_name + "Str",
                          action_url: "configurations/undoConfigSoftDeletes",
                          action: "enable",
                          disabled: true,
                          handler: "deleteRecordFromIDByConnection",
                        },
                      ],
                    },
                  },
                  onWidgetAttach: function (col, widget, rec) {
                    var is_enabled = rec.get("is_enabled");
                    if (is_enabled === 0 || is_enabled == 0) {
                      widget
                        .down("menu menuitem[action=enable]")
                        .setDisabled(false);
                      widget
                        .down("menu menuitem[action=soft_delete]")
                        .setDisabled(true);
                    } else {
                      widget
                        .down("menu menuitem[action=enable]")
                        .setDisabled(true);
                      widget
                        .down("menu menuitem[action=soft_delete]")
                        .setDisabled(false);
                    }
                  },
                },
              ],
            });
            //add columns
            var tot = result.length - 1;
            if (tot > 5) {
              for (var i = result.length - 1; i >= 0; i--) {
                var column = Ext.create("Ext.grid.column.Column", {
                  text: result[i] + "",
                  dataIndex: result[i] + "",
                  width: 150,
                  tbCls: "wrap",
                });
                grid.headerCt.insert(grid.columns.length - 2, column);
              }
            } else {
              for (var i = result.length - 1; i >= 0; i--) {
                var column = Ext.create("Ext.grid.column.Column", {
                  text: result[i] + "",
                  dataIndex: result[i] + "",
                  flex: 1,
                  tbCls: "wrap",
                });
                grid.headerCt.insert(grid.columns.length - 2, column);
              }
            }
            grid.down("hiddenfield[name=def_id]").setValue(def_id);
            grid.down("hiddenfield[name=db_con]").setValue(resp.db_con_name);
            panel.add(grid);

            // var main_panel =  Ext.ComponentQuery.query("#contentPanel")[0];
            contentPnl.add(panel);
            contentPnl.setActiveTab(contentPnl.items.length - 1);
            Ext.getBody().unmask();
          } else {
            Ext.getBody().unmask();
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
    }
  },
  deleteRecordByID: function (
    id,
    table_name,
    storeID,
    url,
    method = null,
    is_variation = ""
  ) {
    var me = this,
      store = Ext.getStore(storeID);
    Ext.MessageBox.confirm(
      "Delete",
      "Are you sure to perform this action ?",
      function (btn) {
        if (btn === "yes") {
          Ext.getBody().mask("Deleting record...");
          if (!method) {
            method = "POST";
          }
          Ext.Ajax.request({
            url: base_url + url,
            method: method,
            params: {
              table_name: table_name,
              id: id,
              is_variation: is_variation,
              _token: token,
            },
            headers: {
              Authorization: "Bearer " + access_token,
              Accept: "application/json",
            },
            success: function (response) {
              Ext.getBody().unmask();
              var resp = Ext.JSON.decode(response.responseText),
                message = resp.message,
                success = resp.success;
              if (success == true || success === true) {
                toastr.success(message, "Success Response");
                store.removeAll();
                store.load();
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
              toastr.error(
                "Error deleting data: " + errorThrown,
                "Error Response"
              );
            },
          });
        } else {
          //
        }
      }
    );
  },

  
});
