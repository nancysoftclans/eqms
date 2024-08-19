Ext.define('Admin.view.auditManagement.panels.AuditSchedule', {
  extend: 'Ext.panel.Panel',
  xtype: 'auditschedule', 
  controller: 'auditMgmntVctr',
  viewModel: 'auditplanvm',
  layout: 'fit',
  items:[{
    xtype:'auditschedulepnl',
}]
});