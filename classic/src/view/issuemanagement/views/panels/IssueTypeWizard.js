Ext.define(
  "Admin.view.issuemanagement.views.panels.IssueTypeWizard",
  {
    extend: "Ext.panel.Panel",
    alias: "widget.issuetypewwizard",
    padding: "2 0 2 0",
    requires: ["Ext.layout.container.*", "Ext.toolbar.Fill"],
    reference: "wizardpnl",
    layout: "card",
    bodyPadding: 3,
    flex: 1,
    autoScroll: true,
    cls: "wizard three shadow",
    colorScheme: "soft-blue",
    
    items: [
      {
        xtype: "issuetypepnl",
        layout: "fit",
        defaults: {
          margin: 3,
        },
      },
    ],
    initComponent: function () {
      var me = this;
      this.bbar = {
        reference: "navigation-toolbar",
        ui: "footer",
        items: [
          {
            text: "Back to List",
            ui: "soft-blue",
            iconCls: "fa fa-bars",
            name: "back_to_list",
            hidden: true,
          },
          "->",
          {
            text: "Save Details",
            iconCls: "x-fa fa-save",
            action: "save",
            storeID: "issuestatusgroupsstr",
            formBind: true,
            ui: "soft-blue",
            action_url: "issuemanagement/issue_status_groups",
            handler: "doCreateConfigParamWin",
          },
        ],
      };
      me.callParent(arguments);
    },
  }
);