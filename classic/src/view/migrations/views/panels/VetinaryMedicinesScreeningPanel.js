Ext.define('Admin.view.migrations.views.panels.VetinaryMedicinesScreeningPanel.js',{


    extend: 'Ext.panel.Panel',
    xtype: 'vetinarymedscreeningpanel',

    autoScroll: true,
    autoHeight: true,
    layout : 'fit' ,
    items: {
        xtype: 'vetinarymedicinesscreeninggrd'
    }
    



}); 