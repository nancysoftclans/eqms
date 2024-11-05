Ext.define("Admin.view.issuemanagement.views.grids.IssueActionPlanGrid", {
  extend: "Ext.grid.Panel",
  xtype: "issueactionplangrid",
  itemId: "issueactionplangrid",
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
      text: "Add",
      iconCls: "x-fa fa-plus",
      action: "add",
      name: "add_action_plan_btn",
      ui: "soft-blue",
      childXtype: "addactionplanform",
      winTitle: "Action Plan",
      winWidth: "50%",
      stores: "[issuemanagementactionplanstr]",
      storeID: "issuemanagementactionplanstr"
    },
  ],
  autoScroll: true,
  listeners: {
    beforerender: {
      fn: "setGridTreeStore",
      config: {
        storeId: "issuemanagementactionplanstr",
        proxy: {
          api: {
            read: "issuemanagement/issue_action_plans",
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
        this.up("issueactionplangrid").fireEvent("refresh", this);
      },
    },
  ],
  columns: [
    {
      xtype: "gridcolumn",
      dataIndex: "id",
      text: "ID",
      flex: 1,
      hidden: true,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "action",
      text: "Action",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "responsible_person",
      text: "Responsible Person",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "start_date",
      text: "Start Date",
      flex: 1,
      tdCls: "wrap",
      // renderer: Ext.util.Format.dateRenderer("d M Y"),
    },
    {
      xtype: "gridcolumn",
      dataIndex: "completion_date",
      text: "Completion Date",
      flex: 1,
      tdCls: "wrap",
      // renderer: Ext.util.Format.dateRenderer("d M Y"),
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
              text: "Edit",
              iconCls: "x-fa fa-edit",
              tooltip: "Edit Record",
              action: "edit",
              childXtype: "addactionplanform",
              winTitle: "Edit Action Plan",
              winWidth: "50%",
              handler: "showEditConfigParamWinFrm",
              bind: {
                disabled: "{isReadOnly}",
              },
              stores: "[]",
            },
            {
              text: "Delete",
              iconCls: "x-fa fa-trash",
              tooltip: "Delete Record",
              table_name: "tra_issue_management_action_plans",
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
