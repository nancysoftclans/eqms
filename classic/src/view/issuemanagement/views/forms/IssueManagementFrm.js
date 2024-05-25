Ext.define("Admin.view.issuemanagement.views.forms.IssueManagementFrm", {
  extend: "Ext.form.Panel",
  xtype: "issuemanagementfrm",
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
      name: "module_id",
    },
    {
      xtype: "hiddenfield",
      name: "sub_module_id",
    },
    {
      xtype: "hiddenfield",
      name: "application_code",
    },
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
    // {
    //   xtype: "fieldset",
    //   columnWidth: 1,
    //   title: "Issue Details",
    //   collapsible: true,
    //   defaults: {
    //     labelAlign: "top",
    //     allowBlank: false,
    //     labelAlign: "top",
    //     margin: 5,
    //     xtype: "textfield",
    //     allowBlank: false,
    //     columnWidth: 0.5,
    //   },
    //   layout: "column",
    // items: [
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Issue Type",
      margin: "0 20 20 0",
      name: "issue_type_id",
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
                table_name: "par_issue_types",
              },
            },
          },
          isLoad: true,
        },
      },
    },
    {
      xtype: "datefield",
      fieldLabel: "Creation Date",
      margin: "0 20 20 0",
      name: "creation_date",
    },
    {
      xtype: "textfield",
      fieldLabel: "Title",
      margin: "0 20 20 0",
      name: "title",
      columnWidth: 1,
      allowBlank: false,
    },
    {
      xtype: "textarea",
      fieldLabel: "Description",
      margin: "0 20 20 0",
      name: "description",
      columnWidth: 1,
      allowBlank: false,
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Status",
      margin: "0 20 20 0",
      name: "issue_status_id",
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
                table_name: "par_issue_statuses",
              },
            },
          },
          isLoad: true,
        },
      },
    },
    {
      xtype: "datefield",
      fieldLabel: "Target Resolution Date",
      margin: "0 20 20 0",
      name: "target_resolution_date",
    },
    {
      xtype: "tagfield",
      fieldLabel: "Organisational Areas",
      margin: "0 20 20 0",
      name: "section_ids",
      allowBlank: true,
      // forceSelection: true,
      filterPickList: true,
      encodeSubmitValue: true,
      emptyText: "Select",
      growMax: 100,
      queryMode: "local",
      valueField: "id",
      displayField: "name",
      columnWidth: 1,
      listeners: {
        beforerender: {
          fn: "setWorkflowCombosStore",
          config: {
            pageSize: 1000,
            proxy: {
              url: "configurations/getConfigParamFromTable",
              extraParams: {
                table_name: "par_sections",
              },
            },
          },
          isLoad: true,
        },
      },
    },
    // ],
    // },
  ],
});
