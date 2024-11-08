Ext.define('Admin.view.documentManager.views.panels.AuditPlanApplication', {
    extend: 'Ext.Container',
    xtype: 'auditplanapplication',
    itemId: 'auditplanapplication',
    controller: 'auditMgmntVctr',
    layout: 'border',
    items: [
        {
            xtype: 'hiddenfield',
            name: 'module_id',
            value: 29
        },{
            xtype: 'hiddenfield',
            name: 'sub_module_id',
            value: 103
        },
        {
            xtype: 'auditManagementDashWrapperPnl',
            region: 'center'
        },
        {
            xtype: 'auditManagementDashTb',
            region: 'south'
        }
        
    ]
});
