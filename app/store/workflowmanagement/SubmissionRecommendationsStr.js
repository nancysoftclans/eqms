
Ext.define('Admin.store.workflowmanagement.SubmissionRecommendationsStr', {
    extend: 'Ext.data.Store',
    storeId: 'submissionrecommendationsstr',
    alias: 'store.submissionrecommendationsstr',
    requires: [
        'Admin.model.workflowmanagement.WorkflowManagementMdl'
    ],
    model: 'Admin.model.workflowmanagement.WorkflowManagementMdl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'workflow/getSubmissionRecommendations',
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
