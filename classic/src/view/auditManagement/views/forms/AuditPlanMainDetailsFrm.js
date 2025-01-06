Ext.define('Admin.view.auditManagement.panels.AuditPlanMainDetailsFrm',{
    extend: 'Ext.form.Panel',
    xtype: 'auditPlanMainDetailsFrm',
    itemId: 'auditPlanMainDetailsFrm',
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
        name: 'id',
        allowBlank: true
        },
        {
        xtype: 'hiddenfield',
        name: '_token',
        value: token,
        allowBlank: true
        },
        {
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'tra_auditsmanager_application',
        allowBlank: true
       },

        {
        xtype:'fieldset',
        columnWidth: 1,
        title: "Create Audit",
        collapsible: true,
        defaults: {
            labelAlign: 'top',
            allowBlank: false,
            labelAlign: 'top',
            margin: 5,
            xtype: 'textfield',
            allowBlank: false,
            columnWidth: 0.33,
        },
        layout: 'column',
        items:[{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Option',
        name: 'option_type',
        valueField: 'id',
        displayField: `name`,
        margin: '0 20 20 0',
        forceSelection: true,
        allowBlank: true,
        hidden: true,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        //url: 'usermanagement/documentOwner',
                        extraParams: {
                            table_name: 'par_groups'
                        }
                    }
                },
                isLoad: true
            }
        }
    },{
        xtype: 'textfield',
        fieldLabel: 'ID',
        margin: '0 20 20 0',
        name: 'audit_id',
        allowBlank: true
    },{
            xtype: 'textfield',
            fieldLabel: 'Reference',
            margin: '0 20 20 0',
            name: 'audit_reference',

        }, {
            xtype: 'textfield',
            fieldLabel: 'Title',
            margin: '0 20 20 0',
            name: 'audit_title',

        },
        {
            xtype: 'textfield',
            fieldLabel: 'Audit Types',
            name: 'audit_type_name',
            columnWidth: 0.23,
            readOnly: true
        },
        {
            xtype: 'textfield',
            name: 'audit_type_id',
           // columnWidth: 0.9,
            allowBlank: false,
            hidden: true,
            fieldLabel: 'AUDIT ID',
            readOnly: true
        },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-link',
            columnWidth: 0.10,
            tooltip: 'Select Audit Type',
           // handler: 'showAuditTypesRecords',
            winTitle: 'Select Audit Type',
            winWidth: '90%',
            margin: '35 0 0 0',
            action: 'search_audit_type',
            childXtype: 'audittypesgrid',
        },
        {
            xtype: 'htmleditor',
            name: 'audit_summary',
            columnWidth: 1,
            labelAlign : 'top',
            margin: '0 20 20 0',
            columnWidth: 1,
            fieldLabel: 'Summary & Scope'

        }
        ]
    },
     {
        xtype:'fieldset',
        columnWidth: 1,
        collapsible: true,
        defaults: {
            //labelAlign: 'top',
            allowBlank: false,
            labelAlign: 'top',
            margin: 5,
            allowBlank: false,    
        },
        layout: 'column',
        items:[
        {
            xtype: 'checkbox',
            inputValue: 1,
            uncheckedValue: 0,
            fieldLabel: 'Full Day Audit',
            labelAlign: 'left',
            //margin: '0 20 20 0',
            name: 'is_full_day',
            itemId: 'isEnabledCheckbox',
            allowBlank: true,
            columnWidth: 1,
            listeners: {
                change: function(checkbox, newValue, oldValue, eOpts) {
                    var startTimeField = checkbox.up('form').down('#startTimeField'),
                        endTimeField = checkbox.up('form').down('#endTimeField');
                        
                    if (newValue) {
                        startTimeField.show();
                        endTimeField.show();
                    } else {
                        startTimeField.hide();
                        endTimeField.hide();
                    }
                }
            }
        },
        {
            xtype: 'datefield',
            name: 'audit_start_date',
            labelAlign: 'top',
            format: 'd F Y',
            columnWidth: 0.5,
            fieldLabel: 'Start Date',
            allowBlank: true,
            //minValue: new Date(),
        }, 
        {
            xtype: 'datefield',
            name: 'audit_end_date',  
            format: 'd F Y',
            labelAlign: 'top',
            columnWidth: 0.5,
            allowBlank: true,
            fieldLabel: 'End Date',
        }, 
        {
            xtype: 'timefield',
            name: 'start_time',
            format: 'g:i a',
            fieldLabel: 'Start Time (UTC)',
            minValue: '6:00 AM',
            maxValue: '8:00 PM',
            increment: 30,
            columnWidth: 0.5,
            anchor: '100%',
            hidden: true,
            allowBlank: true,
            itemId: 'startTimeField'
        }, 
        {
            xtype: 'timefield',
            name: 'end_time',
            format: 'g:i a',
            fieldLabel: 'End Time (UTC)',
            minValue: '6:00 AM',
            maxValue: '8:00 PM',
            increment: 30,
            columnWidth: 0.5,
            anchor: '100%',
            allowBlank: true,
            hidden: true,
            itemId: 'endTimeField'
        }

       
        ]
    },{
    xtype:'fieldset',
    columnWidth: 1,
    title: "",
    collapsible: true,
    defaults: {
        labelAlign: 'top',
        allowBlank: false,
        labelAlign: 'top',
        margin: 5,
        xtype: 'textfield',
        allowBlank: false,
        columnWidth: 0.33,
    },
    layout: 'column',
     items:[

        {
        xtype: 'textfield',
        fieldLabel: 'Function Audited',
        margin: '0 20 20 0',
        name: 'function_audited',
        allowBlank: true
    },
    {
        xtype: 'textfield',
        fieldLabel: 'Audit Criteria',
        margin: '0 20 20 0',
        name: 'audit_criteria',
        allowBlank: true
    },
    {
        xtype: 'textfield',
        fieldLabel: 'Additional Auditor',
        margin: '0 20 20 0',
        name: 'additional_auditor',
        allowBlank: true
    },
    {
        xtype: 'htmleditor',
        fieldLabel: 'Audit Standard',
        margin: '0 20 20 0',
        name: 'audit_standard',
        columnWidth: 0.5,
        allowBlank: true
    },
    {
        xtype: 'htmleditor',
        fieldLabel: 'Audit Objectives',
        margin: '0 20 20 0',
        name: 'audit_objectives',
        columnWidth: 0.5,
        allowBlank: true
    },
]
 },]

})