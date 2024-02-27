 Ext.define('Admin.view.frontoffice.product.grids.ProductIngridientsViewGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   titleCollapse: true,
   width: '100%',
   collapsible: true,
    xtype: 'productingridientsview',
    layout:'fit',
    title: 'Product Ingredient Details',
     viewConfig: {
            emptyText: 'No information found for the product under creteria'
        },
        listeners: {
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetproductingridientsstr',
                    proxy: {
                        url: 'openoffice/getProductIngredients'
                        
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
        dataIndex: 'Ingredient',
        name: 'Ingredient',
        text: 'Ingredient',
        width: 150,
        tbCls: 'wrap'
        
    },{
        xtype: 'gridcolumn',
        dataIndex: 'IngredientType',
        name: 'IngredientType',
        text: 'IngredientType',
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
        dataIndex: 'InclutionReason',
        name: 'InclutionReason',
        text: 'InclutionReason',
        width: 150,
        tbCls: 'wrap'
    }]


  });