
Ext.define('Admin.view.documentManager.views.panels.ReceivingSOPTemplate', {
  extend: 'Ext.panel.Panel',
  xtype: 'receivingsoptemplate', 
  controller: 'documentsManagementvctr',
  viewModel: 'documentcreationvm',
  layout: 'fit',
  items:[{
    xtype:'receivingsoptemplatepnl',
}]
});