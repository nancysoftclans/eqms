Ext.define('Admin.view.configurations.views.panels.HFDImportExportFeeConfigPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'HFDimportExportFeeConfigPnl',
    title: 'Import/Export Fee Configurations',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'hfdimportexportfeeconfiggrid'
        }
    ],

});