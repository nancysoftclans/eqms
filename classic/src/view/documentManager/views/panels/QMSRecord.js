Ext.define('Admin.view.documentManager.views.panels.QMSRecord', {
    extend: 'Ext.Container',
    xtype: 'qmsrecord',
    itemId: 'qmsrecord',
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
            value: 108
        },
        {
            xtype: 'qmsrecordapplicationwrapper',
            region: 'center'
        },
        {
            xtype: 'qmsrecordtb',
            region: 'south'
        }
    ]
});
