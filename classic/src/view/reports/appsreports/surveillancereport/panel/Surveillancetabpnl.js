Ext.define('Admin.view.reports.appsreport.surveillancereport.panel.Surveillancetabpnl', {
	extend: 'Ext.tab.Panel',
	xtype: 'surveillancetabpnl',
    itemId:'surveillancetabpnl',
	margin: 2,
    controller: 'productreportctr',
    defaults: {
        bodyPadding: 1,
        scrollable: true,
    },
    items: [{
    	xtype: 'surveillancetabularrepresentationGrid',
    	title: 'Tabular Representation'
    },{
    	xtype: 'surveillanceGraphicalRepresentationGraph',
    	title: 'Graphical Representation'
    }],
});