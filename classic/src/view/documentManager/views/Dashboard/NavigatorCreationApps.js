
Ext.define('Admin.view.documentManager.views.dashboards.NavigatorCreationApps', {
    extend: 'Ext.Container',
    xtype: 'navigatorcreationapps', 
    itemId:'navigatorcreationapps',
    layout: 'border',
    items: [{
        xtype: 'hiddenfield',
        name: 'module_id',
        value: 26
    },
    {
            xtype: 'hiddenfield',
            name: 'sub_module_id',
            value: 101
        },
      {
            xtype: 'navigatorgrid',
            region: 'center',
            title: 'Active Tasks',
            margin: 2
        }
    ]
});