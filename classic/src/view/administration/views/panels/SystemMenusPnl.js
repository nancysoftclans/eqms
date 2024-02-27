
Ext.define('Admin.view.administration.views.panels.SystemMenusPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'systemmenuspnl',
    userCls: 'big-100 small-100',
    itemId: 'SystemMenusDashboard',
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'systemmenusgrid'
        }
    ]
});
