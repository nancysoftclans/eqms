Ext.define("Admin.view.issuemanagement.views.forms.ComplainantDetailsFrm", {
  extend: "Ext.form.Panel",
  xtype: "complainantdetailsfrm",
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
      xtype: "textfield",
      fieldLabel: "Name of Complainant",
      margin: "0 20 20 0",
      name: "complainant_name",
    },
    {
      xtype: "textfield",
      fieldLabel: "Name of Organisation (if applicable)",
      margin: "0 20 20 0",
      name: "organisation_name",
    },
    {
      xtype: "textfield",
      fieldLabel: "Complainant Address",
      margin: "0 20 20 0",
      name: "complainant_address",
    },
    {
      xtype: "textfield",
      fieldLabel: "Telephone",
      margin: "0 20 20 0",
      name: "complainant_telephone",
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Complaint or Appeal",
      margin: "0 20 20 0",
      name: "complaint_type_id",
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
                table_name: "par_complaint_types",
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
      fieldLabel: "Mode of Complaint",
      margin: "0 20 20 0",
      name: "complaint_mode_id",
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
                table_name: "par_complaint_modes",
              },
            },
          },
          isLoad: true,
        },
      },
    },
  ],
});
