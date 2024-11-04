Ext.define('Admin.view.gbt.views.dashboard.GbtDashCnt', {
    extend: 'Ext.Container',
    xtype: 'gbtDashCtn',
    controller: 'gbtViewctr',
    layout:'border',
    items: [
        {
            xtype: 'hiddenfield',
            name : 'module_id',
           
        },
        {
            xtype: 'gbtDashWrapperPnl',
            region: 'center',

        },
        {
            xtype: 'gbtDashTb',
            region: 'south'
        }
    ]
});