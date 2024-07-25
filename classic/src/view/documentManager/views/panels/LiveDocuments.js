Ext.define('Admin.view.documentManager.views.panels.LiveDocuments',  {
    extend: 'Ext.panel.Panel',
    xtype: 'livedocuments',
    itemId: 'livedocuments',
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
            value: 105
        },
        {
            xtype: 'livedocumentapplicationwrapper',
            region: 'center'
        }
    ]
});
