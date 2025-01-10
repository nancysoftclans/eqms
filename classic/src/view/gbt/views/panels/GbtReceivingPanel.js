Ext.define(
  "Admin.view.gbt.views.grids.GbtReceivingPanel",
  {
    extend: "Ext.panel.Panel",
    xtype: "gbtreceiving",
    controller: "issuemanagementvctr",
    viewModel: "gbtplanvm",
    layout: "fit",
    
    items: [
      {
        xtype: "gbtreceivingwizard",
      },
    ],
  }
);
