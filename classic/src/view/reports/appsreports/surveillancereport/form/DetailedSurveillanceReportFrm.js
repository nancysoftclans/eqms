Ext.define('Admin.view.reports.appsreport.surveillancereport.form.DetailedSurveillanceReportFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'detailedSurveillanceReportFrm',
    margin: 2,
    height: 500,
    layout: 'fit',
    referenceHolder: true,
    reference: 'ReportDetailedExportWin',
    controller: 'productreportctr',
    layout: 'border',
    items: [{
    		xtype: 'textfield',
    		name: 'section_id',
    		hidden: true
    	},{
            xtype: 'textfield',
            name: 'module_name',
            value: 'surveillance',
            hidden: true
        },{
            xtype: 'textfield',
            name: 'process_class',
            hidden: true
        },{
    		xtype: 'textfield',
    		name: 'xstore',
    		hidden: true
    	},{
    		xtype: 'textfield',
    		name: 'sub_module_id',
    		hidden: true
    	},{
    		xtype: 'textfield',
    		name: 'category',
    		hidden: true
    	},{
    		xtype: 'datefield',
    		format: 'Y-m-d',
    		name: 'to_date',
    		hidden: true
    	},{
    		xtype: 'datefield',
    		format: 'Y-m-d',
    		name: 'from_date',
    		hidden: true
    	},{
            xtype: 'textfield',
            name: 'grid',
            hidden: true
        },{
            xtype: 'textfield',
            name: 'program_id',
            hidden: true
        },{
            xtype: 'textfield',
            name: 'action_url',
            value: 'SurveillanceDetailedReportPreview',
            hidden: true
        },{
            xtype: 'textfield',
            name: 'zone_id',
            hidden: true
        }
    	],
     dockedItems: [{
     	xtype: 'toolbar',
        width: '100%',
        ui: 'footer',
        dock: 'bottom',
        items: [
	        '->',
	        {
	        	
		       text: 'Export Detailed Report',
		       ui: 'soft-purple',
		       name: 'detailed',
               module: 'Surveillance',
		       iconCls: 'x-fa fa-cloud-upload', 
		       handler: 'func_exportClinicalTrialDetailedReport',
		       xFileName: 'Surveillance Detailed Report'
	        }
           ]
     }],
     listeners: {
     	afterRender: 'fun_loadExportClinicalTrialWinStoreReload'
     }

    });