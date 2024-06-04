Ext.define('Admin.view.auditManagement.views.panels.AuditTypesPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'auditTypesPnl',
    controller: 'auditMgmntVctr',
    layout: 'fit',
    items: [
        {
            xtype: 'auditTypesGrid'
        }
    ]

});