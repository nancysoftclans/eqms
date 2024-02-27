
Ext.define('Admin.store.workflowmanagement.SubmissionsUrgenciesStr', {
    extend: 'Ext.data.Store',
    storeId: 'submissionsurgenciesstr',
    alias: 'store.submissionsurgenciesstr',
    requires: [
        'Admin.model.workflowmanagement.WorkflowManagementMdl'
    ],
    model: 'Admin.model.workflowmanagement.WorkflowManagementMdl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'workflow/getWorkflowParamFromModel',
        headers: {
            'Authorization':'Bearer '+access_token
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            rootProperty: 'results',
            messageProperty: 'msg'
        },
        extraParams: {
            model_name: 'SubmissionUrgency'
        }
    },
    
});

