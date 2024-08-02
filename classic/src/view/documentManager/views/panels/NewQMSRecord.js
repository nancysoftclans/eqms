Ext.define('Admin.view.documentManager.views.panels.NewQMSRecord', {
  extend: 'Ext.panel.Panel',
  xtype: 'newqmsrecord',
  controller: 'documentsManagementvctr',
  viewModel: {
      type: 'documentcreationvm'
  },
  layout: 'fit',
  items: [
      {
          xtype: 'newqmsrecordwizard'
         
      }
  ]
});