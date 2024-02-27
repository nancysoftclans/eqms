Ext.define('Admin.view.configurations.views.panels.ExcelUploadConfigTypePnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'excelUploadConfigTypePnl',
    title: 'Excel Uploads Config Type',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'excelUploadsConfigTypeGrid'
        }
    ]
});