Ext.define(
  "Admin.view.issuemanagement.views.panels.IssueRootCauseAnalysisPnl",
  {
    extend: "Ext.tab.Panel",
    xtype: "issuerootcauseanalysispnl",
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
        xtype: "issuerootcauseanalysisfrm",
        autoScroll: true,
        title: "Root Cause Analysis",
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
  }
);