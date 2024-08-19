Ext.define('Admin.view.documentManager.views.forms.DocumentTypeForm', {
    extend: 'Ext.form.Panel',
    xtype: 'documenttypeform',
    controller: 'documentsManagementvctr',
    autoScroll: true,
    scrollable: true,
    //frame: true,
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
    //frame: true,
    bodyPadding: 8,
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'par_document_types',
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
        xtype: 'tagfield',
        fieldLabel: 'Allowed Document Extensions',
        margin: '0 20 20 0',
        name: 'document_extension_ids',
        allowBlank: true,
        forceSelection: true,
        filterPickList: true,
        encodeSubmitValue: true,
        hidden: true,
        emptyText: 'Select Document Extensions',
        growMax: 100,
        queryMode: 'local',
        valueField: 'id',
        displayField: 'extension',
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_document_extensionstypes'
                        }
                    }
                },
                isLoad: true
            }
        }
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Sub Module',
        margin: '0 20 20 0',
        name: 'sub_module_id',
        valueField: 'id',
        allowBlank: true,
        hidden: true,
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {

                        extraParams: {
                            table_name: 'par_sub_modules'
                        }
                    }
                },
                isLoad: true,
            },
        }
    },

    {
        xtype: 'fieldset',
        columnWidth: 1,
        title: "Create Document Type",
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
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Title',
                margin: '0 20 20 0',
                name: 'name',
                allowBlank: false
            },

            {
                xtype: 'textfield',
                fieldLabel: 'Prefix',
                margin: '0 20 20 0',
                name: 'prefix',
                value: 'DOC',
                allowBlank: false
            },
            {
                xtype: 'tagfield',
                fieldLabel: 'Properties',
                margin: '0 20 20 0',
                name: 'property_ids',
                allowBlank: true,
                forceSelection: true,
                filterPickList: true,
                encodeSubmitValue: true,
                emptyText: 'Select Appropriate Property',
                growMax: 100,
                queryMode: 'local',
                valueField: 'id',
                displayField: 'name',
                listeners: {
                    beforerender: {
                        fn: 'setWorkflowCombosStore',
                        config: {
                            pageSize: 1000,
                            proxy: {
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_document_properties'
                                }
                            }
                        },
                        isLoad: true
                    }
                }
            },
        ]
    }, {
        xtype: 'fieldset',
        columnWidth: 1,
        title: "Review Procedure",
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
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Review period - Months',
                margin: '0 20 20 0',
                value: 12,
                name: 'review_period'
            }, {
                xtype: 'textarea',
                fieldLabel: 'Review instructions',
                name: 'review_instructions',
                allowBlank: true,
                columnWidth: 1,
                labelAlign: 'top'
            }]
    }, {
        xtype: 'fieldset',
        columnWidth: 1,
        title: "Document Expiry",
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
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Expiry period - Months',
                margin: '0 20 20 0',
                value: 36,
                name: 'expiry_period'
            }, {
                xtype: 'textarea',
                fieldLabel: 'Disposition instructions',
                name: 'disposition_instructions',
                allowBlank: true,
                columnWidth: 1,
                labelAlign: 'top'
            }]
    }, {
        xtype: 'checkbox',
        inputValue: 1,
        uncheckedValue: 0,
        fieldLabel: 'Is Enabled',
        margin: '0 20 20 0',
        name: 'is_enabled',
        allowBlank: true
    }, {
        xtype: 'checkbox',
        inputValue: 1,
        uncheckedValue: 0,
        fieldLabel: 'Is Controlled',
        margin: '0 20 20 0',
        name: 'is_controlled',
        allowBlank: true
    }, {
        xtype: 'fieldset',
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
            columnWidth: 1,
        },
        layout: 'column',
        items: [
            {
                xtype: 'combo',
                queryMode: 'local',
                forceSelection: true,
                valueField: 'id',
                margin: '0 20 20 0',
                displayField: 'name',
                fieldLabel: 'Enable edit',
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
                    }, beforerender: {
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

            }, {
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
            }, {
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
    }, {
        xtype: 'fieldset',
        columnWidth: 1,
        title: "Notifications",
        collapsible: true,
        defaults: {
            labelAlign: 'top',
            allowBlank: false,
            labelAlign: 'top',
            margin: 5,
            xtype: 'textfield',
            allowBlank: false,
            columnWidth: 1,
        },
        layout: 'column',
        items: [
            {
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Owner Group',
                name: 'notifications_id',
                valueField: 'id',
                displayField: `name`,
                margin: '0 20 20 0',
                forceSelection: true,
                allowBlank: true,
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
            }]
    },],
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: [
                '->', {
                    text: 'Save Details',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'par_document_types',
                    storeID: 'docdefinationrequirementstr',
                    formBind: true,
                    ui: 'soft-blue',
                    //action_url: 'configurations/saveConfigCommonData',
                    action_url: 'configurations/saveDocumentTypes',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});