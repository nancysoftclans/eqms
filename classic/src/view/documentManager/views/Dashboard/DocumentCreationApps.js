
Ext.define('Admin.view.documentManager.views.dashboards.DocumentCreationApps', {
    extend: 'Ext.Container',
    xtype: 'documentcreationapps', 
    itemId:'documentcreationapps',
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
            xtype: 'docdefinationrequirementgrid',
            region: 'center',
            title: 'Active Tasks',
            margin: 2
        }
    ]
});