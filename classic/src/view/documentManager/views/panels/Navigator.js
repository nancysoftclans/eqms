Ext.define('Admin.view.documentManager.views.panels.Navigator',  {
    extend: 'Ext.panel.Panel',
    xtype: 'navigator',
    title: 'Forms Categories',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'navigatorgrid'
        }
    ]
});
