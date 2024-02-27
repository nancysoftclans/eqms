Ext.define('Admin.view.frontoffice.importexport.grids.SpreadSheetIEPoeApplicationViewGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   titleCollapse: true,
   width: '100%',
   collapsible: true,
    xtype: 'spreadsheetiepoeapplicationView',
    layout:'fit',
    //store: 'spreadsheetiepoeapplicationstr',
    title: 'POE Details',
     viewConfig: {
            emptyText: 'No information found for the product under creteria'
        },
        listeners: {
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetiepoeapplicationstr',
                    proxy: {
                        url: 'openoffice/getPoeApplicationDetails',
                        
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
        dataIndex: 'port_of_entry',
        name: 'port_of_entry',
        text: 'Port of Entry'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'tra_registration_number',
        name: 'tra_registration_number',
        text: 'Registration No'
    
    },{
        xtype: 'gridcolumn',
        dataIndex: 'clearing_agent',
        name: 'clearing_agent',
        text: 'Clearing Agent'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'inspected_by',
        name: 'inspected_by',
        text: 'Inspected By'
    },{
        xtype: 'datecolumn',
        dataIndex: 'inspected_on',
        name: 'inspected_on',
        format: 'Y-m-d',
        text: 'Inspected On'
    }]


  });