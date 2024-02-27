Ext.define('Admin.view.documentsManagement.views.panels.Documentsdefinationrequirement', {
    extend: 'Ext.container.Container',
    xtype: 'documentsdefinationrequirementContainer',
    controller: 'documentsManagementvctr',
    padding: '2 0 0 0',
    layout: {
        type: 'fit'
    },
    items: [{
            xtype: 'documentsdefinationrequirementpnl',
            flex: 0.8,
            resizable: true,
            split: true
     }]
});//
