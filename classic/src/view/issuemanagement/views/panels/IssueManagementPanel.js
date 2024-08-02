Ext.define("Admin.view.issuemanagement.views.panels.IssueManagementPanel", {
  extend: "Ext.panel.Panel",
  xtype: "issuecomplete",
  controller: "issuemanagementvctr",
  viewModel: "issuemanagementvm",
  layout: "fit",
  items: [
    {
      xtype: "issuemanagementwwizard",
    },
  ],
});
