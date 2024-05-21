Ext.define("Admin.view.issuemanagement.views.containers.IssueManagementPnl", {
  extend: "Ext.Container",
  xtype: "issuemanagement",
  itemId: "issuemanagement",
  controller: "issuemanagementvctr",
  layout: "border",
  items: [
    {
      xtype: "hiddenfield",
      name: "module_id",
      value: 268,
    },
    {
      xtype: "hiddenfield",
      name: "sub_module_id",
      value: 102,
    },
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
