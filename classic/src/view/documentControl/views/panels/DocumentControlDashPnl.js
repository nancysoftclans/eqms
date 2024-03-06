Ext.define('Admin.view.documentControl.view.panels.DocumentControlDashPnl', {
    extend: 'Ext.Container',
    xtype: 'documentControlDashPnl',
    layout: 'border',
    items: [
        {
            xtype: 'documentControlDashGrid',
            region: 'center',
            title: 'Active Tasks',
            margin: 2,
        }
    ]
})