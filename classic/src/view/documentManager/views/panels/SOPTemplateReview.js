Ext.define('Admin.view.documentManager.views.panels.SOPTemplateReview', {
  extend: 'Ext.panel.Panel',
  xtype: 'soptemplatereview', 
  controller: 'documentsManagementvctr',
  viewModel: 'documentcreationvm',
  layout: 'fit',
  items:[{
    xtype:'soptemplatereviewpnl',
}]
});