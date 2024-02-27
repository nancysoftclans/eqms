Ext.define('Admin.view.reports.appsreports.enforcementreport.grid.Enforcementtabularrepresentationgrid', {
    extend: 'Ext.grid.Panel',
    controller: 'productreportctr',
    xtype: 'enforcementtabularrepresentationgrid',
    itemId:'enforcementtabularrepresentationgrid',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    export_title:'Enforcement report Summary',
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
                storeId: 'enforcementtabularrepresentationgridstr',
                proxy: {
                    url: 'newreports/getEnforcementSummaryReport',
                    extraParams: {
                        module_id: 8
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
            // {
            //     text: 'Screened',
            //     flex: 1,
            //     dataIndex: 'screened_applications',
            //     summaryType: 'sum',
            //     summaryRenderer: function(value){
            //                  return(value);
            //       },
            // },
            {
                text: 'Evaluated',
                flex: 1,
                dataIndex: 'evaluated_applications',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
            //  {
            //     text: 'Request for Additional Information',
            //     flex: 1,
            //     dataIndex: 'requested_for_additional_information',
            //     summaryType: 'sum',
            //     summaryRenderer: function(value){
            //                  return(value);
            //       },
            // },
            //   {
            //     text: 'Response of Request',
            //     flex: 1,
            //     dataIndex: 'query_responses',
            //     summaryType: 'sum',
            //     summaryRenderer: function(value){
            //                  return(value);
            //       },
            // },
            {
                text: 'Approved',
                flex: 1,
                dataIndex: 'approved_applications',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
            {
                text: 'Dropped Reports',
                flex: 1,
                dataIndex: 'rejected_applications',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
           
            {
                text: 'Forward For Investigations',
                flex: 1,
                dataIndex: 'carried_forward',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
            {
                text: 'Closed Cases',
                flex: 1,
                dataIndex: 'closed_cases',
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
           
          },
           {
                xtype: 'pagingtoolbar',
                width: '80%',
                displayInfo: true,
                hidden: false,
                displayMsg: 'Showing {0} - {1} out of {2}',
                emptyMsg: 'No Records',
                beforeLoad: function() {
                    var store=this.getStore();
                    var grid=this.up('grid'),
                        filter=Ext.ComponentQuery.query('#enforcementReportFilterFrm')[0];   
                        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),  
                        from_date = filter.down('datefield[name=from_date]').getValue(),
                        to_date = filter.down('textfield[name=to_date]').getValue(),
                        module_id=filter.down('hiddenfield[name=module_id]').getValue();
                     frm = filter.getForm();
                     if (frm.isValid()) {
                    store.getProxy().extraParams = {
                        module_id: module_id,
                        sub_module_id: sub_module_id,
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
