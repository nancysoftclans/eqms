var backStep = 1;
Ext.define('Admin.view.commoninterfaces.viewControllers.CommoninterfacesVctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.commoninterfacesVctr',

    init: function () {

    },
    setPremiseRegGridsStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setCompStore:function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
    addAuthSignature: function(btn) {
        this.fireEvent('addAuthSignature', btn);
    },
    setGridStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setParamCombosStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
    setDynamicTreeGridStore: function (obj, options) {
        this.fireEvent('setGridTreeStore', obj, options);
    },
    showApplicationMoreDetails: function (btn) {
        this.fireEvent('showApplicationMoreDetails', btn);
    },
    add_application_details_tag: function (btn) {
        this.fireEvent('add_application_details_tag', btn);
    },
    showApplicationDocUploadWin: function (btn) {
        this.fireEvent('showApplicationDocUploadWin', btn);
    },
    onEditOnlineQuery: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            record = btn.getWidgetRecord(),
            application_id = grid.down('hiddenfield[name=application_id]').getValue(),
            application_code = grid.down('hiddenfield[name=application_code]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),

            win = grid.up('window'),
            queriesFrm = Ext.widget('onlinequeriesfrm'),
            gridHeight = grid.getHeight();
        queriesFrm.loadRecord(record);
        queriesFrm.setHeight(gridHeight);

        queriesFrm.down('hiddenfield[name=application_id]').setValue(application_id);
        queriesFrm.down('hiddenfield[name=application_code]').setValue(application_code);

        queriesFrm.down('hiddenfield[name=module_id]').setValue(module_id);
        queriesFrm.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);


        grid.hide();
        win.add(queriesFrm);
    },
    
    doSavequerychecklistitemsWin: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form_xtype = btn.up('form'),
            win = form_xtype.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            module_id = form_xtype.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = form_xtype.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = form_xtype.down('hiddenfield[name=section_id]').getValue(),
            query_id = form_xtype.down('hiddenfield[name=query_id]').getValue(),
            is_structured = form_xtype.down('hiddenfield[name=is_structured]').getValue(),
            process_id = form_xtype.down('hiddenfield[name=process_id]').getValue(),
            application_code = form_xtype.down('hiddenfield[name=application_code]').getValue();

        var frm = form_xtype.getForm();
            
        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {model: table},
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
                        
                        store.load({params: {module_id: module_id, sub_module_id: sub_module_id,section_id:section_id,application_code:application_code,query_id:query_id,process_id:process_id,is_structured:is_structured}});
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    backToOnlineQueries: function (btn) {
        var queriesFrm = btn.up('form'),
            win = queriesFrm.up('window'),
            grid = win.down('grid');
        win.remove(queriesFrm, true);
        grid.show();
    },
    onAddOnlineQuery: function (btn) {
        var grid = btn.up('grid'),
            win = grid.up('window'),
            application_id = grid.down('hiddenfield[name=application_id]').getValue(),
            application_code = grid.down('hiddenfield[name=application_code]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),
            queriesFrm = Ext.widget('onlinequeriesfrm'),
            gridHeight = grid.getHeight();
        queriesFrm.down('hiddenfield[name=application_id]').setValue(application_id);
        queriesFrm.down('hiddenfield[name=application_code]').setValue(application_code);

        queriesFrm.down('hiddenfield[name=module_id]').setValue(module_id);
        queriesFrm.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        queriesFrm.setHeight(gridHeight);
        grid.hide();
        win.add(queriesFrm);
    },
    saveOnlineQuery: function (btn) {
        var action_url = btn.action_url,
            form = btn.up('form'),
            win = form.up('window'),
            grid = win.down('grid'),
            store = grid.getStore(),
            frm = form.getForm();
        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        store.load();
                        win.remove(form, true);
                        grid.show();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },  
    showWinAddApplicationUnstrcuturedQueryForm: function (btn) {
        var form = Ext.widget('applicationunstructuredqueriesfrm'),
            grid = btn.up('grid'),
            height = grid.getHeight(),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = grid.down('hiddenfield[name=section_id]').getValue(),
            application_code = grid.down('hiddenfield[name=application_code]').getValue();
            form.down('hiddenfield[name=module_id]').setValue(module_id);
            form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            form.down('hiddenfield[name=section_id]').setValue(section_id);
            winWidth = '70%';
            form.down('hiddenfield[name=application_code]').setValue(application_code);
            form.setHeight(height);
           
        funcShowCustomizableWindow('GCP Inspection Non-Conformance Observation(s)', winWidth, form, 'customizablewindow');
    },
    
    showAddApplicationUnstrcuturedQueryForm: function (btn) {
        var form = Ext.widget('applicationunstructuredqueriesfrm'),
            grid = btn.up('grid'),
            height = grid.getHeight(),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = grid.down('hiddenfield[name=section_id]').getValue(),
            application_code = grid.down('hiddenfield[name=application_code]').getValue(),
            win = grid.up('window');
            form.down('hiddenfield[name=module_id]').setValue(module_id);
            form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            form.down('hiddenfield[name=section_id]').setValue(section_id);

            form.down('hiddenfield[name=application_code]').setValue(application_code);
            form.setHeight(height);
           // grid.hide();
           // win.add(form);
           funcShowCustomizableWindow('Query', "60%", form, 'customizablewindow');
    },

    funcAddquerychecklistitems: function (btn) {
        var frm = btn.up('form'),
            height = frm.getHeight(),
            module_id = frm.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = frm.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = frm.down('hiddenfield[name=section_id]').getValue(),
            query_id = frm.down('hiddenfield[name=query_id]').getValue(),
            is_structured = frm.down('hiddenfield[name=query_id]').getValue(),
            process_id = frm.down('hiddenfield[name=process_id]').getValue(),
            application_code = frm.down('hiddenfield[name=application_code]').getValue(),
            childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            form = Ext.widget(childXtype);
            
        form.down('hiddenfield[name=module_id]').setValue(module_id);
        form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        form.down('hiddenfield[name=section_id]').setValue(section_id);
        
        form.down('hiddenfield[name=query_id]').setValue(query_id);
        form.down('hiddenfield[name=is_structured]').setValue(is_structured);
        form.down('hiddenfield[name=process_id]').setValue(process_id);
        form.down('hiddenfield[name=application_code]').setValue(application_code);
        
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');

    },


    doDeleteApplicationRegWidgetParam: function (item) {
        //if (this.fireEvent('checkFullAccess')) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            id = record.get('id'),
            storeID = item.storeID,
            table_name = item.table_name,
            url = item.action_url;
        this.fireEvent('deleteRecord', id, table_name, storeID, url);

    },
    doDeletePremiseRegWidgetParam: function (item) {
        //if (this.fireEvent('checkFullAccess')) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            id = record.get('id'),
            storeID = item.storeID,
            table_name = item.table_name,
            url = item.action_url;
        this.fireEvent('deleteRecord', id, table_name, storeID, url);
        /*  } else {
              toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
              return false;
          }*/
    },

    saveUnstructuredApplicationQuery: function (btn) {
        var me = this,
            form = btn.up('form'),
            is_structured = form.down('hiddenfield[name=is_structured]').getValue(),
            query_id = form.down('hiddenfield[name=query_id]').getValue(),
            reload_base = btn.reload_base,
            action_url = btn.action_url;
            win = form.up('window');
            frm = form.getForm();

        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store = Ext.getStore('checklistitemsqueriesstr');
                        win.close();
                     //   store.load();
                        store.removeAll();
                       
                        store.removeAll();
                        store.load({params: {query_id:query_id,is_structured:is_structured}});
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }

    },
    backToApplicationQueriesGrid: function (btn) {
        var form = btn.up('form'),
            win = form.up('window'),
            grid = win.down('grid');
        win.remove(form, true);
        grid.show();
    },

    functionQueryaction: function (grid, rowIndex, status_id) {

        var store = grid.store,
            record = store.getAt(rowIndex);
        win = grid.up('window'),
            record_id = record.get('id'),
            application_id = win.down('hiddenfield[name=application_id]').getValue();
        application_code = win.down('hiddenfield[name=application_code]').getValue();

        //get the document path 
        Ext.getBody().mask('Closing query details..');

        Ext.Ajax.request({
            url: 'premiseregistration/onOnlineApplicationActionQueries',
            method: 'POST',
            params: {
                record_id: record_id,
                application_id: application_id,
                application_code: application_code,
                status_id: status_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {

                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success;
                message = resp.message;

                if (success == true || success === true) {
                    toastr.success(message, 'Response');
                    store.removeAll();
                    store.load()
                } else {
                    toastr.error(message, 'Failure Response');
                }


            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
            }
        });

    },
    onActionCloseInitialQuery: function (grid, rowIndex,) {
        this.functionQueryaction(grid, rowIndex, 4)
    },
    onActionOpenInitialQuery: function (grid, rowIndex,) {
        this.functionQueryaction(grid, rowIndex, 1)
    },
    onDeleteOnlineQuery: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            store = grid.store,
            record = btn.getWidgetRecord(),
            win = grid.up('window'),
            record_id = record.get('id'),

            status_id = record.get('status_id'),
            application_id = win.down('hiddenfield[name=application_id]').getValue();
        application_code = win.down('hiddenfield[name=application_code]').getValue();

        //get the document path 
        Ext.getBody().mask('Deleting query details..');

        Ext.Ajax.request({
            url: 'premiseregistration/onDeleteOnlineApplicationQueries',
            method: 'POST',
            params: {
                record_id: record_id,
                application_id: application_id,
                application_code: application_code,
                status_id: status_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {

                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success;
                message = resp.message;
                if (success == true || success === true) {
                    toastr.success(message, 'Response');
                    store.removeAll();
                    store.load()
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
            }
        });
    },
    setProductRegGridsStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setProductRegGridsStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setPremiseRegCombosStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },

    setWorkflowCombosStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },

    setOrgConfigCombosStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },

    setConfigGridsStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setSurveillanceCombosStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
    setConfigCombosSectionfilterStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },

    setConfigCombosStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },

    setConfigCombosProductfilterStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },

    setCommonGridsStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },

    setParamCombosStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
    doSavePrecheckingecommendationDetails: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),

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
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                            win.close();
                        store1 = Ext.getStore('meetingApplicationListGridStr');
                        if(store1){
                            store1.load();
                            return true;
                        }
                        store1 = Ext.getStore('premiseReviewTCMeetingStr');
                        if(store1){
                            store1.load();
                            return true;
                        }
                        store1 = Ext.getStore('pvRcMeetingApplicationListGridStr');
                        if(store1){
                            store1.load();
                            return true;
                        }
                        store1 = Ext.getStore('pvMeetingApplicationListGridStr');
                        if(store1){
                            store1.load();
                            return true;
                        }
                        store1 = Ext.getStore('pMSProgramMeetingAppListStr');
                        if(store1){
                            store1.load();
                            return true;
                        }
                        store1 = Ext.getStore('enforcementApplicationsGridStr');
                        if(store1){
                            store1.load();
                            return true;
                        }
                        store1 = Ext.getStore('peerJointOperationsApplicationsGrid');
                        if(store1){
                            store1.load();
                            return true;
                        }
                        store1 = Ext.getStore('monitoringmeetingGridStr');
                        if(store1){
                            store1.load();
                            return true;
                        }
                        store1 = Ext.getStore('PromotionMeetingsApplicationsGridStr');
                        if(store1){
                            store1.load();
                            return true;
                        }
                        store1 = Ext.getStore('promotionPVACMeetingsApplicationsGridStr');
                        if(store1){
                            console.log(store1);
                            store1.load();
                            return true;
                        }
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    doCreateCommonParamWin: function (btn) {
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
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        store.load();
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },

    showEditCommonParamParamWinFrm: function (item) {
        var me = this,
            btn = item.up('button'),
            grid = btn.up('grid'),
            record = btn.getWidgetRecord(),
            childXtype = item.childXtype,
            winTitle = item.winTitle,
            winWidth = item.winWidth,
            form = Ext.widget(childXtype),
            storeArray = eval(item.stores),
            arrayLength = storeArray.length;
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        form.loadRecord(record);
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
    },

    doDeleteCommonParamWidgetParam: function (item) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            id = record.get('id'),
           storeID = item.storeID,
            table_name = item.table_name,
            url = item.action_url;
            console.log(storeID);
        this.fireEvent('deleteRecord', id, table_name, storeID, url);
    },

    showApplicationDocUploadWin: function (btn) {
        var mainTabPnl = btn.up('#contentPanel'),
            container = mainTabPnl.getActiveTab(),
            process_id = container.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage = container.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_code = container.down('hiddenfield[name=active_application_code]').getValue();
        this.fireEvent('showDocUploadWin', btn, process_id, workflow_stage, application_code);
    },

    updateApplicationDocUploadWin: function (item) {
        var me = this,
            btn = item.up('button'),
            mainTabPnl = item.up('#contentPanel');
            if(mainTabPnl){
              var activeTab = mainTabPnl.getActiveTab(); 
            }else{
              var activeTab = Ext.ComponentQuery.query("#contentPanel")[0];
            }
            
            var record = btn.getWidgetRecord(),
            childXtype = item.childXtype,
            winTitle = item.winTitle,
            winWidth = item.winWidth,
            grid = btn.up('treepanel'),
            table_name = grid.table_name,
            upload_tab = grid.upload_tab,
            application_code = record.get('application_code'),
            document_type_id = record.get('document_type_id'),
            document_requirement = record.get('document_requirement_id'),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            // module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            form = Ext.widget(childXtype);
        form.loadRecord(record);
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
        var store = Ext.getStore('document_requirementsStr');
        form.down('button[name=upload_file_btn]').upload_tab = upload_tab;
        form.down('button[name=upload_file_btn]').storeID = 'applicationDocumentsUploadsStr';
        var doctype_id = form.down('combo[name=doctype_id]');
        doctype_id.store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        var document_requirement_id = form.down('combo[name=document_requirement_id]');
        doctype_id.setValue(document_type_id);
        document_requirement_id.setValue(document_requirement);
        doctype_id.setReadOnly(true);
        document_requirement_id.setReadOnly(true);
    },

    previewPreviousUploadedDocument: function (item) {
        var me = this,
            btn = item.up('button'),
            storeId = item.storeId,
            record = btn.getWidgetRecord(),
            childXtype = item.childXtype,
            winTitle = item.winTitle,
            winWidth = item.winWidth,
            grid = btn.up('treepanel'),
            table_name = grid.table_name,
            record_id = record.get('id'),
            form = Ext.widget(childXtype);
        //set doc id
        form.down('hiddenfield[name=document_id]').setValue(record_id);
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
        // var store = Ext.getStore(storeId);
        // store.removeAll();
        // store.load({params: {document_upload_id: record_id, table_name: table_name}});
    },

    

    onDeleteApplicationDocument: function (item) {
        var btn = item.up('button'),
            download = item.download,

            record = btn.getWidgetRecord(),
            grid = btn.up('treepanel'),
            store = grid.store,
            table_name = grid.table_name,
            document_type_id = grid.document_type_id,
        node_ref = record.get('node_ref'),
            application_document_id = record.get('application_document_id'),
            record_id = record.get('id'),
            application_code = record.get('application_code');
        //get the document path 
         Ext.MessageBox.confirm('Delete', 'Are you sure to perform this action ?', function (btn) {
            if (btn === 'yes') {
                Ext.getBody().mask('Deleting Uploaded Document..');

                Ext.Ajax.request({
                    url: 'documentmanagement/onApplicationDocumentDelete',
                    method: 'POST',
                    params: {
                        node_ref: node_ref,
                        record_id: record_id,
                        application_document_id: application_document_id,
                        application_code: application_code
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {

                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success;
                        message = resp.message;
                        if (success == true || success === true) {
                            toastr.success(message, 'Response');
                            store.removeAll();
                            store.load({
                                params: {
                                    table_name: table_name,
                                    document_type_id: document_type_id,
                                    application_code: application_code
                                }
                            })
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
                    }
                });
            }else {
                 toastr.warning('Terminated Successfully', 'Operation Cancelled');
            }
        });
    },
    onDeleteNonStructureApplicationDocument: function (item) {
        var btn = item.up('button'),
            download = item.download,

            record = btn.getWidgetRecord(),
            grid = btn.up('grid'),
            store = grid.store,
            table_name = grid.table_name,
            document_type_id = grid.document_type_id,

            node_ref = record.get('node_ref'),
            record_id = record.get('id'),
            application_code = record.get('application_code');
        //get the document path 
        Ext.getBody().mask('Deleting Uploaded Document..');

        Ext.Ajax.request({
            url: 'documentmanagement/onDeleteNonStructureApplicationDocument',
            method: 'POST',
            params: {
                node_ref: node_ref,
                record_id: record_id,
                table_name: table_name
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {

                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success;
                message = resp.message;
                if (success == true || success === true) {
                    toastr.success(message, 'Response');
                    store.removeAll();
                    store.load()
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
            }
        });
    },
    cancelAddApplicationComment: function (btn) {
        var form = btn.up('form'),
            panel = form.up('panel'),
            grid = panel.down('grid'),
            add_btn = grid.down('button[name=add_btn]');
        form.setVisible(false);
        add_btn.setDisabled(false);
    },

    showAddApplicationComment: function (btn) {
        btn.setDisabled(true);
        var grid = btn.up('grid'),
            panel = grid.up('panel'),
            form = panel.down('form');
        form.setVisible(true);
    },

    showEditApplicationComment: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            form = Ext.widget('applicationcommentsFrm');
        form.loadRecord(record);

        funcShowCustomizableWindow('Edit Recommendations', '60%', form, 'customizablewindow');

    },
    showEditInvestigationComment: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            form = Ext.widget('investigationcommentsFrm');
        form.loadRecord(record);

        funcShowCustomizableWindow('Edit Comments', '60%', form, 'customizablewindow');

    },

    doDeleteCommonWidgetParam: function (item) {
        //if (this.fireEvent('checkFullAccess')) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            id = record.get('id'),
            storeID = item.storeID,
            table_name = item.table_name,
            url = item.action_url;
        this.fireEvent('deleteRecord', id, table_name, storeID, url);

    },
   

    funcActiveSamplesOtherInformationTab: function (tab) {
        this.fireEvent('funcActiveSamplesOtherInformationTab', tab);
    },

    editSsampleanalysistestrequests: function (item) {// here
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            panel = btn.up('panel[name=sampleanalysistestrequestspnl]'),
            section_id = panel.down('hiddenfield[name=section_id]').getValue(),
            code_ref_no = panel.down('hiddenfield[name=code_ref_no]').getValue(),
            childXtype,
            childObject;
        if (section_id == 1) {
            childXtype = 'foodsampleanalysistestrequestswizard';
        } else if (section_id == 2) {
            childXtype = 'drugssampleanalysistestrequestswizard';
        } else if (section_id == 3) {
            childXtype = 'cosmeticssampleanalysistestrequestswizard';
        } else if (section_id == 4) {
            childXtype = 'medicaldevicessampleanalysistestrequestswizard';
        }
        childXtype = 'sampleanalysistestrequestswizard';
        childObject = Ext.widget(childXtype);
        var sampleDetailsForm = childObject.down('commonsampledetailsfrm'),
            sampleDetailsFrm = sampleDetailsForm.getForm(),
            tabPnl = childObject.down('tabpanel');
        childObject.down('displayfield[name=reference_no]').setValue(code_ref_no);
        if (section_id == 1 || section_id == 3 || section_id === 1 || section_id === 3) {//food and cosmetics
            sampleDetailsForm.down('combo[name=product_form_id]').setHidden(false);
            sampleDetailsForm.down('textfield[name=common_name]').setHidden(false);
        } else if (section_id == 4 || section_id === 4) {//medical devices
            sampleDetailsForm.down('combo[name=device_type_id]').setHidden(false);
        } else {
            sampleDetailsForm.down('combo[name=dosage_form_id]').setHidden(false);
            tabPnl.items.getAt(1).tab.setHidden(false);
        }
        sampleDetailsFrm.loadRecord(record);
        panel.removeAll();
        panel.add(childObject);
        panel.down('displayfield[name=laboratoryreference_no]').setValue(record.get('reference_no'));
        panel.down('displayfield[name=laboratory_no]').setValue(record.get('laboratory_no'));
        panel.down('displayfield[name=reference_no]').setValue(record.get('reference_no'));
    },

    viewsampleanalysistestResults: function (item) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            requeststatus_id = record.get('requeststatus_id'),
            panel = btn.up('panel[name=sampleanalysistestrequestspnl]'),
            section_id = panel.down('hiddenfield[name=section_id]').getValue(),
            code_ref_no = panel.down('hiddenfield[name=code_ref_no]').getValue(),
            childXtype;
        if (requeststatus_id > 4) {
            if (section_id == 1) {
                childXtype = 'foodsampleanalysistestresultswizard';
            } else if (section_id == 2) {
                childXtype = 'drugssampleanalysistestresultswizard';
            } else if (section_id == 3) {
                childXtype = 'cosmeticssampleanalysistestresultswizard';
            } else if (section_id == 4) {
                childXtype = 'medicaldevicessampleanalysistestresultswizard';
            }
            var childObject = Ext.widget(childXtype),
                form = childObject.down('#sampledetailsfrm'),
                frm = form.getForm();
            frm.loadRecord(record)
            panel.removeAll();
            panel.add(childObject);
            panel.down('displayfield[name=laboratoryreference_no]').setValue(record.get('reference_no'));
            panel.down('displayfield[name=laboratory_no]').setValue(record.get('laboratory_no'));
            panel.down('displayfield[name=reference_no]').setValue(record.get('reference_no'));
            panel.down('hiddenfield[name=labreference_no]').setValue(record.get('reference_no'));
        } else {
            toastr.warning('Sample Analysis Results not complete or approved', 'Warning Response!!');
        }
    },

    funcReturnBackSampleTestAnalysisrequest: function (btn) {
        var form = btn.up('form'),
            childXtype = btn.childXtype,
            childObject = Ext.widget(childXtype),
            panel = form.up('panel');
        form.destroy();
        panel.add(childObject)

    },

    funcSampleApplicationSubmissionWin: function (btn) {
        var form = btn.up('form'),
            childXtype = btn.childXtype,
            childObject = Ext.widget(childXtype),
            panel = form.up('panel[name=sampleanalysistestrequestspnl]'),
            application_code = panel.down('hiddenfield[name=application_code]').getValue(),
            sample_app_code = panel.down('hiddenfield[name=sample_application_code]').getValue(),
            limssample_id = form.down('hiddenfield[name=limssample_id]').getValue(),
            mask = new Ext.LoadMask(
                {
                    msg: 'Please wait...',
                    target: panel
                }
            );
        if (sample_app_code) {
            application_code = sample_app_code;
        }
        if (limssample_id) {
            Ext.Msg.prompt("Sample Test Request Submissions", "Please enter the Submission Remarks", function (btnText, sInput) {
                if (btnText === 'ok') {
                    mask.show();
                    Ext.Ajax.request({
                        url: 'sampleanalysis/funcSampleApplicationSubmissionWin',
                        params: {
                            limssample_id: limssample_id,
                            application_code: application_code,
                            remarks: sInput,
                            _token: token
                        },
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        },
                        success: function (response) {
                            mask.hide();
                            var resp = Ext.JSON.decode(response.responseText),
                                success = resp.success,
                                message = resp.message;
                            if (success || success == true || success === true) {
                                toastr.success(message, 'Success Response!!');
                                form.destroy();
                                panel.add(childObject)

                            } else {
                                toastr.error(message, 'Failure Response!!');
                            }
                        },
                        failure: function (response) {
                            mask.hide();
                            var resp = Ext.JSON.decode(response.responseText),
                                message = resp.message;
                            toastr.warning(message, 'Failure Response!!');
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            mask.hide();
                            toastr.error('Error: ' + errorThrown, 'Error Response');
                        }
                    });
                }
            }, this);

        } else {
            toastr.error('Error: Save Sample Test request to submit', 'Error Response');
        }

    },

    viewsampleanalysistestrequestsProcesses: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            laboratoryreference_no = record.get('reference_no'),
            childXtype = item.childXtype,

            winTitle = item.winTitle,
            winWidth = item.winWidth;

        var child = Ext.widget(childXtype);
        child.setHeight(450)
        child.down('hiddenfield[name=labreference_no]').setValue(laboratoryreference_no);
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');


    }, printSampleTestRequestReview: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            application_code = record.get('application_code'),
            module_id = record.get('module_id'),
            reference_no = record.get('reference_no');

            // report_url = lims_baseurl + 'reports/reports/generateTestReviewReport?reference_no=' + reference_no;
        // print_report(report_url);
        previewCorrespondence(application_code, module_id, 'sampletestletter');
    },printSampleCertificate:  function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            application_code = record.get('application_code'),
            module_id = record.get('module_id'),
            reference_no = record.get('reference_no');
            
            // report_url = lims_baseurl + 'reports/reports/printSampleCertificate?reference_no=' + reference_no;
        previewCorrespondence(application_code, module_id, 'samplecertificate');

    },printSampleCertificate:  function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            application_code = record.get('application_code'),
            module_id = record.get('module_id'),
            reference_no = record.get('reference_no');
            
        //     report_url = lims_baseurl + 'reports/reports/printSampleCertificate?reference_no=' + reference_no;
        // print_report(report_url);
        previewCorrespondence(application_code, module_id, 'samplecertificate');

    },printSampleSummaryReport:  function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            application_code = record.get('application_code'),
            module_id = record.get('module_id'),
            sample_id = record.get('sample_id');
            
        //     report_url = lims_baseurl + 'reports/reports/printReport?sample_id=' + sample_id;
        // print_report(report_url);
        previewCorrespondence(application_code, module_id, 'samplesummaryreport',JSON.stringify({sample_id:sample_id}));

    },
    
    quickNavigationSample: function (btn) {
        var step = btn.step,
            wizard = btn.wizard,
            wizardPnl = btn.up(wizard),
            motherPnl = wizardPnl.up('panel'),
            limssample_id = motherPnl.down('hiddenfield[name=limssample_id]').getValue(),
            progress = wizardPnl.down('#progress_tbar'),
            progressItems = progress.items.items;

        if (step > 0) {
            var thisItem = progressItems[step];
            if (!limssample_id) {
                thisItem.setPressed(false);
                toastr.warning('Please save sample Test Request details first!!', 'Warning Response');
                return false;
            }
        }

        wizardPnl.getLayout().setActiveItem(step);
        var layout = wizardPnl.getLayout(),
            item = null,
            i = 0,
            activeItem = layout.getActiveItem();
        if (step == 0) {
            motherPnl.getViewModel().set('atBeginning', true);
        } else if (step == 1) {
            motherPnl.getViewModel().set('atBeginning', false);
        } else {
            motherPnl.getViewModel().set('atBeginning', false);
        }
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
    onPrevCardClickSample: function (btn) {
        var wizard = btn.wizard,
            wizardPnl = btn.up(wizard),
            motherPnl = wizardPnl.up('panel');
        motherPnl.getViewModel().set('atEnd', false);
        this.navigateSampleTestRequest(btn, wizardPnl, 'prev');
    },
    onNextCardClickSample: function (btn) {
        var wizard = btn.wizard,
            wizardPnl = btn.up(wizard),
            motherPnl = wizardPnl.up('panel');
        motherPnl.getViewModel().set('atBeginning', false);
        this.navigateSampleTestRequest(btn, wizardPnl, 'next');
    },
    setConfigCombosSampleSectionfilterStore: function (obj, options) {
        this.fireEvent('setConfigCombosSampleSectionfilterStore', obj, options);
    },
    funcAddTestAnalysisParameter: function (btn) {
        var childXtype = btn.childXtype,
            child = Ext.widget(childXtype),
            winTitle = btn.winTitle,
            winWidth = btn.winWidth;
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    },
    // 
    navigateSampleTestRequest: function (button, wizardPanel, direction) {
        var layout = wizardPanel.getLayout(),
            progress = this.lookupReference('progress'),
            motherPnl = wizardPanel.up('panel'),
            limssample_id = motherPnl.down('hiddenfield[name=limssample_id]').getValue(),
            model = motherPnl.getViewModel(),
            progressItems = progress.items.items,
            item, i, activeItem, activeIndex,
            nextStep = wizardPanel.items.indexOf(layout.getNext());

        layout[direction]();

        activeItem = layout.getActiveItem();
        activeIndex = wizardPanel.items.indexOf(activeItem);

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (activeIndex === item.step) {
                item.setPressed(true);
            } else {
                item.setPressed(false);
            }
            if (Ext.isIE8) {
                item.btnIconEl.syncRepaint();
            }
        }

    },
    doDeleteSampleTestDetailsdetails: function (item) {
        //if (this.fireEvent('checkFullAccess')) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            id = record.get('id'),
            limssample_id = record.get('limssample_id'),
            storeID = item.storeID,
            store = Ext.getStore(storeID),
            table_name = item.table_name,
            url = item.action_url;
        Ext.MessageBox.confirm('Delete', 'Are you sure to perform this action ?', function (btn) {
            if (btn === 'yes') {
                Ext.getBody().mask('Deleting record...');

                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: {
                        table_name: table_name,
                        id: id
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                            store.removeAll();
                            store.load();
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
                    }
                });
            } else {
                //
            }
        });
    },

    addGmpProductLinkageDetails: function (btn) {
        var me = this,
            grid = btn.up('grid'),
            win = grid.up('window'),
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            childObject = Ext.widget(btn.childXtype),
            manufacturing_site_id = grid.down('hiddenfield[name=manufacturing_site_id]').getValue(),
            reg_site_id = grid.down('hiddenfield[name=reg_site_id]').getValue(),
            saveBtn = childObject.down('button[name=save_details]');
        childObject.down('hiddenfield[name=manufacturing_site_id]').setValue(manufacturing_site_id);
        childObject.down('hiddenfield[name=reg_site_id]').setValue(reg_site_id);
        funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');
        childObject.getStore().load();
        saveBtn.handler = function () {
            me.saveGmpProductDetails(saveBtn, win);
        }
    },

    saveGmpProductDetails: function (btn, parent_win) {
        var products_grid = parent_win.down('grid'),
            win = btn.up('window'),
            lineGrid = win.down('grid'),
            manufacturing_site_id = lineGrid.down('hiddenfield[name=manufacturing_site_id]').getValue(),
            reg_site_id = lineGrid.down('hiddenfield[name=reg_site_id]').getValue(),
            products_sm = products_grid.getSelectionModel(),
            products_records = products_sm.getSelection(),
            line_sm = lineGrid.getSelectionModel(),
            line_records = line_sm.getSelection(),
            line_id = line_records[0].get('id'),
            products_selected = [],
            mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: win
            });
        mask.show();
        Ext.each(products_records, function (record) {
            var product_id = record.get('product_id'),
                reg_product_id = record.get('reg_product_id'),
                obj = {product_id: product_id, reg_product_id: reg_product_id};
            products_selected.push(obj);
        });
        Ext.Ajax.request({
            url: 'gmpapplications/saveGmpProductInfoLinkage',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            jsonData: products_selected,
            params: {
                inspection_line_id: line_id,
                manufacturing_site_id: manufacturing_site_id,
                reg_site_id: reg_site_id
            },
            success: function (response) {
                mask.hide();
                var resp = Ext.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success == true || success === true) {
                    win.close();
                    parent_win.close();
                    Ext.getStore('gmpproductslinkagedetailsstr').load();
                    toastr.success(message, 'Success Response');
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                mask.hide();
                var text = Ext.decode(response.responseText);
                toastr.error(text.message, "Response");
            }
        });
    },
    showPreviewApplicationManagerQueryPnl:function (btn) {
        var form = Ext.widget('applicationRaiseQueryFrm'),
            grid = btn.up('grid'),
            height = grid.getHeight(),
            button = btn.up('button'),
            record = button.getWidgetRecord(),
            height = grid.getHeight(),
            query_id = record.get('query_id'),
            invoice_id = record.get('invoice_id'),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
            application_code = grid.down('hiddenfield[name=application_code]').getValue(),
            workflow_stage_id = grid.down('hiddenfield[name=workflow_stage_id]').getValue(),
            process_id = grid.down('hiddenfield[name=process_id]').getValue(),
            section_id = grid.down('hiddenfield[name=section_id]').getValue(),
            assessment_procedure_id = grid.down('hiddenfield[name=assessment_procedure_id]').getValue(),
            classification_id = grid.down('hiddenfield[name=classification_id]').getValue(),
            prodclass_category_id = grid.down('hiddenfield[name=prodclass_category_id]').getValue(),
            product_subcategory_id = grid.down('hiddenfield[name=product_subcategory_id]').getValue(),
            application_id = grid.down('hiddenfield[name=application_id]').getValue(),
            product_origin_id = grid.down('hiddenfield[name=product_origin_id]').getValue(),
            win = grid.up('window');
        
        form.loadRecord(record);
        form.down('hiddenfield[name=module_id]').setValue(module_id);
        form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        form.down('hiddenfield[name=query_id]').setValue(query_id);
        form.down('hiddenfield[name=is_manager_review]').setValue(1);
        form.down('hiddenfield[name=application_code]').setValue(application_code);
        form.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        form.down('hiddenfield[name=process_id]').setValue(process_id);
        // form.down('hiddenfield[name=section_id]').setValue(section_id);
        // form.down('hiddenfield[name=assessment_procedure_id]').setValue(assessment_procedure_id);
        // form.down('hiddenfield[name=classification_id]').setValue(classification_id);
        // form.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);
        // form.down('hiddenfield[name=product_subcategory_id]').setValue(product_subcategory_id);
        form.down('hiddenfield[name=application_id]').setValue(application_id);
        // form.down('hiddenfield[name=product_origin_id]').setValue(product_origin_id);
        form.down('hiddenfield[name=invoice_id]').setValue(invoice_id);
        form.down('hiddenfield[name=status_id]').setValue(record.get('status'));
        // form.setHeight(height);
        //grid.hide();
        //win.add(form);
        
        funcShowCustomizableWindow("Preview Query", "70%", form, 'customizablewindow');
    },
    showAddchecklistitemsqueriefrm:function(btn){
        var form = Ext.widget('applicationunstructuredqueriesfrm'),
                grid = btn.up('grid'),
                panel = grid.up('panel'),
                height = grid.getHeight(),
                application_code = panel.down('hiddenfield[name=application_code]').getValue(),
                workflow_stage_id = panel.down('hiddenfield[name=workflow_stage_id]').getValue(),
                module_id = panel.down('hiddenfield[name=module_id]').getValue(),
                sub_module_id = panel.down('hiddenfield[name=sub_module_id]').getValue(),
                process_id = panel.down('hiddenfield[name=process_id]').getValue(),
                section_id = panel.down('hiddenfield[name=section_id]').getValue(),
                is_structured = panel.down('combo[name=is_structured]').getValue(),
                query_id = panel.down('hiddenfield[name=query_id]').getValue();

            form.down('hiddenfield[name=module_id]').setValue(module_id);
            form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            form.down('hiddenfield[name=application_code]').setValue(application_code);
            form.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
            form.down('hiddenfield[name=process_id]').setValue(process_id);
            form.down('hiddenfield[name=section_id]').setValue(section_id);
            form.down('hiddenfield[name=query_id]').setValue(query_id);
            form.down('hiddenfield[name=is_structured]').setValue(is_structured);

            form.setHeight(height);
            //grid.hide();
            //win.add(form);
            funcShowCustomizableWindow("Add Query", "80%", form, 'customizablewindow');


    },

    showAddApplicationQueryForm: function (btn) {
        var form = Ext.widget('applicationRaiseQueryFrm'),
            grid = btn.up('grid'),
            height = grid.getHeight(),
            // item_resp_id = grid.down('hiddenfield[name=item_resp_id]').getValue(),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
            application_code = grid.down('hiddenfield[name=application_code]').getValue(),
            workflow_stage_id = grid.down('hiddenfield[name=workflow_stage_id]').getValue(),
            process_id = grid.down('hiddenfield[name=process_id]').getValue(),
            section_id = grid.down('hiddenfield[name=section_id]').getValue(),
            win = grid.up('window');
        form.down('hiddenfield[name=module_id]').setValue(module_id);
        form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        form.down('hiddenfield[name=application_code]').setValue(application_code);
        form.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        form.down('hiddenfield[name=process_id]').setValue(process_id);
        form.down('hiddenfield[name=section_id]').setValue(section_id);
        form.setHeight(Ext.Element.getViewportHeight() - 118);
        //grid.hide();
        //win.add(form);
        funcShowCustomizableWindow("New Query", "80%", form, 'customizablewindow');
    },

    showQueryPrevResponses: function (item) {
        var btn = item.up('button'),
            query_grid = btn.up('grid');
            if(query_grid.up('window')){
                var win = query_grid.up('window'),
                    width = win.getWidth();
            }else{
                var width = '60%';
            }
        var record = btn.getWidgetRecord(),
            query_id = record.get('id'),
            query = record.get('query'),
            grid = Ext.widget('prevqueryresponsesgrid');
        grid.down('hiddenfield[name=query_id]').setValue(query_id);
        grid.down('displayfield[name=query_desc]').setValue(query);
        funcShowCustomizableWindow('Query Responses', width, grid, 'customizablewindow');
    },
    showAddNewTraderAccountDetails: function (btn) {
            var winWidth = btn.winWidth,
            winTitle = btn.winTitle,
            applicant_form = Ext.widget('newtraderaccountsmanagementFrm');
        funcShowCustomizableWindow(winTitle, width, applicant_form, 'customizablewindow');
    },
    
    closeApplicationQuery: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            action_url = item.action_url,
            grid = btn.up('grid'),
            
            store = grid.getStore(),
            store2 = Ext.getStore('checklistresponsescmnstr'),
            id = record.get('query_id'),
            status = record.get('status');
            if(grid.up('window')){
              var win = grid.up('window');  
            }else if(grid.up('panel')){
                var win = grid.up('panel');
            }else{
             toastr.error("unable to mask correct window", 'Mask Failure');  
             win = grid; 
            }
            var mask = new Ext.LoadMask(
                {
                    target: win,
                    msg: 'Please wait...'
                }
            );
            if(status == 1){
                var title=  'Are you sure to close this query Open Query(Note the query has not been responsed to)?';
            }
            else{
                var title = 'Are you sure to close this query?';
            }
        Ext.MessageBox.confirm('Close', title, function (button) {
            if (button === 'yes') {
                mask.show();
                Ext.Ajax.request({
                    url: action_url,
                    params: {
                        query_id: id,
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                        mask.hide();
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message;
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                            store.load();
                            if(store2){
                                store2.load();
                            }
                            
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        mask.hide();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        mask.hide();
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });
            }
        });
    },
    deleteChecklistRaisedQuery: function(item){
        var me = this,
            btn = item.up('button'),
            grid = btn.up('grid'),
            store = grid.getStore(),
            record = btn.getWidgetRecord(),
            query_id = record.get('query_id');
        Ext.MessageBox.confirm('Delete', "Are you sure you want to delete this query", function (button) {
            if (button === 'yes') {
                grid.mask('Deleting....');
                Ext.Ajax.request({
                    url: item.action_url,
                    method: 'POST',
                    params: {
                        _token: token,
                        query_id: query_id
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message;
                        grid.unmask();
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                            store.load();
                        } else {
                            grid.unmask();
                            toastr.error(resp.message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        grid.unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        grid.unmask();
                        toastr.error('Error downloading data: ' + errorThrown, 'Error Response');
                    }
                });
            }else{
                toastr.warning("Deletion terminated", 'Terminated');
            }
        });
    },
    appDataAmmendmentStatusUpdate: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            action_url = item.action_url,
            status_id = item.status_id,
            title = item.title,
            grid = btn.up('grid'),
            win = grid.up('window'),
            store = grid.getStore(),
            id = record.get('id'),
            mask = new Ext.LoadMask(
                {
                    target: win,
                    msg: 'Please wait...'
                }
            ); 
            var title=  'Are you sure to '+title+'?';
           
        Ext.MessageBox.confirm('Action', title, function (button) {
            if (button === 'yes') {
                mask.show();
                Ext.Ajax.request({
                    url: action_url,
                    params: {
                        record_id: id,
                        status_id:status_id
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                        mask.hide();
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
                        mask.hide();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        mask.hide();
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });
            }
        });
    },
    showReQueryApplicationQueryForm: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            height = grid.getHeight(),
            record = btn.getWidgetRecord(),
            item_resp_id = record.get('item_resp_id'),
            win = grid.up('window'),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue();
            if (!item_resp_id) {
                childXtype = 'applicationRaiseQueryFrm';
            }else{
                 childXtype = 'applicationRaiseQueryFrm';   
            }
            form = Ext.widget(childXtype);
        form.loadRecord(record);
        form.down('htmleditor[name=query_txt]').setReadOnly(false);
        form.down('textarea[name=query_remark]').allowBlank = false;
        form.down('textarea[name=query_remark]').setFieldLabel('Re-Query Comment');
        form.down('textarea[name=query_remark]').reset();
        // form.down('button[action=save_requery]').setVisible(true);
        // form.down('button[action=save_query]').setVisible(false);
        // grid.hide();
        funcShowCustomizableWindow('Re-Open Query', '70%', form, 'customizablewindow', btn);
        // win.add(form);
    },

    showEditApplicationQueryForm: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            // height = grid.getHeight(),
            record = btn.getWidgetRecord(),
            childXtype = item.childXtype,
            form = Ext.widget(childXtype),//'applicationqueryfrm'
            win = grid.up('window');
        // if (!query_id) {
        //     childXtype = 'applicationunstructuredqueriesfrm';
        // }
        // panel = Ext.widget(childXtype);
        // panel.down('hiddenfield[name=module_id]').setValue(module_id);
        // panel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        // panel.down('hiddenfield[name=section_id]').setValue(section_id);
        // panel.down('hiddenfield[name=application_code]').setValue(application_code);
        // panel.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        // panel.down('hiddenfield[name=query_id]').setValue(query_id);
        // panel.down('hiddenfield[name=process_id]').setValue(process_id);
        //query details form
        // form = panel.down('form');
        form.loadRecord(record);
        funcShowCustomizableWindow('Edit Query', '70%', form, 'customizablewindow', btn);
    },
    showEditApplicationQueryResponseForm: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            height = grid.getHeight(),
            record = btn.getWidgetRecord(),
            item_resp_id = record.get('item_resp_id'),
            childXtype = item.childXtype,
            winWidth = item.winWidth,
            document_type_id =item.document_type_id,
            //form = Ext.widget(childXtype),//'applicationqueryfrm'
            win = grid.up('window'),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
            application_code = grid.down('hiddenfield[name=application_code]').getValue(),
           // process_id = grid.down('hiddenfield[name=process_id]').getValue(),
            section_id = grid.down('hiddenfield[name=section_id]').getValue();


        panel = Ext.widget(childXtype);
        form = panel.down('form');
        grid = panel.down('previewproductDocUploadsGrid');
        form.down('hiddenfield[name=module_id]').setValue(module_id);
        form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        form.down('hiddenfield[name=section_id]').setValue(section_id);
        form.loadRecord(record);
        form.setHeight(500);
        grid.setHeight(500);

         grid.down('hiddenfield[name=module_id]').setValue(module_id);
        grid.down('hiddenfield[name=application_code]').setValue(application_code);

        grid.down('combo[name=applicable_documents]').setValue(document_type_id);
        funcShowCustomizableWindow('Query Responses', winWidth, panel, 'customizablewindow');
        
    },
   
    showEditApplicationManagerQueryForm: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            height = grid.getHeight(),
            record = btn.getWidgetRecord(),
            item_resp_id = record.get('item_resp_id'),
            childXtype = item.childXtype,
            //form = Ext.widget(childXtype),//'applicationqueryfrm'
            win = grid.up('window'),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = grid.down('hiddenfield[name=section_id]').getValue(),
            is_manager_query = grid.down('hiddenfield[name=is_manager_query]').getValue(),
            form;
        if (!item_resp_id) {
            childXtype = 'applicationunstructuredqueriesfrm';
        }
        form = Ext.widget(childXtype); 
        if(form.down('htmleditor[name=manager_query_comment]')){

            form.down('htmleditor[name=manager_query_comment]').setVisible(true);
            if ((is_manager_query) && is_manager_query > 0) {
                form.getForm().getFields().each(function (field) {
                    field.setReadOnly(true);
                });
                form.down('htmleditor[name=manager_query_comment]').setReadOnly(false);
            } else {
              
            }
            form.down('htmleditor[name=manager_query_comment]').setReadOnly(false);
        }
        
        form.down('hiddenfield[name=module_id]').setValue(module_id);
        form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        form.down('hiddenfield[name=section_id]').setValue(section_id);
        form.loadRecord(record);
        form.setHeight(height);
        console.log(form);
        console.log(record);
        grid.hide();
        win.add(form);
    },

    showEditApplicationUnstructuredQueryForm: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            height = grid.getHeight(),
            record = btn.getWidgetRecord(),
            item_resp_id = record.get('item_resp_id'),
            childXtype = item.childXtype,
            //form = Ext.widget(childXtype),//'applicationqueryfrm'
            win = grid.up('window'),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = grid.down('hiddenfield[name=section_id]').getValue(),
            is_manager_query = grid.down('hiddenfield[name=is_manager_query]').getValue(),
            is_manager_query_response = grid.down('hiddenfield[name=is_manager_query_response]').getValue(),
            form;
        if (!item_resp_id) {
            childXtype = 'applicationunstructuredqueriesfrm';
        }
        form = Ext.widget(childXtype);
        if ((is_manager_query) && is_manager_query > 0) {
            form.down('textfield[name=manager_query_comment]').setVisible(true);
            form.getForm().getFields().each(function (field) {
                field.setReadOnly(true);
            });
            form.down('textfield[name=manager_query_comment]').setReadOnly(false);
        } else {
            form.down('textfield[name=manager_query_comment]').setReadOnly(true);
        }

        if ((is_manager_query_response) && is_manager_query_response > 0) {
            form.down('textfield[name=manager_queryresp_comment]').setVisible(true);
            form.getForm().getFields().each(function (field) {
                field.setReadOnly(true);
            });
            form.down('textfield[name=manager_queryresp_comment]').setReadOnly(false);
        } else {
            form.down('textfield[name=manager_queryresp_comment]').setReadOnly(true);
        }

        form.down('hiddenfield[name=module_id]').setValue(module_id);
        form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        form.down('hiddenfield[name=section_id]').setValue(section_id);
        form.loadRecord(record);
        form.setHeight(height);
        grid.hide();
        win.add(form);
    },

    showEditApplicationManagerQueryResponseForm: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            height = grid.getHeight(),
            record = btn.getWidgetRecord(),
            item_resp_id = record.get('item_resp_id'),
            childXtype = item.childXtype,
            //form = Ext.widget(childXtype),//'applicationqueryfrm'
            win = grid.up('window'),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = grid.down('hiddenfield[name=section_id]').getValue(),
            is_manager_query_response = grid.down('hiddenfield[name=is_manager_query_response]').getValue(),
            form;
        if (!item_resp_id) {
            childXtype = 'applicationunstructuredqueriesfrm';
        }
        form = Ext.widget(childXtype);
        form.down('textfield[name=manager_queryresp_comment]').setVisible(true);
        if ((is_manager_query_response) && is_manager_query_response > 0) {
            form.getForm().getFields().each(function (field) {
                field.setReadOnly(true);
            });
            form.down('textfield[name=manager_queryresp_comment]').setReadOnly(false);
        } else {
            form.down('textfield[name=manager_queryresp_comment]').setReadOnly(true);
        }

        form.down('hiddenfield[name=module_id]').setValue(module_id);
        form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        form.down('hiddenfield[name=section_id]').setValue(section_id);
        form.loadRecord(record);
        form.setHeight(height);
        grid.hide();
        win.add(form);
    },
    showEditApplicationManagerQueryResponseForm: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            height = grid.getHeight(),
            record = btn.getWidgetRecord(),
            item_resp_id = record.get('item_resp_id'),
            childXtype = item.childXtype,
            //form = Ext.widget(childXtype),//'applicationqueryfrm'
            win = grid.up('window'),
            module_id = grid.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = grid.down('hiddenfield[name=section_id]').getValue(),
            is_manager_query_response = grid.down('hiddenfield[name=is_manager_query_response]').getValue(),
            form;
        if (!item_resp_id) {
            childXtype = 'applicationunstructuredqueriesfrm';
        }
        form = Ext.widget(childXtype);
        form.down('textfield[name=manager_queryresp_comment]').setVisible(true);
        if ((is_manager_query_response) && is_manager_query_response > 0) {
            form.getForm().getFields().each(function (field) {
                field.setReadOnly(true);
            });
            form.down('textfield[name=manager_queryresp_comment]').setReadOnly(false);
        } else {
            form.down('textfield[name=manager_queryresp_comment]').setReadOnly(true);
        }

        form.down('hiddenfield[name=module_id]').setValue(module_id);
        form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        form.down('hiddenfield[name=section_id]').setValue(section_id);
        form.loadRecord(record);
        form.setHeight(height);
        grid.hide();
        win.add(form);
    },
    saveApplicationQuery: function (btn) {
        var me = this,
            form = btn.up('form'),
            win = form.up('window'),
            store = Ext.getStore(btn.storeID),
            frm = form.getForm(),
            action_url = btn.action_url;
        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.load();
                        win.close();
                      //  me.backToApplicationQueriesGrid(btn);
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }

    },
    saveDocApplicationQuery: function (btn) {
        var me = this,
            form = btn.up('form'),
            win = form.up('window'),
            store = Ext.getStore(btn.storeID),
            frm = form.getForm(),
            action_url = btn.action_url;
        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                waitMsg: 'Please wait...',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.load();
                        me.backToApplicationQueriesGrid(btn);
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }

    },
