
Ext.define('Admin.store.workflowmanagement.SubmissionStageActionsStr', {
    extend: 'Ext.data.Store',
    storeId: 'submissionstageactionsstr',
    alias: 'store.submissionstageactionsstr',
    requires: [
        'Admin.model.workflowmanagement.WorkflowManagementMdl'
    ],
    model: 'Admin.model.workflowmanagement.WorkflowManagementMdl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'workflow/getWorkflowActions',
        headers: {
            'Authorization':'Bearer '+access_token
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            rootProperty: 'results',
            messageProperty: 'msg'
        },
        extraParams: {}
    },
    
});
