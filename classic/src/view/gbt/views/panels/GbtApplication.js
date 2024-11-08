Ext.define('Admin.view.gbt.views.panels.GbtApplication', {
    extend: 'Ext.Container',
    xtype: 'gbtapplication',
    itemId: 'gbtapplication',
    controller: 'gbtViewctr',
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
            xtype: 'gbtDashWrapperPnl',
            region: 'center'
        },
        {
            xtype: 'gbtDashTb',
            region: 'south'
        }
    ]
});
