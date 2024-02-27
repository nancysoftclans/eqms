Ext.define('Admin.view.summaryreport.controlleddocumentsrpt.panel.ControlledDocumentsSummaryReport', {
	extend: 'Ext.panel.Panel',
	xtype: 'controlleddocumentssummaryreport',
	margin: 2,
	layout: 'border',
    controller: 'registrationreportviewctr',
    defaults: {
        bodyPadding: '0 10 0 10',
        scrollable: true
        },
  	items: [{
 		xtype: 'controlleddocumentssummaryfrm',
 		title: 'Controlled Documents Type Report Filters',
 		region: 'north',
 	
 		collapsible:true,
        collapsed: false
 	},{
 		xtype: 'controlleddocumentssummarygrid',
 		title: 'Controlled Documents Type Summary',
 		region: 'center'
	}]
});