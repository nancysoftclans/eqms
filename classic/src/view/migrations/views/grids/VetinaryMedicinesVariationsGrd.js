Ext.define('Admin.view.migrations.views.grids.VetinaryMedicinesVariationsGrd.js',{


    extend: 'Ext.grid.Panel',
    xtype: 'vetinarymedicinesvariationsgrd',
    itemId : 'vetinarymedicinesvariationsgrd',
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
                    //url: 'productregistration/gethmscreeningregister',
                   // url : 'migrations/gethmscreeningregister'

                    url : 'migrations/getvetinarymedicinesvariationsregister'
                }
            },
            isLoad: true
        },
    },
    plugins: [{
        ptype: 'gridexporter'
    }, {
        ptype: 'cellediting',
        clicksToEdit: 1,
        editing: true
    },{
        ptype: 'filterfield'
    }],
    tbar : [
        {
            xtype : 'button',
            ui : 'blue',
            text : 'save updated details',
            handler : 'savedirtydataforvetinarymedicinesvariations',
        
        },
        {
            xtype : 'button', bind : {
                disabled : '{isReadOnly}'
            },
            text : 'import records from excel',
            iconCls: 'x-fa fa-upload',
            action : 'add',
            ui : 'blue',
           
            childXtype : 'uploadfilefrm',
            winWidth: '40%',
            winTitle : 'Import Data From Excel Sheet',
            // handler : 'upload excel file ',
            handler : 'uploadexcelspreadsheetform',
          
           
           
        }
    ],
    columns:[
        {
            xtype: 'gridcolumn',
            dataIndex : 'id',
            editor : true,
            //ptype: 'cellediting',
            hidden : true,
            


        },
        {
        xtype: 'gridcolumn',
        dataIndex : 'Variation #',
        editor : true,
        //ptype: 'cellediting',
        text : 'Variation #',
        editor: {
            xtype: 'textarea'
        },
        filter: {
            xtype: 'textfield'
        }


        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Bot #',
            text  : 'Bot #',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Date Received',
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
            dataIndex : 'Date Logged',
            text : 'Date Logged',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Fee Paid',
            text : 'Fee Paid',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
            
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Sales Quote',
            text : 'Sales Quote',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
            
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Rep Name',
            text  : 'Rep Name',
            editor: {
            xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
            
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Generic Name',
            text  : 'Generic Name',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Trade Namw',
            text  : 'Trade Name',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Applicant',
            text  : 'Product Name',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        
        {
            xtype : 'gridcolumn',
            dataIndex : 'Manufacturer',
            text  : 'Manufacturer',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        
        
        {
            xtype : 'gridcolumn',
            dataIndex : 'Type of variation',
            text  : 'Type of Variation',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }

        },
       
        
        {
            xtype : 'gridcolumn',
            dataIndex : 'Logged by',
            text  : 'Logged by',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        
        {
            xtype : 'gridcolumn',
            dataIndex : 'Comments',
            text  : 'Comments',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Assesor',
            text  : 'Assessor',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Allocation Date',
            text  : 'Allocation Date',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Depostit Date',
            text  : 'Deposit Date',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
       
        {
            xtype : 'gridcolumn',
            dataIndex : 'Letter Ref',
            text  : 'Letter Ref',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Date Dispatched and Acknowledged (Email)',
            text  : 'Date Dispatched and Acknowledged (Email)',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Status',
            text  : 'Status',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Status Date',
            text  : 'Status Date',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Date QI LOQ sent',
            text  : 'Date QI LOQ sent',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Date Q2 LOQ sent',
            text  : 'Date Q2 LOQ sent',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Allocation Date',
            text  : 'Allocation Date',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Deadline',
            text  : 'Deadline',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'TAT',
            text  : 'TAT',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        
      
        
        {
        xtype : 'gridcolumn',
        dataIndex : 'Rep dataIndex',
        text  : 'Rep dataIndex',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        
        },
        
        {
            xtype : 'gridcolumn',
            dataIndex : 'Time to allocation (Days)',
            text  : 'Time to allocation (Days)',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Total Screening',
            text  : 'Total Screening',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
       
       
      
        {
            xtype : 'gridcolumn',
            dataIndex : 'Result',
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
            dataIndex : 'Date Received',
            text  : 'Date Received',
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