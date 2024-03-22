Ext.define('Admin.view.documentsManagement.views.forms.DocumentTypeForm',{
    extend: 'Ext.form.Panel',
    xtype: 'documenttypeform',
    controller: 'documentsManagementvctr',
    autoScroll: true,
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
       value: 'par_form_categories',
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
        fieldLabel: 'Dcument Name',
        margin: '0 20 20 0',
        name: 'name',
        allowBlank: false
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Module',
        margin: '0 20 20 0',
        name: 'module_id',
        valueField: 'id',
        allowBlank: false,
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                        
                        extraParams: {
                            table_name: 'par_modules'
                        }
                    }
                   },
              isLoad: true
            },
        
            change: function(combo, newVal, oldval, eopts){
                var form = combo.up('form'),
                    sub_moduleStr = form.down('combo[name=sub_module_id]').getStore(),
                    premise_type_id = form.down('combo[name=premise_type_id]'),
                    prodclass_category_id = form.down('combo[name=prodclass_category_id]'),
                    importexport_permittype_id = form.down('combo[name=importexport_permittype_id]'),
                    filters = JSON.stringify({'module_id': newVal});
                    sub_moduleStr.removeAll();
                    sub_moduleStr.load({params: {filters: filters}});
                if(newVal == 1){
                    prodclass_category_id.setVisible(true);
                    premise_type_id.setVisible(false);
                    importexport_permittype_id.setVisible(false);
                    prodclass_category_id.validate();
                    //------//
                    prodclass_category_id.allowBlank = false;
                    premise_type_id.allowBlank = true;
                    importexport_permittype_id.allowBlank = true;
                    
                }
                else if(newVal == 2){
                    premise_type_id.setVisible(true);
                    prodclass_category_id.setVisible(false);
                    importexport_permittype_id.setVisible(false);
                    premise_type_id.validate();
                    //------//
                    premise_type_id.allowBlank = false;
                    prodclass_category_id.allowBlank = true;
                    importexport_permittype_id.allowBlank = true;
                }
                else if(newVal == 4 || newVal == 12){
                    importexport_permittype_id.setVisible(true);
                    premise_type_id.setVisible(false);
                    prodclass_category_id.setVisible(false);
                    importexport_permittype_id.validate();
                    //------//
                    importexport_permittype_id.allowBlank = false;
                    prodclass_category_id.allowBlank = true;
                    premise_type_id.allowBlank = true;
                }
                else{
                    //no effects
                }
            }
           
        }
    },
    {
        xtype: 'tagfield',
        fieldLabel: 'Allowed Document Extensions',
        margin: '0 20 20 0',
        name: 'document_extension_ids',
        allowBlank: false,
        forceSelection: true,
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
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Sub Module',
        margin: '0 20 20 0',
        name: 'sub_module_id',
        valueField: 'id',
        allowBlank: true,
        hidden: false,
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
    //{
    //     xtype: 'combo', anyMatch: true,
    //     fieldLabel: 'Section',
    //     margin: '0 20 20 0',
    //     name: 'section_id',
    //     valueField: 'id',
    //     hidden: true,
    //     allowBlank: true,
    //     displayField: 'name',
    //     forceSelection: true,
    //     queryMode: 'local',
    //     listeners: {
    //         beforerender: {
    //             fn: 'setCompStore',
    //             config: {
    //                 proxy: {
                        
    //                     extraParams: {
    //                         table_name: 'par_sections'
    //                     }
    //                 }
    //                },
    //           isLoad: true
    //         },
    //         change: function(combo, newVal, oldval, eopts){
    //             var form = combo.up('form'),
    //                 prodclassStr = form.down('combo[name=prodclass_category_id]').getStore(),
    //                 premiseStr = form.down('combo[name=premise_type_id]').getStore(),
    //                 filters = JSON.stringify({'section_id': newVal});
    //                 prodclassStr.removeAll();
    //                 premiseStr.removeAll();
    //                 prodclassStr.load({params: {filters: filters}});
    //                 premiseStr.load({params: {filters: filters}});
    //         }
           
    //     }
    // },{
    //     xtype: 'combo', anyMatch: true,
    //     fieldLabel: 'Prodclass Category',
    //     margin: '0 20 20 0',
    //     name: 'prodclass_category_id',
    //     valueField: 'id',
    //     allowBlank: true,
    //     displayField: 'name',
    //     hidden: true,
    //     forceSelection: true,
    //     queryMode: 'local',
    //     listeners: {
    //         beforerender: {
    //             fn: 'setCompStore',
    //             config: {
    //                 proxy: {
                        
    //                     extraParams: {
    //                         table_name: 'par_prodclass_categories'
    //                     }
    //                 }
    //                },
    //           isLoad: false
    //         }
           
    //     }
    // },{
    //     xtype: 'combo', anyMatch: true,
    //     fieldLabel: 'Premise Type',
    //     margin: '0 20 20 0',
    //     name: 'premise_type_id',
    //     valueField: 'id',
    //     allowBlank: true,
    //     displayField: 'name',
    //     forceSelection: true,
    //     hidden: true,
    //     queryMode: 'local',
    //     listeners: {
    //         beforerender: {
    //             fn: 'setCompStore',
    //             config: {
    //                 proxy: {
                        
    //                     extraParams: {
    //                         table_name: 'par_premises_types'
    //                     }
    //                 }
    //                },
    //           isLoad: true
    //         }
           
    //     }
    // },{
    //     xtype: 'combo', anyMatch: true,
    //     fieldLabel: 'Import Permit Type',
    //     margin: '0 20 20 0',
    //     name: 'importexport_permittype_id',
    //     valueField: 'id',
    //     allowBlank: true,
    //     displayField: 'name',
    //     forceSelection: true,
    //     hidden: true,
    //     queryMode: 'local',
    //     listeners: {
    //         beforerender: {
    //             fn: 'setCompStore',
    //             config: {
    //                 proxy: {
                        
    //                     extraParams: {
    //                         table_name: 'par_importexport_permittypes'
    //                     }
    //                 }
    //                },
    //           isLoad: true
    //         }
           
    //     }
    // },
    {
        xtype: 'textarea',
        fieldLabel: 'Description',
        margin: '0 20 20 0',
        name: 'description',
        allowBlank: true
    },{
        xtype: 'checkbox',
        inputValue: 1,
        uncheckedValue: 0,
        fieldLabel: 'Is Enabled',
        margin: '0 20 20 0',
        name: 'is_enabled',
        allowBlank: true
    }],
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
                    table_name: 'par_form_categories',
                    storeID: 'docdefinationrequirementstr',
                    formBind: true,
                    ui: 'soft-blue',
                    //action_url: 'configurations/saveConfigCommonData',
                    action_url: 'configurations/saveDocDefinationrequirement',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});