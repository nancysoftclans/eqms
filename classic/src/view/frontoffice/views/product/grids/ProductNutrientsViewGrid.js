 Ext.define('Admin.view.frontoffice.product.grids.ProductNutrientsViewGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   collapsible: true,
   titleCollapse: true,
   width: '100%',
    xtype: 'productnutrientsview',
   layout: 'fit',
    title: 'Product Nutrients Details',
      viewConfig: {
            emptyText: 'No information found for the product under creteria'
        },
        listeners: {
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetproductnutrientsstr',
                    proxy: {
                        url: 'openoffice/getProductNutrients',
                        
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
        dataIndex: 'Nutrients',
        name: 'Nutrients',
        text: 'Nutrients',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'Category',
        name: 'Category',
        text: 'Category',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'proportion',
        name: 'proportion',
        text: 'proportion',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'siUnit',
        name: 'siUnit',
        text: 'siUnit',
        width: 150,
        tbCls: 'wrap'
    }]


  });