Ext.define('Admin.view.reports.appsreport.adrreport.panel.Adrtabpnl', {
	extend: 'Ext.tab.Panel',
	xtype: 'adrtabpnl',
    itemId:'adrtabpnl',
	margin: 2,
    controller: 'productreportctr',
    defaults: {
        bodyPadding: 1,
        scrollable: true,
    },
    items: [{
    	xtype: 'adrtabularrepresentationgrid',
    	title: 'Tabular Representation'
    },{
    	xtype: 'adrGraphicalRepresentationGraph',
    	title: 'Graphical Representation'
    }],
});