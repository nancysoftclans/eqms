Ext.define('Admin.view.documentManager.views.panels.DocumentsviewPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'documentsviewpnl',
    title: 'Documents Creation Setup',
    userCls: 'big-100 small-100',
    controller: 'documentsManagementvctr',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
	
    items: [
        {
            xtype: 'applicationdocpreviewgrid'
        }
    ]
});
