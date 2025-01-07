
 Ext.define('Admin.view.auditManagement.views.forms.AuditChecklistItemsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'auditchecklistitemsfrm',
    autoScroll: true,
    controller: 'auditMgmntVctr',
    layout: 'form',
    frame: true,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'par_checklist_items',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'unset_data',
        value: 'checklist_category_id',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: '_token',
        value: token,
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'id',
        margin: '0 20 20 0',
        name: 'id',
        allowBlank: true
    }, {
        xtype: 'textfield',
        fieldLabel: 'Question',
        margin: '0 20 20 0',
        name: 'name',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Order No',
        margin: '0 20 20 0',
        name: 'order_no',
        allowBlank: false
    }, {
        xtype: 'textfield',
        fieldLabel: 'Code',
        margin: '0 20 20 0',
        name: 'code',
        allowBlank: false
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Checklist Category',
        margin: '0 20 20 0',
        name: 'checklist_category_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        extraParams: {
                            table_name: 'par_checklist_categories'
                        }
                    }
                },
                isLoad: true
            },
            change: function (cmbo, newVal) {
                var form = cmbo.up('form'),
                    type_field = form.down('combo[name=checklist_type_id]'),
                    type_store = type_field.store;
                type_store.removeAll();
                type_store.load({params: {checklist_category: newVal}});
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Checklist Type',
        margin: '0 20 20 0',
        name: 'checklist_type_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: false,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getChecklistTypes',
                        extraParams: {
                            table_name: 'par_checklist_type'
                        }
                    }
                },
                isLoad: true
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Item Parent',
        margin: '0 20 20 0',
        name: 'checklistitem_parent_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getChecklistTypes',
                        extraParams: {
                            table_name: 'par_checklist_type'
                        }
                    }
                },
                isLoad: true
            },
            afterrender: function(combo) {
                var store = combo.getStore(),
                    form = combo.up('form'),
                    checklist_category_id = form.down('combo[name=checklist_category_id]').getValue(),
                    checklist_type_id = form.down('combo[name=checklist_type_id]').getValue();

                store.removeAll();
                store.load({params: {'checklist_category_id':checklist_category_id, 'checklist_type':checklist_type_id}});
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Auto Serial',
        margin: '0 20 20 0',
        name: 'auto_serial',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        hidden: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_confirmations'
                        }
                    }
                },
                isLoad: true
            },
            change: function(combo, newVal, oldval, eopts){
                var form = combo.up('form'),
                    serial = form.down('textfield[name=serial_no]');
                if(newVal != 1){
                    serial.setVisible(true);
                    serial.allowBlank = false;
                }else{
                    serial.setVisible(false);
                    serial.allowBlank = true;
                }
                serial.validate();
            }
        }
    }, {
        xtype: 'textfield',
        fieldLabel: 'Serial Number',
        margin: '0 20 20 0',
        name: 'serial_no',
        allowBlank: true,
        hidden: true
    },{
        xtype: 'checkbox',
        inputValue: 1,
        fieldLabel: 'Is Other Config',
        margin: '0 20 20 0',
        name: 'is_other_config',
        allowBlank: true,
        hidden: true
    },
    {
        xtype: 'textfield',
        fieldLabel: 'Reference',
        margin: '0 20 20 0',
        name: 'reference',
        allowBlank: true,
        hidden: true
    },
    {
        xtype: 'combo', 
        anyMatch: true,
        fieldLabel: 'Scale(Applicable to Facility)',
        margin: '0 20 20 0',
        name: 'risk_type',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        hidden: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_compliance_risk_scale'
                        }
                    }
                },
                isLoad: true
            }
        }
    },
     {
        xtype: 'textarea',
        fieldLabel: 'Description',
        margin: '0 20 20 0',
        name: 'description',
        allowBlank: true,
        hidden: true
    }],
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: [
                '->', {
                    text: 'Save Details',
                    iconCls: 'x-fa fa-save',
                    action: 'save_audit_checklist',
                    table_name: 'par_checklist_items',
                    storeID: 'checklistitemsstr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'configurations/saveConfigCommonData',
                   // handler: 'CreateAuditConfigParamWin'
                }, {
                    text: 'Reset',
                    iconCls: 'x-fa fa-close',
                    ui: 'soft-purple',
                    handler: function (btn) {
                        btn.up('form').getForm().reset();
                    }
                }
            ]
        }
    ]
});
