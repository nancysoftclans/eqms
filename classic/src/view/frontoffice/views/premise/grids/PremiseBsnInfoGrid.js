 Ext.define('Admin.view.frontoffice.premise.grids.PremiseBsnInfoGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   width: '100%',
   collapsible: true,
   titleCollapse: true,
    xtype: 'premisebsninfo',
    layout:{
        type:'fit',
        align:'stretch',
        pack:'start'
      },
   // store: 'spreadsheetpremisebsninfostr',
    title: 'Facility Business Details',
     viewConfig: {
            emptyText: 'No information found for the facility under set creteria'
        },
        listeners: {
          beforerender: {
              fn: 'setGridStore',
              config: {
                  pageSize: 100,
                  storeId: 'spreadsheetpremisebsninfostr',
                  proxy: {
                    url: 'openoffice/getPremisebsnInfo',
                      
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
        text: 'Business Type',
        flex: 1
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'details',
        name: 'details',
        text: 'Details',
        flex: 1
    }
    ]
  });