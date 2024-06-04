Ext.define('Admin.view.documentManager.views.dashboards.DocumentApplicationWrapper', {
    extend: 'Ext.Container',
    xtype: 'documentapplicationwrapper',
	itemId:'documentapplicationwrapper',
    layout: 'fit',
    items: [
        {
            xtype: 'documentcreationapps',
            title: 'create',
        }
    ]
});