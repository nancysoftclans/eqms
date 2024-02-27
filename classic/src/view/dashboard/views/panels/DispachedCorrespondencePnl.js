Ext.define('Admin.view.dashboard.DispachedCorrespondencePnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'dispachedCorrespondencePnl',
    margin: 2,
    controller: 'dashboardvctr',
    layout: 'fit',
    items: [{
		xtype: 'dispachedCorrespondenceGrid'
    }
    ]
});
