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
  ],
});
