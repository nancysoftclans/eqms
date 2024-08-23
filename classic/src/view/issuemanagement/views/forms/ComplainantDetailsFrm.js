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
      fieldLabel: "<strong>Name of Complainant</strong>",
      margin: "0 20 20 0",
      name: "complainant_name",
      allowBlank: false,
    },
    {
      xtype: "textfield",
      fieldLabel: "<strong>Name of Organisation (if applicable)</strong>",
      margin: "0 20 20 0",
      name: "complainant_organisation",
    },
    {
      xtype: "textfield",
      fieldLabel: "<strong>Complainant Address</strong>",
      margin: "0 20 20 0",
      name: "complainant_address",
    },
    {
      xtype: "textfield",
      fieldLabel: "<strong>Telephone</strong>",
      margin: "0 20 20 0",
      name: "complainant_telephone",
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "<strong>Complaint or Appeal</strong>",
      margin: "0 20 20 0",
      name: "complaint_type",
      valueField: "id",
      displayField: "name",
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
      fieldLabel: "<strong>Mode of Complaint</strong>",
      margin: "0 20 20 0",
      name: "complaint_mode",
      valueField: "id",
      displayField: "name",
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
