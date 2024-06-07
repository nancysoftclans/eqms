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
            columnWidth: 1,
            labelAlign: 'top'

        },
        {
            xtype: 'fieldcontainer',
			readOnly:true,
            layout: 'column',
            name:'registration_container',
            fieldLabel: 'Audit Type',
            columnWidth: 1,
            defaults: {
                labelAlign: 'top'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'audit_type_name',
                    columnWidth: 0.9
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-link',
                    columnWidth: 0.1,
                    tooltip: 'Select Audit Type',
                    handler: 'showAuditTypesRecords'
                }
            ]
        },
        {
            xtype: 'datefield',
            columnWidth: 1,
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
            allowBlank: false,
            fieldLabel: 'End Date',
            maxValue: new Date(),

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