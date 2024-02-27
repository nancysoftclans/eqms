Ext.define('Admin.view.reports.appsreports.premisesreport.grid.PremisesTabularRepresentationGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'productreportctr',
    xtype: 'premisestabularrepresentationgrid',
    itemId:'premisestabularrepresentationgrid',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    export_title:'Premise Summary',
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
                            //storeId: 'producttabularrepresentationgridstr',
                            proxy: {
                                url: 'newreports/getPremiseSummaryReport',
                                extraParams: {
                                        module_id: 2
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
                text: 'Premise Type',
                sortable: false,
                flex: 1,
                tdCls:'wrap-text',
                dataIndex: 'Premise_name',
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
            //  {
            //     text: 'Screened',
            //     flex: 1,
            //     dataIndex: 'screened_applications',
            //     summaryType: 'sum',
            //     summaryRenderer: function(value){
            //                  return(value);
            //       },
            // },
            {
                text: 'Inspected',
                flex: 1,
                dataIndex: 'inspected_applications',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
             {
                text: 'Request for Additional Information',
                flex: 1,
                dataIndex: 'requested_for_additional_information',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
              {
                text: 'Response of Request',
                flex: 1,
                dataIndex: 'query_responses',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
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
                text: 'Rejected',
                flex: 1,
                dataIndex: 'rejected_applications',
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
                        filter=Ext.ComponentQuery.query('#premisesreportfiltersfrm')[0]; 
                                   sub_module_id = filter.down('combo[name=sub_module_id]').getValue();
                                   from_date = filter.down('datefield[name=from_date]').getValue(),
                                   to_date = filter.down('textfield[name=to_date]').getValue(),
                                   premise_type = filter.down('combo[name=premise_type]').getValue();  
                                  module_id=filter.down('hiddenfield[name=module_id]').getValue();
                              
                              frm = filter.getForm();
                             if (frm.isValid()) {
                             store.getProxy().extraParams = {
                                module_id: module_id,
                                sub_module_id: sub_module_id,
                                premise_type: premise_type,
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
