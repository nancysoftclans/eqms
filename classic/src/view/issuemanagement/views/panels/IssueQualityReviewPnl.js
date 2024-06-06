Ext.define("Admin.view.issuemanagement.views.panels.IssueQualityReviewPnl", {
  extend: "Ext.panel.Panel",
  xtype: "issuequalityofficereview",
  controller: "issuemanagementvctr",
  viewModel: "issuemanagementvm",
  layout: "fit",
  items: [
    {
      xtype: "issuereceivingwizard",
    },
  ],
});
