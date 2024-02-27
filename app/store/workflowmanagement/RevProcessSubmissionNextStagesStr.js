
Ext.define('Admin.store.workflowmanagement.RevProcessSubmissionNextStagesStr', {
    extend: 'Ext.data.Store',
    storeId: 'revprocesssubmissionnextstagesstr',
    alias: 'store.revprocesssubmissionnextstagesstr',
    requires: [
        'Admin.model.workflowmanagement.WorkflowManagementMdl'
    ],
    model: 'Admin.model.workflowmanagement.WorkflowManagementMdl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'workflow/getRevProcessSubmissionWorkflowStages',
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
