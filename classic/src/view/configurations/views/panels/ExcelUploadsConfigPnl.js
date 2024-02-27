Ext.define('Admin.view.configurations.views.panels.ExcelUploadsConfigPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'excelUploadsConfigPnl',
    title: 'Excel Uploads Config Pnl',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'excelUploadsConfigGrid'
        }
    ]
});