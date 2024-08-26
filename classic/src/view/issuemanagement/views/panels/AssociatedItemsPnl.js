Ext.define(
  "Admin.view.issuemanagement.views.panels.AssociatedItemsPnl",
  {
    extend: "Ext.tab.Panel",
    xtype: "associateditemspnl",
    layout: {
      type: "fit",
    },
    defaults: {
      margin: 3,
    },
    items: [
      {
        xtype: "issuemanagementdocuploadsgrid",
        title: "Associated documents",
      },
      {
        xtype: "issuemanagementdocuploadsgrid",
        title: "Associated Issues",
      },
      {
        xtype: "issuemanagementdocuploadsgrid",
        title: " Associated audits",
      },
      {
        xtype: "hiddenfield",
        name: "_token",
        value: token,
      },
    ],
  }
);
