Ext.define('Admin.view.reports.appsreports.importexportreport.grid.ImportExportTabularRepresentationGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'productreportctr',
    xtype: 'importexporttabularrepresentationgrid',
    itemId:'importexporttabularrepresentationgrid',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    export_title:'Import & Export Summary',
    viewConfig: {
    deferEmptyText: false,
        emptyText: 'Nothing to display'
    },

   
              listeners: {
                    beforerender: {
                        fn: 'setConfigGridsStore',
                        config: {
                            pageSize: 1000,
                            groupField: 'SubModule',
                            storeId: 'importtabularrepresentationgridstr',
                            proxy: {
                                url: 'newreports/getImportExportSummaryReport',
                                extraParams: {
                                        module_id: 4
                                    }
                            }
                        },
                        isLoad: false
                      }
                   },
            plugins: [{
                    ptype: 'gridexporter'
                }
                ],
            features: [{
                 startCollapsed: true,
                 ftype: 'groupingsummary'
            }],
    columns: [{
                text: 'Permit Type',
                sortable: false,
                flex: 1,
                tdCls:'wrap-text',
                dataIndex: 'Permit_name',
                summaryRenderer: function(){
                        return '<b>Grand Total:</b>';
                    }
            },
            
            {
                text: 'Brought Forward',
                flex: 1,
                dataIndex: 'brought_forward',
                        summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },

            }, {
                text: 'Received Applications',
                flex: 1,
                dataIndex: 'received_applications',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },{
                text: 'Total',
                flex: 1,
                dataIndex: 'total',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
             {
                text: 'Evaluated',
                flex: 1,
                dataIndex: 'evaluated_applications',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
             {
                text: 'Queried',
                flex: 1,
                dataIndex: 'requested_for_additional_information',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
              {
                text: 'Query Response',
                flex: 1,
                dataIndex: 'query_responses',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
            {
                text: 'Permits Reviewed',
                flex: 1,
                dataIndex: 'permit_reviewed',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
             {
                text: 'Permits Released',
                flex: 1,
                dataIndex: 'permit_release',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
            {
                text: 'Permits Rejected',
                flex: 1,
                dataIndex: 'permit_rejection',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
           
            {
                text: 'Carried Forward',
                flex: 1,
                dataIndex: 'carried_forward',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            }
        ],
          bbar: [ 
         {
                    xtype:'exportbtn',
                    ui: 'soft-blue',
                    text: 'Export',
                    iconCls: 'x-fa fa-file'
           
          },{
                    xtype: 'pagingtoolbar',
                    width: '80%',
                    displayInfo: true,
                    hidden: false,
                    displayMsg: 'Showing {0} - {1} out of {2}',
                    emptyMsg: 'No Records',
                    beforeLoad: function() {
                        var store=this.getStore();
                        var grid=this.up('grid'),
                        filter=Ext.ComponentQuery.query('#importexportreportfiltersfrm')[0]; 
                                   sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),  
                                   from_date = filter.down('datefield[name=from_date]').getValue(),
                                   to_date = filter.down('textfield[name=to_date]').getValue(),
                                   permit_type = filter.down('combo[name=permit_type]').getValue(),  
                                   module_id=filter.down('hiddenfield[name=module_id]').getValue();
   
                              frm = filter.getForm();
                              if (frm.isValid()) {
                             store.getProxy().extraParams = {
                                module_id: module_id,
                                sub_module_id: sub_module_id,
                                permit_type: permit_type,
                                from_date: from_date,
                                to_date: to_date
                        
                            }
                            } else {
                        toastr.error('Please select all Filters first ', 'Failure Response');
                         return false;
                     }
                            
                        },
                      
                    
                }]
    
});
