Ext.define('Admin.view.documentsManagement.views.panels.DocumentCreationReceivingApplication', {
  extend: 'Ext.panel.Panel',
  xtype: 'documentcreationreceivingapplication',
  controller: 'documentsManagementvctr',
  // viewModel: {
  //     type: 'importexportpermitsvm'
  // },
  layout: 'fit',
  items: [
      {
          xtype: 'documentapplicationreceivingwizard'
      }
  ]
});