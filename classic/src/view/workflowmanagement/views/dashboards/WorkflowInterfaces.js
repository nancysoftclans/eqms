
Ext.define('Admin.view.workflowmanagement.views.dashboards.WorkflowInterfaces', {
    extend: 'Ext.container.Container',
    xtype: 'workflowinterfaces',
    layout: 'responsivecolumn',
    controller: 'workflowmanagementvctr',
    viewModel: 'workflowmanagementvm',
    items: [
        {
            xtype: 'workflowinterfacespnl'
        }
    ]
});
