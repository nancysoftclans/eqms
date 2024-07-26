Ext.define(
  "Admin.view.issuemanagement.views.forms.IssueQualityReviewFrm",
  {
    extend: "Ext.form.Panel",
    xtype: "issuequalityreviewfrm",
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
        fieldLabel: "<strong>Has the complaint been fully addressed?</strong>",
        margin: "0 20 20 0",
        allowBlank: false,
        name: "complaint_fully_addressed",
        columns: 1,
        items: [
          { boxLabel: "Complaint fully addressed", name: "complaint_fully_addressed", inputValue: 1 },
          { boxLabel: "Complaint not fully addressed and returned to the assigned officer for proper action", name: "complaint_fully_addressed", inputValue: 2 },
        ],
      }
    ],
  }
);
