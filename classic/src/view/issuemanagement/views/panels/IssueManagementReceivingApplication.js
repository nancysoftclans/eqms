Ext.define(
  "Admin.view.issuemanagement.views.panels.IssueManagementReceivingApplication",
  {
    extend: "Ext.panel.Panel",
    xtype: "issuemanagementreceivingapplication",
    controller: "issuemanagementvctr",
    viewModel: {
      type: "issuemanagementvm",
    },
    layout: "fit",
    items: [
      {
        xtype: "issuemanagementreceivingapplicationwizard",
      },
    ],
  }
);
