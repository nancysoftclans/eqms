Ext.define('Admin.view.auditManagement.panels.AuditPlanMainDetailsFrm',{
    extend: 'Ext.form.Panel',
    xtype: 'auditPlanMainDetailsFrm',
    controller: 'auditMgmntVctr',

    height: Ext.Element.getViewportHeight() - 118,
    layout: {
        type: 'column'
    },
    bodyPadding: 5,
    defaults: {
        columnWidth: 0.33,
        margin: 5,
        allowBlank: true,
        labelAlign: 'top'
    },
    scrollable: true,
    autoScroll: true,

    items: [
        {
            xtype: 'hiddenfield',
            name: 'id'
        },
        {
            xtype: 'hiddenfield',
            name: 'audit_type_id',
        },
        {
            xtype: 'hiddenfield',
            name: 'application_code'
        },
        {
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        }, 
        {
            xtype: 'textfield',
            fieldLabel: 'Title',
            name: 'audit_label',
            columnWidth: 0.33,
            labelAlign: 'top'

        },
        {
            xtype: 'textfield',
            fieldLabel: 'Audit Types',
            name: 'audit_type_name',
            columnWidth: 0.23
        },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-link',
            columnWidth: 0.10,
            tooltip: 'Select Audit Type',
            handler: 'showAuditTypesRecords',
            margin: '35 0 0 0',
        },
       
        {
            xtype: 'datefield',
            columnWidth: 0.33,
            labelAlign : 'top',
            format: 'Y-m-d',
            name: 'audit_start_date',
            fieldLabel: 'Start Date',
            allowBlank: false,
        }, 
        {
            xtype: 'datefield',
            name: 'audit_start_date',  
            margin: 2,
            format: 'Y-m-d',
            labelAlign : 'top',
            columnWidth: 0.33,
            allowBlank: false,
            fieldLabel: 'End Date',
            maxValue: new Date(),

        },
        {
            xtype: 'textfield',
            fieldLabel: 'Status',
            name: 'status',
            columnWidth: 0.33
        },
        {
            xtype: 'htmleditor',
            name: 'audit_summary',
            columnWidth: 1,
            labelAlign : 'top',
            fieldLabel: 'Summary & Scope'

        }

    ]
})