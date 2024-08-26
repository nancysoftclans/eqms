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
        xtype: "associateditemspnl",
        title: "Associated Items",
      },
      {
        xtype: "hiddenfield",
        name: "_token",
        value: token,
      },
    ],
  }
);
