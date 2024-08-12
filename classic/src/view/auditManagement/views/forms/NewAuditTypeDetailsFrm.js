Ext.define('Admin.view.auditManagement.views.forms.NewAuditTypeDetailsFrm',{
    extend: 'Ext.form.Panel',
    xtype: 'newAuditTypeDetailsFrm',
    controller: 'auditMgmntVctr',
    autoScroll: true,
      bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
    viewModel: {
        type: 'documentcreationvm'
    },
    layout: {
        type: 'column'
    },
    bodyPadding: 5,
    defaults: {
        columnWidth: 0.33,
        margin: 5,
        labelAlign: 'top'
    },

     
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
       value: 'par_qms_audit_types',
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
    }, 
     {
        xtype:'fieldset',
        columnWidth: 1,
        title: "Create Audit Type",
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
        xtype: 'textfield',
        fieldLabel: 'Code',
        margin: '0 20 20 0',
        name: 'code',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Title',
        margin: '0 20 20 0',
        name: 'name',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Prefix',
        margin: '0 20 20 0',
        name: 'prefix',
        value: 'AUD',
        allowBlank: false
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Questionnaire modifiable',
        margin: '0 20 20 0',
        name: 'is_modifiable_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                       
                        extraParams: {
                            table_name: 'par_confirmations'
                        }
                    }
                   },
              isLoad: true
            },
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Allow audit report PDF export',
        margin: '0 20 20 0',
        name: 'is_allowpdfexport_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                       
                        extraParams: {
                            table_name: 'par_confirmations'
                        }
                    }
                   },
              isLoad: true
            },
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Require note with question response',
        margin: '0 20 20 0',
        name: 'requre_notewithresponse_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                       
                        extraParams: {
                            table_name: 'par_confirmations'
                        }
                    }
                   },
              isLoad: true
            },
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Set owner as auditor',
        margin: '0 20 20 0',
        name: 'owner_asauditor_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                       
                        extraParams: {
                            table_name: 'par_confirmations'
                        }
                    }
                   },
              isLoad: true
            },
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Allow audit report Word export',
        margin: '0 20 20 0',
        name: 'is_allowwordexport_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                       
                        extraParams: {
                            table_name: 'par_confirmations'
                        }
                    }
                   },
              isLoad: true
            },
        }
    },
    {  xtype: 'checkbox',
        inputValue: 1,
        uncheckedValue: 0,
        fieldLabel: 'Is Enabled',
        margin: '0 20 20 0',
        name: 'is_enabled',
        allowBlank: true
    }
    ]},
    {
    xtype:'fieldset',
    columnWidth: 1,
    title: "Restrict permissions",
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
            xtype: 'combo',
            queryMode: 'local',
            forceSelection: true,
            valueField: 'id',
            margin: '0 20 20 0',
            displayField: 'name',
            fieldLabel: 'Restrict',
            name: 'has_restriction_id',
            //store: 'confirmationstr',
            listeners: {
                change: function (cmb, newVal) {
                    var form = cmb.up('form'),
                        owneruser = form.down('combo[name=owner_user_id]'),
                        ownergroup = form.down('combo[name=owner_group_id]');
                    if (newVal == 1 || newVal === 1) {
                        owneruser.setVisible(true);
                        ownergroup.setVisible(true);
                    } else {
                        ownergroup.setVisible(false);
                        owneruser.setVisible(false);
                    }
                },beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            url: 'configurations/getNonrefParameter',
                            extraParams: {
                                table_name: 'par_confirmations'
                            }
                        }
                    },
                    isLoad: true
                }
            }
            
        },{
        xtype: 'combo', 
        fieldLabel: 'Owner User',
        name: 'owner_user_id',
        valueField: 'id',
        margin: '0 20 20 0',
        displayField: `fullname`,
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
                        url: 'usermanagement/documentOwner',
                        extraParams: {
                            //table_name: 'par_user_roles'
                        }
                    }
                },
                isLoad: true
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Owner Group',
        name: 'owner_group_id',
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
    },]
 },],
    dockedItems:[
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items:[
                '->',{
                    text: 'Save Details',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'par_qms_audit_types',
                    storeID: 'audittypesstr',
                    formBind: true,
                    ui: 'soft-blue',
                    action_url: 'auditManagement/saveAuditType',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
})