///added for documnet view in reports
func_setDocumentGridStore: function(me){
         var panel=me.up('reportDocumentsPnl'),
             form = panel.up('panel'),
           module_id=form.down('hiddenfield[name=module_id]').getValue();
           me.down('hiddenfield[name=module_id]').setValue(module_id);
            
            store=form.xtype+'dynamicStore';
           //create store
           var config = {
               storeId: store,
               groupField: 'doc_type',
                 proxy: {
                    url: 'summaryreport/getUploadedDocs',
                   }
              };
           Ext.create('Admin.store.summaryreport.ReportsGlobalAbstractStr', config);
          
           me.reconfigure(Ext.getStore(store));
           me.down('pagingtoolbar').setStore(store);

  },funcDOwnloadApplicationVariationDoc:function(grid, rowIndex, colIndex){
    var rec = grid.getStore().getAt(rowIndex);
        node_ref = rec.get('node_ref');
        if(node_ref != ''){
            this.fireEvent('funcDOwnloadApplicationVariationDoc',grid, rowIndex);
            
        }
        else{
            toastr.error('Document Not Uploaded', 'Failure Response');
        }
  },previewUploadedDocument: function (item) {
    var btn = item.up('button'),
        download = item.download,
        record = btn.getWidgetRecord(),
        node_ref = record.get('node_ref'),
        application_code = record.get('application_code'),
        uploadeddocuments_id = record.get('uploadeddocuments_id');
        
        if(node_ref != ''){

            this.functDownloadAppDocument(node_ref,download,application_code,uploadeddocuments_id, item);
        }
        else{
            toastr.error('Document Not Uploaded', 'Failure Response');
        }
        

},functDownloadAppDocument:function(node_ref,download,application_code=null,uploadeddocuments_id=null, item=null){
        //get the document path 
        item.setLoading(true);
      
        Ext.Ajax.request({
            url: 'documentmanagement/getApplicationDocumentDownloadurl',
            method: 'GET',
            params: {
                node_ref: node_ref,
                application_code:application_code,
                uploadeddocuments_id:uploadeddocuments_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                item.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success;
                document_url = resp.document_url;
                if (success == true || success === true) {
                    // if (download == 1 || download === 1) {
                    //     download_report(document_url);
                    // } else {
                    //     print_report(document_url);
                    // }
                    window.open(document_url,'_blank', 'resizable=yes,scrollbars=yes,directories=no, titlebar=no, toolbar=no,menubar=no,location=no,directories=no, status=no');
                } else {
                    toastr.error(resp.message, 'Failure Response');
                }
                
                // var resp = Ext.JSON.decode(response.responseText),
                // success = resp.success;
                // document_url = resp.document_url;
                // filename = resp.filename;
                // if (success == true || success === true) {
                //     var a = document.createElement("a");
                //     a.href = document_url; 
                //     a.download = filename;
                //     document.body.appendChild(a);

                //     a.click();
                //     a.remove();
                //     Ext.getBody().unmask();
                // } else {
                //     Ext.getBody().unmask();
                //     toastr.error(resp.message, 'Failure Response');
                // }
            },
            failure: function (response) {
                item.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                item.setLoading(false);
                toastr.error('Error downloading data: ' + errorThrown, 'Error Response');
            }
        });


},
 downloadAllSelectedDocuments: function(btn) {
    var grid = btn.up('grid'),
        sm = grid.getSelectionModel(),
        selected_records = sm.getSelection(),
        name_type = btn.type,
        selected = [];
        var zipper = Ext.create('Ext.exporter.file.zip.Archive', {id:'FilesExport'});
        if (!sm.hasSelection()) {
            toastr.warning('No record selected. Please select a document(s) to download!!', 'Warning Response');
            return;
        }
        if( name_type != 'zip' ){
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to download selected document(s)?', function (check) {
            if (check === 'yes') {
                Ext.getBody().mask('Please wait...');
                Ext.each(selected_records, function (item) {
                    //selected.push(item.data.id);
                    Ext.Ajax.request({
                        url: 'documentmanagement/getApplicationDocumentDownloadurl',
                        method: 'GET',
                        params: {
                            node_ref: item.data.node_ref,
                            application_code:item.data.application_code,
                            uploadeddocuments_id:item.data.uploadeddocuments_id
                        },
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'X-CSRF-Token': token
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            var resp = Ext.JSON.decode(response.responseText),
                                success = resp.success;
                            document_url = resp.document_url;
                            if (success == true || success === true) {
                                
                                    download_report(document_url);
                                
                            } else {
                                toastr.error(resp.message, 'Failure Response');
                            }
                        },
                        failure: function (response) {
                            Ext.getBody().unmask();
                            var resp = Ext.JSON.decode(response.responseText),
                                message = resp.message;
                            toastr.error(message, 'Failure Response');
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            Ext.getBody().unmask();
                            toastr.error('Error downloading data: ' + errorThrown, 'Error Response');
                        }
                    });
                });
               
              }
          });
       }else{
           Ext.each(selected_records, function (item) {
                    selected.push([item.data.node_ref, item.data.application_code, item.data.uploadeddocuments_id, item.data.file_name]);

                });
           grid.mask('Exporting....');
           Ext.Ajax.request({
                        url: 'documentmanagement/getDocumentArchive',
                        method: 'POST',
                        params: {
                            selected: JSON.stringify(selected)
                        },
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'X-CSRF-Token': token
                        },
                        success: function (response) {
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
                                    grid.unmask();
                                } else {
                                    grid.unmask();
                                    toastr.error(resp.message, 'Failure Response');
                                }
                        },
                        failure: function (response) {
                            grid.unmask();
                            var resp = Ext.JSON.decode(response.responseText),
                                message = resp.message;
                            toastr.error(message, 'Failure Response');
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            grid.unmask();
                            toastr.error('Error downloading data: ' + errorThrown, 'Error Response');
                        }
                    });
       }

  }, showEditAdhocQueryFrm: function (item) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            childXtype = item.childXtype,
            winTitle=item.winTitle,
            winWidth=item.winWidth,
            form = Ext.widget(childXtype);
            
        form.loadRecord(record);
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
       
    },
    addChecklistToQuery: function(btn){
        btn.setLoading(true);
        var grid = btn.up('grid'),
            store= grid.getStore(),
            panel = grid.up('panel'),
            //panel = pnl.up('panel'),
            query_id = panel.down('hiddenfield[name=query_id]').getValue(),
            params = [];
        grid.mask('Saving Queries');
        for (var i = 0; i < store.data.items.length; i++) {
            var record = store.data.items [i],
                checklist_item_id = record.get('checklist_item_id'),
                item_resp_id = record.get('item_resp_id'),
                query_response = record.get('query_response'),
                query = record.get('query');
            var obj = {
                checklist_item_id: checklist_item_id,
                item_resp_id:item_resp_id,
                query: query,
                query_response: query_response
            };
            if (record.dirty) {
                params.push(obj);
            }
        }
        if (params.length < 1) {
            grid.unmask();
            btn.setLoading(false);
            toastr.warning('No records to save!!', 'Warning Response');
            return false;
        }
        params = JSON.stringify(params);
        Ext.Ajax.request({
            url: btn.action_url,
            params: {
                query_data: params,
                query_id: query_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                 grid.unmask();
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
                grid.unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                btn.setLoading(false);
                grid.unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    checkSavedQuery: function(me){
        var pnl = me.up('panel'),
            query_id = pnl.down('hiddenfield[name=query_id]').getValue();
        if(Ext.getStore('applicationqueriesstr')){
                Ext.getStore('applicationqueriesstr').load();
            }
        if(query_id){
            //
        }else{
            me.setActiveTab(0);
            toastr.warning("Please save the Query Details First", 'Failure Response');
            return false;
        }
    },
    saveChecklistApplicationQuery: function(btn){
        var form = btn.up('form'),
            frm = form.getForm(),
            win = form.up('window'),
            me = this;

        if (frm.isValid()) {
            frm.submit({
                url: btn.action_url,
                waitMsg: 'Please wait...',
                method: 'POST',
                params: {
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        var query_id = response.record_id;
                        if(Ext.getStore('applicationqueriesstr')){
                            Ext.getStore('applicationqueriesstr').removeAll();
                            Ext.getStore('applicationqueriesstr').load();
                        }
                        if(Ext.getStore('allQueriesViewGridStr')){
                            Ext.getStore('allQueriesViewGridStr').removeAll();
                            Ext.getStore('allQueriesViewGridStr').load();
                        }
                        // form.down('hiddenfield[name=query_id]').setValue(query_id);
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    GenerateQueryInvoice: function(btn){
        var form = btn.up('form'),
            me = this,
            panel = form.up('panel'),
            //panel = pnl.up('panel'),
            query_id = panel.down('hiddenfield[name=query_id]').getValue(),
            record = form.getValues(),
            query_type = record.query_type_id;
        if(!query_id){
            toastr.error("Failed to locate Query Details", "Error on Passed Arguments");
            return false;
        }
        if(query_type != 1){
            toastr.error("Invoices only Allowed on Major Queries", "Error on Passed Arguments");
            return false;
        }
        Ext.MessageBox.confirm('Confirm', 'Generate Query Invoice ?', function (button) {
                if (button === 'yes') {
                        btn.query_id = query_id;
                        btn.application_feetype_id = 2;
                        me.funcGenerateQueryWizardApplicationInvoice(btn);
                    }
            });
    },
    funcGenerateQueryWizardApplicationInvoice: function(btn){
        var payment_pnl = Ext.widget('onlineapplicationgenerateinvoicesGrid');
        //cost parameters
        var panel = Ext.ComponentQuery.query("#applicationRaiseQueryPnlId")[0];
            var assessment_procedure_id = panel.down('hiddenfield[name=assessment_procedure_id]').getValue(),
            classification_id = panel.down('hiddenfield[name=classification_id]').getValue(),
            prodclass_category_id = panel.down('hiddenfield[name=prodclass_category_id]').getValue(),
            product_subcategory_id = panel.down('hiddenfield[name=product_subcategory_id]').getValue(),
            product_origin_id = panel.down('hiddenfield[name=product_origin_id]').getValue(),
            application_id = panel.down('hiddenfield[name=application_id]').getValue(),
            application_code = panel.down('hiddenfield[name=application_code]').getValue(),
            process_id = panel.down('hiddenfield[name=process_id]').getValue(),
            module_id = panel.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = panel.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = panel.down('hiddenfield[name=section_id]').getValue(),
            curr_stage_id = panel.down('hiddenfield[name=workflow_stage_id]').getValue(),
            //status_type_id = panel.down('hiddenfield[name=status_type_id]').getValue(),
            application_status_id = panel.down('hiddenfield[name=application_status_id]').getValue(),
            applicationfeetype = btn.application_feetype_id,
            query_id = btn.query_id;
        //pass variables
        payment_pnl.down('hiddenfield[name=application_id]').setValue(application_id);
        payment_pnl.down('hiddenfield[name=application_code]').setValue(application_code);
        payment_pnl.down('hiddenfield[name=process_id]').setValue(process_id);
        payment_pnl.down('hiddenfield[name=module_id]').setValue(module_id);
        payment_pnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        payment_pnl.down('hiddenfield[name=section_id]').setValue(section_id);
        //payment_pnl.down('hiddenfield[name=curr_stage_id]').setValue(curr_stage_id);
        //payment_pnl.down('hiddenfield[name=status_type_id]').setValue(status_type_id);
        // payment_pnl.down('hiddenfield[name=application_status_id]').setValue(application_status_id);
        // payment_pnl.down('hiddenfield[name=assessment_procedure_id]').setValue(assessment_procedure_id);
        // payment_pnl.down('hiddenfield[name=classification_id]').setValue(classification_id);
        // payment_pnl.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);
        // payment_pnl.down('hiddenfield[name=product_subcategory_id]').setValue(product_subcategory_id);
        // payment_pnl.down('hiddenfield[name=product_origin_id]').setValue(product_origin_id);
        payment_pnl.down('hiddenfield[name=application_feetype_id]').setValue(applicationfeetype);
        payment_pnl.down('hiddenfield[name=query_id]').setValue(query_id);
     
        
        funcShowCustomizableWindow('Invoice Quotation', '70%', payment_pnl, 'customizablewindow');
    },
    ViewQueryInvoice: function(btn){
        var form = btn.up('form'),
            me = this,
            panel = form.up('panel'),
           // panel = pnl.up('panel'),
            invoice_id = panel.down('hiddenfield[name=invoice_id]').getValue(),
            record = form.getValues();
        if(!invoice_id){
            toastr.error("Failed to locate Query Invoice Details", "Error on Passed Arguments");
            return false;
        }
        this.fireEvent('printInvoiceById', invoice_id);
    },
    navigateQueryWizard: function(btn){
        var me_container = btn.up(),
            step = btn.nextStep,
            wizardPnl = me_container.up('#applicationRaiseQueryPnlId'),
            progress = wizardPnl.down('#progress_tbar'),
            progressItems = progress.items.items;
        if(step == 1){
            var query_id = wizardPnl.down('hiddenfield[name=query_id]').getValue();
            if(query_id){
                //well
            }else{
                toastr.warning("Please save the Query Details First", 'Failure Response');
                return false;
            }
        }
        wizardPnl.getLayout().setActiveItem(step);
        var layout = wizardPnl.getLayout(),
            item = null,
            i = 0,
            activeItem = layout.getActiveItem();

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (step === item.nextStep) {
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
    toggleQueryChecklistView: function(combo, newVal, oldVal, eopts){ //deplicated 
        var form = combo.up('form'),
            panel = form.up('panel'),
            qry_field = form.down('textarea[name=query_txt]');

        if(newVal == 2){
            form.down('textarea[name=comment]').setVisible(false);
            qry_field.setVisible(true);
            qry_field.allowBlank = false;
            qry_field.validate();
            //skip checklist on click
            form.down('button[name=qry_tochecklist_btn]').nextStep = 2;
            panel.down('button[name=doc_qryback_btn]').nextStep = 0;
            panel.down('button[name=checklist_query_tab]').setVisible(false);
        }else{
            form.down('textarea[name=comment]').setVisible(true);
            qry_field.setVisible(false);
            qry_field.allowBlank = true;
            qry_field.setValue('');
            qry_field.validate();
            //remove skip checklist on click
            form.down('button[name=qry_tochecklist_btn]').nextStep = 1;
            panel.down('button[name=doc_qryback_btn]').nextStep = 1;
            panel.down('button[name=checklist_query_tab]').setVisible(true);
        }
    },
    printInvoice: function (btn) {
        var me = this,
            win = btn.up('panel'),
            panel = win.up('panel'),
            record = btn.getWidgetRecord(),
            invoice_no = record.get('invoice_no');
        if(panel.down('hiddenfield[name=active_application_code]')){
            var application_code = panel.down('hiddenfield[name=active_application_code]').getValue(),
                application_id = panel.down('hiddenfield[name=active_application_id]').getValue(),
                invoice_id = '',
                module_id = panel.down('hiddenfield[name=module_id]').getValue();
        }else{
            var panel = win.up('#contentPanel'),
                application_code = panel.down('hiddenfield[name=active_application_code]').getValue(),
                application_id = panel.down('hiddenfield[name=active_application_id]').getValue(),
                invoice_id = '',
                module_id = panel.down('hiddenfield[name=module_id]').getValue();
        }


       // var action_url = report_server_url+'invoice?invoice_no=' + invoice_no;
       // print_report(action_url);
       previewCorrespondence(application_code, module_id, 'invoice', JSON.stringify({invoice_no:invoice_no}));
    },
    receiveInvoicePayment: function(item){
        
        this.fireEvent('showPaymentReceptionForm', item);

    },
    showPaymentReceiptsWin: function(item){
        var btn = item.up('button'),
            grid = btn.up('grid'),
            record = btn.getWidgetRecord(),
            invoice_no = record.get('invoice_no');
        this.fireEvent('showInvoiceReceipts', invoice_no);
    },

    printColumnReceipt: function (item) {
        var record = item.getWidgetRecord(),
            receipt_no = record.get('receipt_no'),
            application_code = record.get('application_code'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id');
        
        previewCorrespondence(application_code, module_id, 'receipt',JSON.stringify({receipt_no:receipt_no,section_id:section_id,sub_module_id:sub_module_id}));
    },

    showPreviewQueryLetter: function (item) {
        var button = item.up('button'),
            record = button.getWidgetRecord(),
            query_id = record.get('query_id'),
            application_code = record.get('application_code'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id');

        // print_report('reports/printRequestForAdditionalInformation?query_id='+query_id+'&application_code='+application_code+'&module_id='+module_id);
        // this.fireEvent('printReceipt', payment_id);
       previewCorrespondence(application_code, module_id, 'queryletter',JSON.stringify({query_id:query_id,section_id:section_id,sub_module_id:sub_module_id}));//JSON.stringify({query_id:query_id})

    },
    showApproveQueryLetter: function(item){
        var button = item.up('button'),
            record = button.getWidgetRecord(),
            form = Ext.widget('queryApprovalRecommFrm');
        form.loadRecord(record);
        funcShowCustomizableWindow('Query Approval', '50%', form, 'customizablewindow', item);
    },
    feedColumntoStr: function(combo){
        var grid = combo.up('grid'),
            store = combo.getStore(),
            content = [];
        var TopicRecord = Ext.data.Record.create([
                {name: 'name', mapping: 'name'},
                {name: 'dataIndex', mapping: 'dataIndex'}
            ]);
        gridColumns = grid.headerCt.getGridColumns();
          // console.log(gridColumns);
        for (var i = 0; i < gridColumns.length; i++) {
            var myNewRecord = new TopicRecord({
                                name: gridColumns[i].text,
                                dataIndex: gridColumns[i].dataIndex
                            });
            console.log(myNewRecord);
                // item_object = {'id': i, 'dataIndex': gridColumns[i].dataIndex, 'name': gridColumns[i].text};
            store.insert(myNewRecord);
        }
        console.log(content);
        //store.insert(0, content);
        console.log(store);
       // combo.store = store;
    },
    funcUniformTradersearch:function(btn){
            var grid  = btn.up('grid'),
                store = grid.getStore()
                search_value = grid.down('textfield[name=search_value]').getValue(),
                search_field = grid.down('combo[name=search_field]').getValue();

                store.removeAll();
                store.load({params:{search_value:search_value, search_field:search_field}});

    },
     InvoiceOnlineApplicationDetails: function (clicked_btn) {
        var grid = clicked_btn.up('grid'),
            pnl = grid.up('panel'),
            application_code = pnl.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = pnl.down('hiddenfield[name=module_id]').getValue(),
            store = grid.getStore(),
            query_id,
            sm = grid.getSelectionModel(),
            selected_records = sm.getSelection(),
            alert_msg = 'Are you sure to generate this invoice based on the selected quotation';
        if(clicked_btn.alert_msg){
            alert_msg = clicked_btn.alert_msg;
        }
        if (!sm.hasSelection()) {
            toastr.warning('No record selected. Please select a fully paid quotation !!', 'Warning Response');
            return;
        }
        //get items from selection
        var application_feetype_id = selected_records[0].get('application_feetype_id'),
            fasttrack_option_id = selected_records[0].get('fasttrack_option_id'),
            quotation_id = selected_records[0].get('id');


        if(grid.down('hiddenfield[name=query_id]')){
            query_id = grid.down('hiddenfield[name=query_id]').getValue();
        }
        Ext.MessageBox.confirm('Generate', alert_msg+' (This process cannot be undone) ?', function (btn) {
            if (btn === 'yes') {
                if (store.getCount()) {
                    Ext.getBody().mask('Generating Invoice(s)');
                     Ext.Ajax.request({
                        url: clicked_btn.action_url,
                        method: 'POST',
                        waitMsg: 'Please wait...',
                        params:{
                            module_id: module_id,
                            application_code: application_code,
                            fasttrack_option_id: fasttrack_option_id,
                            application_feetype_id: application_feetype_id,
                            quotation_id: quotation_id,
                            query_id: query_id,
                             _token: token
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            var resp = Ext.JSON.decode(response.responseText),
                                success = resp.success,
                                message = resp.message;
                            if (success == true || success === true) {
                                toastr.success(message, "Success Response");
                                //find store and refresh
                                if(Ext.getStore('applicationQuotationStr')){
                                    Ext.getStore('applicationQuotationStr').load();
                                }
                                if(Ext.getStore('invoicepaymentverificationdetailsGridStr')){
                                    Ext.getStore('invoicepaymentverificationdetailsGridStr').load();
                                }
                                store.reload();
                                if(grid.is_query_invoice_check){
                                    var query_form = Ext.ComponentQuery.query("#applicationRaiseQueryFrmId")[0];
                                    query_form.down('button[name=print_invoice]').setVisible(true);
                                    query_form.down('button[name=generate_invoice]').setVisible(false);
                                }
                                // if(win){
                                //     win.close();
                                // }
                                
                            } else {
                                toastr.error(message, 'Failure Response');
                            }
                        },
                        failure: function (fm, action) {
                             Ext.getBody().unmask();                           
                            toastr.error('Server Error', 'Failure Response');
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            Ext.getBody().unmask();
                            toastr.error('Error: ' + errorThrown, 'Error Response');
                        }
                    });
                }else{
                    toastr.error("No Quotation was retrieved", 'Failure Response');
                }
            }else{
                toastr.warning('Operation Cancelled', 'Cancelled');
            }
        });
    },
    AddGeneralComment: function (argument) {
        var form = Ext.widget('applicationcommentsFrm');
        funcShowCustomizableWindow('Application Recommendation', '50%', form, 'customizablewindow');
    },
    
    AddInvestigationComment: function (argument) {
        //var form = Ext.widget('investigationcommentsFrm');
        var form = Ext.widget('recommendationfrm');
        funcShowCustomizableWindow('Investigation comments', '50%', form, 'customizablewindow');
    },
    AddCaseDecision: function (argument) {
        var form = Ext.widget('casedecisionFrm');
        funcShowCustomizableWindow('Investigation Decisions', '50%', form, 'customizablewindow');
    },
    showAddTcMeetingParticipants: function (btn) {
        var me = this,
            grid = btn.up('grid'),
            pnl = grid.up('panel'),//('newclinicaltrialmanagermeetingpanel'),
            mainTabPnl = pnl.up('#contentPanel'),
            activeTab = mainTabPnl.getActiveTab(),
            meeting_id = activeTab.down('form').down('hiddenfield[name=id]').getValue(),
            childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length,
            childObject;
        if (!meeting_id) {
            toastr.warning('Please save meeting details first!!', 'Warning Response');
            return false;
        }
        childObject = Ext.widget(childXtype);
        childObject.down('hiddenfield[name=meeting_id]').setValue(meeting_id);
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');
    },
     showAddTcMeetingExternalParticipant: function (btn) {
        var me = this,
            grid = btn.up('grid'),
            meeting_id = grid.down('hiddenfield[name=meeting_id]').getValue(),
            childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length,
            childObject;
        if (!meeting_id) {
            toastr.warning('Please save meeting details first!!', 'Warning Response');
            return false;
        }
        childObject = Ext.widget(childXtype);
        childObject.down('hiddenfield[name=meeting_id]').setValue(meeting_id);
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');
    },
    showMeetingSchedules: function(btn) {
        var me = this,
            form = btn.up('form'),
            pnl = form.up('panel'),//('newclinicaltrialmanagermeetingpanel'),
            mainTabPnl = pnl.up('#contentPanel'),
            activeTab = mainTabPnl.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            childObject;
        childObject = Ext.widget('meetingSchedulesLogsGrid');
        childObject.down('hiddenfield[name=module_id]').setValue(module_id);
      
        funcShowCustomizableWindow('Defined Meeting Schedules', '70%', childObject, 'customizablewindow', btn);
    },
    loadSelectedSchedule: function(view, record, item, index, e, eOpts) {
        // body...meetingdetailsfrm
       var form = Ext.ComponentQuery.query("#meetingdetailsfrm")[0],
            grid = view.grid,
            win = grid.up('window');
        form.loadRecord(record);
        win.close();
    },
    updateMeetingAttendance: function(btn){
        btn.setLoading(true);
        var grid = btn.up('grid'),
            panel = grid.up('panel'),
            meeting_id = panel.down('hiddenfield[name=id]').getValue(),
            store = grid.getStore(),
            selected = [];
        for (var i = 0; i < store.data.items.length; i++) {
            var record = store.data.items [i],
                has_attended = record.get('has_attended'),
                personnel_id = record.get('id');
            var obj = {
                has_attended: has_attended,
                personnel_id: personnel_id
            };
            if (record.dirty) {
                selected.push(obj);
            }
        }
        if (selected.length < 1) {
            btn.setLoading(false);
            toastr.warning('No records to save!!', 'Warning Response');
            return false;
        }
           grid.mask('Updating Attendance....');
           Ext.Ajax.request({
                url: 'common/updateMeetingAttendance',
                method: 'POST',
                params: {
                    selected: JSON.stringify(selected),
                    meeting_id: meeting_id,
                    _token: token
                },
                success: function (response) {
                    btn.setLoading(false);
                    grid.unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        success = resp.success;
                        if (success == true || success === true) {
                            store.load();
                            toastr.success(resp.message, 'Success');
                        } else {
                            grid.unmask();
                            toastr.error(resp.message, 'Failure Response');
                        }
                },
                failure: function (response) {
                    grid.unmask();
                    btn.setLoading(false);
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    grid.unmask();
                    btn.setLoading(false);
                    toastr.error('Error downloading data: ' + errorThrown, 'Error Response');
                }
            });
    },
    getExpiryDate: function(combo, newValue, oldValue, eopts){
        var form = combo.up('form');
        decision_id = form.down('combo[name=decision_id]').getValue();
        if(decision_id == 1){
            this.fireEvent('getExpiryDate', form);
        }  
    },
    saveApplicationApprovaldetails: function (btn) {
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
                waitMsg: 'Please wait...',
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        store.removeAll();
                        store.load();
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    SaveAuthSignature: function(btn) {
            this.fireEvent('SaveAuthSignature', btn);
        },
    shareQuotewithCustomer: function(btn){
       // btn.setLoading(true);
        var button = btn.up('button'),
            record = button.getWidgetRecord(),
            quotation_id = record.get('id'),
            grid = button.up('grid'),
            pnl = grid.up('panel'),
            application_code = pnl.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = pnl.down('hiddenfield[name=module_id]').getValue(),
            store = grid.getStore();
            Ext.MessageBox.confirm('Quote Dispatch', 'Are you sure to share this quote with the Customer (This process cannot be undone) ?', function (btn) {
            if (btn === 'yes') {
                grid.mask('Sharing');
                Ext.Ajax.request({
                        url: 'revenuemanagement/shareQuotewithCustomer',
                        method: 'POST',
                        params: {
                            module_id: module_id,
                            application_code: application_code,
                            quotation_id: quotation_id,
                            _token: token
                        },
                        success: function (response) {
                           // btn.setLoading(false);
                            grid.unmask();
                            var resp = Ext.JSON.decode(response.responseText),
                                success = resp.success;
                                if (success == true || success === true) {
                                    store.load();
                                    toastr.success(resp.message, 'Success');
                                } else {
                                    grid.unmask();
                                    toastr.error(resp.message, 'Failure Response');
                                }
                        },
                        failure: function (response) {
                            grid.unmask();
                            //btn.setLoading(false);
                            var resp = Ext.JSON.decode(response.responseText),
                                message = resp.message;
                            toastr.error(message, 'Failure Response');
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            grid.unmask();
                            //btn.setLoading(false);
                            toastr.error('Error downloading data: ' + errorThrown, 'Error Response');
                        }
                    });
            }
        });
    },
    printQuote: function (btn) {
        var me = this,
            win = btn.up('panel'),
            record = btn.getWidgetRecord(),
            application_code = record.get('application_code'),
            module_id = record.get('module_id'),
            // section_id = record.get('section_id'),
            // sub_module_id = record.get('sub_module_id'),
            invoice_no = record.get('invoice_no');
          
       previewCorrespondence(application_code, module_id, 'salesQuote', JSON.stringify({invoice_no:invoice_no}));
    },
    showPreviousNonGridPanelUploadedDocs: function (item) {
        this.fireEvent('showPreviousNonGridPanelUploadedDocs', item);
    },
    showMembersRecommendationWin:function(btn) {
        var button = btn.up('button'),
            grid = button.up('grid'),
            form = Ext.widget('meetingMembersRecommendationFrm'),
            frm = form.getForm(),
            record = button.getWidgetRecord(),
            application_code = record.get('application_code'),
            stage_category_id = record.get('stage_category_id'),
            module_id = record.get('module_id');
      
        form.loadRecord(record);
        form.down('hiddenfield[name=application_code]').setValue(application_code);
        form.down('hiddenfield[name=stage_category_id]').setValue(stage_category_id);
        form.down('hiddenfield[name=module_id]').setValue(module_id);

        funcShowCustomizableWindow('Recommendation Form', '50%', form, 'customizablewindow', btn);
        
    },
    viewApplicationEvaluationReport: function (item) {
        //if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            panel = Ext.widget('productReportViewPnl');
        panel.down('hiddenfield[name=report_type]').setValue(1);
        panel.down('hiddenfield[name=section_id]').setValue(record.get('section_id'));
        panel.down('hiddenfield[name=module_id]').setValue(record.get('module_id'));
        panel.down('hiddenfield[name=sub_module_id]').setValue(record.get('sub_module_id'));
        panel.down('hiddenfield[name=process_id]').setValue(record.get('process_id'));
        panel.down('hiddenfield[name=workflow_stage_id]').setValue(record.get('workflow_stage_id'));
        panel.down('hiddenfield[name=application_code]').setValue(record.get('application_code'));
        //panel.down('hiddenfield[name=application_code]').setValue(record.get('application_code'));

        this.fireEvent('setSelectedGridRecToTab', record);

        funcShowCustomizableWindow(item.winTitle, '70%', panel, 'customizablewindow');
        
    },
    showSelectedApplicationMoreDetails: function(btn) {
        // showApplicationMoreDetails
         var button = btn.up('button'),
            grid = button.up('grid'),
            container = grid.up('panel'),
            record = button.getWidgetRecord(),
            application_code = record.get('application_code');
            module_id = record.get('module_id');
        this.fireEvent('setSelectedGridRecToTab', record);
          if(module_id==2){
            this.fireEvent('showMeetingApplicationDetails', btn);
          }
          else{
       // container.down('hiddenfield[name=active_application_code]').setValue(application_code);
             this.fireEvent('showApplicationMoreDetails', btn);
          }

    },
    showApplicationUploadedDocument: function(btn) {
        // showApplicationMoreDetails
         this.fireEvent('showPreviousUploadedDocs', btn);
    },
    downloadDirectoryasZip: function(btn){
        var button = btn.up('button'),
            record = button.getWidgetRecord(),
            node_ref = record.get('node_ref'),
            application_code = record.get('application_code'),
            uploadeddocuments_id = record.get('id'),
            file_name = record.get('file_name');
        button.setLoading(true);
        Ext.Ajax.request({
                url: 'documentmanagement/getDocumentArchive',
                method: 'POST',
                params: {
                    node_ref: node_ref,
                    application_code: application_code,
                    uploadeddocuments_id: uploadeddocuments_id,
                    file_name: file_name
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (response) {
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
                            button.setLoading(false);
                        } else {
                            button.setLoading(false);
                            toastr.error(resp.message, 'Failure Response');
                        }
                },
                failure: function (response) {
                    button.setLoading(false);
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    button.setLoading(false);
                    toastr.error('Error downloading data: ' + errorThrown, 'Error Response');
                }
        });
    },
    showReasonsWin:function(btn){
        this.fireEvent('showReasonsWin', btn);
    },
    showEditCaseDecision: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            form = Ext.widget('casedecisionFrm');
        form.loadRecord(record);

        funcShowCustomizableWindow('Edit Decisions', '60%', form, 'customizablewindow');

    },
    showEditConfigParamGridFrm: function (item) {//for tree panels
        //if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
        var me = this,
            btn = item.up('button'),
            grid = btn.up('grid'),
            parentPanel = grid.up('panel'),
            record = btn.getWidgetRecord(),
            formWidget = item.form,
            form = Ext.widget(formWidget),
            storeArray = eval(item.stores),
            arrayLength = storeArray.length;
        form.reset();
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        form.loadRecord(record);
        grid.hide();
        parentPanel.add(form);
    },
    previewproductApplicationQueries: function (item) {
        this.fireEvent('showApplicationQueries', item);
    },
    showRecommendationWin:function(btn) {
        var button = btn.up('button'),
            grid = button.up('grid'),
            form = Ext.widget('recommendationfrm'),
            frm = form.getForm(),
            record = button.getWidgetRecord(),
            application_code = record.get('application_code'),
            stage_category_id = record.get('stage_category_id'),
            module_id = record.get('module_id');
      
        form.loadRecord(record);
        form.down('hiddenfield[name=application_code]').setValue(application_code);
        form.down('hiddenfield[name=stage_category_id]').setValue(stage_category_id);
        form.down('hiddenfield[name=module_id]').setValue(module_id);
        
        funcShowCustomizableWindow('Recommendation Form', '50%', form, 'customizablewindow', btn);
        
    },
    reloadParentGridOnChange: function (combo) {
        var grid = combo.up('grid'),
            store = grid.getStore();
        store.load();
    },
    viewApplicationRecommendationLogs:function(btn) {
        this.fireEvent('viewApplicationRecommendationLogs', btn);
    },
    previewPmsProgram: function (item) {//wrong
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            section_id = record.get('section_id'),
            grid = btn.up('grid'),
            store = grid.getStore(),
            sm = grid.getSelectionModel(),
            homePnl = grid.up('panel'),
            addPnl = Ext.widget('pmsprogramcontainer');
           
        addPnl.down('form').loadRecord(record);
        addPnl.itemId = 'previewPmsProgramView';
        //change view mode
        addPnl.getViewModel().set('is_read_only', true);
        funcShowCustomizableWindow('Program Details', '80%', addPnl, 'customizablewindow', item);
        // var rowIndex = store.indexOf(record);
        // sm.deselectAll();
        // sm.select(rowIndex, true);
        // grid.hide();
        // homePnl.add(addPnl);
    },
    autoGenerateChecklistBasedQueries:function(btn) {
        this.fireEvent('autoGenerateChecklistBasedQueries', btn);
    },
});