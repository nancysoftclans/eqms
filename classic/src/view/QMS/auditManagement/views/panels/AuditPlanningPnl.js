Ext.define('Admin.view.QMS.auditManagement.panels.AuditPlanningPnl',{
    extend: 'Ext.panel.Panel',
    xtype: 'auditPlanningPnl',
    controller: 'auditMgmntVctr',
    layout: 'fit',

    items: [{
        xtype: 'auditPlanningWizardPnl'
    }]
})