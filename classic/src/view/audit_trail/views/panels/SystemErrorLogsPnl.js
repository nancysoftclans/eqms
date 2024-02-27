Ext.define('Admin.view.audit_trail.view.panel.SystemErrorLogsPnl', {
	extend: 'Ext.tab.Panel',
	xtype: 'systemErrorLogsPnl',
	margin: 2,
	layout: 'fit',
    height: Ext.Element.getViewportHeight() - 118,
    controller: 'audit_trialViewCtr',
    defaults: {
        bodyPadding: 10,
        scrollable: true,
    },
    items: [{
        xtype:'systemErrorLogsGrid',
        title: 'Pending Resolution'
    },{
        xtype: 'resolvedSystemErrorLogsGrid',
        title: 'Resolved Errors'
    }]
});