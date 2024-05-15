Ext.define('Admin.view.documentManager.views.panels.Documentsdefinationrequirementpnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'documentsdefinationrequirementpnl',
    title: 'Documents Creation Setup',
    userCls: 'big-100 small-100',
    controller: 'documentsManagementvctr',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
	
    items: [
        {
            xtype: 'docdefinationrequirementgrid'
        }
    ]
});
