
Ext.define('Admin.view.workflowmanagement.views.panels.WorkflowsPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'workflowspnl',
   
    title: 'Workflow Configuration',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'workflowsgrid'
        }
    ]
});
