Ext.define('Admin.view.documentManager.viewcontrollers.DocumentsManagementVctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.documentsManagementvctr',

    ///the export option
    requires: [
        'Ext.exporter.text.CSV',
        'Ext.exporter.text.Html',
        'Ext.exporter.excel.Xlsx'
    ],


    showLogConfigwin: function(btn){
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


    showLogConfigwinWidget: function(btn) {
        
        var button = btn.up('button'),
        grid = button.up('grid'),
        record = button.getWidgetRecord(),
        
        childXtype = btn.childXtype,
        child = Ext.widget(childXtype)
         winWidth='100%',
         winTitle="logs",
         //child.setHeight('600');
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
        logGrid.down('textfield[name=id]').setValue(refId);
    
        funcShowCustomizableWindow(winTitle, winWidth, logGrid, 'customizablewindow');
        
     },


    onDocRequirementSelectionChange: function(selectable, selection) {
       
    },
    funcChangeDocumentReqmodule:function (cmbo, newVal) {
            var form = cmbo.up('form'),
            subModuleStore = form.down('combo[name=sub_module_id]').getStore(),
            filters = JSON.stringify({'module_id': newVal});
            subModuleStore.removeAll();
            subModuleStore.load({params:{filters: filters}});

            docparentStore = form.down('combo[name=docparent_id]').getStore();
            filters = JSON.stringify({'module_id': newVal});
            docparentStore.removeAll();
            docparentStore.load({params: {filters: filters}});

        if(newVal == 1){
            form.down('combo[name=prodclass_category_id]').setVisible(true);
        } else if(newVal == 4 || newVal == 12){
            form.down('combo[name=importexport_permittype_id]').setVisible(true);
        } else if(newVal == 2){
            form.down('combo[name=premise_type_id]').setVisible(true);
        }
        else{
            
            form.down('combo[name=premise_type_id]').setVisible(false);
            form.down('combo[name=prodclass_category_id]').setVisible(false);
            form.down('combo[name=importexport_permittype_id]').setVisible(false);
        }
    },
    funcChangeParentDocumentNode:function(cmbo,newVal){
        var form = cmbo.up('form'),
            docparentStore = form.down('combo[name=docparent_id]').getStore();
            section_id = form.down('combo[name=section_id]').getValue();
            module_id = form.down('combo[name=module_id]').getValue();
            sub_module_id = form.down('combo[name=sub_module_id]').getValue();
            docparentStore.removeAll();
            docparentStore.load({params: {sub_module_id: sub_module_id,section_id:section_id,module_id:module_id}});

    },
    function (cmbo, newVal) {
        var form = cmbo.up('form'),
             prodclassStr = form.down('combo[name=prodclass_category_id]').getStore();
             filter = {section_id: newVal},
             filter = JSON.stringify(filter);
             prodclassStr.removeAll();
             prodclassStr.load({params: {filters: filter}});

             docparentStore = form.down('combo[name=docparent_id]').getStore();
            section_id = form.down('combo[name=section_id]').getValue();
            module_id = form.down('combo[name=module_id]').getValue();
            sub_module_id = form.down('combo[name=sub_module_id]').getValue();
            docparentStore.removeAll();
            docparentStore.load({params: {sub_module_id: sub_module_id,section_id:section_id,module_id:module_id}});

    },
    showHideParent: function (combo, newVal, oldVal) {
        var me = this,
            selectedVal = newVal,
            form = combo.up('form'),
            docparent_id = form.down('combo[name=docparent_id]');
        if (selectedVal == 1) {
            //show parent only
            docparent_id.setFieldLabel('Parent');
          
            docparent_id.setVisible(true);
        } else {
            //show parent and child
            docparent_id.setVisible(false);
        }
        
    },
    showSimpleConfigModuleGridForm: function (btn) {
        //if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
        var me = this,
            formWidget = btn.form,
            grid = btn.up('grid'),
            parentPanel = grid.up('panel'),
            form = Ext.widget(formWidget),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        grid.hide();
        parentPanel.add(form);
        /*} else {
            toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
            return false;
        }*/
    },
    downloadDocumentRequirementTemplate:function(item){
        var me = this,
            btn = item.up('button'),
            grid = btn.up('grid'),
            parentPanel = grid.up('panel'),
            record = btn.getWidgetRecord(),
            has_document_template = record.get('has_document_template');

            if(has_document_template == 1){
                //download document 
                var redirect = upload_directory+'/'+record.get('document_folder')+'/'+record.get('file_name');
                download_report(redirect);

            }
            else{
                toastr.warning('The document do not have uploaded template!!', 'Warning Response');
            }
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

   
    configBackToDashboard: function (btn) {
        var currentPnl = btn.up('form'),
            containerPnlXtype = btn.containerPnlXtype,
            hiddenCompXtype = btn.hiddenCompXtype,
            containerPnl = btn.up(containerPnlXtype),
            grid = containerPnl.down(hiddenCompXtype);
        containerPnl.remove(currentPnl);
        grid.show();
    },

   onInitiateDocumentApplication: function (btn) {
        var application_type = btn.app_type;
        this.fireEvent('onInitiateDocumentApplication', application_type, btn);
    },

    onInitiateQmsRecordApplication: function (btn) {
        var application_type = btn.app_type;
        this.fireEvent('onInitiateQmsRecordApplication', application_type, btn);
    },

       onInitiateLiveDocumentApplication: function (btn) {
        var application_type = btn.app_type;
        this.fireEvent('onViewLiveDocumentDetails', application_type, btn);
    },

    doCreateConfigParam: function (btn) {
        var me = this,
            action_url = btn.action_url,
            form = btn.up('form'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
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
                        store.removeAll();
                        store.load();
                        me.configBackToDashboard(btn);
                        toastr.success(message, "Success Response");
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
    AddFormTypeFields: function (item) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            childXtype = item.childXtype,
            winTitle=item.winTitle,
            winWidth=item.winWidth,
            form = Ext.widget(childXtype),
            form_category_id = record.get('id');
        form.down('hiddenfield[name=form_category_id]').setValue(form_category_id);
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
    },
    doCreateDMSSectionDocConfigParamWin: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            doc_section_id = form.down('hiddenfield[name=doc_section_id]').getValue(),
            frm = form.getForm();
        if (frm.isValid()) {
            frm.submit({
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                params: {model: table},
                waitMsg: 'Please wait...',
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {

                        toastr.success(message, "Success Response");
                        store.removeAll();
                        store.load({params:{doc_section_id:doc_section_id} });
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
funcSaveDocumentRepositoryStructure:function (btn) {
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
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                params: {model: table},
                waitMsg: 'Please wait...',
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
showEditConfigParamWinFrm: function (item) {
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

    showEditDocumentTypeConfigParamWinFrm: function (item) {
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

        // const property_ids_array = JSON.parse(record.get('property_ids'));

        // console.log(property_ids_array);
        // form.down("tagfield[name=property_ids]").setValue(property_ids_array);

        form.on('afterrender', function() {
        try {
            const property_ids = record.get('property_ids');

            console.log(property_ids);
            if (property_ids) {
                const property_ids_array = JSON.parse(property_ids);
                form.down("tagfield[name=property_ids]").setValue(property_ids_array);
            }
        } catch (e) {
            console.error('Error parsing property_ids:', e);
        }
        });
        form.setHeight(650);
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
        /* } else {
             toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
             return false;
         }*/
    },


    onViewDocumentDetails: function (grid, record) {

        this.fireEvent('viewNavigatorDocDetails', record);

    },

    
    onViewDocumentApplication: function (grid, record) {

        this.fireEvent('viewApplicationDetails', record);

    },

    // onViewLiveDocumentApplication: function (grid, record) {

    //     this.fireEvent('viewLiveDocumentDetails', record);

    // },

    getDocumentReleaseRecommendationDetails: function (btn) {
        this.fireEvent('getDocumentReleaseRecommendationDetails', btn);
    },
    quickNavigationPOE: function (btn) {
        var step = btn.step,
            wizard = btn.wizard,
            wizardPnl = btn.up(wizard);
           
            if(wizardPnl.up('panel')){
                motherPnl = wizardPnl.up('panel');

            }
            else{
                motherPnl = wizardPnl;

            }
            
        var
            progress = wizardPnl.down('#progress_tbar'),
            document_type_id = motherPnl.down('combo[name=document_type_id]').getValue(),
            progressItems = progress.items.items;

            if(document_type_id == ''){
               
                toastr.error('Please select a Permit Application and save inspection entry before you proceed for inspection!!', 'Failure');
                return;
            } 

        if (step ==1) {
            var thisItem = progressItems[step];
            
        }
        if (step == 0) {
            
            motherPnl.getViewModel().set('atBeginning', false);
            
            wizardPnl.down('button[name=process_submission_btn]').setVisible(false);
            
        }
         else if (step == max_step) {
            motherPnl.getViewModel().set('atBeginning', true);
            motherPnl.getViewModel().set('atEnd', false);
            wizardPnl.down('button[name=process_submission_btn]').setVisible(true);
            
        } 
        else {
           
            motherPnl.getViewModel().set('atBeginning', false);
            motherPnl.getViewModel().set('atEnd', false);
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

     saveDocumentApplicationReceivingBaseDetails: function (btn) {
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
            qmsdoclistfrm = containerPnl.down('qmsdoclistfrm');
         
            qmsdoclistfrm = qmsdoclistfrm.getForm(); 
  
        if (qmsdoclistfrm.isValid()) {
             // console.log(process_id, moduleId, submodule_id, applicationCode);
            qmsdoclistfrm.submit({
                url: 'documentmanagement/'+action_url,
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
                        tracking_no = resp.tracking_no,
                        document_number = resp.document_number,
                        created_on = resp.created_on;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                            containerPnl.down('hiddenfield[name=active_application_code]').setValue(application_code);
                            containerPnl.down('hiddenfield[name=sub_module_id]').setValue(submodule_id);
                            containerPnl.down('hiddenfield[name=module_id]').setValue(moduleId);
                            containerPnl.down('displayfield[name=tracking_no]').setValue(tracking_no);
                            containerPnl.down('displayfield[name=document_number]').setValue(document_number);
                            containerPnl.down('displayfield[name=created_on]').setValue(created_on);
                      

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

    saveDocumentRenewalBaseDetails: function (btn) {
       var wizard = btn.wizardpnl,
             wizardPnl = btn.up(wizard),
             action_url = btn.action_url,
             form_panel = btn.form_panel,
             mainTabPnl = btn.up('#contentPanel'),
             containerPnl = mainTabPnl.getActiveTab();

        var process_id = containerPnl.down('hiddenfield[name=process_id]').getValue(),
            moduleId = containerPnl.down('hiddenfield[name=module_id]').getValue(),
            submodule_id = containerPnl.down('hiddenfield[name=sub_module_id]').getValue(),
            active_application_id = containerPnl.down('hiddenfield[name=active_application_id]').getValue(),
            applicationCode= containerPnl.down('hiddenfield[name=active_application_code]').getValue(),
            application_status_id = containerPnl.down('hiddenfield[name=application_status_id]').getValue(),
            workflow_stage_id = containerPnl.down('hiddenfield[name=workflow_stage_id]').getValue(),
            stage_category_id = containerPnl.down('hiddenfield[name=stage_category_id]').getValue();
            qmsdoclistfrm = containerPnl.down('docrenewalfrm');
         
            qmsdoclistfrm = qmsdoclistfrm.getForm(); 
  
        if (qmsdoclistfrm.isValid()) {
            qmsdoclistfrm.submit({
                url: 'documentmanagement/'+action_url,
                waitMsg: 'Please wait...',
                params: {
                    module_id: moduleId,
                    sub_module_id: submodule_id,
                    application_code: applicationCode,
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    stage_category_id: stage_category_id,
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
                        sub_module_id = resp.sub_module_id,
                        module_id = resp.module_id,
                        product_id = resp.product_id,
                        tracking_no = resp.tracking_no;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                            // containerPnl.down('hiddenfield[name=active_application_code]').setValue(application_code);
                            // containerPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
                            // containerPnl.down('hiddenfield[name=module_id]').setValue(module_id);
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


    saveSOPTemplateApplicationReceivingBaseDetails: function (btn) {
       var wizard = btn.wizardpnl,
             wizardPnl = btn.up(wizard),
             action_url = btn.action_url,
             form_panel = btn.form_panel,
             mainTabPnl = btn.up('#contentPanel'),
             containerPnl = mainTabPnl.getActiveTab();

        var process_id = containerPnl.down('hiddenfield[name=process_id]').getValue(),
            moduleId = 26,
            submodule_id = 104,
            active_application_id = containerPnl.down('hiddenfield[name=active_application_id]').getValue(),
            applicationCode= containerPnl.down('hiddenfield[name=active_application_code]').getValue(),
            application_status_id = containerPnl.down('hiddenfield[name=application_status_id]').getValue(),
            workflow_stage_id = containerPnl.down('hiddenfield[name=workflow_stage_id]').getValue(),
            stage_category_id = containerPnl.down('hiddenfield[name=stage_category_id]').getValue();
            qmsdoclistfrm = containerPnl.down('soptemplatedoclistfrm');

            qmsdoclistfrm = qmsdoclistfrm.getForm();
  
        if (qmsdoclistfrm.isValid()) {
             // console.log(process_id, moduleId, submodule_id, applicationCode);
            qmsdoclistfrm.submit({
                url: 'documentmanagement/'+action_url,
                waitMsg: 'Please wait...',
                params: {
                    module_id: moduleId,
                    sub_module_id: submodule_id,
                    application_code: applicationCode,
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    stage_category_id: stage_category_id,
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
                        tracking_no = resp.tracking_no,
                        document_number = resp.document_number,
                        created_on = resp.created_on;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                            containerPnl.down('hiddenfield[name=active_application_code]').setValue(application_code);
                            containerPnl.down('hiddenfield[name=sub_module_id]').setValue(submodule_id);
                            containerPnl.down('hiddenfield[name=module_id]').setValue(moduleId);
                            containerPnl.down('displayfield[name=tracking_no]').setValue(tracking_no);
                            containerPnl.down('displayfield[name=document_number]').setValue(document_number);
                            containerPnl.down('displayfield[name=created_on]').setValue(created_on);
                      

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

    saveFormFormatApplicationReceivingBaseDetails: function (btn) {
       var wizard = btn.wizardpnl,
             wizardPnl = btn.up(wizard),
             action_url = btn.action_url,
             form_panel = btn.form_panel,
             mainTabPnl = btn.up('#contentPanel'),
             containerPnl = mainTabPnl.getActiveTab();

        var process_id = containerPnl.down('hiddenfield[name=process_id]').getValue(),
            moduleId = 26,
            submodule_id = 106,
            active_application_id = containerPnl.down('hiddenfield[name=active_application_id]').getValue(),
            applicationCode= containerPnl.down('hiddenfield[name=active_application_code]').getValue(),
            application_status_id = containerPnl.down('hiddenfield[name=application_status_id]').getValue(),
            workflow_stage_id = containerPnl.down('hiddenfield[name=workflow_stage_id]').getValue(),
            stage_category_id = containerPnl.down('hiddenfield[name=stage_category_id]').getValue();
            qmsdoclistfrm = containerPnl.down('soptemplatedoclistfrm');

            qmsdoclistfrm = qmsdoclistfrm.getForm();
  
        if (qmsdoclistfrm.isValid()) {
             // console.log(process_id, moduleId, submodule_id, applicationCode);
            qmsdoclistfrm.submit({
                url: 'documentmanagement/'+action_url,
                waitMsg: 'Please wait...',
                params: {
                    module_id: moduleId,
                    sub_module_id: submodule_id,
                    application_code: applicationCode,
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    stage_category_id: stage_category_id,
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
                        tracking_no = resp.tracking_no,
                        document_number = resp.document_number,
                        created_on = resp.created_on;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                            containerPnl.down('hiddenfield[name=active_application_code]').setValue(application_code);
                            containerPnl.down('hiddenfield[name=sub_module_id]').setValue(submodule_id);
                            containerPnl.down('hiddenfield[name=module_id]').setValue(moduleId);
                            containerPnl.down('displayfield[name=tracking_no]').setValue(tracking_no);
                            containerPnl.down('displayfield[name=document_number]').setValue(document_number);
                            containerPnl.down('displayfield[name=created_on]').setValue(created_on);
                      

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

    saveLogDBApplicationReceivingBaseDetails: function (btn) {
       var wizard = btn.wizardpnl,
             wizardPnl = btn.up(wizard),
             action_url = btn.action_url,
             form_panel = btn.form_panel,
             mainTabPnl = btn.up('#contentPanel'),
             containerPnl = mainTabPnl.getActiveTab();

        var process_id = containerPnl.down('hiddenfield[name=process_id]').getValue(),
            moduleId = 26,
            submodule_id = 107,
            active_application_id = containerPnl.down('hiddenfield[name=active_application_id]').getValue(),
            applicationCode= containerPnl.down('hiddenfield[name=active_application_code]').getValue(),
            application_status_id = containerPnl.down('hiddenfield[name=application_status_id]').getValue(),
            workflow_stage_id = containerPnl.down('hiddenfield[name=workflow_stage_id]').getValue(),
            stage_category_id = containerPnl.down('hiddenfield[name=stage_category_id]').getValue();
            qmsdoclistfrm = containerPnl.down('soptemplatedoclistfrm');

            qmsdoclistfrm = qmsdoclistfrm.getForm();
  
        if (qmsdoclistfrm.isValid()) {
             // console.log(process_id, moduleId, submodule_id, applicationCode);
            qmsdoclistfrm.submit({
                url: 'documentmanagement/'+action_url,
                waitMsg: 'Please wait...',
                params: {
                    module_id: moduleId,
                    sub_module_id: submodule_id,
                    application_code: applicationCode,
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    stage_category_id: stage_category_id,
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
                        tracking_no = resp.tracking_no,
                        document_number = resp.document_number,
                        created_on = resp.created_on;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                            containerPnl.down('hiddenfield[name=active_application_code]').setValue(application_code);
                            containerPnl.down('hiddenfield[name=sub_module_id]').setValue(submodule_id);
                            containerPnl.down('hiddenfield[name=module_id]').setValue(moduleId);
                            containerPnl.down('displayfield[name=tracking_no]').setValue(tracking_no);
                            containerPnl.down('displayfield[name=document_number]').setValue(document_number);
                            containerPnl.down('displayfield[name=created_on]').setValue(created_on);
                      

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

    
    // showAddConfigParamWinFrm: function (btn) {
    //     //if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
    //     var me = this,
    //         childXtype = btn.childXtype,
    //         winTitle=btn.winTitle,
    //         winWidth=btn.winWidth,
    //         child = Ext.widget(childXtype),
    //         storeArray = eval(btn.stores),
    //         arrayLength = storeArray.length;
    //     if (arrayLength > 0) {
    //         me.fireEvent('refreshStores', storeArray);
    //     }
    //     funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
        
    // },
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
    setGridStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
    setDynamicTreeGridStore: function (obj, options) {
        this.fireEvent('setDynamicTreeGridStore', obj, options);
    },
    setWorkflowCombosStore: function (obj, options) {
        this.fireEvent('setWorkflowCombosStore', obj, options);
    },
    setGridTreeStore: function (obj, options) {
        this.fireEvent('setGridTreeStore', obj, options);
    },
    doDeleteConfigWidgetParam: function (item) {
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

    generateReport: function (btn) {
        var grid_reference = btn.grid_reference,
            title = btn.title,
            type = btn.type,
            file_name = btn.file_name;

        this.doExport({
            type: type,
            title: title,
            fileName: file_name
        }, grid_reference);

    },
    generatePDFReport: function (btn) {
        var grid_reference = btn.grid_reference,
            title = btn.title,
            type = btn.type,
            file_name = btn.file_name,
            grid = this.lookupReference(grid_reference);
        grid.saveDocumentAs({
            fileName: file_name
        });

    },

    doExport: function (config, grid_reference) {
        var grid = this.lookupReference(grid_reference);
        grid.saveDocumentAs(config);
    },

    onBeforeDocumentSave: function (view) {
        view.mask('Document is prepared for export. Please wait ...');
    },

    onDocumentSave: function (view) {
        view.unmask();
    },


     navigate: function (button, wizardPanel, direction) {
        var layout = wizardPanel.getLayout(),
            progress = this.lookupReference('progress'),
            motherPnl = wizardPanel.up('panel'),
          //  application_id = motherPnl.down('hiddenfield[name=active_application_code]').getValue(),
            sub_module_id = motherPnl.down('hiddenfield[name=sub_module_id]').getValue(),
            model = motherPnl.getViewModel(),
            progressItems = progress.items.items,
            item, i, activeItem, activeIndex,
            end = 1,
            nextStep = wizardPanel.items.indexOf(layout.getNext());

        if(sub_module_id == ''){
               
            toastr.error('Search Import/Export Permit Application before you proceed for inspection!!', 'Failure');
            return;
        }  layout[direction]();
        activeItem = layout.getActiveItem();
        activeIndex = wizardPanel.items.indexOf(activeItem);
        //
        if (activeIndex == 0) {
            
            model.set('atBeginning', true);
            model.set('atEnd', false);
            motherPnl.down('button[name=process_submission_btn]').setVisible(false);
        } else if (activeIndex == end) {
            
                model.set('atEnd', false);
                model.set('atBeginning', true);
                
                motherPnl.down('button[name=process_submission_btn]').setVisible(true);
            
            
        } else {
            model.set('atEnd', false);
            model.set('atBeginning', false);
        }
        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (activeIndex === item.step) {
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
            motherPnl.down('button[name=save]').setVisible(true);
            panel.getViewModel().set('atBeginning', false);
            panel.getViewModel().set('atEnd', true);
            wizardPnl.down('button[name=process_submission_btn]').setVisible(false);
        } else if (step == max_step) {
            
            motherPnl.down('button[name=save]').setVisible(false);
            panel.getViewModel().set('atBeginning', true);
            wizardPnl.down('button[name=process_submission_btn]').setVisible(true);
        } else {
            panel.getViewModel().set('atBeginning', false);
            panel.getViewModel().set('atEnd', false);
            if(wizardPnl.down('button[name=save]')){

                wizardPnl.down('button[name=save]').setVisible(false);
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
    showSectionsDocDefDetailsPanel: function (item) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            workflow_id = record.get('id'),
            section_name = record.get('section_name'),
            site_name = record.get('site_name'),
            doc_section_id = record.get('id'),
            grid = btn.up('grid'),
            panel = grid.up('panel'),
            containerPnl = Ext.widget('sectionsDocumentDefinationpnl');
        
        containerPnl.down('displayfield[name=site_name]').setValue('DMS Site Name:'+site_name);
        containerPnl.down('displayfield[name=section_name]').setValue('DMS Section Node:'+section_name);
        
        containerPnl.down('hiddenfield[name=doc_section_id]').setValue(doc_section_id);

        grid.hide();
        panel.add(containerPnl);
    },
    onPrevCardClick: function (btn) {
        var wizard = btn.wizard,
            wizardPnl = btn.up(wizard);
            wizardPnl.getViewModel().set('atEnd', false);
        this.navigate(btn, wizardPnl, 'prev');
    },

    onNextCardClick: function (btn) {
        var wizard = btn.wizard,
            wizardPnl = btn.up(wizard);
            motherPnl = wizardPnl.up('panel');

        motherPnl.getViewModel().set('atBeginning', false);
        this.navigate(btn, wizardPnl, 'next');
    },
    showAddDMSSectionsDefinationDetails: function (btn) {
        var childXtype = btn.childXtype,
            form = Ext.widget(childXtype),
            title = btn.winTitle,
            grid = btn.up('grid'),
            grid_store = grid.getStore(),
            record_count = grid_store.getTotalCount(),
            wizardFrm = btn.up('sectionsDocumentDefinationpnl'),
            doc_section_id = wizardFrm.down('hiddenfield[name=doc_section_id]').getValue();
            
            form.down('hiddenfield[name=doc_section_id]').setValue(doc_section_id);
            funcShowCustomizableWindow(title, '55%', form, 'customizablewindow');
    },

    showReceivingApplicationSubmissionWin: function (btn) {

        this.fireEvent('showReceivingApplicationSubmissionWin', btn);
    },
    showSectionsDocDefDetailsToDashboard: function (btn) {
        var currentPnl = btn.up('directorateSectionsDocDefinationpnl'),
            containerPnlXtype = btn.containerPnlXtype,
            hiddenCompXtype = btn.hiddenCompXtype,
            containerPnl = btn.up(containerPnlXtype),
            grid = containerPnl.down(hiddenCompXtype);
            containerPnl.remove(currentPnl);
            grid.show();
    },
    funcReloadSubModulesDetails:function(cbo,value){
       var store = Ext.getStore('system_submodulesStr');
        store.removeAll();
        store.load({})
    }

//     onViewDocumentDetails: function (item) {
//     Ext.getBody().mask("Please wait...");
//     var me = this,
//       btn = item.up("button"),
//       record = btn.getWidgetRecord(),
//       childXtype = item.childXtype,
//       pnl = Ext.widget('documentsviewpnl'),
//       ApplicationCode = record.get('application_code'),
//       ModuleID = record.get('module_id'),
//       SuboduleID = record.get('sub_module_id'),
//       grid = Ext.widget('applicationdocpreviewnavigatorgrid'),
//       WorkFlowStage = record.get('workflow_stage_id');
      
//       console.log(ApplicationCode, ModuleID, SuboduleID, WorkFlowStage);
      
//       winTitle = "Document",
//       winWidth = "80%";
//        pnl.down("hiddenfield[name=application_code]").setValue(ApplicationCode),
//        pnl.down("hiddenfield[name=module_id]").setValue(ModuleID),
//        pnl.down("hiddenfield[name=sub_module_id]").setValue(SuboduleID),
//        pnl.down("hiddenfield[name=workflow_stage_id]").setValue(WorkFlowStage);

  
//     funcShowCustomizableWindow(
//       winTitle,
//       "60%",
//       pnl,
//       "customizablewindow"
//     );

//     me.refreshApplicationDocPreviewNavigatorGrid(pnl);
//   },
//   refreshApplicationDocPreviewNavigatorGrid: function (pnl) {
//     var me = this,
//         store = me.store,
//         previewPnl = pnl.down('documentsviewpnl'); // Correctly reference the grid within the panel

//     if (!previewPnl) {
//         console.error("Error: previewPnl not found. Ensure 'applicationdocpreviewnavigatorgrid' exists within the panel.");
//         return;
//     }

//     var application_code = previewPnl.down("hiddenfield[name=application_code]").getValue(),
//         module_id = previewPnl.down("hiddenfield[name=module_id]").getValue(),
//         sub_module_id = previewPnl.down("hiddenfield[name=sub_module_id]").getValue(),
//         workflow_stage = previewPnl.down("hiddenfield[name=workflow_stage_id]").getValue();

//     if (!application_code || !module_id || !sub_module_id || !workflow_stage) {
//         console.error("Error: One or more hidden fields not found within the panel.");
//         return;
//     }

//     store.getProxy().extraParams = {
//         application_code: application_code,
//         module_id: module_id,
//         sub_module_id: sub_module_id,
//         workflow_stage: workflow_stage
//     };

//     store.load(); // Load the store with the new parameters
// },
    
});