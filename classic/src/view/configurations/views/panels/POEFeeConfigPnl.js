Ext.define('Admin.view.configurations.views.panels.POEFeeConfigPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'poefeeconfigpnl',
    title: 'POE Fee Configurations',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'poefeeconfiggrid'
        }
    ],

});