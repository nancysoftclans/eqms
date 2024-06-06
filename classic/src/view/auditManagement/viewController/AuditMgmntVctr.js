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
       var application_type = btn.app_type,
            section_id= btn.section_id,
            xtypeWrapper = btn.xtypeWrapper,
            module_id = btn.module_id;

            this.fireEvent('onInitiateNewAuditPlan',application_type,section_id,xtypeWrapper,module_id);
    },

    onAuditPlanSchedule: function(btn) {
        // console.log(btn);
    },

    saveNewAuditPlanDetails:function(btn) {
        // console.log(btn);
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
    doCreateConfigParamWin: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm();

            console.log(url);
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

                    console.log(resp);
                    toastr.error(resp.message, 'Failure Response');
                }
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


})