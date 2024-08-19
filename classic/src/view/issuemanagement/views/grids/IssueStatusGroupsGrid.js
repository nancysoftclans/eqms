Ext.define("Admin.view.issuemanagement.views.grids.DocumentTypeGrid", {
  extend: "Ext.grid.Panel",
  xtype: "issuestatusgroupsgrid",
  itemId: "issuestatusgroupsgrid",
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
      text: "Create",
      iconCls: "x-fa fa-plus",
      action: "add",
      ui: "soft-blue",
      childXtype: "issuestatusgroupsform",
      winTitle: "Create Issue Status Group",
      winWidth: "80%",
      handler: "showAddConfigParamWinFrm",
      stores: "[]",
    },
  ],
  autoScroll: true,
  listeners: {
    beforerender: {
      fn: "setGridTreeStore",
      config: {
        storeId: "issuestatusgroupsstr",
        proxy: {
          api: {
            read: "issuemanagement/issue_status_groups",
          },
        },
      },
      isLoad: true,
    },
    // itemdblclick: "showAddConfigParamWinFrm",
  },

  bbar: [
    {
      xtype: "button",
      text: "Back",
      ui: "soft-blue",
      iconCls: "x-fa fa-backward",
      handler: "backFromGroupAllDetails",
    },
    {
      xtype: "pagingtoolbar",
      displayInfo: true,
      displayMsg: "Showing {0} - {1} of {2} total records",
      emptyMsg: "No Records",
      beforeLoad: function () {
        var store = this.store,
          grid = this.up("grid");
        store.getProxy().extraParams = {
          table_name: "par_issue_status_groups",
        };
      },
    },
  ],
  columns: [
    {
      xtype: "gridcolumn",
      dataIndex: "title",
      text: "Title",
      flex: 1,
      sortable: true,
    },
    {
      xtype: "gridcolumn",
      dataIndex: "is_enabled",
      text: "Active",
      flex: 1,
      renderer: function (value, metaData) {
        if (value) {
          metaData.tdStyle = "color:green;";
          return '<i class="fas fa-check"></i>';
        }
        metaData.tdStyle = "color:green;";
        return '<i class="fas fa-times"></i>';
      },
    },
    {
      xtype: "gridcolumn",
      dataIndex: "dola",
      text: "Date Modified",
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
              text: "Edit",
              iconCls: "x-fa fa-edit",
              tooltip: "Edit Record",
              action: "edit",
              childXtype: "issuestatusgroupsform",
              winTitle: "Edit Issue Status Group",
              winWidth: "80%",
              handler: "showEditConfigParamWinFrm",
              bind: {
                disabled: "{isReadOnly}",
              },
              stores: "[]",
            },
            {
              text: "Disable",
              iconCls: "x-fa fa-repeat",
              table_name: "par_document_types",
              storeID: "formCategoryStr",
              hidden: true,
              action_url: "configurations/softDeleteConfigRecord",
              action: "soft_delete",
              bind: {
                disabled: "{isReadOnly}",
              },
              handler: "doDeleteConfigWidgetParam",
            },
            {
              text: "Delete",
              iconCls: "x-fa fa-trash",
              tooltip: "Delete Record",
              table_name: "par_document_types",
              storeID: "formCategoryStr",
              hidden: true,
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
            {
              text: "Enable",
              iconCls: "x-fa fa-undo",
              tooltip: "Enable Record",
              table_name: "par_document_types",
              hidden: true,
              storeID: "formCategoryStr",
              action_url: "configurations/undoConfigSoftDeletes",
              action: "enable",
              disabled: true,
              bind: {
                disabled: "{isReadOnly}",
              },
              handler: "doDeleteConfigWidgetParam",
            },
          ],
        },
      },
      onWidgetAttach: function (col, widget, rec) {
        var is_enabled = rec.get("is_enabled");
        if (is_enabled === 0 || is_enabled == 0) {
          widget.down("menu menuitem[action=enable]").setDisabled(false);
          widget.down("menu menuitem[action=soft_delete]").setDisabled(true);
        } else {
          widget.down("menu menuitem[action=enable]").setDisabled(true);
          widget.down("menu menuitem[action=soft_delete]").setDisabled(false);
        }
      },
    },
  ],
});
