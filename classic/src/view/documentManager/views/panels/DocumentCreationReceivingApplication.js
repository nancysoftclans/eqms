Ext.define('Admin.view.documentManager.views.panels.DocumentCreationReceivingApplication', {
  extend: 'Ext.panel.Panel',
  xtype: 'documentcreationreceivingapplication',
  controller: 'documentsManagementvctr',
  viewModel: {
      type: 'documentcreationvm'
  },
  layout: 'fit',
  items: [
      {
          xtype: 'documentapplicationreceivingwizard'
         
      }
  ]
});