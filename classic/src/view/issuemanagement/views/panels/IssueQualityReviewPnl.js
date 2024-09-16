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
      xtype: "issueactionplangrid",
      autoScroll: true,
      title: "Action Plan",
    },
    {
      xtype: "issuechecklistgrid",
      autoScroll: true,
      title: "Checklist",
    },
    {
      title: "Associated Items",
      xtype: 'tabpanel',
      items: [
        {
          xtype: "issuemanagementorgareasgrid",
          title: "Organisational Areas",
        },
        {
          xtype: "issuemanagementdocgrid",
          title: "Associated Documents",
        },
        {
          xtype: "issuemanagementissuegrid",
          title: "Associated Issues",
        },
        {
          xtype: "issuemanagementauditgrid",
          title: " Associated Audits",
        }
      ],
    },
    {
      xtype: "issueactivitygrid",
      autoScroll: true,
      title: "Activity",
    },
    {
      xtype: "hiddenfield",
      name: "_token",
      value: token,
    },
  ],
});
