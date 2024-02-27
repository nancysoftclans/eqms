Ext.define('Admin.view.migrations.views.grids.MDListingMigratedgrd',{
    extend: 'Ext.grid.Panel',
    xtype: 'mdListingMigratedgrd',
    itemId : 'mdListingMigratedgrd',
    controller : 'migrationviewctr',
    autoScroll: true,
    autoHeight: true,
    
    margin: 5,
    width: '100%',
    selType: 'cellmodel',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
       
    },
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                autoLoad: false,
                pageSize: 100,
                remoteFilter: true,
                proxy: {
                    //url: 'productregistration/gethmscreeningregister',
                    url : 'migrations/getListedDevicesregister'
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
        

        
    },{
        xtype : 'button', bind : {
            disabled : '{isReadOnly}'
        },
        text : 'import records from excel',
        iconCls: 'x-fa fa-upload',
        action : 'add',
        ui : 'blue',
       
        childXtype : 'uploadhumanmedicinesscreeningfilefrm',
        winWidth: '40%',
        winTitle : 'Import Data From Excel Sheet',
        base_url: 'migrations/uploadExcelSheetForMDListing',
        // handler : 'upload excel file ',
        handler : 'uploadexcelspreadsheetform',
      
       
       
    },{
        xtype : 'button',
        ui : 'blue',
        text : 'Truncate tables',
        childXtype : 'truncatetablesFrm',
        winWidth: '40%',
        handler : 'createtruncatetablesform',
        

        
    },
    {
        xtype : 'button',
        ui : 'blue',
        text : 'Transfer data to transactional tables',
        url: 'migrations/transferlistedDevicesdatatotransactionaltables',
        handler : 'transfertotranscationaltables',
        

        
    }

    ],
    columns:[
       
        {
            xtype: 'gridcolumn',
            text : 'Screening_number',
            dataIndex : 'screening_no',
            tbCls: 'wrap',
            tdCls: 'wrap',
            editor : true,
            filter: {
                xtype: 'textfield',
            
            },
            editor: {
                xtype: 'textarea'
        }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'date_received',
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
            dataIndex : 'date_logged_in_rmu',
            text  : 'Date logged in RMU',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }

        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'fee_paid',
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
            dataIndex : 'sales_quote',
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
        dataIndex : 'applicant_name',
        text  : 'Applicant_name',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        
        },
        {
        xtype : 'gridcolumn',
        dataIndex : 'applicant_email',
        text  : 'Applicant Email',
        editor: {
            xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'applicant_physical_address',
            text  : 'Applicant physical address',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'applicant_pacra_reg_no',
            text  : 'Applicant pacra registration no',
            hidden: true,
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'applicant_telephone_no',
            text  : 'Applicant telephone no',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'applicant_postal_address',
            text  : 'Applicant postal Address',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'applicant_fax',
            hidden: true,
            text  : 'Applicant fax',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'applicant_mobile_no',
            hidden: true,
            text  : 'Applicant mobile',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'applicant_identification_no',
            hidden: true,
            text  : 'Applicant identification no',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'applicant_website',
            hidden: true,
            text  : 'Applicant website',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'applicant_country',
            text  : 'Applicant country of residence',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'applicant_region',
            text  : 'Applicant region of residence',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'rep_name',
            text  : 'Representative',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'rep_physical_address',
            text  : 'Representative Physical Address',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'rep_email',
            text  : 'Representative Email',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'rep_phone',
            text  : 'Representative Telephone',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'manufacturer',
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
            dataIndex : 'manufacturer_physical_address',
            text  : 'Manufacturer Physical Address',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'manufacturer_email',
            text  : 'Manufacturer Email Address',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'manufacturer_mobile',
            text  : 'Manufacturer Mobile',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'manufacturer_country',
            text  : 'Manufacturer County',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'manufacturer_region',
            text  : 'Manufacturer Region',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'manufacturer_tin_no',
            text  : 'Manufacturer tin no',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'manufacturer_website',
            hidden: true,
            text  : 'Manufacturer website',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'product_name',
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
            dataIndex : 'common_name',
            text  : 'Approved/Common Name',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'dosage',
            text  : 'Dosage',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'strength',
            text  : 'Product Strength',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'Route_of_admin',
            text  : 'Route of Administration',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'storage_condition',
            text  : 'Storage Condition',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'physical_desc',
            text  : 'physical Description',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'indication',
            text  : 'Indication',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },{
            xtype : 'gridcolumn',
            dataIndex : 'shelf_life',
            text  : 'Shelf Life',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },{
            xtype : 'gridcolumn',
            dataIndex : 'pack_size',
            text  : 'Pack Size',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },{
            xtype : 'gridcolumn',
            dataIndex : 'country_of_origin',
            text  : 'Country Of Origin',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },{
            xtype : 'gridcolumn',
            dataIndex : 'ingredient',
            text  : 'Product Ingredients',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },{
            xtype : 'gridcolumn',
            dataIndex : 'closure_container',
            text  : 'Closure Container',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'submitted_by',
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
            dataIndex : 'logged_by',
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
            dataIndex : 'comments',
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
            dataIndex : 'allocation_date',
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
            dataIndex : 'assesor',
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
            dataIndex : 'total_screening_days',
            text  : 'Total Screening Days',
            editor: {
                xtype: 'textarea'
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'deposit_date',
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
            dataIndex : 'letters_ref',
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
            dataIndex : 'deadline',
            text  : 'Deadline',
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
       
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
       
    }],
    



}); 