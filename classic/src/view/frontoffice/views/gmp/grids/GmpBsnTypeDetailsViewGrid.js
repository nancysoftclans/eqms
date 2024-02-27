 Ext.define('Admin.view.frontoffice.gmp.grids.GmpBsnTypeDetailsViewGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   width: '100%',
   collapsible: true,
   titleCollapse: true,
    xtype: 'gmpbsntypedetailsview',
   layout: 'fit',
   storeId: 'spreadsheetgmpbsntypedetailsstr',
    title: 'Business Type Details',
     viewConfig: {
            emptyText: 'No information found for the Business Type'
        },
        listeners: {
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetgmpbsntypedetailsstr',
                    url: 'openoffice/getGmpBsnDetails',
                    proxy: {
                        url: 'openoffice/getGmpManSite',
                        
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
        dataIndex: 'BsnType',
        name: 'BsnType',
        text: 'Business Type',
        width: 150,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'details',
        name: 'details',
        text: 'Details',
        width: 150,
        tbCls: 'wrap'
    }

    
    ]


  });