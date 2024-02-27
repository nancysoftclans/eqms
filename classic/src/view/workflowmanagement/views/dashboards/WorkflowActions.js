
Ext.define('Admin.view.workflowmanagement.views.dashboards.WorkflowActions', {
    extend: 'Ext.container.Container',
    xtype: 'workflowactions',
    layout: 'responsivecolumn',
    controller: 'workflowmanagementvctr',
    viewModel: 'workflowmanagementvm',
    items: [
        {
            xtype: 'workflowactionspnl'
        }
    ]
});
