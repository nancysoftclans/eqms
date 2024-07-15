Ext.define('Admin.view.documentManager.views.dashboards.LiveDocumentApplicationWrapper', {
    extend: 'Ext.Container',
    xtype: 'livedocumentapplicationwrapper',
	itemId:'livedocumentapplicationwrapper',
    layout: 'fit',
    items: [
        {
            xtype: 'livedocumentcreationapps',
            title: 'renew',
        }
    ]
});