Ext.define('Admin.view.auditManagement.views.forms.AuditTypeCustomFieldsFrm', {
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
    },
    {
        xtype: 'hiddenfield',
        name: 'audit_type_id',
        allowBlank: true,   
      

    },
    {
        xtype: 'textfield',
        name: 'field_name',
        fieldLabel: 'Field Name',

    },
    {
        xtype: 'textfield',
        name: 'label',
        fieldLabel: 'Field Label'
    }, 
    {
        xtype: 'combo',
        anyMatch: true,
        name: 'form_field_type_id',
        fieldLabel: 'Field Type',
        queryMode: 'local',
        allowBlank: false,
       
        forceSelection: true,
        valueField: 'id',
        displayField: 'name',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 100,
                    proxy: {
                        extraParams: {
                            table_name: 'par_form_field_types',
                        }
                    }
                },
                isLoad: true 
                
                
            }
        }
    }, {
        xtype: 'button',
        text: 'Add Field Types',
       
        iconCls: 'x-fa fa-plus',
        margin: '30 0 0 0',
        ui: 'soft-blue',
        handler: 'saveAuditTypeMetaData'
    }
    ]
})