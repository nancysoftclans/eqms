Ext.define("Admin.view.issuemanagement.views.panels.IssueRootCauseAnalysisPanel", {
  extend: "Ext.panel.Panel",
  xtype: "issuerootcauseanalysis",
  controller: "issuemanagementvctr",
  viewModel: "issuemanagementvm",
  layout: "fit",
  items: [
    {
      xtype: "issuerootcauseanalysiswizard",
    },
  ],
});
