Ext.define('Admin.view.QMS.auditManagement.viewController.AuditMgmntVctr', {
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
    /**
        Audit Types
     */
    showAuditTypesRecords: function(btn){
        var grid = Ext.widget('auditTypesGrid'),
        form = btn.up('form');
        funcShowCustomizableWindowWithObject('Audit Types Selection','90%',grid,'customizablewindow',form);
    },

    saveAuditType: function(btn) {
        var form = btn.up('form'),
        frm = form.getForm(),
        f = form;

        if(frm.isValid()) {
            frm.submit({
                url: 'auditManagement/saveAuditType',
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
                        f.down('hiddenfield[name=id]').setValue(record_id);
                        
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
        child = Ext.widget(childXtype);
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
    
    }


})