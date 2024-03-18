
 Ext.define('Admin.view.documentsManagement.views.forms.DocdefinationRequirementFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'docdefinationrequirementfrm',
    height: Ext.Element.getViewportHeight() - 118,
    controller: 'documentsManagementvctr',
    autoScroll: true,
    layout: {
        type: 'column'
    },
    //bodyPadding: 5,
    defaults: {
        columnWidth: 0.33,
        margin: 5,
        labelAlign: 'top'
    },
    frame: true,
    bodyPadding: 8,
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'tra_documentupload_requirements',
        allowBlank: true
    },{
        xtype: 'hiddenfield',
        name: 'module_id'
    }, {
        xtype: 'hiddenfield',
        name: 'sub_module_id'
    },{
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
        fieldLabel: 'Name',
        margin: '0 20 20 0',
        name: 'name'
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Document Type',
        margin: '0 20 20 0',
        name: 'document_type_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: false,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        extraParams: {
                            table_name: 'par_form_categories'
                        }
                    }
                },
                isLoad: true
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Module',
        margin: '0 20 20 0',
        name: 'module_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        hidden: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        extraParams: {
                            table_name: 'par_modules'
                        }
                    }
                },
                isLoad: true
            },
            change: 'funcChangeDocumentReqmodule'
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Sub Module',
        margin: '0 20 20 0',
        name: 'sub_module_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        hidden: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        extraParams: {
                            table_name: 'par_sub_modules'
                        }
                    }
                },
                isLoad: false
            },
            change: 'funcChangeParentDocumentNode'
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Section',
        margin: '0 20 20 0',
        name: 'section_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        hidden: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        extraParams: {
                            table_name: 'par_sections'
                        }
                    }
                },
                isLoad: true
            },
            change: function(combo, newVal, oldVal, eopts) {
                var form = combo.up('form'),
                    pcc = form.down('combo[name=prodclass_category_id]').getStore(),
                    premise_type_id = form.down('combo[name=premise_type_id]').getStore(), 
                    filters = JSON.stringify({'section_id': newVal});
                pcc.removeAll();
                pcc.load({params:{filters: filters}});
                premise_type_id.removeAll();
                premise_type_id.load({params:{filters: filters}});
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Product Class Categories',
        margin: '0 20 20 0',
        name: 'prodclass_category_id',
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
                    proxy: {
                       
                        extraParams: {
                            table_name: 'par_prodclass_categories'
                        }
                    }
                   },
              isLoad: true
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Import Export Permit Type',
        margin: '0 20 20 0',
        name: 'importexport_permittype_id',
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
                    proxy: {
                        
                        extraParams: {
                            table_name: 'par_importexport_permittypes'
                        }
                    }
                   },
              isLoad: true
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Premises Type',
        margin: '0 20 20 0',
        name: 'premise_type_id',
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
                    proxy: {
                       
                        extraParams: {
                            table_name: 'par_premises_types'
                        }
                    }
                   },
              isLoad: true
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Has Parent',
        margin: '0 20 20 0',
        name: 'has_parent_level',
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
            change: 'showHideParent'
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Parent Document',
        margin: '0 20 20 0',
        name: 'docparent_id',
        valueField: 'id',
        hidden: true,
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                       
                        extraParams: {
                            table_name: 'tra_documentupload_requirements'
                        }
                     }
                },
                isLoad: true
            }
        }
    },{
        xtype: 'checkbox',
        fieldLabel: 'Is Mandatory',
        name: 'is_mandatory',
        inputValue: 1,
        hidden: true,
        uncheckedValue: 0
    },{
        xtype: 'checkbox',
        fieldLabel: 'Portal Uploadable',
        name: 'portal_uploadable',
        hidden: true,
        inputValue: 1,
        uncheckedValue: 0,
        align: 'center'
    },{
        xtype: 'tagfield',
        fieldLabel: 'Allowed Document Extensions',
        margin: '0 20 20 0',
        name: 'document_extension_ids',
        allowBlank: true,
        forceSelection: true,
        hidden: true,
        filterPickList: true,
        encodeSubmitValue: true,
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
    },{
        xtype: 'combo', anyMatch: true,
        name: 'has_document_template',
        store: 'confirmationstr',
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        readOnly: true,
        forceSelection: true,
        hidden: true,
        fieldLabel: 'Has Document Template?',
        value: 2,
        // listeners: {
        //     change: function (cmb, newVal) {
        //         var form = cmb.up('form'),
        //         document_template = form.down('filefield[name=document_template]');
        //         if (newVal == 1 || newVal === 1) {
        //             document_template.allowBlank = false;
        //             document_template.validate();
        //             document_template.setVisible(true);
        //         } else {
        //             document_template.allowBlank = true;
        //             document_template.validate();
        //             document_template.setVisible(false);
        //         }
        //     }
        // }
    },
    // {
    //     xtype: 'filefield',
    //     fieldLabel: 'Document Template',
    //     allowBlank: true,
    //     hidden: true,
    //     name: 'document_template'
    // },
    {
        xtype: 'textarea',
        fieldLabel: 'Description',
        name: 'description',
        allowBlank: true
        
    }]
    //dockedItems:[
    // {
    //         xtype: 'toolbar',
    //         ui: 'footer',
    //         dock: 'bottom',
    //         items:[
    //             '->',{
    //                 text: 'Save Details',
    //                 iconCls: 'x-fa fa-save',
    //                 action: 'save',
    //                 table_name: 'tra_documentupload_requirements',
    //                 storeID: 'docdefinationrequirementstr',
    //                 formBind: true,
    //                 ui: 'soft-purple',
    //                 action_url: 'configurations/saveDocDefinationrequirement',
    //                 handler: 'doCreateConfigParamWin'
    //             },{
    //                 text: 'Reset',
    //                 iconCls: 'x-fa fa-close',
    //                 ui: 'soft-purple',
    //                 handler: function (btn) {
    //                     btn.up('form').getForm().reset();
    //                 }
    //             }
    //         ]
    //     }
    //]
});
