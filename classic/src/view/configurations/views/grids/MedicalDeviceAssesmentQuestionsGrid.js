Ext.define('Admin.view.configurations.views.grids.MedicalDeviceAssesmentQuestionsGrid', {

    extend: 'Ext.grid.Panel',
    xtype : 'medicaldeviceassesmentquestionsgrd',
    controller: 'configurationsvctr',
   
    autoScroll: true,
    autoHeight: true,
    
    margin: 5,
    width: '100%',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
       
    },
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 1000,
                storeId: 'medical_device_assesment_questions_Str',
                proxy: {
                    url: 'configurations/getConfigParamFromTable',
                    extraParams:{
                        table_name: 'par_medical_device_assesment_questions'
                    }
                }
            },
            isLoad: true
        }
    },
   
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records'
    }],

    tbar : [{

        xtype : 'button',
        text : 'Upload Questions From Excel Sheets',
        ui : 'blue',
        handler : 'doUploadQuestionsFromExcelSheets',
    }],
    columns:[

        {
            xtype: 'gridcolumn',
            text : 'Questions',
            dataIndex : 'question',
            tbCls: 'wrap',
            tdCls: 'wrap',
            flex: 3,
            
        },
        
    ]

    

  
    
});