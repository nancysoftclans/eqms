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
        console.log(btn);
    },


})