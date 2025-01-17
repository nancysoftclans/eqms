Ext.define('Admin.view.issuemanagement.views.grids.IssueStatusGrpLoggrid', {
  extend: 'Ext.grid.Panel',
  xtype: 'issuestatusgrploggrid',
  itemId: 'issuestatusgrploggrid',
  controller: 'issuemanagementvctr',
  //title: 'Activity',
  //layout: 'card',
  //collapsible: true,
  //collapseDirection: 'right',
  //collapsed: true, 
  //width: 200,
  //margin: '0 5 0 0',
  //selType: 'cellmodel',


  // plugins: [{
  //     ptype: 'cellediting',
  //     clicksToEdit: 1
  // }],
  height: 600,

  tbar: [
      {
          xtype: 'textfield',
          name: 'id',
          hidden: true
      }
  ],

  features: [{
      ftype: 'searching',
      minChars: 2,
      mode: 'local'
  }],

  viewConfig: {
      deferEmptyText: false,
      emptyText: 'No logs to display'
  },

  // tbar: [ {
  //     xtype: "tbspacer",
  //     width: 100,
  // }],

  listeners: {
      beforerender: {
          fn: 'setGridStore',
          config: {
              storeId:'issuetypelogstore',
              proxy: {
                  api: {
                      read: 'issuemanagement/getIssueStatusGroupsLogs'
                  },
                  
              },
          },
          isLoad: true
      }
  },

  bbar: [{
      xtype: 'pagingtoolbar',
      displayInfo: false,
      displayMsg: 'Showing {0} - {1} of {2} total records',
      emptyMsg: 'No Records',
      beforeLoad: function() {
          var store = this.store,
              grid = this.up('grid');

          var mainTabPnl = Ext.ComponentQuery.query('#contentPanel')[0], // Get the main panel
              containerPnl = mainTabPnl.getActiveTab();

          //  process_id = containerPnl.down('hiddenfield[name=process_id]').getValue(),
          //     moduleId = containerPnl.down('hiddenfield[name=module_id]').getValue(),
          //     submodule_id = containerPnl.down('hiddenfield[name=sub_module_id]').getValue(),
              //applicationCode = containerPnl.down('hiddenfield[name=active_application_code]').getValue();
              id = grid.down('textfield[name=id]').getValue(),
          store.getProxy().extraParams = {
              table_name: 'eqms_issue_status_groups_logs',
              //application_code: applicationCode,
              ref_id : id
          };
      }
  }],

  columns: [
  //     {
  //     xtype: 'gridcolumn',
  //     dataIndex: 'id',
  //     text: 'Log ID',
  //     flex: 1,
  //     sortable: true
  // }, {
  //     xtype: 'gridcolumn',
  //     dataIndex: 'user_id',
  //     text: 'User ID',
  //     flex: 1,
  //     sortable: true
  // },
  {
      xtype: 'gridcolumn',
      dataIndex: 'user_name',
      text: 'User',
      flex: 1,
      sortable: true
  },
      {xtype: 'gridcolumn',
      dataIndex: 'title',
      text: 'Title',
      flex: 1,
      sortable: true
  }, 
  {
      xtype: 'gridcolumn',
      dataIndex: 'action',
      text: 'Action',
      flex: 1,
      sortable: true
  }, {
      xtype: 'gridcolumn',
      dataIndex: 'created_on',
      text: 'Created On',
      flex: 1,
      xtype: 'datecolumn',
      format: 'Y-m-d H:i:s'
  }]
});
