Ext.define("Admin.view.issuemanagement.views.panels.IssueResolutionPnl", {
  extend: "Ext.panel.Panel",
  xtype: "issueresolution",
  controller: "issuemanagementvctr",
  viewModel: "issuemanagementvm",
  layout: "fit",
  items: [
    {
      xtype: "issuereceivingwizard",
    },
  ],
});
