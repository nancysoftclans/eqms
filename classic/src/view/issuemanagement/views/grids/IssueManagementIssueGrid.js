Ext.define("Admin.view.issuemanagement.views.grids.IssueManagementIssueGrid", {
  extend: "Ext.grid.Panel",
  xtype: "issuemanagementissuegrid",
  itemId: "issuemanagementissuegrid",
  controller: "issuemanagementvctr",

  features: [
    {
      ftype: "searching",
      minChars: 2,
      mode: "local",
    },
  ],
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
      text: "Select",
      iconCls: "x-fa fa-plus",
      action: "add",
      name: "select_issue_btn",
      ui: "soft-blue",
      childXtype: "selectissueform",
      winTitle: "Select Issue",
      winWidth: "80%",
      stores: "[issuemanagementissuestr]",
      storeID: "issuemanagementissuestr"
    },
  ],
  autoScroll: true,
  listeners: {
    beforerender: {
      fn: "setGridTreeStore",
      config: {
        storeId: "issuemanagementissuestr",
        proxy: {
          api: {
            read: "issuemanagement/getIssueManagementRelatedIssues",
          },
        },
      },
      isLoad: true,
    },
    // itemdblclick: "showAddConfigParamWinFrm",
  },

  bbar: [
    {
      xtype: "pagingtoolbar",
      displayInfo: true,
      displayMsg: "Showing {0} - {1} of {2} total records",
      emptyMsg: "No Records",
      beforeLoad: function () {
        this.up("issuemanagementissuegrid").fireEvent("refresh", this);
      },
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
      renderer: Ext.util.Format.dateRenderer("d M Y"),
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
      dataIndex: "issue_type",
      text: "Type",
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
      text: "Owner",
      flex: 1,
      tdCls: "wrap",
      renderer: function (value, metaData, record) {
        var firstName = record.get("first_name");
        var lastName = record.get("last_name");
        return firstName + " " + lastName;
      },
    },
    {
      text: "Options",
      xtype: "widgetcolumn",
      width: 90,
      widget: {
        width: 75,
        textAlign: "left",
        xtype: "splitbutton",
        iconCls: "x-fa fa-th-list",
        ui: "gray",
        menu: {
          xtype: "menu",
          items: [
            {
              text: "Delete",
              iconCls: "x-fa fa-trash",
              tooltip: "Delete Record",
              table_name: "tra_issue_management_related_issues",
              storeID: "issuemanagementissuestr",
              action_url: "configurations/deleteConfigRecord",
              action: "actual_delete",
              bind: {
                disabled: "{hideDeleteButton}",
              },
              handler: "doDeleteConfigWidgetParam",
              bind: {
                disabled: "{hideDeleteButton}",
              },
            },
          ],
        },
      },
      onWidgetAttach: function (col, widget, rec) {
        var is_enabled = rec.get("is_enabled");
        if (is_enabled === 0 || is_enabled == 0) {
          // widget.down("menu menuitem[action=enable]").setDisabled(false);
        } else {
          // widget.down("menu menuitem[action=enable]").setDisabled(true);
        }
      },
    },
  ],
});
