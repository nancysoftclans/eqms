 Ext.define('Admin.view.frontoffice.gmp.grids.GmpManufacturingBlockViewGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   width: '100%',
   collapsible: true,
   titleCollapse: true,
    xtype: 'gmpmanufacturingblockview',
   layout: 'fit',
//    storeId: 'spreadsheetgmpmanblockstr',
    title: 'Product Manufacturing Block Details',
     viewConfig: {
            emptyText: 'No information found for the manufacturing block under this'
        },
        listeners: {
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetgmpmanblockstr',
                    proxy: {
                        url: 'openoffice/getgmpmanblock',
                        
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
        dataIndex: 'name',
        name: 'name',
        text: 'Name',
        width: 150,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'activities',
        name: 'activities',
        text: 'Activity',
        width: 150,
        tbCls: 'wrap'
    }

    
    ]


  });