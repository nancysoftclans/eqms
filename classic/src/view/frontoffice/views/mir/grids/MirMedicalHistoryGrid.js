Ext.define('Admin.view.frontoffice.mir.grids.MirMedicalHistoryGrid', {
    extend: 'Ext.grid.Panel',  
      scroll: true,
      width: '100%',
      collapsible: true,
      titleCollapse: true,
       xtype: 'mirMedicalHistoryGrid',
      layout: 'fit',
       title: 'Mir Medical Information History information',
        viewConfig: {
               emptyText: 'No information found  under set creteria'
           },
           listeners: {
               beforerender: {
                   fn: 'setGridStore',
                   config: {
                       pageSize: 100,
                       storeId: 'spreadsheetmirmedicalinforstr',
                       proxy: {
                          url: 'openoffice/getMirMedicalInforHistory',
                           
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
           dataIndex: 'dosage',
           name: 'dosage',
           text: 'Dosage',
           width: 150,
           tbCls: 'wrap'
          
       },{
           xtype: 'gridcolumn',
           dataIndex: 'condition',
           name: 'condition',
           text: 'Condition',
           width: 150,
           tbCls: 'wrap'
       },{
        xtype: 'gridcolumn',
        dataIndex: 'under_medication',
        name: 'under_medication',
        text: 'Is under medication',
        width: 150,
        tbCls: 'wrap'
       },{
           xtype: 'gridcolumn',
           dataIndex: 'start_date',
           name: 'start_date',
           text: 'Start Date',
           width: 150,
           tbCls: 'wrap'
       },{
           xtype: 'gridcolumn',
           dataIndex: 'end_date',
           name: 'end_date',
           text: 'End Date',
           width: 150,
           tbCls: 'wrap'
       }
       ]
     });