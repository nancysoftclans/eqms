Ext.define("Admin.view.issuemanagement.views.forms.IssueStatusGroupsForm", {
  extend: "Ext.form.Panel",
  xtype: "issuestatusgroupsform",
  controller: "issuemanagementvctr",
  autoScroll: true,
  scrollable: true,
  bodyPadding: 8,
  defaults: {
    labelAlign: "top",
    allowBlank: false,
  },
  viewModel: {
    type: "",
  },
  layout: {
    type: "column",
  },
  bodyPadding: 5,
  defaults: {
    columnWidth: 0.33,
    margin: 5,
    labelAlign: "top",
  },
  bodyPadding: 8,
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
      xtype: "fieldset",
      columnWidth: 1,
      // title: "Create",
      collapsible: false,
      defaults: {
        labelAlign: "top",
        allowBlank: false,
        labelAlign: "top",
        margin: 5,
        xtype: "textfield",
        allowBlank: false,
        columnWidth: 1,
      },
      layout: "column",
      items: [
        {
          xtype: "textfield",
          fieldLabel: "Title",
          margin: "0 20 20 0",
          name: "title",
          allowBlank: false,
        },
        {
          xtype: "checkbox",
          inputValue: 1,
          uncheckedValue: 0,
          fieldLabel: "Is Enabled",
          margin: "0 20 20 0",
          name: "is_enabled",
          allowBlank: true,
        },
      ],
    },
    {
      xtype: "fieldset",
      columnWidth: 1,
      // title: "Statuses within lifecycle",
      collapsible: false,
      defaults: {
        labelAlign: "top",
        allowBlank: false,
        labelAlign: "top",
        margin: 5,
        xtype: "textfield",
        allowBlank: false,
        columnWidth: 1,
      },
      layout: "column",
      items: [
        {
          xtype: "tagfield",
          fieldLabel: "Statuses within lifecycle",
          name: "issue_status_ids",
          allowBlank: false,
          filterPickList: true,
          encodeSubmitValue: true,
          emptyText: "Select",
          growMax: 100,
          queryMode: "local",
          valueField: "id",
          displayField: "title",
          columnWidth: 1,
          listeners: {
            beforerender: {
              fn: "setWorkflowCombosStore",
              config: {
                pageSize: 1000,
                proxy: {
                  url: "configurations/getConfigParamFromTable",
                  extraParams: {
                    table_name: "par_issue_statuses",
                  },
                },
              },
              isLoad: true,
            },
          },
        },
      ],
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
    },
  ],
});