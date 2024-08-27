Ext.define("Admin.view.issuemanagement.views.panels.IssueQualityReviewPnl", {
  extend: "Ext.tab.Panel",
  xtype: "issuequalityreviewpnl",
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
      fieldDefaults: {
        fieldStyle: {
          color: "green",
          "font-weight": "bold",
        },
      },
    },
    {
      title: "Associated Items",
      xtype: 'tabpanel',
      items: [
        {
          xtype: "issuemanagementdocuploadsgrid",
          title: "Associated Documents",
        },
        {
          xtype: "",
          title: "Associated Issues",
        },
        {
          xtype: "",
          title: " Associated Audits",
        }
      ],
    },
    {
      xtype: "hiddenfield",
      name: "_token",
      value: token,
    },
  ],
});
