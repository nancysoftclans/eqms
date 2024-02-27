Ext.define('Admin.view.documentsManagement.views.panels.Documentsdefinationrequirementpnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'documentsdefinationrequirement',
    title: 'Documents Defination Requiments Setup',
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
