Ext.define(
  "Admin.view.issuemanagement.views.panels.IssueReceivingPnl",
  {
    extend: "Ext.panel.Panel",
    xtype: "issuereceiving",
    controller: "issuemanagementvctr",
    viewModel: "issuemanagementvm",
    layout: "fit",
    
    items: [
      {
        xtype: "issuereceivingwizard",
      },
    ],
  }
);
