Ext.define('Admin.view.auditManagement.panels.AuditPlanningReceiving', {
  extend: 'Ext.panel.Panel',
  xtype: 'auditplanningreceiving',
  controller: 'auditMgmntVctr',
  viewModel: {
      type: 'auditplanvm'
  },
  layout: 'fit',
  items: [
      {
          xtype: 'auditPlanningWizardPnl'
         
      }
  ]
});