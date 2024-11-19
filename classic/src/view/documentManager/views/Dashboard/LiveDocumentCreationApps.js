
Ext.define('Admin.view.documentManager.views.dashboards.LiveDocumentCreationApps', {
    extend: 'Ext.Container',
    xtype: 'livedocumentcreationapps', 
    itemId:'livedocumentcreationapps',
    layout: 'border',
    items: [{
        xtype: 'hiddenfield',
        name: 'module_id',
        value: 26
    },
    {
            xtype: 'hiddenfield',
            name: 'sub_module_id',
            value: 105
        },
      {
            xtype: 'renewaldocumentsgrid',
            region: 'center',
            title: 'Active Tasks',
            margin: 2
        }
    ]
});