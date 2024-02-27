Ext.define('Admin.view.Migrations.views.grids.ResponseToHumaMedicinesGrid',{
    extend: 'Ext.grid.Panel',
    xtype: 'responsetohumamedicinesscreeninggrd',
    itemId : 'responsetohumamedicinesscreeninggrd',
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
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 100,
                remoteFilter: true,
                proxy: {
                    //url: 'productregistration/gethmscreeningregister',
                    url : 'migrations/getresponsetohmscreeningregister'
                }
            },
            isLoad: true
        },
    },

    plugins: [
        {
            ptype: 'gridexporter'
        }, 
        {
            ptype: 'cellediting',
            clicksToEdit: 1,
            editing: true
        },
        {
            ptype: 'filterfield'
        }
        ],
    tbar : [{
        xtype : 'button',
        ui : 'blue',
        text : 'save updated details',
        handler : 'savedirtydataforresponsetohumanmedicinesscreening',
        

        
    },{
        xtype : 'button', bind : {
            disabled : '{isReadOnly}'
        },
        text : 'import records from excel',
        iconCls: 'x-fa fa-upload',
        action : 'add',
        ui : 'blue',
       
        childXtype : 'uploadresponsehumanmedicinesscreeningfilefrm',
        winWidth: '40%',
        winTitle : 'Import Data From Excel Sheet',
        // handler : 'upload excel file ',
        handler : 'uploadexcelspreadsheetformforresponsetohumanmedsscreening',
      
       
       
    }],
    columns:[
        {
            xtype: 'gridcolumn',
            dataIndex : 'id',
            editor : false,
            hidden : true,
            //ptype: 'cellediting',
            text : 'id',
            width: '10%',
            
        
        
        },
        {
        xtype: 'gridcolumn',
        dataIndex : 'screening_no',
        editor : true,
        //ptype: 'cellediting',
        text : 'Screening_number',
        editor: {
            xtype: 'textarea'
        },
        filter: {
            xtype: 'textfield',
            // name : 'screening_no_query',
            // handler: 'filerbyscreeningno'
        }
    
    
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'rmu_reference',
            text  : 'RMU Reference',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'date_received',
            text  : 'Date Received',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
       
        {
            xtype : 'gridcolumn',
            dataIndex : 'comments',
            text : 'Comments',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        
       
      
      
        {
            xtype : 'gridcolumn',
            dataIndex : 'correspondence',
            text  : 'Correspondence',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'time_to_allocation',
            text  : 'Time to Allocation',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'total_screening_days',
            text  : 'Total Screening Days',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        // {
        //     xtype : 'gridcolumn',
        //     dataIndex : 'Deposit Date',
        //     text  : 'deposit_date',
        //     editor: {
        //         xtype: 'textarea'
        //     },
        //     filter: {
        //         xtype: 'textfield'
        //     }
        // },
        {
            xtype : 'gridcolumn',
            dataIndex : 'letter_ref',
            text  : 'letter_ref',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'date_dispatched_and_acknowledged',
            text  : 'Date Dispatched and Allocated',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'results',
            text  : 'Result',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'assesment_pathway',
            text  : 'Assesment Pathway',
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
});