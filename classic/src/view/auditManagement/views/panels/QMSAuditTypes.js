Ext.define('Admin.view.auditManagement.views.panels.QMSAuditTypes',  {
    extend: 'Ext.panel.Panel',
    xtype: 'qmsaudittypes',
    title: 'Document Type',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'qmsaudittypegrid'
        }
    ]
});
