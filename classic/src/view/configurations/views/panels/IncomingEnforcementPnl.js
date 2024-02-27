Ext.define('Admin.view.configurations.views.panels.IncomingEnforcementPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'incomingEnforcementPnl',
    title: 'Incoming Enforcement Reports',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },

    items: [
        {
            xtype: 'incomingEnforcementGrid'
        }
    ],

});