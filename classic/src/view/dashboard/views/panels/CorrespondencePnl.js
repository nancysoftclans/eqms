Ext.define('Admin.view.dashboard.CorrespondencePnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'correspondencePnl',
    margin: 2,
    controller: 'dashboardvctr',
    layout: 'fit',
    items: [{
		xtype: 'correspondenceGrid'
    }
    ]
});
