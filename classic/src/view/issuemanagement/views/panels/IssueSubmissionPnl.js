Ext.define("Admin.view.issuemanagement.views.panels.IssueSubmissionPnl", {
  extend: "Ext.panel.Panel",
  xtype: "issuesubmission",
  controller: "issuemanagementvctr",
  viewModel: "issuemanagementvm",
  layout: "fit",
  items: [
    {
      xtype: "issuesubmissionwizard",
    },
  ],
});
