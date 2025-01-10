Ext.define('Admin.view.gbt.views.dashboard.GbtMgmntDashCnt', {
    extend: 'Ext.Container',
    xtype: 'gbtapplication',
    controller: 'gbtMgmntVctr',
    layout:'border',
    items: [
        {
            xtype: 'hiddenfield',
            name: 'module_id',
            value: 32
        },{
            xtype: 'hiddenfield',
            name: 'sub_module_id',
            value: 115
        },
        {
            xtype: 'gbtManagementDashWrapperPnl',
            region: 'center',

        },
        {
            xtype: 'gbtManagementDashTb',
            region: 'south'
        },
       
    ]
});