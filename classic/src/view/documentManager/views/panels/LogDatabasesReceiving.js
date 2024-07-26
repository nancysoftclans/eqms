
Ext.define('Admin.view.documentManager.views.panels.LogDatabasesReceiving', {
  extend: 'Ext.panel.Panel',
  xtype: 'logdatabasesreceiving', 
  controller: 'documentsManagementvctr',
  viewModel: 'documentcreationvm',
  layout: 'fit',
  items:[{
    xtype:'logdatabasesreceivingpnl',
}]
});