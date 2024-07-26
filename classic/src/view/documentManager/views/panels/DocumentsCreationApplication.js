Ext.define('Admin.view.documentManager.views.panels.DocumentsCreationApplication', {
    extend: 'Ext.Container',
    xtype: 'documentscreationapplication',
    itemId: 'documentscreationapplication',
    controller: 'documentsManagementvctr',
    layout: 'border',
    items: [
        {
            xtype: 'hiddenfield',
            name: 'module_id',
            value: 26
        },{
            xtype: 'hiddenfield',
            name: 'sub_module_id',
            value: 101
        },{
            xtype: 'hiddenfield',
            name: 'sop_sub_module_id',
            value: 104
        },{
            xtype: 'hiddenfield',
            name: 'sop_module_id',
            value: 26
        },
        {
            xtype: 'documentapplicationwrapper',
            region: 'center'
        },
        {
            xtype: 'documenttypetb',
            region: 'south'
        }
    ]
});
