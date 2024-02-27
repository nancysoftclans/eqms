
Ext.define('Admin.view.workflowmanagement.views.panels.TfdaProcessesPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'tfdaprocessespnl',
    title: 'Processes Configuration',
    userCls: 'big-100 small-100',
    itemId: 'TfdaProcessesDashboard',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'tfdaprocessesgrid'
        }
    ]
});
