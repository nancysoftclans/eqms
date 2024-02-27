Ext.define('Admin.view.frontoffice.rmu.grids.RmuResponsesViewGrid', {
    extend: 'Ext.grid.Panel',  
      scroll: true,
      width: '100%',
      collapsible: true,
      titleCollapse: true,
       xtype: 'rmuResponsesViewGrid',
      layout: 'fit',
       title: 'RMU Responses information',
        viewConfig: {
               emptyText: 'No information found  under set creteria'
           },
           listeners: {
               beforerender: {
                   fn: 'setGridStore',
                   config: {
                       pageSize: 100,
                       storeId: 'spreadsheetrmuresponseinforstr',
                       proxy: {
                          url: 'openoffice/getRmuResponsesInfor',
                           
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
           dataIndex: 'response',
           name: 'response',
           text: 'Response',
           width: 150,
           tbCls: 'wrap'
          
       },{
           xtype: 'gridcolumn',
           dataIndex: 'prepared_by',
           name: 'prepared_by',
           text: 'Prepared by',
           width: 150,
           tbCls: 'wrap'
       },{
        xtype: 'gridcolumn',
        dataIndex: 'approved_by',
        name: 'approved_by',
        text: 'Approved by',
        width: 150,
        tbCls: 'wrap'
       },
         {
        xtype: 'gridcolumn',
        dataIndex: 'decision_id',
        name: 'decision_id',
        text: 'Is Approved',
        width: 150,
        tbCls: 'wrap',
        renderer: function (value, metaData) {
            if (value == 1) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "Yes";
            }else if(value == 2){
                metaData.tdStyle = 'color:white;background-color:red';
                return "No";
            }else{
                metaData.tdStyle = 'color:white;background-color:gray';
                return "Pending";
            }         
        }
    },
       {
           xtype: 'gridcolumn',
           dataIndex: 'approval_date',
           name: 'approval_date',
           text: 'Approval date',
           width: 150,
           tbCls: 'wrap'
       },
       ]
     });