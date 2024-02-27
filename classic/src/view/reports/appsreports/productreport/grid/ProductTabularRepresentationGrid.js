Ext.define('Admin.view.reports.appsreports.productreport.grid.ProductTabularRepresentationGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'productreportctr',
    xtype: 'producttabularrepresentationgrid',
    itemId:'producttabularrepresentationgrid',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    export_title:'Product Summary',
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
                storeId: 'producttabularrepresentationgridstr',
                proxy: {
                    url: 'newreports/getProductSummaryReport',
                    extraParams: {
                        module_id: 1
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
                text: 'Product Type',
                sortable: false,
                flex: 1,
                tdCls:'wrap-text',
                dataIndex: 'section_name',
                summaryRenderer: function(){
                        return '<b>Grand Total:</b>';
                    }
            },{
                text: 'Product Category',
                sortable: false,
                flex: 1,
                tdCls:'wrap-text',
                dataIndex: 'product_category_name'
            },{
                text: 'Product Classification',
                sortable: false,
                hidden:true,
                flex: 1,
                tdCls:'wrap-text',
                dataIndex: 'product_class_name'
            },{
                text: 'Product Origin',
                sortable: false,
                flex: 1,
                tdCls:'wrap-text',
                dataIndex: 'product_origin'
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
                text: 'Evaluated',
                flex: 1,
                dataIndex: 'evaluated_applications',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
             {
                text: 'LOQs',
                flex: 1,
                dataIndex: 'requested_for_additional_information',
                summaryType: 'sum',
                summaryRenderer: function(value){
                             return(value);
                  },
            },
              {
                text: 'LOQ Responses',
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
                text: 'Not Assessed',
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
                        filter=Ext.ComponentQuery.query('#productreportfiltersfrm')[0],
                        section_id = filter.down('combo[name=section_id]').getValue(), 
                        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),  
                        from_date = filter.down('datefield[name=from_date]').getValue(),
                        to_date = filter.down('textfield[name=to_date]').getValue(),
                       // classification_category = filter.down('combo[name=classification_category]').getValue(),
                        prodclass_category = filter.down('combo[name=prodclass_category]').getValue(), 
                        product_origin_id = filter.down('combo[name=product_origin_id]').getValue(), 
                        user_id = filter.down('combo[name=user_id]').getValue(), 
                        module_id=filter.down('hiddenfield[name=module_id]').getValue();
                     frm = filter.getForm();
                     if (frm.isValid()) {
                    store.getProxy().extraParams = {
                        module_id: module_id,
                        sub_module_id: sub_module_id,
                        section_id: section_id,
                       // classification_category: classification_category,
                        prodclass_category: prodclass_category,
                        product_origin_id: product_origin_id,
                        from_date: from_date,
                        to_date: to_date,
                        user_id: user_id
                        }
                    } else {
                         toastr.error('Please select all Filters first ', 'Failure Response');
                         return false;
                     }
                            
                    },  
                    
                    
                }]
    
});
