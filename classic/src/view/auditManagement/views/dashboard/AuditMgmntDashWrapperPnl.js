Ext.define('Admin.view.auditManagement.views.dashboard.AuditMgmntDashWrapperPnl.js', {
    extend: 'Ext.Container',
    xtype: 'auditManagementDashWrapperPnl',
    itemId:  'auditManagementDashWrapperPnl',
    layout: 'fit',
    items: [
        {
            xtype: 'auditMgmntDashPnl'
        }
    ]
});