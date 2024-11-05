Ext.define("Admin.view.issuemanagement.views.forms.IssueTypeForm", {
  extend: "Ext.form.Panel",
  xtype: "issuetypeform",
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
          columnWidth: 1,
          allowBlank: false,
        },
        {
          xtype: "textarea",
          fieldLabel: "Description",
          margin: "0 20 20 0",
          name: "description",
          columnWidth: 1,
          allowBlank: true,
        },
        {
          xtype: "combo",
          anyMatch: true,
          fieldLabel: "Form",
          margin: "0 20 20 0",
          name: "form_id",
          columnWidth: 1,
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
                    table_name: "par_form_categories",
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
          fieldLabel: "Status Group",
          margin: "0 20 20 0",
          name: "status_group_id",
          columnWidth: 0.33,
          valueField: "id",
          displayField: "title",
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
                    table_name: "par_issue_status_groups",
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
          fieldLabel: "Issue Type Category",
          margin: "0 20 20 0",
          name: "issue_type_category_id",
          columnWidth: 0.33,
          valueField: "id",
          displayField: "title",
          forceSelection: true,
          allowBlank: true,
          queryMode: "local",
          listeners: {
            afterrender: {
              fn: "setCompStore",
              config: {
                pageSize: 10000,
                proxy: {
                  extraParams: {
                    table_name: "par_issue_type_categories",
                  },
                },
              },
              isLoad: true,
            },
          },
        },
        {
          xtype: "checkbox",
          inputValue: 1,
          uncheckedValue: 0,
          fieldLabel: "Active",
          margin: "0 20 20 0",
          name: "is_enabled",
          columnWidth: 0.33,
          allowBlank: true,
        },
        {
          xtype: 'combo', anyMatch: true,
          name: 'is_checklist_tied',
          store: 'confirmationstr',
          valueField: 'id',
          displayField: 'name',
          queryMode: 'local',
          forceSelection: true,
          columnWidth: 0.5,
          fieldLabel: 'Tied to Checklist?',
          value: 2,
          listeners: {
            change: function (cmb, newVal) {
              var form = cmb.up('form'),
                checklistCategory = form.down('combo[name=checklist_category_id]');
              if (newVal == 1 || newVal === 1) {
                checklistCategory.allowBlank = false;
                checklistCategory.validate();
                checklistCategory.setVisible(true);
              } else {
                checklistCategory.reset();
                checklistCategory.allowBlank = true;
                checklistCategory.validate();
                checklistCategory.setVisible(false);
              }
            }
          }
        }, {
          xtype: 'combo', anyMatch: true,
          fieldLabel: 'Checklist Category',
          name: 'checklist_category_id',
          allowBlank: true,
          valueField: 'id',
          displayField: 'name',
          columnWidth: 0.5,
          queryMode: 'local',
          hidden: true,
          listeners: {
            beforerender: {
              fn: 'setWorkflowCombosStore',
              config: {
                pageSize: 1000,
                proxy: {
                  url: 'configurations/getConfigParamFromTable',
                  extraParams: {
                    table_name: 'par_checklist_categories'
                  }
                }
              },
              isLoad: true
            }
          }
        },
        {
          xtype: 'combo', anyMatch: true,
          name: 'has_action_plan',
          store: 'confirmationstr',
          valueField: 'id',
          displayField: 'name',
          queryMode: 'local',
          forceSelection: true,
          columnWidth: 0.5,
          fieldLabel: 'Has Action Plan?',
          value: 2,
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
          storeID: "issuetypestr",
          formBind: true,
          ui: "soft-blue",
          action_url: "issuemanagement/issue_types",
          handler: "doCreateConfigParamWin",
        },
      ],
    },
  ],
});
