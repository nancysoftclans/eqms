Ext.define('Admin.view.configurations.views.panels.MainDetailsVariationPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'maindetailsvariationpnl',
    controller: 'configurationsvctr',
    title: 'Main Details Variation Configuration',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [{
        xtype: 'maindetailsvariationgrid'
    }]
});