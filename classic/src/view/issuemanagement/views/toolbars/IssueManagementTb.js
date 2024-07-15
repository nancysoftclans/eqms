Ext.define("Admin.view.issuemanagement.views.toolbars.IssueManagementTb", {
  extend: "Ext.toolbar.Toolbar",
  xtype: "issuemanagementtb",
  ui: "footer",
  defaults: {
    ui: "soft-blue",
    iconAlign: "top",
  },
  requires: ["Ext.ux.BoxReorderer"],
  plugins: "boxreorderer",
  overflowHandler: "scroller",
  items: [
    {
      text: "Home",
      iconCls: "x-fa fa-home",
      sec_dashboard:'issuemanagementdashboard',
      name: "issuemanagementHomeBtn",
      homeDashWrapper: '#issuemanagementwrapper'
    },
    {
      text: "Issue Initialisation",
      iconCls: "x-fa fa-plus-square",
      childXtype: "issuetypeselectform",
      winTitle: "Select Issue Type",
      winWidth: "40%",
      handler: "showIssueTypeConfigParam",
      stores: "[]"
    },
    "->",

    {
      text: "Workflow",
      iconCls: "x-fa fa-sitemap",
      menu: {
        xtype: "menu",
        items: [
            {
              text: "Customer Complaints And Appeals",
              iconCls: "x-fa fa-check",
              // handler: "showPmsApplicationWorkflow",
              // wrapper_xtype: "drugssurveillancedashwrapper",
              app_type: 38,
            },
          //   {
          //     text: "Non-Structured Surveillance",
          //     iconCls: "x-fa fa-check",
          //     handler: "showPmsApplicationWorkflow",
          //     wrapper_xtype: "drugssurveillancedashwrapper",
          //     app_type: 37,
          //   },
        ],
      },
    },
  ],
});
