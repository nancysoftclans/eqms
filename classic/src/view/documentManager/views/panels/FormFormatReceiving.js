
Ext.define('Admin.view.documentManager.views.panels.FormFormatReceiving', {
  extend: 'Ext.panel.Panel',
  xtype: 'formformatreceiving', 
  controller: 'documentsManagementvctr',
  viewModel: 'documentcreationvm',
  layout: 'fit',
  items:[{
    xtype:'formformatreceivingpnl',
}]
});