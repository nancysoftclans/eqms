Ext.define('Admin.view.gbt.views.dashboard.GbtDashWrapperPnl.js', {
    extend: 'Ext.Container',
    xtype: 'gbtDashWrapperPnl',
    itemId:  'gbtDashWrapperPnl',
    layout: 'fit',
    items: [
        {
            xtype: 'gbtDashPnl'
        }
    ]
});