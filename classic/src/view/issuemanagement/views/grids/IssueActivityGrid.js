Ext.define("Admin.view.issuemanagement.views.grids.IssueActivityGrid", {
  extend: "Ext.grid.Panel",
  xtype: "issueactivitygrid",
  itemId: "issueactivitygrid",
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
  autoScroll: true,
  listeners: {
    beforerender: {
      fn: "setGridTreeStore",
      config: {
        storeId: "issuemanagementissuestr",
        proxy: {
          api: {
            read: "issuemanagement/getActivity",
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
        this.up("issueactivitygrid").fireEvent("refresh", this);
      },
    },
  ],
  columns: [
    {
      xtype: "gridcolumn",
      dataIndex: "id",
      text: "ID",
      flex: 1,
      tdCls: "wrap",
      hidden: true
    },
    {
      xtype: "gridcolumn",
      dataIndex: "from_stage",
      text: "From Stage",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "to_stage",
      text: "To Stage",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      text: "Action By",
      flex: 1,
      tdCls: "wrap",
      renderer: function (value, metaData, record) {
        var firstName = record.get("first_name");
        var lastName = record.get("last_name");
        return firstName + " " + lastName;
      },
    },
    {
      xtype: "gridcolumn",
      dataIndex: "created_on",
      text: "Action On",
      flex: 1,
      tdCls: "wrap",
      renderer: Ext.util.Format.dateRenderer("d M Y"),
    },
    {
      xtype: "gridcolumn",
      dataIndex: "remarks",
      text: "Remarks",
      flex: 1,
      tdCls: "wrap",
    }
  ],
});
