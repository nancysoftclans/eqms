Ext.define('Admin.view.documentManager.views.panels.SOPTemplateApproval', {
  extend: 'Ext.panel.Panel',
  xtype: 'soptemplateapproval', 
  controller: 'documentsManagementvctr',
  viewModel: 'documentcreationvm',
  layout: 'fit',
  items:[{
    xtype:'soptemplateapprovalpnl',
}]
});

