Ext.define("Admin.view.issuemanagement.views.forms.IssueResolutionFrm", {
  extend: "Ext.form.Panel",
  xtype: "issueresolutionfrm",
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
      fieldLabel: "<strong>Resolution</strong>",
      margin: "0 20 20 0",
      name: "issue_resolution",
      allowBlank: false,
    },
    {
      xtype: "displayfield",
      fieldLabel: "<strong>Has the resolution been communicated to the customer?</strong>",
      margin: "0 20 20 0",
      value: '<strong>Remember to attach all supporting documents, eg letters sent to the customer.</strong>'
    },
  ],
});
