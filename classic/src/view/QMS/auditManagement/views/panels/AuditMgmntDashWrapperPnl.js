Ext.define('Admin.view.QMS.auditManagement.views.panels.AuditMgmntDashWrapperPnl.js', {
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