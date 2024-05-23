Ext.define("Admin.view.issuemanagement.views.grids.IssueManagementGrid", {
  extend: "Ext.grid.Panel",
  controller: "issuemanagementvctr",
  xtype: "issuemanagementgrid",
  itemId: "issuemanagementgrid",
  useArrows: true,
  rootVisible: false,
  multiSelect: false,
  singleExpand: true,
  margin: "0 5 0 0",
  selType: "cellmodel",

  // autoScroll: true,
  // autoHeight: true,
  // width: "100%",
  plugins: [
    {
      ptype: "cellediting",
      clicksToEdit: 1,
    },
  ],

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
  // tbar: [
  //   {
  //     xtype: "button",
  //     text: "Add",
  //     iconCls: "x-fa fa-plus",
  //     action: "add",
  //     ui: "soft-blue",
  //     hidden: true,
  //     childXtype: "docdefinationrequirementfrm",
  //     winTitle: "Documents requirements Defination",
  //     winWidth: "40%",
  //     handler: "showAddConfigParamWinFrm",
  //     stores: "[]",
  //   },
  // ],
  autoScroll: true,
  listeners: {
    beforerender: {
      fn: "setGridTreeStore",
      config: {
        storeId: "",
        proxy: {
          api: {
            read: "issuemanagement/getIssueManagementDetails",
          },
        },
      },
      isLoad: true,
    },
    itemdblclick: "onViewIssueManagementApplication",
  },
  columns: [
    {
      xtype: "gridcolumn",
      dataIndex: "title",
      text: "Title",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "description",
      text: "Description",
      flex: 1,
      tdCls: "wrap",
    },
  ],
});
