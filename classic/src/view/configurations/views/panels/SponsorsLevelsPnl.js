Ext.define('Admin.view.configurations.views.panels.SponsorsLevelsPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'sponsorslevels',
    title: 'Sponsors Levels',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },

    items: [
        {
            xtype: 'sponsorslevelsGrid'
        }
    ],

});
