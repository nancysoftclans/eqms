Ext.define('Admin.view.reports.appsreport.mirreport.panel.Mirtabpnl', {
	extend: 'Ext.tab.Panel',
	xtype: 'mirtabpnl',
    itemId:'mirtabpnl',
	margin: 2,
    controller: 'productreportctr',
    defaults: {
        bodyPadding: 1,
        scrollable: true,
    },
    items: [{
    	xtype: 'mirtabularrepresentationgrid',
    	title: 'Tabular Representation'
    },{
    	xtype: 'mirGraphicalRepresentationGraph',
    	title: 'Graphical Representation'
    }],
});