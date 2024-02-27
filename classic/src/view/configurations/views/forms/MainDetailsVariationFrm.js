Ext.define('Admin.view.configurations.views.forms.MainDetailsVariationFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'maindetailsvariationfrm',
    controller: 'configurationsvctr',
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
        value: 'par_maindetails_variation_points',
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
    },{
        xtype: 'textfield',
        fieldLabel: 'Name',
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
                    filters = JSON.stringify({'module_id': newVal});
                    sub_moduleStr.removeAll();
                    sub_moduleStr.load({params: {filters: filters}});
                if(newVal == 1){
                    prodclass_category_id.setVisible(true);
                    premise_type_id.setVisible(false);
                    prodclass_category_id.validate();
                    //------//
                    prodclass_category_id.allowBlank = false;
                    premise_type_id.allowBlank = true;
                    
                }
                if(newVal == 2){
                    premise_type_id.setVisible(true);
                    prodclass_category_id.setVisible(false);
                    premise_type_id.validate();
                    //------//
                    premise_type_id.allowBlank = false;
                    prodclass_category_id.allowBlank = true;
                }
            }
           
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Sub Module',
        margin: '0 20 20 0',
        name: 'sub_module_id',
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
                            table_name: 'par_sub_modules'
                        }
                    }
                   },
              isLoad: false
            },
            // change: function(combo, newVal, oldval, eopts){
            //     var form = combo.up('form'),
            //         // FormStr = form.down('combo[name=form_categories_id]').getStore(),
            //         // filters = JSON.stringify({'t1.sub_module_id': newVal});
            //         // FormStr.removeAll();
            //         // FormStr.load({params: {filters: filters}});
            // }
           
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Section',
        margin: '0 20 20 0',
        name: 'section_id',
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
                            table_name: 'par_sections'
                        }
                    }
                   },
              isLoad: true
            },
            change: function(combo, newVal, oldval, eopts){
                var form = combo.up('form'),
                    prodclassStr = form.down('combo[name=prodclass_category_id]').getStore(),
                    premTypeStr = form.down('combo[name=premise_type_id]').getStore(),
                    filters = JSON.stringify({'section_id': newVal});
                    prodclassStr.removeAll();
                    premTypeStr .removeAll();
                    prodclassStr.load({params: {filters: filters}});
                    premTypeStr.load({params: {filters: filters}});
            }
           
        }
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Section Category',
        margin: '0 20 20 0',
        name: 'prodclass_category_id',
        valueField: 'id',
        allowBlank: true,
        displayField: 'name',
        hidden: true,
        forceSelection: true,
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
              isLoad: false
            },
            change: function(combo, newVal, oldval, eopts){
                var form = combo.up('form'),
                    FormStr = form.down('combo[name=form_categories_id]').getStore(),
                    Submodule = form.down('combo[name=sub_module_id]').getValue(),
                    filters = JSON.stringify({'prodclass_category_id': newVal,'t1.sub_module_id':Submodule});
                    FormStr.removeAll();
                    FormStr.load({params: {filters: filters}});
            }
           
        }
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Premise Type',
        margin: '0 20 20 0',
        name: 'premise_type_id',
        valueField: 'id',
        allowBlank: true,
        displayField: 'name',
        forceSelection: true,
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
            },
            change: function(combo, newVal, oldval, eopts){
                var form = combo.up('form'),
                    FormStr = form.down('combo[name=form_categories_id]').getStore(),
                    Submodule = form.down('combo[name=sub_module_id]').getValue(),
                    filters = JSON.stringify({'premise_type_id': newVal,'t1.sub_module_id':Submodule});
                    FormStr.removeAll();
                    FormStr.load({params: {filters: filters}});
            }
           
        }
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Form',
        margin: '0 20 20 0',
        name: 'form_categories_id',
        valueField: 'id',
        allowBlank: true,
        displayField: 'name',
        forceSelection: true,
        hidden: false,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                        extraParams: {
                            table_name: 'par_form_categories'
                        }
                    }
                   },
              isLoad: true
            },
            change: function(combo, newVal, oldval, eopts){
                var form = combo.up('form'),
                    FormFieldStr = form.down('combo[name=form_fields_id]').getStore(),
                    filters = JSON.stringify({'form_category_id': newVal});
                    FormFieldStr.removeAll();
                    FormFieldStr.load({params: {filters: filters}});
            }
           
        }
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Form Fields type',
        margin: '0 20 20 0',
        name: 'formtype_fields_id',
        valueField: 'id',
        allowBlank: true,
        displayField: 'id',
        forceSelection: true,
        hidden: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                        
                        extraParams: {
                            table_name: 'par_formtype_fields'
                        }
                    }
                   },
              isLoad: true
            },
            change: function(combo, newVal, oldval, eopts){
                var form = combo.up('form'),
                    FormTypeFieldStr = form.down('combo[name=form_fields_id]').getStore(),
                    filters = JSON.stringify({'field_id': newVal});
                    FormTypeFieldStr.removeAll();
                    FormTypeFieldStr.load({params: {filters: filters}});
            }
           
        }
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Form Fields',
        margin: '0 20 20 0',
        name: 'form_fields_id',
        valueField: 'id',
        allowBlank: true,
        displayField: 'field_name',
        forceSelection: true,
        hidden: false,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                        url: 'configurations/getFormFields',
                        extraParams: {
                            table_name: 'par_formfield_designs'
                        }
                    }
                   },
              isLoad: true
            }
           
        }
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Variation Type',
        margin: '0 20 20 0',
        name: 'variationtype_id',
        valueField: 'id',
        allowBlank: true,
        displayField: 'name',
        forceSelection: true,
        hidden: false,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                        
                        extraParams: {
                            table_name: 'par_typeof_variations'
                        }
                    }
                   },
              isLoad: true
            }
           
        }
    },
    {
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
                    table_name: 'par_maindetails_variation_points',
                    storeID: 'maindetailsvariationStr',
                    formBind: true,
                    ui: 'soft-blue',
                    action_url: 'configurations/saveConfigCommonData',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});