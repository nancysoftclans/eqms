Ext.define('Admin.view.documentManager.views.dashboards.NavigatorApplicationWrapper', {
    extend: 'Ext.Container',
    xtype: 'navigatorapplicationwrapper',
	itemId:'navigatorapplicationwrapper',
    layout: 'fit',
    items: [
        {
            xtype: 'navigatorcreationapps'
        }
    ]
});