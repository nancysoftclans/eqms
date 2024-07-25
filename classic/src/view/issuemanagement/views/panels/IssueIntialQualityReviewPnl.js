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
        title: "ISSUE DETAILS",
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
        title: "COMPLAINANT DETAILS",
        fieldDefaults: {
          fieldStyle: {
            color: "green",
            "font-weight": "bold",
          },
        },
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
  }
);
