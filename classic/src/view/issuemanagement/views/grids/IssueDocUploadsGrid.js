Ext.define("Admin.view.issuemanagement.views.grids.IssueDocUploadsGrid", {
  extend: "Ext.grid.Panel",
  controller: "issuemanagementvctr",
  xtype: "issuemanagementdocuploadsgrid",
  itemId: "issuemanagementdocuploadsgrid",
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
      winHeight: "35%",
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
        this.up("issuemanagementdocuploadsgrid").fireEvent("refresh", this);
      },
    },
  ],
  columns: [
    {
      xtype: "treecolumn",
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
              text: "ZIP and Download",
              iconCls: "x-fa fa-download",
              handler: "downloadDirectoryasZip",
              tooltip: "download as zip",
              action: "download",
              download: 0,
            },
            {
              text: "Update Document",
              iconCls: "x-fa fa-upload",
              winTitle: "Update Document",
              childXtype: "applicationDocUploadsFrm",
              winWidth: "35%",
              handler: "updateApplicationDocUploadWin",
              stores: "[]",
              action: "update",
              name: "update",
              bind: {
                hidden: "{isReadOnly}", // false
              },
            },
            {
              text: "Delete",
              iconCls: "x-fa fa-trash",
              name: "delete",
              tooltip: "Delete Record",
              table_name: "tra_application_uploadeddocuments",
              storeID: "applicationDocumentsUploads",
              action_url: "productregistration/deleteProductiseRegRecord",
              action: "actual_delete",
              handler: "onDeleteApplicationDocument",

              bind: {
                hidden: "{isReadOnly}", // false
              },
            },
            {
              text: "Preview Previous Version",
              iconCls: "x-fa fa-eye",
              hidden: true,
              storeId: "previousDocumentsUploads",
              childXtype: "previousDocumentVersionsGrid",
              winTitle: "Document Previous Versions",
              winWidth: "70%",
              action: "prev_versions",
              handler: "previewPreviousUploadedDocument",
              bind: {
                hidden: "{isReadOnly}", // false
              },
            },
          ],
        },
      },
      onWidgetAttach: function (col, widget, rec) {
        var is_enabled = rec.get("is_enabled");
        if (is_enabled === 0 || is_enabled == 0) {
          // widget.down("menu menuitem[action=enable]").setDisabled(false);
          // widget.down("menu menuitem[action=soft_delete]").setDisabled(true);
        } else {
          // widget.down("menu menuitem[action=enable]").setDisabled(true);
          // widget.down("menu menuitem[action=soft_delete]").setDisabled(false);
        }
      },
    },
  ],
});
