Ext.define('Admin.view.reports.appsreport.enforcementreport.panel.Enforcementtabpnl', {
	extend: 'Ext.tab.Panel',
	xtype: 'enforcementtabpnl',
    itemId:'enforcementtabpnl',
	margin: 2,
    controller: 'productreportctr',
    defaults: {
        bodyPadding: 1,
        scrollable: true,
    },
    items: [{
    	xtype: 'enforcementtabularrepresentationgrid',
    	title: 'Tabular Representation'
    },{
    	xtype: 'enforcementGraphicalRepresentation',
    	title: 'Graphical Representation'
    }],
});