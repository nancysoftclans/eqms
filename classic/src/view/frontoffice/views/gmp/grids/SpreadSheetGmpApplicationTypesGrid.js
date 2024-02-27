Ext.define('Admin.view.frontoffice.gmp.grids.SpreadSheetGmpApplicationTypesGrid', {
    extend: 'Ext.grid.Panel',  
    scroll: true,
    titleCollapse: true,
    width: '100%',
    xtype: 'spreadsheetgmpapplicationtypes',
    layout: 'fit',
    storeId: 'spreadsheetapplicationtypesstr',
    title: 'Select Gmp Application Sections',
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 100,
                storeId: 'spreadsheetapplicationtypesstr',
                proxy: {
                    url: 'configurations/getConfigParamFromTable',
                    extraParams: {
                        table_name: 'par_gmplicensetypes_details',
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
        dataIndex: 'section_id',
        name: 'id',
        hidden: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'name',
        name: 'name',
        flex:1
    }],
     listeners:{
        select: 'loadApplicationColumns'
     }
});