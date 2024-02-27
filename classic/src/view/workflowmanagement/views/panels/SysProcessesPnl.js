
Ext.define('Admin.view.workflowmanagement.views.panels.SysProcessesPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'sysprocessespnl',
    title: 'System Processes',
    userCls: 'big-100 small-100',
    itemId: 'SysProcessesDashboard',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'sysprocessesgrid'
        }
    ]
});
