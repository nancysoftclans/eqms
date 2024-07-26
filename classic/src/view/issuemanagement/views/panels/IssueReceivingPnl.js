Ext.define("Admin.view.issuemanagement.views.panels.IssueReceivingPnl", {
  extend: "Ext.tab.Panel",
  xtype: "issuemanagementpnl",
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
      xtype: "complainantdetailsfrm",
      autoScroll: true,
      title: "Complainant Details",
    },
    {
      xtype: "issuemanagementdocuploadsgrid",
      title: "DOCUMENTS",
    },
    {
      xtype: "hiddenfield",
      name: "_token",
      value: token,
    },
  ],
});
