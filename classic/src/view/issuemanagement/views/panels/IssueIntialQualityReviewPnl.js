Ext.define("Admin.view.issuemanagement.views.panels.IssueIntialQualityReviewPnl", {
  extend: "Ext.tab.Panel",
  xtype: "issuesubmissionpnl",
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
      title: "ASSOCIATED DOCUMENTS",
    },
    {
      xtype: "hiddenfield",
      name: "_token",
      value: token,
    },
  ],
});
