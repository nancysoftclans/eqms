Ext.define('Admin.view.QMS.auditManagement.views.forms.NewAuditTypeDetailsFrm',{
    extend: 'Ext.form.Panel',
    xtype: 'newAuditTypeDetailsFrm',
    controller: 'auditMgmntVctr',
    layout: 'column',
    autoScroll: true,
    scrollable: true,
    bodyPadding: 5,
    defaults: {
        columnWidth: 1,
        labelAlign: 'top',
        margin: 3
    },
    items: [
        {
            xtype: 'textfield',
            name: 'audit_type_code',
            fieldLabel: 'Code',
        },
        {
            xtype: 'textfield',
            name: 'audit_title',
            fieldLabel: 'Title',
            
        },
        {
            xtype: 'textfield',
            name: 'audit_prefix',
            fieldLabel: 'Prefix',
        }
    ]
})