Ext.define("Admin.view.issuemanagement.views.forms.IssueRootCauseAnalysisFrm", {
  extend: "Ext.form.Panel",
  xtype: "issuerootcauseanalysisfrm",
  height: Ext.Element.getViewportHeight() - 118,
  controller: "issuemanagementvctr",
  autoScroll: true,
  viewModel: {
    type: "issuemanagementvm",
  },
  layout: {
    type: "column",
  },
  bodyPadding: 8,
  defaults: {
    columnWidth: 0.5,
    margin: 5,
    labelAlign: "top",
  },
  frame: true,
  items: [
    {
      xtype: "hiddenfield",
      margin: "0 20 20 0",
      name: "_token",
      value: token,
      allowBlank: true,
    },
    {
      xtype: "hiddenfield",
      fieldLabel: "id",
      margin: "0 20 20 0",
      name: "id",
      allowBlank: true,
    },
    {
      xtype: "textarea",
      fieldLabel: "Problem Statement (Issue)",
      margin: "0 20 20 0",
      name: "problem_statement",
      allowBlank: false,
    },
    {
      xtype: "textarea",
      fieldLabel: "RCA Team",
      margin: "0 20 20 0",
      name: "rca_team",
      allowBlank: false,
    },
    {
      xtype: "textfield",
      fieldLabel: "Name of the Responsible Officer for the RCA",
      margin: "0 20 20 0",
      name: "responsible_officer",
      columnWidth: 1,
      allowBlank: false,
    },
    {
      xtype: "checkboxgroup",
      fieldLabel: "Management and People - Belief System",
      columns: 1,
      allowBlank: false,
      items: [
        {
          boxLabel: "Placing budgetary considerations ahead of quality",
          name: "complaint_placing_budgetary",
        },
        {
          boxLabel: "Placing schedule considerations ahead of quality",
          name: "complaint_placing_schedule",
        },
        {
          boxLabel: "Lacking fundamental knowledge, research or education",
          name: "complaint_lacking_knowledge",
        },
        {
          boxLabel:
            'Practicing autocratic behaviours, resulting in "annulment"',
          name: "complaint_practicing_autocratic",
        },
      ],
    },
    {
      xtype: "checkboxgroup",
      fieldLabel: "Management Systems - Processes",
      columns: 1,
      allowBlank: false,
      items: [
        {
          boxLabel: "Processes not defined",
          name: "complaint_processes",
        },
        {
          boxLabel: "Ineffective processes/systems",
          name: "complaint_ineffective_processes",
        },
        {
          boxLabel: "Ineffective support services",
          name: "complaint_ineffective_support",
        },
      ],
    },
    {
      xtype: "checkboxgroup",
      fieldLabel: "Management Systems - Documentation",
      columns: 1,
      allowBlank: false,
      items: [
        {
          boxLabel: "System documentation not available",
          name: "complaint_system_documentation",
        },
        {
          boxLabel: "Incomplete system documentation",
          name: "complaint_incomplete_system",
        },
        {
          boxLabel: "Ineffective system documentation",
          name: "complaint_ineffective_system",
        }
      ],
    },
    {
      xtype: "checkboxgroup",
      fieldLabel: "Analytical Methods",
      columns: 1,
      allowBlank: false,
      items: [
        {
          boxLabel: "Method not fit for purpose",
          name: "complaint_analytical_methods",
        },
        {
          boxLabel: "Inadequate validated methods",
          name: "complaint_validated_methods",
        },
      ],
    },
  ],
});
