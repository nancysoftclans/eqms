Ext.define('Admin.view.auditManagement.views.forms.NewAuditTypeDetailsFrm',{
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
            name: 'id',
            xtype: 'hiddenfield',
            
        },
        {
            xtype: 'textfield',
            name: 'audit_type_code',
            fieldLabel: 'Code',
            columnWidth: 1,
        },
        {
            xtype: 'textfield',
            name: 'audit_title',
            fieldLabel: 'Title',
            columnWidth: 1,
            
        },
        {
            xtype: 'combo',
            anyMatch: true,
            queryMode: 'local',
            forceSelection: true,
            valueField: 'id',
            displayField: 'name',
            name: 'audit_prefix_id',
            fieldLabel: 'Select Prefix',
            valueField: 'id',
            columnWidth: 1,
            listeners: {
                afterrender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 10000,
                        proxy: {
                            extraParams: {
                                table_name: 'par_audit_types'
                            }

                        }
                    },
                    isLoad: true

                }
            }
        }
    ],
    buttons: [
       {
            xtype: 'button',
            text: 'Save Details',
            iconCls: 'x-fa fa-save',
            ui: 'soft-purple',
            formBind: true,
            handler: 'saveAuditType'
       },
    ]
})