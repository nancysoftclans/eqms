Ext.define(
  "Admin.view.issuemanagement.views.panels.IssueTypePnl",
  {
    extend: "Ext.tab.Panel",
    xtype: "issuetypepnl",
    layout: {
      type: "fit",
    },
    defaults: {
      margin: 3,
    },
    items: [
      {
        xtype: "issuemanagementfrm",
        autoScroll: true,
        title: "Issue Type Details",
      },
      {
        xtype: "complainantdetailsfrm",
        autoScroll: true,
        title: "Associated Items",
      },
      {
        xtype: "",
        title: "Notifications",
      },
      {
        xtype: "hiddenfield",
        name: "_token",
        value: token,
      },
    ],
  }
);
