Ext.define(
  "Admin.view.issuemanagement.views.dashboards.IssueManagementDashboard",
  {
    extend: "Ext.Container",
    xtype: 'issuemanagementdashboard',
    itemId: "issuemanagementdashboard",
    layout: "border",
    items: [
      {
        xtype: "issuemanagementgrid",
        region: "center",
        title: "Active Issue Lists",
        margin: 2,
      },
    ],
  }
);
