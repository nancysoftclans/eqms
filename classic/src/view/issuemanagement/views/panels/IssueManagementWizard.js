Ext.define("Admin.view.issuemanagement.views.panels.IssueManagementWizard", {
  extend: "Ext.panel.Panel",
  alias: "widget.issuemanagementwwizard",
  padding: "2 0 2 0",
  requires: ["Ext.layout.container.*", "Ext.toolbar.Fill"],
  reference: "wizardpnl",
  layout: "card",
  bodyPadding: 3,
  flex: 1,
  autoScroll: true,
  cls: "wizard three shadow",
  colorScheme: "soft-blue",
  dockedItems: [
    {
      xtype: "toolbar",
      dock: "top",
      ui: "footer",
      height: 55,
      defaults: {
        labelAlign: "left",
        margin: "-12 5 0 5",
        labelStyle: "color:#595959;font-size:10px",
      },
      items: [
        "->",
        {
          xtype: "displayfield",
          name: "process_name",
          fieldLabel: "PROCESS",
          fieldStyle: {
            color: "green",
            "font-weight": "bold",
            "font-size": "10px",
          },
        },
        {
          xtype: "tbseparator",
          width: 20,
        },
        {
          xtype: "displayfield",
          name: "workflow_stage",
          fieldLabel: "WORKFLOW STAGE",
          fieldStyle: {
            color: "green",
            "font-weight": "bold",
            "font-size": "10px",
          },
        },
        {
          xtype: "tbseparator",
          width: 20,
        },
        {
          xtype: "displayfield",
          name: "tracking_no",
          fieldLabel: "TRACKING NO",
          fieldStyle: {
            color: "green",
            "font-weight": "bold",
            "font-size": "10px",
          },
        },
        {
          xtype: 'displayfield',
          name: 'reference_no',
          hidden: true,
          fieldLabel: 'Ref No',
          fieldStyle: {
            'color': 'green',
            'font-weight': 'bold',
            'font-size': '10px'
          }
        },
        {
          xtype: "tbseparator",
          hidden: true,
          width: 20,
        },
        {
          xtype: "displayfield",
          name: "application_status",
          hidden: true,
          fieldLabel: "App Status",
          fieldStyle: {
            color: "green",
            "font-weight": "bold",
            "font-size": "12px",
            "margin-top": "-2px",
          },
        },
        {
          xtype: "hiddenfield",
          name: "process_id",
        },
        {
          xtype: "hiddenfield",
          name: "workflow_stage_id",
        },
        {
          xtype: "hiddenfield",
          name: "active_application_id",
        },
        {
          xtype: "hiddenfield",
          name: "module_id",
        },
        {
          xtype: "hiddenfield",
          name: "sub_module_id",
        },
        {
          xtype: "hiddenfield",
          name: "section_id",
        },
        {
          xtype: "hiddenfield",
          name: "active_application_code",
        },
        {
          xtype: "hiddenfield",
          name: "application_status_id",
        },
        {
          xtype: "hiddenfield",
          name: "application_code",
        },
        {
          xtype: "hiddenfield",
          name: "issue_type_id",
        },
      ],
    },
  ],
  items: [
    {
      xtype: "issuemanagementpnl",
      layout: "fit",
      defaults: {
        margin: 3,
      },
    },
    {
      xtype: "hiddenfield",
      name: "active_application_id",
    },
  ],
  initComponent: function () {
    var me = this;
    // this.tbar = {
    //   reference: "progress",
    //   itemId: "progress_tbar",
    //   defaultButtonUI: "wizard-blue",
    //   cls: "wizardprogressbar",
    //   style: {
    //     color: "#90c258",
    //   },
    //   bodystyle: {
    //     color: "#90c258",
    //   },
    //   layout: {
    //     pack: "center",
    //   },
    //   items: [
    //     {
    //       step: 0,
    //       iconCls: "fa fa-exclamation-triangle",
    //       enableToggle: true,
    //       pressed: true,
    //       text: "ISSUE MANAGEMENT",
    //       max_step: 1,
    //       action: "quickNav",
    //       wizard: "issuemanagementwwizard",
    //       handler: "quickNavigation",
    //     },
    //   ],
    // };
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
      ],
    };
    me.callParent(arguments);
  },
});
