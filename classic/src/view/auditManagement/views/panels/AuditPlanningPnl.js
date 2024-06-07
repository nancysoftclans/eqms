Ext.define('Admin.view.auditManagement.panels.AuditPlanningPnl',{
    extend: 'Ext.panel.Panel',
    xtype: 'auditPlanningPnl',
    controller: 'auditMgmntVctr',
    layout: 'fit',

    items: [{
        xtype: 'auditMgmntDashCtn'
    }]
})