Ext.define('Admin.view.configurations.views.grids.TablesGrid', {

    extend: 'Ext.grid.Panel',
    controller: 'configurationsvctr',
    xtype : 'tablesGrid',
    autoScroll : true,
    autoHeight: true,

   

    columns: [
        {
            xtype: 'gridcolumn',
            dataIndex: 'table_name',
            text: 'table name',
            flex: 1,
            // listeners:{

            //     beforerender: {
            //         fn: 'setCompStore',
            //         config: {
            //             pageSize: 1000,
            //             proxy: {
            //                 url: 'configurations/getTableslist',
            //                 extraParams:{
    
            //                     in_db:'mis'
            //                 }
            //             }
            //         },
            //         isLoad: true
            //     }
            // },
            // bind : {
            //     store : [
            //         {
            //             proxy : {
            //                          type : 'rest',
                         
            //                          rootProperty : 'table_name',
                                     
            //                      },
            //                      url : 'migrations/getTableslist',
            //         }
            //     ]
            // }
            // store: [

            //     {
            //      proxy : {
            //          type : 'rest',
         
            //          rootProperty : 'table_name',
                     
            //      },
            //      url : 'configurations/getTableslist',
            //      writer : {
            //          type : 'json',
            //          //dateFormat : 'd/m/Y',
            //          //writeAllFields : true
            //      }
            //     }
            //  ],
            // listeners:{

            //     beforerender: {
            //        // fn: 'setCompStore',
            //         config: {
            //             pageSize: 1000,
            //             proxy: {
            //                 url: 'configurations/getTableslist',
            //                 extraParams:{
    
            //                     in_db:'mis'
            //                 }
            //             }
            //         },
            //         isLoad: true
            //     }
            // },
            
        },
        // {
        //     xtype: 'gridcolumn',
        //     // fieldLabel: 'Select Tables To truncate',
        //     // margin: '0 20 20 0',
        //     itemId: 'value_2-label',
        //     displayField: 'table_name',
        //     valueField: 'table_name',
        //     name:'table_list',
        //    // hidden: true,
        //     queryMode: 'local',
        //     filterPickList: true,
        //     encodeSubmitValue: true,
            
        //     listeners:{

        //         beforerender: {
        //             fn: 'setCompStore',
        //             config: {
        //                 pageSize: 1000,
        //                 proxy: {
        //                     url: 'configurations/getTableslist',
        //                     extraParams:{
    
        //                         in_db:'mis'
        //                     }
        //                 }
        //             },
        //             isLoad: true
        //         }
        //     },
         
        // },
    ],


    tbar: [{
        xtype: 'button',bind: {
            disabled: '{isReadOnly}'
        },
        text: 'truncate selected tables',
        iconCls: 'x-fa fa-times',
        action: 'add',
        ui: 'soft-blue',
        childXtype: 'truncatetablesFrm',
        winTitle: 'Tables',
        winWidth: '40%',
        handler: 'showFormToTruncateOn',
        stores: '[]'
    }, {
        xtype: 'exportbtn'
    }],


});