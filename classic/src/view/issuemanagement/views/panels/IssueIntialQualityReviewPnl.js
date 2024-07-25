Ext.define(
  "Admin.view.issuemanagement.views.panels.IssueIntialQualityReviewPnl",
  {
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
        xtype: "issueinitialqualityreviewfrm",
        autoScroll: true,
        title: "Initial Review by Quality Office",
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
