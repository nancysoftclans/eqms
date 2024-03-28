Ext.define('Admin.view.issuemanagement.viewcontroller.IssueMgmtVctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.issuemgmtvctr',
   
    init: function () {

    }, 

    setWorkflowCombosStore: function (obj, options) {
        this.fireEvent('setWorkflowCombosStore', obj, options);
    },
    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },

    showNewIssueApplication: function (btn) {
        var application_type = btn.app_type,
            wrapper_xtype = btn.wrapper_xtype;
        this.fireEvent('onNewIssueApplication', application_type, wrapper_xtype);
    },





});