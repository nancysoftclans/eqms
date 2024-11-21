Ext.define('Admin.view.auditManagement.views.dashboard.AuditMgmntDashCnt', {
    extend: 'Ext.Container',
    xtype: 'auditMgmntDashCtn',
    controller: 'auditMgmntVctr',
    layout:'border',
    items: [
        {
            xtype: 'hiddenfield',
            name : 'module_id',
           
        },
        {
            xtype: 'auditManagementDashWrapperPnl',
            region: 'center',

        },
        {
            xtype: 'auditManagementDashTb',
            region: 'south'
        },
       
    ]
});