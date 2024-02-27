Ext.define('Admin.view.frontoffice.adr.grids.AdrDrugInfoGrid', {
    extend: 'Ext.grid.Panel',  
      scroll: true,
      width: '100%',
      collapsible: true,
      titleCollapse: true,
       xtype: 'adrDrugInfogrid',
      layout: 'fit',
       title: 'ADR suspected drug information',
        viewConfig: {
               emptyText: 'No information found  under set creteria'
           },
           listeners: {
               beforerender: {
                   fn: 'setGridStore',
                   config: {
                       pageSize: 100,
                       storeId: 'spreadsheetadrsuspecteddruginfostr',
                       proxy: {
                          url: 'openoffice/getAdrSuspectedDrugInfo',
                           
                       }
                   },
                   isLoad: true
               },
           
           },
           bbar: [{
               xtype: 'pagingtoolbar',
               width: '100%',
               displayInfo: true,
               hidden:true,
               displayMsg: 'Showing {0} - {1} of {2} total records',
               emptyMsg: 'No Records',
           }],
       columns: [{
           xtype: 'gridcolumn',
           dataIndex: 'brand_name',
           name: 'brand_name',
           text: 'Brand Name',
           width: 150,
           tbCls: 'wrap'
          
       },{
           xtype: 'gridcolumn',
           dataIndex: 'manufacturer_name',
           name: 'manufacturer_name',
           text: 'Manufacturer Name',
           width: 150,
           tbCls: 'wrap'
       },{
        xtype: 'gridcolumn',
        dataIndex: 'batch_no',
        name: 'batch_no',
        text: 'Batch no',
        width: 150,
        tbCls: 'wrap'
       },{
           xtype: 'gridcolumn',
           dataIndex: 'expiry_date',
           name: 'expiry_date',
           text: 'Expiry date',
           width: 150,
           tbCls: 'wrap'
       },{
           xtype: 'gridcolumn',
           dataIndex: 'start_date',
           name: 'start_date',
           text: 'Start Date',
           width: 150,
           tbCls: 'wrap'
       },{
           xtype: 'gridcolumn',
           dataIndex: 'end_date',
           name: 'end_date',
           text: 'End Date',
           width: 150,
           tbCls: 'wrap'
       },{
        xtype: 'gridcolumn',
        dataIndex: 'use_reasons',
        name: 'use_reasons',
        text: 'Use reasons',
        width: 150,
        tbCls: 'wrap'
    }
       ]
   
   
     });