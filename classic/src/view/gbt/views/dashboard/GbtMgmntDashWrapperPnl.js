Ext.define('Admin.view.gbt.views.dashboard.GbtMgmntDashWrapperPnl.js', {
    extend: 'Ext.Container',
    xtype: 'gbtManagementDashWrapperPnl',
    itemId:  'gbtManagementDashWrapperPnl',
    layout: 'fit',
    items: [
        {
            xtype: 'gbtMgmntDashPnl'
        }
    ]
});
