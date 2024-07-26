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
      xtype: "issuequalityreviewfrm",
      autoScroll: true,
      title: "Quality Office Review"
    },
    {
      xtype: "issueresolutionfrm",
      autoScroll: true,
      title: "Resolution",
      fieldDefaults: {
        fieldStyle: {
          color: "green",
          "font-weight": "bold",
        },
      },
    },
    {
      xtype: "issuerootcauseanalysisfrm",
      autoScroll: true,
      title: "Root Cause Analysis",
      fieldDefaults: {
        fieldStyle: {
          color: "green",
          "font-weight": "bold",
        },
      },
    },
    {
      xtype: "issueinitialqualityreviewfrm",
      autoScroll: true,
      title: "Initial Review by Quality Office",
      fieldDefaults: {
        fieldStyle: {
          color: "green",
          "font-weight": "bold",
        },
      },
    },
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
      xtype: "complainantdetailsfrm",
      autoScroll: true,
      title: "Complainant Details",
      fieldDefaults: {
        fieldStyle: {
          color: "green",
          "font-weight": "bold",
        },
      },
    },
    {
      xtype: "issuemanagementdocuploadsgrid",
      title: "Documents",
    },
    {
      xtype: "hiddenfield",
      name: "_token",
      value: token,
    },
  ],
});
