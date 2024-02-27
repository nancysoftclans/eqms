Ext.define('Admin.view.documentsManagement.viewcontrollers.DocumentsManagementVctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.documentsManagementvctr',

    ///the export option
    requires: [
        'Ext.exporter.text.CSV',
        'Ext.exporter.text.Html',
        'Ext.exporter.excel.Xlsx'
    ],
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
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
        /* } else {
             toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
             return false;
         }*/
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
    quickNavigation: function (btn) {
        var step = btn.step,
            formPnl = btn.up('directorateSectionsDocDefinationWizardfrm'),
            motherPnl = formPnl.up('sectionsDocumentDefinationpnl');

        if (step == 2) {
            motherPnl.getViewModel().set('atEnd', true);
        } else {
            motherPnl.getViewModel().set('atEnd', false);
        }
        if (step == 2) {
            //check if its an edit
            // this.prepareContactDetails();
        }
        if (step == 0) {
            motherPnl.getViewModel().set('atBeginning', true);
        } else {
            motherPnl.getViewModel().set('atBeginning', false);
        }


        formPnl.getLayout().setActiveItem(step);
        var layout = formPnl.getLayout(),
            progress = formPnl.down('#progress_tbar'),
            model = motherPnl.getViewModel(),
            progressItems = progress.items.items,
            item = null,
            i = 0,
            activeItem = layout.getActiveItem(),
            activeIndex = formPnl.items.indexOf(activeItem);

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
        var wizardPnl = btn.up('workflowwizardfrm'),
            motherPnl = wizardPnl.up('sectionsDocumentDefinationpnl');
        motherPnl.getViewModel().set('atEnd', false);
        this.navigate(btn, wizardPnl, 'prev');
    },

    onNextCardClick: function (btn) {
        var wizardPnl = btn.up('workflowwizardfrm'),
            motherPnl = wizardPnl.up('sectionsDocumentDefinationpnl');
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
    },
    
});

