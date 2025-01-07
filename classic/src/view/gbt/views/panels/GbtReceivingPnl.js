Ext.define("Admin.view.gbt.views.grids.GbtReceivingPnl", {
  extend: "Ext.tab.Panel",
  xtype: "gbtreceivingpnl",
  layout: {
    type: "fit",
  },
  defaults: {
    margin: 3,
  },
  viewModel: {
    type: "gbtplanvm",
  },
  items: [
    {
      xtype: "gbtmanagementfrm",
      autoScroll: true,      
      title: "Details",
    },    
    // {
    //   title: "Associated Items",
    //   xtype: 'tabpanel',
    //   items: [
    //     {
    //       xtype: "issuemanagementorgareasgrid",
    //       title: "Organisational Areas",
    //     },
    //     {
    //       xtype: "issuemanagementdocgrid",
    //       title: "Associated Documents",
    //     },
    //     {
    //       xtype: "issuemanagementissuegrid",
    //       title: "Associated Issues",
    //     },
    //     {
    //       xtype: "issuemanagementauditgrid",
    //       title: " Associated Audits",
    //     }
    //   ],
    // },
    
    // {
    //   xtype: "issueactivitygrid",
    //   autoScroll: true,
    //   title: "Activity",
    // },
    {
      xtype: "hiddenfield",
      name: "_token",
      value: token,
    },
  ],
});
