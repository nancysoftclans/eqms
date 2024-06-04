Ext.define('Admin.view.auditManagement.views.panels.NewAuditTypePnl', {
    extend: 'Ext.tab.Panel',
    xtype: 'newAuditTypePnl',
    controller: 'auditMgmntVctr',
    height: Ext.Element.getViewportHeight() - 118,
    
    autoScroll: true,
    scrollable: true,
    defaults:{
        margin: 3
    },
    listeners: {
        beforetabchange: 'funcBeforeShowAuditTypeMetadata'
    },
    
    items: [{
        xtype: 'newAuditTypeDetailsFrm',
        title: 'Audit Type'
    },
    {
        xtype: 'auditTypeCustomFieldsGrd',
        title: 'Custom Fields'
    }
    ]
})