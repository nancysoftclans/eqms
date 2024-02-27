 Ext.define('Admin.view.frontoffice.gmp.grids.GmpFacilityLocationViewGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   collapsible: true,
   titleCollapse: true,
   width: '100%',
    xtype: 'gmpfacilitylocationview',
   layout: 'fit',
   storeId: 'spreadsheetfacilitylocationstr',
    title: 'Facility Location',
      viewConfig: {
            emptyText: 'No Locations'
        },
        listeners: {
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetfacilitylocationstr',
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                      extraParams:{
                        table_name:'par_gmplocation_details'
                      }  
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
        dataIndex: 'id',
        name: 'id',
        hidden: true
    },{
        xtype: 'gridcolumn',
        dataIndex: 'name',
        name: 'name',
       flex: 1
    }],
     listeners:{
        select: 'loadGmpFacilityLocation'
     }


  });