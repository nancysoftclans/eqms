Ext.define('Admin.view.auditManagement.views.toolbars.AuditMgmntTb.js', {
    extend: 'Ext.toolbar.Toolbar',
    xtype:'auditManagementDashTb',
    ui: 'footer', 
    defaults: {
        ui: 'soft-blue',
        iconAlign: 'top' 
    },
    requires: [
        'Ext.ux.BoxReorderer'
    ],
    plugins: 'boxreorderer',
    overflowHandler: 'scroller',
    items: [
        {
            text: 'Home',
            iconCls: 'x-fa fa-home',
            sec_dashboard:'auditManagementDashWrapperPnl',
            name: 'disposalpermitstbRegHomeBtn'
        },
        {
            text: 'Plan Audit',
            iconCls: 'x-fa fa-plus-square',
            handler: 'onInitiateAuditPlan',
            app_type: 103
        }
    ]
});
