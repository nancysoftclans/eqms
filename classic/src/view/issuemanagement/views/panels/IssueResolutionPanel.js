Ext.define("Admin.view.issuemanagement.views.panels.IssueResolutionPanel", {
  extend: "Ext.panel.Panel",
  xtype: "issueresolution",
  controller: "issuemanagementvctr",
  viewModel: "issuemanagementvm",
  layout: "fit",
  items: [
    {
      xtype: "issueresolutiongwizard",
    },
  ],
});
