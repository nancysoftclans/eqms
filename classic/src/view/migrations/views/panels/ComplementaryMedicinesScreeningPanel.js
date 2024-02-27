Ext.define('Admin.view.migrations.views.panels.ComplementaryMedicinesScreeningPanel', {

    extend : 'Ext.panel.Panel',
    xtype  : 'complementarymedicinesscreeningpanel',

    autoScroll: true,
    autoHeight: true,
    layout : 'fit' ,
    items: {
        xtype: 'complementarymedicinesscreeninggrd'
    }
})