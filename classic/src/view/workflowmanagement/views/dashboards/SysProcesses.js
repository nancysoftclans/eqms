
Ext.define('Admin.view.workflowmanagement.views.dashboards.SysProcesses', {
    extend: 'Ext.container.Container',
    xtype: 'sysprocesses',
    layout: 'responsivecolumn',
    controller: 'workflowmanagementvctr',
    viewModel: 'workflowmanagementvm',
    items: [
        {
            xtype: 'sysprocessespnl'
        }
    ]
});
