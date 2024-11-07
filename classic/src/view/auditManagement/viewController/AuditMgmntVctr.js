Ext.define('Admin.view.auditManagement.viewController.AuditMgmntVctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.auditMgmntVctr',

    setGridStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setDynamicTreeGridStore: function (obj, options) {
        this.fireEvent('setDynamicTreeGridStore', obj, options);
    },

    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
         setGridTreeStore: function (obj, options) {
        this.fireEvent('setGridTreeStore', obj, options);
    },
    /**
        Audit Types
     */
    showAuditTypesRecords: function(btn){
        var grid = Ext.widget('audittypes'),
        form = btn.up('form');
        funcShowCustomizableWindowWithObject('Audit Types Selection','90%',grid,'customizablewindow',form);
    },

    onSelectAuditType:function(grid ,record) {
        console.log(grid) 
        console.log(record);  
        
       var me = this,
           data = record.data
    },


    funcBeforeShowAuditTypeMetadata: function(frm) {
        
        var id  = frm.down('hiddenfield[name=id]').getValue();

        if(id) {
            return true;
        }
        else {
            frm.setActiveTab(0);
            toastr.warning("Please save the details of the Audit Type First", "Unsaved Changes");
            return false;
        }
    },
    showAddAuditMetaDataDetailsFrm: function(btn) {
        console.log(btn);
        var childXtype = btn.childXtype;

        var child = Ext.widget(childXtype);
        var grid = btn.up('grid');
        var panel = grid.up('panel');
        var audit_type_id = panel.down('hiddenfield[name=id]').getValue();
        
        if(child.down('hiddenfield[name=audit_type_id]')) {
            child.down('hiddenfield[name=audit_type_id]').setValue(audit_type_id);
        }

        

        funcShowCustomizableWindow('Custom Fields','90%',child,'customizablewindow');
    },
    /**
     * New Audit Plan
     */
    onInitiateAuditPlan: function(btn) {
       var application_type = btn.app_type;

            this.fireEvent('onInitiateNewAuditPlan',application_type);
    },

    onAuditPlanSchedule: function(btn) {
        // console.log(btn);
    },

    //*remove after correct implement 
    // getAuditLogsClick:function(){
    //     var logWindow = Ext.create('Admin.view.auditManagement.views.panels.panel');
    //     logWindow.show();
        
    // },

    saveNewAuditPlanDetails:function(btn){
       var wizard = btn.wizardpnl,
             wizardPnl = btn.up(wizard),
             action_url = btn.action_url,
             form_panel = btn.form_panel,
             table_name = btn.table_name,
             mainTabPnl = btn.up('#contentPanel'),
             containerPnl = mainTabPnl.getActiveTab();

        var process_id = containerPnl.down('hiddenfield[name=process_id]').getValue(),
            moduleId = containerPnl.down('hiddenfield[name=module_id]').getValue(),
            submodule_id = containerPnl.down('hiddenfield[name=sub_module_id]').getValue(),
            active_application_id = containerPnl.down('hiddenfield[name=active_application_id]').getValue(),
            applicationCode= containerPnl.down('hiddenfield[name=active_application_code]').getValue(),
            application_status_id = containerPnl.down('hiddenfield[name=application_status_id]').getValue(),
            workflow_stage_id = containerPnl.down('hiddenfield[name=workflow_stage_id]').getValue(),
            auditPlanMainDetailsFrm = containerPnl.down('auditPlanMainDetailsFrm');
         
            auditPlanMainDetailsFrm = auditPlanMainDetailsFrm.getForm(); 
  
        if (auditPlanMainDetailsFrm.isValid()) {
             // console.log(process_id, moduleId, submodule_id, applicationCode);
            auditPlanMainDetailsFrm.submit({
                url: 'auditManagement/'+action_url,
                waitMsg: 'Please wait...',
                params: {
                    module_id: moduleId,
                    sub_module_id: submodule_id,
                    application_code: applicationCode,
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    active_application_id: active_application_id,
                    application_status_id: application_status_id,
                    '_token': token
                },

                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (frm, action) {
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success,
                        active_application_id = resp.active_application_id,
                        application_code = resp.application_code,
                        product_id = resp.product_id,
                        tracking_no = resp.tracking_no;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                            containerPnl.down('hiddenfield[name=active_application_code]').setValue(application_code);
                            containerPnl.down('hiddenfield[name=sub_module_id]').setValue(submodule_id);
                            containerPnl.down('hiddenfield[name=module_id]').setValue(moduleId);
                            containerPnl.down('displayfield[name=tracking_no]').setValue(tracking_no);
                    } else {
                        toastr.error(message, "Failure Response");
                    }
                },
                failure: function (frm, action) {
                    var resp = action.result,
                        message = resp.message;
                    toastr.error(message, "Failure Response");
                }
            });


        } else {
            toastr.warning('Please fill all the required fields!!', 'Warning Response');
        }
    }, 

    showEditAuditType: function(btn) {
       var button = btn.up('button'),
       grid = button.up('grid'),
       record = button.getWidgetRecord(),
       //record_id = record.get('id')
       panelObject = Ext.widget(btn.panelXtype),
       frm = panelObject.down('form');

       console.log(panelObject);
       console.log(frm);


       frm.loadRecord(record);
      
       

        // form.reset();
        // form.loadRecord(record);

        // console.log(form);
        // console.log(record);
        
        funcShowCustomizableWindow('Audit Type','90%',panelObject,'customizablewindow');
    
    },

    saveAuditTypeMetaData: function(btn) {
        var form = btn.up('form'),
        frm = form.getForm(),
        f = form;

        if(frm.isValid()) {
            frm.submit({
                url: 'auditManagement/saveAuditTypeMetaData',
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token 
                },
                success: function(form, action) {
                    var response = Ext.decode(action.response.responseText),
                    success = response.success,
                    record_id = response.record_id,
                    message = response.message;



                    if(success == true || success === true) { 
                        toastr.success(message, "Success Response");
                        // f.down('hiddenfield[name=id]').setValue(record_id);
                        
                    }else {
                        toastr.error(message, 'Failure Response'); 
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            })
        }
    },

    showAddConfigParamWinFrm: function (btn) {
        var me = this,
            childXtype = btn.childXtype,
            winTitle=btn.winTitle,
            winWidth=btn.winWidth,
            child = Ext.widget(childXtype);
        
        if(btn.has_params){
            var param_value = btn.up('grid').down('hiddenfield[name='+btn.param_name+']').getValue();
            child.down('hiddenfield[name='+btn.param_name+']').setValue(param_value);
        }
        child.setHeight(600);
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
       
    },

    //show log window
    showLogGridwin: function(btn){
        var me = this,
            childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth= btn.winWidth,
            child = Ext.widget(childXtype);
        if (btn.has_params){
            var param_value = btn.up('grid').down('hiddenfield[name='+btn.param_name+']').getValue();
            child.down('hiddenfield[name='+btn.param_name+']').setValue(param_value);
        }
        //child.setHeight('600');



        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    },

    showLogConfigwin: function(btn) {
        
        var button = btn.up('button'),
        grid = button.up('grid'),
        record = button.getWidgetRecord(),
        
        childXtype = btn.childXtype,
         winWidth='100%',
         winTitle="logs",
    //     form = Ext.widget(childXtype),
        storeArray = eval(btn.stores),
        arrayLength = storeArray.length;
    if (arrayLength > 0) {
        me.fireEvent('refreshStores', storeArray);
    }
     var refId = record.get('id');
     
    // logGrid.loadRecord(refId);
    //logGrid.setHeight(650);
   // var logGrid = Ext.ComponentQuery.query('#audittypeloggrids')[0];
    var logGrid = Ext.widget(childXtype);
    //console.log(logGrid);
    logGrid.down('textfield[name=id]').setValue(refId);

    funcShowCustomizableWindow(winTitle, winWidth, logGrid, 'customizablewindow');
     
     },
 

    doCreateConfigParamWin: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm();
        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {model: table},
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    //console.log("Server response:", action.response.responseText);
                    var response = Ext.decode(action.response.responseText),
                        success = response.success;
                        message = response.message;
                        id = response.record_id;
                        //console.log(id);
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        store.load();
                        win.close();
                        var logGrid = Ext.widget('audittypeloggrid');
                        //logGrid.down('textfield[name=id]').setValue(id);
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;

                    //console.log(resp);
                    toastr.error(resp.message, 'Failure Response');
                },
            });
        }
    },
    showEditAuditTypeConfigParamWinFrm: function (item) {
        //if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            childXtype = item.childXtype,
            winTitle=item.winTitle,
            winWidth=item.winWidth,
            form = Ext.widget(childXtype),
            storeArray = eval(item.stores),
            arrayLength = storeArray.length;
            
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        form.loadRecord(record);
        form.setHeight(650);
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
        /* } else {
             toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
             return false;
         }*/
    },
    quickNavigation: function (btn) {
         var step = btn.step,
            wizard = btn.wizard,
            max_step = btn.max_step,
            wizardPnl = btn.up(wizard);
            
            motherPnl = wizardPnl;
            panel = motherPnl.up('panel'),
            application_id = motherPnl.down('hiddenfield[name=sub_module_id]').getValue(),
            progress = wizardPnl.down('#progress_tbar'),
            progressItems = progress.items.items;

        if (step == 1) {
            var thisItem = progressItems[step];
            if (!application_id) {
                thisItem.setPressed(false);
                toastr.warning('Please save document details first!!', 'Warning Response');
                return false;
            }
        }
        if (step == 0) {
            motherPnl.down('button[name=save_btn]').setVisible(true);
            // panel.getViewModel().set('atBeginning', false);
            // panel.getViewModel().set('atEnd', true);
            wizardPnl.down('button[name=process_submission_btn]').setVisible(false);
        } else if (step == max_step) {
            
            motherPnl.down('button[name=save_btn]').setVisible(false);
            //panel.getViewModel().set('atBeginning', true);
            wizardPnl.down('button[name=process_submission_btn]').setVisible(true);
        } else {
            // panel.getViewModel().set('atBeginning', false);
            // panel.getViewModel().set('atEnd', false);
            if(wizardPnl.down('button[name=save_btn]')){

                wizardPnl.down('button[name=save_btn]').setVisible(false);
            }
          
                wizardPnl.down('button[name=process_submission_btn]').setVisible(false);
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
            }
            else {
                item.setPressed(false);
            }

            if (Ext.isIE8) {
                item.btnIconEl.syncRepaint();
            }
        }
        activeItem.focus();
    },

    onViewAuditApplication: function (grid, record) {

        this.fireEvent('viewAuditApplication', record);

    },

    // onSelectAssociatedIssueApplication: function (grid, record) {

    //     this.fireEvent('onAssociatedIssueGridClick', record, grid);

    // },
    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },

    saveAuditFindingParam: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm(),
            checklist_store = Ext.getStore('applicationpaymentsstr'), 
            activePanel = Ext.ComponentQuery.query("#wizardpnl")[0];
            applicationCode= activePanel.down('hiddenfield[name=active_application_code]').getValue();

        
        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {model: table, application_code: applicationCode},
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
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

                        if(checklist_store){
                            checklist_store.load();
                        }
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;

                    console.log(resp);
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },

    showRAuditApplicationSubmissionWin: function (btn) {

        this.fireEvent('showRAuditApplicationSubmissionWin', btn);
    },

    showAddChecklistItemConfigParamWinFrm: function (btn) {
        //if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
        var me = this,
            childXtype = btn.childXtype,
            winTitle=btn.winTitle,
            winWidth=btn.winWidth,
            child = Ext.widget(childXtype),
            storeArray = eval(btn.stores),
            grid = btn.up('grid'),
            checklist_type_id = grid.down('hiddenfield[name=checklist_type_id]').getValue(),
            checklist_category_id = grid.down('hiddenfield[name=checklist_category_id]').getValue(),
            arrayLength = storeArray.length;
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        child.down('combo[name=checklist_type_id]').setValue(checklist_type_id);
        child.down('combo[name=checklist_category_id]').setValue(checklist_category_id);
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
        /* } else {
             toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
             return false;
         }*/
    },

    previewUploadedDocument: function (item) {
    var btn = item.up('button'),
        download = item.download,
        record = btn.getWidgetRecord(),
        node_ref = record.get('node_ref'),
        application_code = record.get('application_code'),
        uploadeddocuments_id = record.get('uploadeddocuments_id');

        if(item.up('grid')){
           var grid = item.up('grid');
        }else{
           var grid  = Ext.ComponentQuery.query("#applicationdocuploadsgrid")[0]
        }
        
        if(node_ref != ''){

            this.functDownloadAppDocument(node_ref,download,application_code,uploadeddocuments_id, grid);
        }
        else{
            toastr.error('Document Not Uploaded', 'Failure Response');
        }
        

},

functDownloadAppDocument:function(node_ref,download,application_code=null,uploadeddocuments_id=null, grid=''){
        //get the document path 
        if(grid != ''){

            grid.mask('Document Preview..');
        }
      
        Ext.Ajax.request({
            url: 'documentmanagement/getApplicationDocumentDownloadurl',
            method: 'GET',
            params: {
                node_ref: node_ref,
                application_code:application_code,
                uploadeddocuments_id:uploadeddocuments_id,
                download:download
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                Ext.getBody().unmask();
                grid.unmask();
          
                var resp = Ext.JSON.decode(response.responseText),
                success = resp.success;
                document_url = resp.document_url;
                filename = resp.filename;
                if (success == true || success === true) {
                    var a = document.createElement("a");
                    a.href = document_url; 
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                } else {
                    toastr.error(resp.message, 'Failure Response');
                }
                   
                    
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error downloading data: ' + errorThrown, 'Error Response');
            }
        });


},
generateAuditReport: function (item) {
        var record = item.getWidgetRecord(),
            application_code = record.get('application_code');
            module_id = record.get('module_id');
            sub_module_id = record.get('sub_module_id');
        this.fireEvent('generateAuditReport', application_code,module_id,sub_module_id);
    },

   
})