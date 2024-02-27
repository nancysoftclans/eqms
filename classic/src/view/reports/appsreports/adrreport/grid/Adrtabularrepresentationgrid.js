Ext.define('Admin.view.reports.appsreports.adrreport.grid.Adrtabularrepresentationgrid', {
    extend: 'Ext.grid.Panel',
    controller: 'productreportctr',
    xtype: 'adrtabularrepresentationgrid',
    itemId:'adrtabularrepresentationgrid',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    export_title:'ADR report Summary',
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
                storeId: 'adrtabularrepresentationgridstr',
                proxy: {
                    url: 'newreports/getAdrSummaryReport',
                    extraParams: {
                        module_id: 14
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
                text: 'ADR Type',
                sortable: false,
                flex: 1,
                tdCls:'wrap-text',
                dataIndex: 'adr_type',
                summaryRenderer: function(){
                        return '<b>Grand Total:</b>';
                    }
            },{
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
            }, {
                text: 'Exported',
                flex: 1,
                dataIndex: 'total_exported',
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
                text: 'Reporter Notified',
                flex: 1,
                dataIndex: 'total_reporter_notified',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
            {
                text: 'Published',
                flex: 1,
                dataIndex: 'total_published',
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
                        filter=Ext.ComponentQuery.query('#adrReportFilterFrm')[0];   
                        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
                        adr_type_id = filter.down('combo[name=adr_type_id]').getValue(),  
                        from_date = filter.down('datefield[name=from_date]').getValue(),
                        to_date = filter.down('textfield[name=to_date]').getValue(),
                        module_id=filter.down('hiddenfield[name=module_id]').getValue();

                    // var grid=this.up('grid'),
                    //  panel=grid.up('panel'),
                    //  filter=panel.down('form'),
                     frm = filter.getForm();
                     if (frm.isValid()) {
                    store.getProxy().extraParams = {
                        module_id: module_id,
                        sub_module_id: sub_module_id,
                        adr_type_id: adr_type_id,
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
