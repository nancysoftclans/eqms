Ext.define('Admin.view.documentManager.views.panels.DocumentSubmission', {
  extend: 'Ext.panel.Panel',
  xtype: 'documentsubmission', 
  controller: 'documentsManagementvctr',
  viewModel: 'documentcreationvm',
  layout: 'fit',
  items:[{
    xtype:'documentsubmissionpnl',
}]
});

