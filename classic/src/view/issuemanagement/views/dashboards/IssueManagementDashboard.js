Ext.define(
  "Admin.view.issuemanagement.views.dashboards.IssueManagementDashboard",
  {
    extend: "Ext.Container",
    xtype: "issuemanagementdashboard",
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
        xtype: "issuemgmtgrid",
        region: "center",
        title: "Active Customer Complaints",
        margin: 2,
      },
    ],
  }
);
