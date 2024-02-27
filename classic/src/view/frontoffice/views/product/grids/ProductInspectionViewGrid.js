 Ext.define('Admin.view.frontoffice.product.grids.ProductInspectionViewGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   width: '100%',
   collapsible: true,
   titleCollapse: true,
    xtype: 'productinspectionview',
   layout: 'fit',
    title: 'GMP Inspection Details',
     viewConfig: {
            emptyText: 'No information found for the product under creteria'
        },
        listeners: {
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetproductinspectionstr',
                    proxy: {
                        url: 'openoffice/getInspectionInfo'
                        
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
        dataIndex: 'gmp_certificate_no',
        name: 'certificate_no',
        text: 'Certificate no',
        width: 150,
        tbCls: 'wrap'
     },
     {
        xtype: 'gridcolumn',
        dataIndex: 'manufacturer_name',
        name: 'Manufacturer',
        text: 'Manufacturer',
        width: 150,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'physical_address',
        name: 'physical_address',
        text: 'physical address',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'postal_address',
        name: 'postal_address',
        text: 'postal address',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'email_address',
        name: 'email_address',
        text: 'email address',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'gmp_product_line',
        name: 'ProductLine',
        text: 'Product Line',
        width: 150,
        tbCls: 'wrap'
    }
    ]


  });