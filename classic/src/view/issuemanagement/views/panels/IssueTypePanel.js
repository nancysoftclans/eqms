Ext.define("Admin.view.issuemanagement.views.panels.IssueTypePanel", {
  extend: "Ext.panel.Panel",
  xtype: "issuetypepanel",
  controller: "issuemanagementvctr",
  layout: "fit",
  items: [
    {
      xtype: "issuetypewwizard",
    },
  ],
});
