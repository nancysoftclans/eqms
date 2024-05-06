Ext.define('Admin.view.QMS.auditManagement.views.forms.AuditTypeCustomFields', {
    extend: 'Ext.form.Panel',
    xtype: 'auditTypeCustomFieldsFrm',
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
    items: [{
        name: 'id',
        xtype: 'hiddenfield',
    }]
})