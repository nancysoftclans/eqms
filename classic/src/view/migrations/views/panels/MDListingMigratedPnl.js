Ext.define('Admin.view.migrations.views.panels.MDListingMigratedPnl',{
    extend: 'Ext.panel.Panel',
    xtype: 'mdListingMigratedPnl',
    autoScroll: true,
    autoHeight: true,
    layout : 'fit' ,
    items: {
        xtype: 'mdListingMigratedgrd'
    }
});