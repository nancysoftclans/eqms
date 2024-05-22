Ext.define('Admin.view.documentManager.views.panels.DocumentRelease', {
  extend: 'Ext.panel.Panel',
  xtype: 'documentrelease', 
  controller: 'documentsManagementvctr',
  viewModel: 'documentcreationvm',
  layout: 'fit',
  items:[{
    xtype:'documentreleasepnl',
}]
});

