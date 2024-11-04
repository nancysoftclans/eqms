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
        "auditfindingsfrm button[action=search_issue_type]": {
            click: "showAuditFinding",
        },
        'auditchecklistgrid button[name=savegrid_screening_btn]': {
            click: 'saveApplicationChecklistDetails'
        },
        auditPlanningWizardPnl: {
            afterrender: "prepapreAuditApplicationReceiving",
        },
        auditschedulepnl: {
            afterrender: "prepapreAuditApplicationSchedule",
        },
        audittypesgrid: {
            itemdblclick: "onAuditTypesGridClick",
        },
        // associatedissuegrid: {
        //     itemdblclick: "onAssociatedIssueGridClick",
        // },
        auditfindingsgrid: {
          refresh: "refreshAuditFindingGrid",
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
                onInitiateNewAuditPlan:'onInitiateNewAuditPlan',
                viewAuditApplication: 'viewAuditApplication',
                setCompStore: 'setCompStore',
                onAssociatedIssueGridClick: 'viewAssociatedIssueGrid',
                showRAuditApplicationSubmissionWin: 'showRAuditApplicationSubmissionWin'
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


    onLogButtonClick: function(btn) {

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

  showAuditFinding: function (btn) {
    var me = this,
        childXtype = btn.childXtype,
        winTitle = btn.winTitle,
        winWidth = btn.winWidth,
        mainTabPanel = me.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab();

    if (activeTab.down("hiddenfield[name=section_id]")) {
        section_id = activeTab.down("hiddenfield[name=section_id]").getValue();
    }
    if (activeTab.down("hiddenfield[name=active_application_code]")) {
        section_id = activeTab.down("hiddenfield[name=active_application_code]").getValue();
    }

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
    console.log(record);
    var auditPlanMainDetailsFrm = activeTab.down("auditPlanMainDetailsFrm");

       auditPlanMainDetailsFrm.loadRecord(record);
   


    Ext.Function.defer(function () {
      mask.hide();
      win.close();
    }, 200);
  },

  viewAssociatedIssueGrid: function (record, grid) {
    var me = this,
      win = grid.up("window"),
      title = record.get("title"),
      mask = new Ext.LoadMask({
        msg: "Please wait...",
        target: win,
      });
    mask.show();
    console.log(title);
    var auditfindingsfrm = Ext.widget("auditfindingsfrm");
        auditfindingsfrm.down("textfield[name=title]").setValue(title);
   
    Ext.Function.defer(function () {
      mask.hide();
      win.close();
    }, 200);
  },

  viewAuditApplication: function (record) {
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
        title: title,
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
  prepapreAuditApplicationReceiving: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      auditPlanMainDetailsFrm = activeTab.down("auditPlanMainDetailsFrm"),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue();

    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "auditManagement/prepapreAuditApplicationReceiving",
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
            auditPlanMainDetailsFrm.loadRecord(model);
            activeTab.down("displayfield[name=workflow_stage]").setValue(results.workflow_stage);
            activeTab.down("displayfield[name=tracking_no]").setValue(results.tracking_no);
            activeTab.down("displayfield[name=application_status]").setValue(results.application_status);
            activeTab.down("displayfield[name=process_name]").setValue(results.process_name);
          
           
          
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

  saveApplicationChecklistDetails: function (btn) {
        btn.setLoading(true);
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            screeningGrid = activeTab.down('auditchecklistgrid');
            this.commitApplicationChecklistDetails(btn, application_id, application_code, screeningGrid);
        },

    commitApplicationChecklistDetails: function (btn, application_id, application_code, screeningGrid) {
        var checklist_type = screeningGrid.down('combo[name=applicable_checklist]').getValue(),
            store = screeningGrid.getStore(),
            params = [];
            for (var i = 0; i < store.data.items.length; i++) {
                var record = store.data.items [i],
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
                    application_code: application_code,
                    item_resp_id: item_resp_id,
                    created_by: user_id,
                    checklist_item_id: checklist_item_id,
                    pass_status: pass_status,
                    comment: comment,
                    auditor_comment:auditor_comment,
                    auditorpass_status:auditorpass_status,
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

    refreshAuditFindingGrid: function (me) {
    var store = me.store,
      grid = me.up("treepanel"),
      mainTabPanel = this.getMainTabPanel(),
      activeTab = mainTabPanel.getActiveTab(),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue();

    store.getProxy().extraParams = {
      application_code: application_code
    };
  },

  showRAuditApplicationSubmissionWin: function (btn) {
    Ext.getBody().mask("Please wait...");
    var mainTabPanel = this.getMainTabPanel(),
      storeID = btn.storeID,
      table_name = btn.table_name,
      winWidth = btn.winWidth,
      activeTab = mainTabPanel.getActiveTab(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue(),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      applicantFrm = activeTab.down("auditPlanMainDetailsFrm"),
      Audit_id = applicantFrm.down("textfield[name=audit_type_id]").getValue(),
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
        url: "documentmanagement/validateAuditAppReceivingDetails",
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
            showWorkflowSubmissionWin(Audit_id, application_code, table_name,"workflowsubmissionsreceivingfrm",
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

      var applicantFrm = activeTab.down("auditPlanMainDetailsFrm"),
       Audit_id = applicantFrm.down("textfield[name=audit_type_id]").getValue();
   
    if (!Audit_id) {
      toastr.warning("Please Save Application Details!!", "Warning Response");
      return false;
    }
    if (!applicantFrm.isValid()) {
      // toastr.warning('Please Enter All the required Permits Details!!', 'Warning Response');
      // return false;
    }

    return true;
  },
  prepapreAuditApplicationSchedule: function (pnl) {
    Ext.getBody().mask("Please wait...");
    var me = this,
      activeTab = pnl;
      application_status_id = activeTab.down("hiddenfield[name=application_status_id]").getValue(),
      auditPlanMainDetailsFrm = activeTab.down("auditPlanMainDetailsFrm"),
      application_code = activeTab.down("hiddenfield[name=active_application_code]").getValue(),
      process_id = activeTab.down("hiddenfield[name=process_id]").getValue(),
      sub_module_id = activeTab.down("hiddenfield[name=sub_module_id]").getValue(),
      module_id = activeTab.down("hiddenfield[name=module_id]").getValue(),
      workflow_stage_id = activeTab.down("hiddenfield[name=workflow_stage_id]").getValue();

    if (application_code) {
      Ext.Ajax.request({
        method: "GET",
        url: "auditManagement/prepapreAuditApplicationReceiving",
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
            activeTab.down("displayfield[name=tracking_no]").setValue(results.tracking_no);
            activeTab.down("displayfield[name=application_status]").setValue(results.application_status);
            activeTab.down("displayfield[name=process_name]").setValue(results.process_name);
          
           
          
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