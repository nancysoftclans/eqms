Ext.define("Admin.view.issuemanagement.views.panels.IssueQualityReviewPanel", {
  extend: "Ext.panel.Panel",
  xtype: "issuequalityreview",
  controller: "issuemanagementvctr",
  viewModel: "issuemanagementvm",
  layout: "fit",
  items: [
    {
      xtype: "issuequalityreviewwizard",
    },
  ],
});
