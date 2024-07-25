Ext.define(
  "Admin.view.issuemanagement.views.panels.IssueResolutionPnl",
  {
    extend: "Ext.tab.Panel",
    xtype: "issueresolutionpnl",
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
        xtype: "issueresolutionfrm",
        autoScroll: true,
        title: "Resolution",
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
  }
);
