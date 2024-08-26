Ext.define("Admin.view.issuemanagement.views.panels.IssueReceivingPnl", {
  extend: "Ext.tab.Panel",
  xtype: "issuereceivingpnl",
  layout: {
    type: "fit",
  },
  defaults: {
    margin: 3,
  },
  viewModel: {
    type: "issuemanagementvm",
  },
  items: [
    {
      xtype: "issuemanagementfrm",
      autoScroll: true,
      title: "Issue Details",
    },
    {
      xtype: "associateditemspnl",
      title: "Associated Items",
    },
    {
      xtype: "hiddenfield",
      name: "_token",
      value: token,
    },
  ],
});
