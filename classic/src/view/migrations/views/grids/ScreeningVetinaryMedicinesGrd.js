Ext.define('Admin.view.migrations.views.grids.ScreeningVetinaryMedicinesGrd.js',{


    extend: 'Ext.grid.Panel',
    xtype: 'vetinarymedicinesscreeninggrd',
    itemId : 'vetinarymedicinesscreeninggrd',
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
                    //url : 'migrations/gethmscreeningregister'
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
    tbar : [{
        xtype : 'button',
        ui : 'blue',
        text : 'save updated details',
        handler : 'savedirtydata',
        
    }],
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
        dataIndex : 'Screening #',
        editor : true,
        //ptype: 'cellediting',
        text : 'Screening number',
        editor: {
            xtype: 'textarea'
        },
        filter: {
            xtype: 'textfield'
        }


        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Date received',
            text  : 'Date received',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Date logged in RMU',
            text  : 'Date logged un RMU',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }

        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Fees Paid',
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
            text : 'Rep Name',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
            
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Physical Address',
            text  : 'Physical Address',
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
            text  : 'Applicant',
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
            dataIndex : 'Product Name',
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
            dataIndex : 'Submitted By',
            text  : 'Submitted By',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        
        
        {
            xtype : 'gridcolumn',
            dataIndex : 'Logged By',
            text  : 'Logged By',
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
            dataIndex : 'Correspondence',
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
            dataIndex : 'Date Marked',
            text  : 'Date Marked',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
       
        {
            xtype : 'gridcolumn',
            dataIndex : 'Date sent',
            text  : 'Date sent',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Outcome',
            text  : 'OutCome',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Deposit Date',
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
            dataIndex : 'Letter Reference',
            text  : 'Letter Reference',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Letters Dispatched',
            text  : 'Letter Dispatched',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Outcome',
            text  : 'Outcome',
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