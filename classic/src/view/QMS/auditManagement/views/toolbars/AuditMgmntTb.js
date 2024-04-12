Ext.define('Admin.view.QMS.auditManagement.views.toolbars.AuditMgmntTb.js', {
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
            xtype: 'hiddenfield',
            name: 'section_id',
            value: 8
        },
        {
            text: 'Plan Audit',
            iconCls: 'x-fa fa-plus',
            handler: 'onInitiateAuditPlan',
            xtypeWrapper: '#auditManagementDashWrapperPnl',
            module_id: 28,
            app_type: 102,
            section_id: 8 //N/A
        },
    ]
});