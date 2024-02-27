
Ext.define('Admin.store.workflowmanagement.ApplicationReturnOptionsStr', {
    extend: 'Ext.data.Store',
    storeId: 'applicationreturnoptionsstr',
    alias: 'store.applicationreturnoptionsstr',
    requires: [
        'Admin.model.workflowmanagement.WorkflowManagementMdl'
    ],
    model: 'Admin.model.workflowmanagement.WorkflowManagementMdl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'workflow/getApplicationReturnDirectives',
        headers: {
            'Authorization':'Bearer '+access_token
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            rootProperty: 'results',
            messageProperty: 'msg'
        }
    },
    
});
