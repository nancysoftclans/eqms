Ext.define('Admin.view.summaryreport.importexport.panel.HFDConsumptionReportPnl', {
	extend: 'Ext.panel.Panel',
	xtype: 'hfdConsumptionReportPnl',
	margin: 2,
	layout: 'fit',
    controller: 'registrationreportviewctr',
  	items: [{
 		xtype: 'hfdConsumptionReportGrids',
	}]
});