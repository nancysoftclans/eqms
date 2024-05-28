Ext.define("Admin.view.issuemanagement.views.panels.IssueManagementPnl", {
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
      title: "ISSUE DETAILS",
    },
    {
      xtype: "complainantdetailsfrm",
      autoScroll: true,
      title: "COMPLAINANT DETAILS",
    },
    {
      xtype: "issuemanagementdocuploadsgrid",
      title: "Applicable Documents",
    },
    {
      xtype: "hiddenfield",
      name: "_token",
      value: token,
    },
  ],
});
