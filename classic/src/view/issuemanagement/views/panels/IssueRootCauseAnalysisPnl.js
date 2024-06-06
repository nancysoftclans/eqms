Ext.define("Admin.view.issuemanagement.views.panels.IssueRootCauseAnalysisPnl", {
  extend: "Ext.panel.Panel",
  xtype: "issuerootcauseanalysis",
  controller: "issuemanagementvctr",
  viewModel: "issuemanagementvm",
  layout: "fit",
  items: [
    {
      xtype: "issuereceivingwizard",
    },
  ],
});
