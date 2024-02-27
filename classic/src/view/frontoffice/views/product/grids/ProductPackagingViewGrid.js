 Ext.define('Admin.view.frontoffice.product.grids.ProductPackagingViewGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   collapsible: true,
   titleCollapse: true,
   width: '100%',
    xtype: 'productpackagingview',
    layout: 'fit',
    title: 'Product Packaging Details',
      viewConfig: {
            emptyText: 'No information found for the product under creteria'
        },
        listeners: {
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetproductpackagingstr',
                    proxy: {
                        url: 'openoffice/getProductPackaging'
                        
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
        dataIndex: 'Type',
        name: 'Type',
        text: 'Type'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'Container',
        name: 'Container',
        text: 'Container',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'ContainerMaterial',
        name: 'ContainerMaterial',
        text: 'ContainerMaterial',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'ClosureMaterial',
        name: 'ClosureMaterial',
        text: 'ClosureMaterial',
        width: 150,
        tbCls: 'wrap'
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'SealType',
        name: 'SealType',
        text: 'SealType',
        width: 150,
        tbCls: 'wrap'
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'PackagingUnits',
        name: 'PackagingUnits',
        text: 'PackagingUnits',
        width: 150,
        tbCls: 'wrap'
    }
    ]


  });