Ext.define("Admin.view.issuemanagement.views.grids.IssueManagementOrgAreasGrid", {
  extend: "Ext.grid.Panel",
  xtype: "issuemanagementorgareasgrid",
  itemId: "issuemanagementorgareasgrid",
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
      name: "select_orgarea_btn",
      ui: "soft-blue",
      childXtype: "issueselectorgareafrm",
      winTitle: "Select",
      winWidth: "60%",
      stores: "[issuemanagementorgareastr]",
      storeID: "issuemanagementorgareastr"
    },
  ],
  autoScroll: true,
  listeners: {
    beforerender: {
      fn: "setGridTreeStore",
      config: {
        storeId: "issuemanagementorgareastr",
        proxy: {
          api: {
            read: "issuemanagement/getIssueManagementOrganisationalAreas",
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
        this.up("issuemanagementorgareasgrid").fireEvent("refresh", this);
      },
    },
  ],
  columns: [
    {
      xtype: "gridcolumn",
      dataIndex: "title",
      text: "Title",
      flex: 1,
      tdCls: "wrap",
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
              table_name: "tra_issue_management_organisational_areas",
              storeID: "issuemanagementorgareastr",
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
