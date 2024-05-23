Ext.define("Admin.view.workflowmanagement.views.forms.SysProcessesFrm", {
  extend: "Ext.form.Panel",
  xtype: "sysprocessesfrm",
  autoScroll: true,
  controller: "workflowmanagementvctr",
  layout: "form",
  height: Ext.Element.getViewportHeight() - 118,
  bodyPadding: 8,
  defaults: {
    labelAlign: "top",
    allowBlank: false,
  },
  items: [
    {
      xtype: "hiddenfield",
      margin: "0 20 20 0",
      name: "table_name",
      value: "wf_processes",
      allowBlank: true,
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
      xtype: "textfield",
      fieldLabel: "Name",
      margin: "0 20 20 0",
      name: "name",
    },
    {
      xtype: "combo",
      anyMatch: true,
      name: "is_dataammendment_request",
      valueField: "id",
      displayField: "name",
      queryMode: "local",
      forceSelection: true,
      allowBlank: true,
      anyMatch: true,
      fieldLabel: "Is Data Ammendment Request",
      value: 2,
      listeners: {
        beforerender: {
          fn: "setWorkflowCombosStore",
          config: {
            pageSize: 1000,
            proxy: {
              url: "configurations/getConfigParamFromTable",
              extraParams: {
                table_name: "par_confirmations",
              },
            },
          },
          isLoad: true,
        },
        change: function (cbo, value) {
          var form = cbo.up("form"),
            sub_module_id = form.down("combo[name=sub_module_id]");

          if (value == 1) {
            sub_module_id.allowBlank = true;
          } else {
            sub_module_id.allowBlank = false;
          }
        },
      },
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Module",
      margin: "0 20 20 0",
      name: "module_id",
      valueField: "id",
      displayField: "name",
      forceSelection: true,
      queryMode: "local",
      anyMatch: true,
      listeners: {
        beforerender: {
          fn: "setWorkflowCombosStore",
          config: {
            pageSize: 100,
            proxy: {
              url: "configurations/getConfigParamFromTable",
              extraParams: {
                table_name: "par_modules",
              },
            },
          },
          isLoad: true,
        },
        change: function (cmbo, newVal) {
          var form = cmbo.up("form"),
            importexport_permittype_id = form.down(
              "combo[name=importexport_permittype_id]"
            ),
            prodclass_category_id = form.down(
              "combo[name=prodclass_category_id]"
            ),
            premise_type_id = form.down("combo[name=premise_type_id]"),
            subModuleStore = form.down("combo[name=sub_module_id]").getStore(),
            workflowStr = form.down("combo[name=workflow_id]").getStore();
          subModuleStore.removeAll();
          subModuleStore.load({ params: { module_id: newVal } });
          workflowStr.load({ params: { module_id: newVal } });

          if (newVal == 4 || newVal == 12 || newVal == 9) {
            importexport_permittype_id.setVisible(true);
            prodclass_category_id.setVisible(false);
            premise_type_id.setVisible(false);
          } else if (newVal == 1) {
            prodclass_category_id.setVisible(true);
            importexport_permittype_id.setVisible(false);
            premise_type_id.setVisible(false);
          } else if (newVal == 2) {
            premise_type_id.setVisible(true);
            importexport_permittype_id.setVisible(false);
            prodclass_category_id.setVisible(false);
          } else {
            importexport_permittype_id.setVisible(false);
            prodclass_category_id.setVisible(false);
            premise_type_id.setVisible(false);
          }
        },
      },
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Sub Module",
      margin: "0 20 20 0",
      name: "sub_module_id",
      valueField: "id",
      displayField: "name",
      forceSelection: true,
      queryMode: "local",
      anyMatch: true,
      listeners: {
        afterrender: {
          fn: "setWorkflowCombosStore",
          config: {
            pageSize: 10000,
            proxy: {
              url: "workflow/getSystemSubModules",
              extraParams: {
                model_name: "SubModule",
              },
            },
          },
          isLoad: false,
        },
      },
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Section",
      margin: "0 20 20 0",
      name: "section_id",
      allowBlank: true,
      valueField: "id",
      displayField: "name",
      forceSelection: true,
      queryMode: "local",
      anyMatch: true,
      listeners: {
        beforerender: {
          fn: "setWorkflowCombosStore",
          config: {
            pageSize: 100,
            proxy: {
              url: "configurations/getConfigParamFromTable",
              extraParams: {
                table_name: "par_sections",
              },
            },
          },
          isLoad: true,
        },
        change: function (combo, newVal, oldVal, eopts) {
          var form = combo.up("form"),
            pdStr = form.down("combo[name=prodclass_category_id]").getStore(),
            premiseStr = form.down("combo[name=premise_type_id]").getStore(),
            filters = JSON.stringify({ section_id: newVal });
          pdStr.removeAll();
          premiseStr.removeAll();
          pdStr.load({ params: { filters: filters } });
          premiseStr.load({ params: { filters: filters } });
        },
      },
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Issue Type",
      margin: "0 20 20 0",
      name: "issue_type_id",
      allowBlank: true,
      valueField: "id",
      displayField: "name",
      forceSelection: true,
      queryMode: "local",
      anyMatch: true,
      listeners: {
        beforerender: {
          fn: "setWorkflowCombosStore",
          config: {
            pageSize: 100,
            proxy: {
              url: "configurations/getConfigParamFromTable",
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
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Product Category",
      margin: "0 20 20 0",
      name: "prodclass_category_id",
      allowBlank: true,
      valueField: "id",
      displayField: "name",
      forceSelection: true,
      queryMode: "local",
      anyMatch: true,
      listeners: {
        beforerender: {
          fn: "setWorkflowCombosStore",
          config: {
            pageSize: 100,
            proxy: {
              url: "configurations/getConfigParamFromTable",
              extraParams: {
                table_name: "par_prodclass_categories",
              },
            },
          },
          isLoad: true,
        },
      },
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Import/Export Permit Type",
      hidden: true,
      allowBlank: true,
      valueField: "id",
      displayField: "name",
      forceSelection: true,
      name: "importexport_permittype_id",
      queryMode: "local",
      fieldStyle: {
        color: "green",
        "font-weight": "bold",
      },
      listeners: {
        beforerender: {
          fn: "setCompStore",
          config: {
            pageSize: 1000,
            proxy: {
              url: "configurations/getConfigParamFromTable",
              extraParams: {
                table_name: "par_importexport_permittypes",
              },
            },
          },
          isLoad: true,
        },
      },
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Premise Type",
      margin: "0 20 20 0",
      name: "premise_type_id",
      allowBlank: true,
      hidden: true,
      valueField: "id",
      displayField: "name",
      forceSelection: true,
      queryMode: "local",
      anyMatch: true,
      listeners: {
        beforerender: {
          fn: "setWorkflowCombosStore",
          config: {
            pageSize: 100,
            proxy: {
              url: "configurations/getConfigParamFromTable",
              extraParams: {
                table_name: "par_premises_types",
              },
            },
          },
          isLoad: true,
        },
      },
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Workflow",
      margin: "0 20 20 0",
      name: "workflow_id",
      valueField: "id",
      displayField: "name",
      forceSelection: true,
      anyMatch: true,
      allowBlank: true,
      queryMode: "local",
      listeners: {
        beforerender: {
          fn: "setWorkflowCombosStore",
          config: {
            pageSize: 100,
            proxy: {
              url: "configurations/getConfigParamFromTable",
              extraParams: {
                table_name: "wf_workflows",
              },
            },
          },
          isLoad: true,
        },
      },
    },
    {
      xtype: "textarea",
      fieldLabel: "Description",
      margin: "0 20 20 0",
      name: "description",
      allowBlank: true,
    },
    {
      xtype: "checkbox",
      inputValue: 1,
      uncheckedValue: 0,
      name: "check_if_exists",
      fieldLabel: "Exists for Existence Validation",
    },
  ],
  dockedItems: [
    {
      xtype: "toolbar",
      ui: "footer",
      dock: "bottom",
      items: [
        {
          text: "Back",
          iconCls: "x-fa fa-backward",
          action: "back",
          containerType: "form",
          containerPnlXtype: "sysprocessespnl",
          hiddenCompXtype: "sysprocessesgrid",
          ui: "soft-purple",
          handler: "workflowBackToDashboard",
        },
        "->",
        {
          text: "Save Details",
          iconCls: "x-fa fa-save",
          action: "save",
          table_name: "wf_processes",
          storeID: "sysprocessesstr",
          containerPnlXtype: "sysprocessespnl",
          hiddenCompXtype: "sysprocessesgrid",
          formBind: true,
          ui: "soft-purple",
          action_url: "workflow/saveWorkflowCommonData",
          handler: "doCreateWorkflowParam",
        },
        {
          text: "Reset",
          iconCls: "x-fa fa-close",
          ui: "soft-purple",
          handler: function (btn) {
            btn.up("form").getForm().reset();
          },
        },
      ],
    },
  ],
});
