Ext.define('Admin.view.documentManager.views.panels.DocumentRenewal', {
  extend: 'Ext.panel.Panel',
  xtype: 'documentrenewal',
  controller: 'documentsManagementvctr',
  viewModel: {
      type: 'documentcreationvm'
  },
  layout: 'fit',
  items: [
      {
          xtype: 'documentrenewalwizard'
         
      }
  ]
});