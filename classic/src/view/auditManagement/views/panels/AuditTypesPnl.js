Ext.define('Admin.view.auditManagement.views.panels.AuditTypesPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'auditTypesPnl',
    controller: 'auditMgmntVctr',

    
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'audittypesgrid',
            flex:1
        },
        {
            xtype: 'hiddenfield',
            name: 'id'
        }
    ]

});