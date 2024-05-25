Ext.define("Admin.view.issuemanagement.views.containers.IssueManagementPnl", {
  extend: "Ext.Container",
  xtype: "issuemanagement",
  controller: "issuemanagementvctr",
  layout: "border",
  items: [
    {
      xtype: "issuemanagementwrapper",
      region: "center",
    },
    {
      xtype: "issuemanagementtb",
      region: "south",
    },
  ],
});
