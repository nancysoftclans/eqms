Ext.define('Admin.view.gbt.panels.GbtPlanningPnl',{
    extend: 'Ext.panel.Panel',
    xtype: 'gbtPlanningPnl',
    controller: 'gbtViewctr',
    layout: 'fit',

    items: [{
        xtype: 'gbtDashCtn'
    }]
})