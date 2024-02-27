Ext.define('Admin.view.frontoffice.premise.grids.SpreadSheetPremiseTypesGrid', {
    extend: 'Ext.grid.Panel',  
    scroll: true,
    titleCollapse: true,
    width: '100%',
    xtype: 'spreadsheetpremisetypes',
    reference: 'spreadsheetpremisetypes',
    layout: 'fit',
    title: 'Select Facility Types',
    columns: [
    {
        xtype: 'gridcolumn',
        dataIndex: 'name',
        name: 'name',
        flex:1
    }],
     listeners: {
        select: 'loadApplicationColumns',
        beforerender: {
            fn: 'setWorkflowCombosStore',
            config: {
                pageSize: 10000,
                storeId: 'premises_typesstr',
                proxy: {
                    url: 'configurations/getNonrefParameter',
                    extraParams: {
                        table_name: 'par_premises_types',
                        has_filter: 0
                    }
                }
            },
            isLoad: true
        },
        // beforequery: function() {
        //     var store=this.getStore();
        //     var all={name: 'All',id:0};
        //       store.insert(0, all);
        // }
    }
});