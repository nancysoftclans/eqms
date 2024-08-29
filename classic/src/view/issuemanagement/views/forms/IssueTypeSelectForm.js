Ext.define("Admin.view.issuemanagement.views.forms.IssueTypeSelectForm", {
  extend: "Ext.form.Panel",
  xtype: "issuetypeselectform",
  controller: "issuemanagementvctr",
  autoScroll: true,
  layout: "form",
  frame: true,
  bodyPadding: 8,
  defaults: {
    labelAlign: "top",
    allowBlank: false,
  },

  items: [
    {
      xtype: "hiddenfield",
      margin: "0 20 20 0",
      name: "_token",
      value: token,
      allowBlank: true,
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "<strong>Issue Type</strong>",
      margin: "0 20 20 0",
      name: "issue_type_id",
      valueField: "id",
      displayField: "title",
      forceSelection: true,
      allowBlank: false,
      queryMode: "local",
      listeners: {
        beforerender: {
          fn: "setCompStore",
          config: {
            proxy: {
              extraParams: {
                table_name: "par_issue_types",
              },
            },
          },
          isLoad: true,
        },
      },
    },
  ],
  dockedItems: [
    {
      xtype: "toolbar",
      ui: "footer",
      dock: "bottom",
      items: [
        "->",
        {
          text: "Raise",
          iconCls: "x-fa fa-save",
          formBind: true,
          ui: "soft-blue",
          handler: "showNewIssueApplication",
          wrapper_xtype: "issuemanagementwrapper"
        },
      ],
    },
  ],
});
