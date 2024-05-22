Ext.define('Admin.view.documentManager.views.panels.DocumentSubmissionApproval', {
  extend: 'Ext.panel.Panel',
  xtype: 'documentsubmissionapproval', 
  controller: 'documentsManagementvctr',
  viewModel: 'documentcreationvm',
  layout: 'fit',
  items:[{
    xtype:'documentsubmissionapprovalpnl',
}]
});

