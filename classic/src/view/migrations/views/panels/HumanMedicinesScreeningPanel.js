Ext.define('Admin.view.migrations.views.panels.HumanMedicinesScreeningPanel.js',{
    extend: 'Ext.panel.Panel',
    xtype: 'humanmedscreeningpanel',
    autoScroll: true,
    autoHeight: true,
    layout : 'fit' ,
    items: {
        xtype: 'humamedicinesscreeninggrd'
    }
});