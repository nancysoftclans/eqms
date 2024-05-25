Ext.define(
  "Admin.view.issuemanagement.views.dashboards.IssueManagementDashboard",
  {
    extend: "Ext.Container",
    xtype: "issuemanagementdashboard",
    layout: "border",
    items: [
      {
        xtype: "issuemanagementgrid",
        region: "center",
        title: "Active Issue Lists",
        margin: 2,
        bbar: [
          {
            xtype: "pagingtoolbar",
            width: "100%",
            displayInfo: true,
            displayMsg: "Showing {0} - {1} of {2} total records",
            emptyMsg: "No Records",
            beforeLoad: function () {
              var grid = this.up("grid"),
                pnl = grid.up("issuemanagementdashboard"),
                wrapper = pnl.up("issuemanagementwrapper"),
                cnt = wrapper.up(),
                store = this.store,
                grid = this.up("grid");
              store.getProxy().extraParams = {
                table_name: "tra_issue_management_applications",
              };
            },
          },
        ],
      },
    ],
  }
);
