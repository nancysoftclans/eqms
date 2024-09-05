Ext.define("Admin.view.issuemanagement.views.grids.IssueManagementDocGrid", {
  extend: "Ext.grid.Panel",
  controller: "issuemanagementvctr",
  xtype: "issuemanagementdocgrid",
  itemId: "issuemanagementdocgrid",
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
      xtype: "button",
      text: "Select",
      name: "select_document",
      iconCls: "x-fa fa-plus",
      ui: "soft-blue",
      winTitle: "Select Documents",
      childXtype: "issueselectdocumentfrm",
      winWidth: "80%",
      stores: '["issuemanagementdocumentstr"]',
      storeID: "issuemanagementdocumentstr",
    },
    {
      xtype: "button",
      text: "Upload",
      name: "add_upload",
      iconCls: "x-fa fa-plus",
      ui: "soft-blue",
      winTitle: "Document Upload",
      childXtype: "applicationDocUploadsFrm",
      winWidth: "50%",
      stores: '["issuemanagementdocumentstr"]',
      storeID: "issuemanagementdocumentstr",
    },
  ],
  autoScroll: true,
  listeners: {
    beforerender: {
      fn: "setGridTreeStore",
      config: {
        storeId: "issuemanagementdocumentstr",
        proxy: {
          api: {
            read: "issuemanagement/getIssueManagementDocuments",
          },
        },
      },
      isLoad: true,
    },
    // itemdblclick: "onMenuItemTreeItemDblClick",
  },
  bbar: [
    {
      xtype: "pagingtoolbar",
      width: "100%",
      displayInfo: true,
      displayMsg: "Showing {0} - {1} of {2} total records",
      emptyMsg: "No Records",
      beforeLoad: function () {
        this.up("issuemanagementdocgrid").fireEvent("refresh", this);
      },
    },
  ],
  columns: [
    {
      xtype: "gridcolumn",
      dataIndex: "reference_no",
      text: "ID",
      sortable: true,
      flex: 1,
    },
    {
      xtype: "gridcolumn",
      dataIndex: "title",
      text: "Title",
      sortable: true,
      flex: 1,
    },
    {
      xtype: "gridcolumn",
      dataIndex: "version",
      text: "version",
      flex: 1,
    },
    {
      xtype: "gridcolumn",
      dataIndex: "type",
      text: "Type",
      flex: 1,
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
              text: "Preview",
              iconCls: "x-fa fa-eye",
              handler: "previewUploadedDocument",
              action: "preview",
              download: 0,
            },
            {
              text: "Delete",
              iconCls: "x-fa fa-trash",
              tooltip: "Delete Record",
              table_name: "tra_issue_management_documents",
              storeID: "issuemanagementdocumentstr",
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
        var upload_id = rec.get("upload_id");
        if (upload_id) {
          widget.down("menu menuitem[action=preview]").setDisabled(false);
        } else {
          widget.down("menu menuitem[action=preview]").setDisabled(true);
        }
      },
    },
  ],
});
