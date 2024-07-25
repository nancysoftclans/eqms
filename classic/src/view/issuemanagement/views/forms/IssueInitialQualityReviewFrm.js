Ext.define(
  "Admin.view.issuemanagement.views.forms.IssueInitialQualityReviewFrm",
  {
    extend: "Ext.form.Panel",
    xtype: "issueinitialqualityreviewfrm",
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
        xtype: "radiogroup",
        fieldLabel: "Direct or Indirect",
        margin: "0 20 20 0",
        allowBlank: false,
        name: "complaint_direct_or_indirect",
        columns: 1,
        items: [
          { boxLabel: "Direct Complaint", name: "complaint_direct_or_indirect", inputValue: 1 },
          { boxLabel: "Indirect Complaint", name: "complaint_direct_or_indirect", inputValue: 2 },
        ],
      },
      {
        xtype: "combo",
        anyMatch: true,
        fieldLabel: "Office Assigned to",
        margin: "0 20 20 0",
        name: "office_assigned_to",
        valueField: "id",
        displayField: "name",
        forceSelection: true,
        allowBlank: false,
        queryMode: "local",
        listeners: {
          afterrender: {
            fn: "setCompStore",
            config: {
              pageSize: 10000,
              proxy: {
                extraParams: {
                  table_name: "par_departments",
                },
              },
            },
            isLoad: true,
          },
        },
      },
      {
        xtype: "checkboxgroup",
        fieldLabel: "Key issues of complaint",
        columns: 2,
        columnWidth: 1,
        allowBlank: false,
        items: [
          { boxLabel: "Scheduling delays", name: "complaint_scheduling_delay" },
          {
            boxLabel: "Manner of advisor/BOMRA Staff member",
            name: "complaint_manner_of_advisor",
          },
          {
            boxLabel: "Complaint turnaround time",
            name: "complaint_turnaround",
          },
          {
            boxLabel: "Delay getting response",
            name: "complaint_response_delay",
          },
          { boxLabel: "Other", name: "complaint_other" },
        ],
      },
    ],
  }
);
