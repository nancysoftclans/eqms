
 Ext.define('Admin.view.configurations.views.forms.ChecklistTypesFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'checklisttypesfrm',
    autoScroll: true,
    controller: 'configurationsvctr',
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
        value: 'par_checklist_types',
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
        fieldLabel: 'Name',
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
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Module',
        margin: '0 20 20 0',
        name: 'module_id',
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
                            table_name: 'par_modules'
                        }
                    }
                },
                isLoad: true
            },
            change: function (cmbo, newVal) {
                var form = cmbo.up('form'),
                subModuleStore = form.down('combo[name=sub_module_id]').getStore();
                premise_type_id = form.down('combo[name=premise_type_id]');
                //prodclass_category_id = form.down('combo[name=prodclass_category_id]');
                product_type_id = form.down('combo[name=product_type_id]');
                subModuleStore.removeAll();
                subModuleStore.load({params: {module_id: newVal}});
               if(newVal == 2){
                premise_type_id.setVisible(true);
                premise_type_id.allowBlank = true;
                product_type_id.setVisible(false);
                product_type_id.allowBlank = true;
               }
               else {
                if(newVal == 1){
                    product_type_id.setVisible(true);
                    product_type_id.allowBlank = true;
                    premise_type_id.setVisible(false);
                    premise_type_id.allowBlank = true;
                   }
                       else{
                        premise_type_id.setVisible(false);
                        premise_type_id.allowBlank = true;
                        product_type_id.setVisible(false);
                        product_type_id.allowBlank = true;
                       }
               }
             
            //    else{
            //     premise_type_id.setVisible(false);
            //     premise_type_id.allowBlank = true;
            //     prodclass_category_id.setVisible(false);
            //     prodclass_category_id.allowBlank = true;
            //    }
            }
        }
    },
     {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Sub Module',
        margin: '0 20 20 0',
        name: 'sub_module_id',
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
                        url: 'workflow/getSystemSubModules',
                        extraParams: {
                            table_name: 'par_sub_modules'
                        }
                    }
                },
                isLoad: false
            }
        }
    }, 
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Section',
        margin: '0 20 20 0',
        name: 'section_id',
        valueField: 'id',
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
                            table_name: 'par_sections'
                        }
                    }
                },
                isLoad: true
            },
            change: function (cmbo, newVal) {
                var form = cmbo.up('form'),
                   premisetypeStore = form.down('combo[name=premise_type_id]').getStore();
                   filters = JSON.stringify({'section_id': newVal});
                    premisetypeStore.removeAll();
                    premisetypeStore.load({params: {filters: filters}});
                   // prodclasscategoryStore = form.down('combo[name=prodclass_category_id]').getStore();
                    producttypeStore = form.down('combo[name=product_type_id]').getStore();
                    filters = JSON.stringify({'section_id': newVal});
                    producttypeStore.removeAll();
                    producttypeStore.load({params: {filters: filters}});
                
            }
        }
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Premise Type',
        margin: '0 20 20 0',
        name: 'premise_type_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        hidden:true,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        extraParams: {
                            table_name: 'par_premises_types'
                        }
                    }
                },
                isLoad: true
            }
        }
    },
    // {
    //     xtype: 'combo', anyMatch: true,
    //     fieldLabel: 'Product Class Category',
    //     margin: '0 20 20 0',
    //     name: 'prodclass_category_id',
    //     valueField: 'id',
    //     displayField: 'name',
    //     forceSelection: true,
    //     allowBlank: true,
    //    // hidden:true,
    //     queryMode: 'local',
    //     listeners: {
    //         afterrender: {
    //             fn: 'setCompStore',
    //             config: {
    //                 pageSize: 10000,
    //                 proxy: {
    //                     extraParams: {
    //                         table_name: 'par_prodclass_categories'
    //                     }
    //                 }
    //             },
    //             isLoad: true
    //         }
    //     }
    // },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Product Type',
        margin: '0 20 20 0',
        name: 'product_type_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
       // hidden:true,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        extraParams: {
                            table_name: 'par_product_types'
                        }
                    }
                },
                isLoad: true
            }
        }
    },
     {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Category',
        margin: '0 20 20 0',
        name: 'checklist_category_id',
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
                            table_name: 'par_checklist_categories'
                        }
                    }
                },
                isLoad: true
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Device Type',
        margin: '0 20 20 0',
        name: 'device_type_id',
        valueField: 'id',
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
                        // url: 'commonparam/getCommonParamFromTable',
                        //url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_device_types'
                        }
                    }
                },
                isLoad: true
            }
        }
    },{
        xtype: 'checkbox',
        inputValue: 1,
        fieldLabel: 'Is Other Config',
        margin: '0 20 20 0',
        name: 'is_other_config',
        allowBlank: true
    }, {
        xtype: 'textarea',
        fieldLabel: 'Description',
        margin: '0 20 20 0',
        name: 'description',
        allowBlank: true
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
                    action: 'save',
                    table_name: 'par_checklist_types',
                    storeID: 'checklisttypesstr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'configurations/saveConfigCommonData',
                    handler: 'doCreateConfigParamWin'
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
