Ext.define("Admin.view.issuemanagement.views.grids.IssueManagementAuditGrid", {
  extend: "Ext.grid.Panel",
  xtype: "issuemanagementauditgrid",
  itemId: "issuemanagementauditgrid",
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
      name: "select_audit_btn",
      ui: "soft-blue",
      childXtype: "issueauditform",
      winTitle: "Select Audit",
      winWidth: "80%",
      stores: "[issuemanagementauditstr]",
      storeID: "issuemanagementauditstr"
    },
  ],
  autoScroll: true,
  listeners: {
    beforerender: {
      fn: "setGridTreeStore",
      config: {
        storeId: "issuemanagementauditstr",
        proxy: {
          api: {
            read: "issuemanagement/getIssueManagementAudits",
          },
        },
      },
      isLoad: true,
    },
  },

  bbar: [
    {
      xtype: "pagingtoolbar",
      displayInfo: true,
      displayMsg: "Showing {0} - {1} of {2} total records",
      emptyMsg: "No Records",
      beforeLoad: function () {
        this.up("issuemanagementauditgrid").fireEvent("refresh", this);
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
      dataIndex: "audit_reference",
      text: "Reference",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "audit_title",
      text: "Title",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "audit_type",
      text: "Type",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "",
      text: "Status",
      flex: 1,
    },
    {
      xtype: "gridcolumn",
      dataIndex: "",
      text: "Finding",
      flex: 1,
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
              table_name: "tra_issue_management_audits",
              storeID: "issuemanagementauditstr",
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
