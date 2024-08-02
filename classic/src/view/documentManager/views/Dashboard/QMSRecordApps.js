
Ext.define('Admin.view.documentManager.views.dashboards.QMSRecordApps', {
    extend: 'Ext.Container',
    xtype: 'qmsrecordapps', 
    itemId:'qmsrecordapps',
    layout: 'border',
    items: [{
        xtype: 'hiddenfield',
        name: 'module_id',
        value: 26
    },
    {
            xtype: 'hiddenfield',
            name: 'sub_module_id',
            value: 108
        },
      {
            xtype: 'qmsrecordgrid',
            region: 'center',
            title: 'Active Tasks',
            margin: 2
        }
    ]
});