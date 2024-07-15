Ext.define("Admin.view.issuemanagement.views.panels.IssueSubmissionWizard", {
  extend: "Ext.panel.Panel",
  xtype: "issuesubmissionwizard",
  layout: {
    type: "border",
  },
  defaults: {
    split: true,
  },
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
          name: "active_application_code",
        },
        {
          xtype: "hiddenfield",
          name: "application_status_id",
        },
        {
          xtype: 'hiddenfield',
          name: 'application_code'
      },
      ],
    },
  ],
  items: [
    {
      title: "Initial Review by Quality Office",
      region: "center",
      layout: "fit",
      items: [
        {
          xtype: "issuemanagementfrm",
        },
      ],
    },
    {
      xtype: "toolbar",
      ui: "footer",
      scrollable: true,
      autoScroll: true,
      region: "south",
      height: 45,
      split: false,
      defaults: {
        margin: 5,
      },
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
          text: "Recommendations & Comments",
          ui: "soft-blue",
          iconCls: "fa fa-clipboard-check",
          childXtype: "applicationcommentspnl",
          winTitle: "Process Comments",
          winWidth: "60%",
          name: "recommendation",
          comment_type_id: 3,
          stores: "[]",
        },
        {
          text: "Submit Application",
          ui: "soft-blue",
          iconCls: "fa fa-check",
          name: "process_submission_btn",
          storeID: "issuemanagementstr",
          table_name: "tra_issue_management_applications",
          winWidth: "50%",
          handler: "showIssueManagementSubmissionWin",
        }
      ],
    },
  ],
});
