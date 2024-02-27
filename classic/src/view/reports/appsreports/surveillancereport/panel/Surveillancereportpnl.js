Ext.define('Admin.view.reports.appsreport.surveillancereport.panel.Surveillancereportpnl', {
    extend: 'Ext.panel.Panel',
     xtype: 'surveillancereportpnl',
     margin: 2,
     layout: 'border',
     controller: 'productreportctr',
     defaults: {
         bodyPadding: 1,
         scrollable: true,
     },
     items: [
      {
             xtype: 'hiddenfield',
             name: 'module_id',
             value: 5
         },
       {
             xtype: 'surveillanceReportFilterFrm',
             region: 'north',
             title: 'Filters',
             collapsible:true,
             collapsed: false
          },
       {
             xtype: 'surveillancetabpnl',
             region: 'center'
         }],
   bbar: [{
         xtype: 'toolbar',
         width: '100%',
         ui: 'footer',
         items: [
         {
             xtype:'button',
             ui: 'soft-blue',
             text: 'Print Summary Report',
             iconCls: 'x-fa fa-print',
             handler: 'printPromotionAdvertisementSummary',
            
             
         },
           {
             xtype:'button',
             ui: 'soft-blue',
             text: 'Export Summary Report',
             iconCls: 'x-fa fa-file',
             handler: 'exportPromotionAdvertisementSummaryReport',
             xFileName: 'Promotion & Advertisement SummaryReport'
            
         },
         '->',
         {
             xtype: 'combo',
             fieldLabel: 'Process',
             labelAlign : 'left',
             forceSelection: true,
             queryMode: 'local',
             valueField: 'id',
             displayField: 'name',
             margin: '0 ,0 ,0 ,0',
             name: 'classification_process',
             itemId:'classification_process',
             allowBlank: false,
             fieldStyle: {
                 'color': 'green',
                 'font-weight': 'bold'
             },
             listeners: {
                 beforerender: {
                     fn: 'setOrgConfigCombosStore',
                    config: {
                         pageSize: 100,
                         proxy: {
                         url: 'configurations/getConfigParamFromTable',
                         extraParams: {
                            table_name: 'par_summaryreport_statuses',
                           //  table_name: 'par_process_classifications',
                            // filters: JSON.stringify({'module_id':5})
                         }
                        }
                     },
                     isLoad: true
                 },
                 beforequery: function() {
                                 var store=this.getStore();
                             
                                 },
                                 
                 afterrender: 'pickFirstEntryOnCombo',
                // change: 'func_toggleExportBtn'
             }
         },
         {
             xtype:'button',
             ui: 'soft-blue',
             text: 'Preview & Export Detailed Report',
             handler: 'expSurveillanceWinShow',
             childXtype: 'detailedSurveillanceReportFrm',
             winTitle: 'Export Detailed Report',
             name: 'DetailedExport',
             module: 'surveillanceWin',
             winWidth: '70%',
             xFileName: 'surveillanceDetailedReport',
             xPrintFunc: 'surveillanceDetailedReportPreview',
             xspreadsheet: 'detailedSurveillanceViewGrid',
             xvisibleColumns: 'detailedSurveillanceColumnsFrm',
             xheading:'Surveillance Report Application Detailed Report'    
         }
       ]
      }
     ],
 
  });