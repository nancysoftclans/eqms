Ext.define('Admin.view.migrations.views.panels.DrugMasterFilePanel', {

    extend : 'Ext.panel.Panel',
    xtype  : 'drugmasterfilepanel',

    autoScroll: true,
    autoHeight: true,
    layout : 'fit' ,
    items: {
        xtype: 'drugmasterfilegrd'
    }
})