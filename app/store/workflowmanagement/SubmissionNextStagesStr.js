
Ext.define('Admin.store.workflowmanagement.SubmissionNextStagesStr', {
    extend: 'Ext.data.Store',
    storeId: 'submissionnextstagesstr',
    alias: 'store.submissionnextstagesstr',
    requires: [
        'Admin.model.workflowmanagement.WorkflowManagementMdl'
    ],
    model: 'Admin.model.workflowmanagement.WorkflowManagementMdl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'workflow/getSubmissionWorkflowStages',
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
