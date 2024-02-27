Ext.define('Admin.view.migrations.views.panels.VetinaryMedicinesApplicationPanel.js',{


    extend: 'Ext.panel.Panel',
    xtype: 'vetinarymedsapplicationpanel',

    autoScroll: true,
    autoHeight: true,
    layout : 'fit' ,
    items: {
        xtype: 'vetinarymedicinesapplicationgrd'
    }
    



}); 