Ext.define("Admin.view.issuemanagement.views.grids.IssueManagementGrid", {
  extend: "Ext.grid.Panel",
  controller: "issuemanagementvctr",
  xtype: "issuemanagementgrid",
  itemId: "issuemanagementgrid",
  cls: "dashboard-todo-list",
  autoScroll: true,
  autoHeight: true,
  width: "100%",
  viewConfig: {
    deferEmptyText: false,
    emptyText: "Nothing to display",
    getRowClass: function (record, rowIndex, rowParams, store) {
      var is_enabled = record.get("is_enabled");
      if (is_enabled == 0 || is_enabled === 0) {
        return "invalid-row";
      }
    },
  },
  tbar: [
    {
      xtype: "exportbtn",
    },
    {
      xtype: "tbspacer",
      width: 50,
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Issue Type",
      labelWidth: 80,
      width: 320,
      valueField: "id",
      displayField: "name",
      forceSelection: true,
      name: "issue_type_id",
      queryMode: "local",
      fieldStyle: {
        color: "green",
        "font-weight": "bold",
      },
      listeners: {
        beforerender: {
          fn: "setCompStore",
          config: {
            pageSize: 1000,
            proxy: {
              extraParams: {
                table_name: "par_issue_types",
              },
            },
          },
          isLoad: true,
        },
        change: "reloadParentGridOnChange",
      },
      triggers: {
        clear: {
          type: "clear",
          hideWhenEmpty: true,
          hideWhenMouseOut: false,
          clearOnEscape: true,
        },
      },
    },
  ],
  plugins: [
    {
      ptype: "gridexporter",
    },
  ],
  listeners: {
    beforerender: {
      fn: "setGridStore",
      config: {
        pageSize: 1000,
        autoLoad: false,
        defaultRootId: "root",
        enablePaging: true,
        storeId: "issuemanagementstr",
        grouper: {
          groupFn: function (item) {
            return item.get("process_id") + item.get("workflow_stage_id");
          },
        },
        proxy: {
          url: "issuemanagement/getIssueManagementDetails",
        },
      },
      isLoad: true,
    },
    itemdblclick: "onViewIssueManagementApplication",
  },
  features: [
    {
      ftype: "searching",
      minChars: 2,
      mode: "local",
    },
    {
      ftype: "grouping",
      startCollapsed: true,
      groupHeaderTpl:
        'Process: {[values.rows[0].data.process_name]}, Stage: {[values.rows[0].data.workflow_stage]} [{rows.length} {[values.rows.length > 1 ? "Items" : "Item"]}]',
      hideGroupedHeader: true,
      enableGroupingMenu: false,
    },
  ],

  bbar: [
    {
      xtype: "button",
      text: "Back",
      hidden: true,
      ui: "soft-blue",
      iconCls: "x-fa fa-backward",
      handler: "backFromGroupAllDetails",
    },
    {
      xtype: "pagingtoolbar",
      // store: 'systemrolestreestr',
      displayInfo: true,
      displayMsg: "Showing {0} - {1} of {2} total records",
      emptyMsg: "No Records",
      beforeLoad: function () {
        var store = this.store,
          grid = this.up("grid");
        store.getProxy().extraParams = {
          table_name: "tra_issue_management_applications",
        };
      },
    },
    "->",
    {
      xtype: "button",
      text: "Sync Changes",
      hidden: true,
      ui: "soft-blue",
      iconCls: "x-fa fa-save",
      handler: "updateSystemNavigationAccessRoles",
    },
  ],
  columns: [
    {
      xtype: "gridcolumn",
      dataIndex: "reference_no",
      text: "ID",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "raised_date",
      text: "Date Raised",
      flex: 1,
      tdCls: "wrap",
      renderer: Ext.util.Format.dateRenderer('d M Y')
    },
    {
      xtype: "gridcolumn",
      dataIndex: "title",
      text: "Title",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "issue_status",
      text: "Status",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "owner",
      text: "Owner",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "target_resolution_date",
      text: "Target Date",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "target_resolution_date",
      text: "Date Closed",
      flex: 1,
      tdCls: "wrap",
    },
  ],
});