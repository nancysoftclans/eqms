Ext.define(
  "Admin.view.issuemanagement.views.dashboards.IssueManagementDashboard",
  {
    extend: "Ext.Container",
    xtype: 'issuemanagementdashboard',
    itemId: "issuemanagementdashboard",
    layout: "border",
    items: [
      {
        xtype: "hiddenfield",
        name: "module_id",
        value: 28,
      },
      {
        xtype: "hiddenfield",
        name: "sub_module_id",
        value: 102,
      },
      {
        xtype: "issuemanagementgrid",
        region: "center",
        title: "Active Issue Lists",
        margin: 2,
      },
    ],
  }
);
