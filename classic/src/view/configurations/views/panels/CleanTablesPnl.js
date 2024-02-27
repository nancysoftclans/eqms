Ext.define('Admin.view.configurations.views.panels.CleanTablesPnl', {

    extend: 'Ext.panel.Panel',
    xtype: 'cleanTables',
    controller: 'configurationsvctr',
    title: 'clean selected tables',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [{
        xtype: 'tablesGrid'
    }]

});