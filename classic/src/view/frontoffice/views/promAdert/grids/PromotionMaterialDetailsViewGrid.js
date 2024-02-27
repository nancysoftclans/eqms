 Ext.define('Admin.view.frontoffice.promadvert.grids.PromotionMaterialDetailsViewGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   width: '100%',
   collapsible: true,
   titleCollapse: true,
    xtype: 'promotionmaterialdetailsview',
   layout: 'fit',
    title: 'Promotion Materials Details',
     viewConfig: {
            emptyText: 'No information found for the product under creteria'
        },
        listeners: {
         beforerender: {
             fn: 'setGridStore',
             config: {
                 pageSize: 100,
                 storeId: 'spreadsheetpromotionmaterialdetailsstr',
                 proxy: {
                     url: 'openoffice/getPromotionMaterialDetails'
                     
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
        dataIndex: 'material',
        name: 'material',
        text: 'Material Name',
        width: 150,
        tbCls: 'wrap'
     },
     {
        xtype: 'gridcolumn',
        dataIndex: 'remarks',
        name: 'remarks',
        text: 'Remarks',
        width: 150,
        tbCls: 'wrap'
       
    }]
});