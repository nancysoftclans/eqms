Ext.define('Admin.view.documentManager.views.dashboards.QMSRecordApplicationWrapper', {
    extend: 'Ext.Container',
    xtype: 'qmsrecordapplicationwrapper',
	itemId:'qmsrecordapplicationwrapper',
    layout: 'fit',
    items: [
        {
            xtype: 'qmsrecordapps',
            title: 'create',
        }
    ]
});