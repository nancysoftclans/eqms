Ext.define('Admin.view.summaryreport.premise.panel.PremiseInspectionReportPnl', {
	extend: 'Ext.panel.Panel',
	xtype: 'premiseInspection_zonal_report',
	margin: 2,
	layout: 'border',
    controller: 'registrationreportviewctr',
    defaults: {
        bodyPadding: '0 10 0 10',
        scrollable: true
        },
  	items: [{
			xtype: 'premiseInspectionReportFiltersFrm',
			title: 'Premise Inspection Report',
			region: 'north',
			margin: 2,
			collapsible:true,
					collapsed: true
		},{
				xtype:'tabpanel',
				title:'Premises Inspections Report',
				items:[{
					xtype: 'inspectionbusinesstypesGrid',
					title: 'Premise Inspection Summary Report',
					region: 'center'
				},{
					xtype: 'premiseInspectionReportGrid',
					title: 'Premise Inspection Detailed Report',
					region: 'center'
				}]
		}]
});