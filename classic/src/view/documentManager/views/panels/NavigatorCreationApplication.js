Ext.define('Admin.view.documentManager.views.panels.NavigatorCreationApplication', {
    extend: 'Ext.Container',
    xtype: 'navigatorcreationapplication',
    itemId: 'navigatorcreationapplication',
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
        },
        {
            xtype: 'navigatorapplicationwrapper',
            region: 'center'
        },
        {
            xtype: 'navigatortypetb',
            region: 'south'
        }
    ]
});
