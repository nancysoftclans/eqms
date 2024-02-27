Ext.define('Admin.view.migrations.views.grids.DrugMasterFileGrd', {
    extend: 'Ext.grid.Panel',
    xtype : 'drugmasterfilegrd',
    controller : 'migrationviewctr',
    autoScroll: true,
    autoHeight: true,
    
    margin: 5,
    width: '100%',
    selType: 'cellmodel',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        // getRowClass: function (record, rowIndex, rowParams, store) {
        //     var is_enabled = record.get('is_enabled');
        //     if (is_enabled == 0 || is_enabled === 0) {
        //         return 'invalid-row';
        //     }
        // }
    },
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 100,
                remoteFilter: true,
                proxy: {
                    //url: 'migrations/gethmscreeningregister',
                   // url : 'migrations/getcomplementarymedicinesscreeningregister'
                }
            },
            isLoad: true
        },
    },
    tbar : [{
        xtype : 'button',
        ui : 'blue',
        text : 'save updated details',
        //handler : 'savedirtydata',
        
    },

    {
        xtype : 'button', bind : {
            disabled : '{isReadOnly}'
        },
        text : 'import records from excel',
        iconCls: 'x-fa fa-upload',
        action : 'add',
        ui : 'blue',
       
        
        // handler : 'upload excel file ',
        handler : 'uploadexcelspreadsheetformfordrugs',
      
       
       
    }],
    columns: [
        {
            xtype: 'gridcolumn',
            dataIndex : 'id',
            editor : true,
            //ptype: 'cellediting',
            hidden : true,
            


        },
        {
        xtype: 'gridcolumn',
        dataIndex : 'Date Received',
        editor : true,
        //ptype: 'cellediting',
        text : 'Date Received',
        editor: {
            xtype: 'textarea'
        },
        filter: {
            xtype: 'textfield'
        }


        },
        {
            xtype: 'gridcolumn',
            dataIndex : 'Date Logged',
            editor : true,
            //ptype: 'cellediting',
            text : 'Date Logged',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
    
    
        },
        {
            xtype: 'gridcolumn',
            dataIndex : 'Product Name',
            editor : true,
            //ptype: 'cellediting',
            text : 'Product Name',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
    
    
        },
        {
            xtype: 'gridcolumn',
            dataIndex : 'Applicant',
            editor : true,
            //ptype: 'cellediting',
            text : 'Applicant No',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
    
    
        },
        {
            xtype: 'gridcolumn',
            dataIndex : 'Rmu Reference',
            editor : true,
            //ptype: 'cellediting',
            text : 'Rmu Reference',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
    
    
            },
    ],
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        // store: 'declaredimportexportpermitsstr',//
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        // beforeLoad: function () {
            
        //     this.up('declaredimportexportpermitsdashgrid').fireEvent('refresh', this);

        // }
    }],
    

})