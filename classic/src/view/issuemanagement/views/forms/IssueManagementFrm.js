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
  //bodyPadding: 5,
  defaults: {
    columnWidth: 0.33,
    margin: 5,
    labelAlign: "top",
  },
  frame: true,
  bodyPadding: 8,
  items: [
    {
      xtype: "hiddenfield",
      margin: "0 20 20 0",
      name: "table_name",
      value: "tra_documentmanager_application",
      allowBlank: true,
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
    {
      xtype: "fieldset",
      columnWidth: 1,
      title: "",
      collapsible: true,
      defaults: {
        labelAlign: "top",
        allowBlank: false,
        labelAlign: "top",
        margin: 5,
        xtype: "textfield",
        allowBlank: false,
        columnWidth: 0.33,
      },
      layout: "column",
      items: [
        {
          xtype: "textfield",
          fieldLabel: "Document Title",
          margin: "0 20 20 0",
          name: "name",
        },
        {
          xtype: "combo",
          anyMatch: true,
          fieldLabel: "Document Type",
          margin: "0 20 20 0",
          name: "document_type_id",
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
                    table_name: "par_document_types",
                  },
                },
              },
              isLoad: true,
            },
          },
        },
        {
          xtype: "tagfield",
          fieldLabel: "Allowed Document Extensions",
          margin: "0 20 20 0",
          name: "property_id",
          allowBlank: true,
          forceSelection: true,
          filterPickList: true,
          encodeSubmitValue: true,
          emptyText: "Select Appropriate Property",
          growMax: 100,
          queryMode: "local",
          valueField: "id",
          displayField: "name",
          listeners: {
            beforerender: {
              fn: "setWorkflowCombosStore",
              config: {
                pageSize: 1000,
                proxy: {
                  url: "configurations/getConfigParamFromTable",
                  extraParams: {
                    table_name: "par_document_properties",
                  },
                },
              },
              isLoad: true,
            },
          },
        },
        {
          xtype: "textfield",
          fieldLabel: "Version",
          margin: "0 20 20 0",
          name: "version",
        },
        {
          xtype: "combo",
          anyMatch: true,
          fieldLabel: "Document Owner",
          margin: "0 20 20 0",
          name: "document_owner_id",
          valueField: "id",
          displayField: `firstname`,
          forceSelection: true,
          allowBlank: false,
          queryMode: "local",
          listeners: {
            afterrender: {
              fn: "setCompStore",
              config: {
                pageSize: 10000,
                proxy: {
                  url: "usermanagement/documentOwner",
                  extraParams: {
                    //table_name: 'par_user_roles'
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
});
