Ext.define(
  "Admin.view.issuemanagement.views.panels.CustomerComplaintDetailsPnl",
  {
    extend: "Ext.tab.Panel",
    xtype: "customercomplaintdetailspnl",
    layout: {
      //
      type: "fit",
    },
    defaults: {
      margin: 3,
    },
    viewModel: {
      type: "issuemgmtvm",
    },
    // listeners: {
    //     tabchange: 'funcActiveImportOtherInformationTab'
    // },
    items: [
      {
        xtype: "customercomplaintbasicinfofrm",
        autoScroll: true,
        title: "Complaint Details",
      },
      {
        xtype: "hiddenfield",
        name: "_token",
        value: token,
      },
    ],
  }
);
