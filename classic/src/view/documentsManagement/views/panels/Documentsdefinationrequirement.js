Ext.define('Admin.view.documentsManagement.views.panels.Documentsdefinationrequirement', {
    extend: 'Ext.Container',
    xtype: 'documentsdefinationrequirement',
    itemId: 'documentsdefinationrequirement',
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
            xtype: 'documentapplicationwrapper',
            region: 'center'
        },
        {
            xtype: 'documenttypetb',
            region: 'south'
        }
    ]
});
