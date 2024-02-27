Ext.define('Admin.view.frontoffice.enforcement.grids.EnforcementSuspectedOffencesGrid', {
    extend: 'Ext.grid.Panel',  
      scroll: true,
      width: '100%',
      collapsible: true,
      titleCollapse: true,
       xtype: 'enforcementSuspectedOffencesGrid',
      layout: 'fit',
       title: 'Enforcement Suspected Offences Details',
        viewConfig: {
               emptyText: 'No information found  under set creteria'
           },
           listeners: {
               beforerender: {
                   fn: 'setGridStore',
                   config: {
                       pageSize: 100,
                       storeId: 'suspectedOffenceInforstr',
                       proxy: {
                          url: 'openoffice/getSuspectedOffenceDetails',
                           
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
           dataIndex: 'offence_type',
           name: 'offence_type',
           text: 'Offence Type',
           width: 150,
           tbCls: 'wrap'
          
       },{
           xtype: 'gridcolumn',
           dataIndex: 'details',
           name: 'details',
           text: 'Offence details',
           width: 150,
           tbCls: 'wrap'
       },
       {
           xtype: 'gridcolumn',
           dataIndex: 'place',
           name: 'place',
           text: 'Offence Place',
           width: 150,
           tbCls: 'wrap'
       },{
           xtype: 'gridcolumn',
           dataIndex: 'offence_date',
           name: 'offence_date',
           text: 'Offence date',
           width: 150,
           tbCls: 'wrap'
       }
       ]
     });