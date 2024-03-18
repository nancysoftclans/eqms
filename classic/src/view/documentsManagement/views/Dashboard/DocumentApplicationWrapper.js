Ext.define('Admin.view.documentsManagement.views.dashboards.DocumentApplicationWrapper', {
    extend: 'Ext.Container',
    xtype: 'documentapplicationwrapper',
	itemId:'documentapplicationwrapper',
    layout: 'fit',
    items: [
        {
            xtype: 'documentcreationapps'
        }
    ]
});