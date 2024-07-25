Ext.define('Admin.view.documentManager.views.panels.SOPTemplateRelease', {
  extend: 'Ext.panel.Panel',
  xtype: 'soptemplaterelease', 
  controller: 'documentsManagementvctr',
  viewModel: 'documentcreationvm',
  layout: 'fit',
  items:[{
    xtype:'soptemplatereleasepnl',
}]
});

