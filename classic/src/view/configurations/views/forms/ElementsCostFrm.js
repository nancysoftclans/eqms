Ext.define('Admin.view.configurations.views.forms.ElementsCostFrm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.elementscostfrm',
    frame: false,
    xtype: 'elementscostfrm',
    bodyPadding: 10,
   controller: 'configurationsvctr',
    
    require : [
        'Ext.form.field.VTypes'
    ],
    layout: {
        type: 'column'
    },
    defaults: {
        labelAlign: 'top',
        labelStyle: {
            'font-weight': 'bold'
        },
        labelCls: '',
        allowBlank: false,
       columnWidth: 0.5
    },
    fieldDefaults: {
        xtype: 'textfield',
        cls: ''
    },
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'tra_element_costs',
        allowBlank: true
    },{
        xtype: 'hiddenfield',
        fieldLabel: 'id',
        margin: '0 20 20 0',
        name: 'id'
    }, {
        xtype: 'textfield',
        value: token,
        name: '_token',
        hidden: true
    }, {
        xtype: 'combobox',
        fieldLabel: 'Fee Type',
        forceSelection: true,
        allowBlank: false,
        margin: '0 20 20 0',
        name: 'fee_type_id',
        queryMode: 'local',
        displayField: 'name',
        valueField: 'id',
        listeners:
         {
             afterrender: {//getConfigParamFromTable
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_fee_types'
                        }
                    }
                },
                isLoad: true
            },
            change:function(cbo,newvalue, oldValue, eopts){
                   var form = cbo.up('form'),
                       cost_category = form.down('combo[name=cost_category_id]').getStore(),
                       element_id = form.down('combo[name=element_id]').getStore();
   
                       var filter = {'fee_type_id':newvalue};
                       filter = JSON.stringify(filter);
                       cost_category.removeAll();
                       element_id.removeAll();
                       cost_category.load({params:{filters: filter}});
                       element_id.load({params:{filters: filter}});
            }
           
         }
    },{
        xtype: 'combobox',
        fieldLabel: 'Category',
        forceSelection: true,
        allowBlank: true,
        hidden: true,
        margin: '0 20 20 0',
        queryMode: 'local',
        displayField: 'name',
       valueField: 'id',
       name: 'cost_category_id',
       listeners:{

        afterrender: {//getConfigParamFromTable
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_cost_categories'
                        }
                    }
                },
                isLoad: false
            },
            change:function(cbo,newvalue, oldValue, eopts){
                   var form = cbo.up('form'),
                       cost_subcategory = form.down('combo[name=sub_cat_id]').getStore();
                       var filter = {'cost_category_id':newvalue};
                       filter = JSON.stringify(filter);
                       cost_subcategory.removeAll();
                       cost_subcategory.load({params:{filters: filter}});
            }
       }
    },
    {
        xtype: 'combobox',
        fieldLabel: 'Sub Category',
        forceSelection: true,
        allowBlank: true,
        hidden: true,
        margin: '0 20 20 0',
        name: 'sub_cat_id',
        queryMode: 'local', 
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        listeners:
         {
             afterrender: {//getConfigParamFromTable
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_cost_sub_categories'
                        }
                    }
                },
                isLoad: false
            }
           
         },
          
    },{
        xtype: 'combobox',
        fieldLabel: 'Module',
        forceSelection: true,
        allowBlank: false,
        margin: '0 20 20 0',
        queryMode: 'local',
        displayField: 'name',
       valueField: 'id',
       name: 'module_id',
       listeners:{

        afterrender: {//getConfigParamFromTable
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_modules'
                        }
                    }
                },
                isLoad: true
            },
            change:function(cbo,newvalue, oldValue, eopts){
                   var form = cbo.up('form'),
                       SubStr = form.down('combo[name=sub_module_id]').getStore();
                       var filter = {'module_id':newvalue};
                       filter = JSON.stringify(filter);
                       SubStr.removeAll();
                       SubStr.load({params:{filters: filter}});
            }
       }
    },
    {
        xtype: 'combobox',
        fieldLabel: 'Sub Module',
        forceSelection: true,
        allowBlank: false,
        margin: '0 20 20 0',
        name: 'sub_module_id',
        queryMode: 'local', 
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        listeners:
         {
             afterrender: {//getConfigParamFromTable
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_sub_modules'
                        }
                    }
                },
                isLoad: false
            }
           
         },
          
    },{
        
        xtype: 'combobox',
        fieldLabel: 'Cost Element',
        forceSelection: true,
        allowBlank: false,
        margin: '0 20 20 0',
        name: 'element_id',
        queryMode: 'local',
        displayField: 'name',
      
        listeners:
         {
             afterrender: {//getConfigParamFromTable
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_cost_elements'
                        }
                    }
                },
                isLoad: false
            }
           
         },
           valueField: 'id'
     },{
        
        xtype: 'combobox',
        fieldLabel: 'Application Fee Type',
        forceSelection: true,
        allowBlank: true,
        margin: '0 20 20 0',
        name: 'application_feetype_id',
       queryMode: 'local',
        displayField: 'name',
      
        listeners:
         {
             afterrender: {//getConfigParamFromTable
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_applicationfee_types'
                        }
                    }
                },
                isLoad: true
            }
           
         },
           valueField: 'id'
     },{
            xtype: 'combobox',
            forceSelection: true,
            name: 'formula',
            displayField: 'name',
            allowBlank: false,
            fieldLabel: 'Is Formula',
            margin: '0 20 0 0',
            valueField: 'id',
            queryMode: 'local',
            listeners:{
                afterrender: {
                    fn: 'setCompStore',
                    config:{
                        pageSize: 10000,
                        proxy:{
                            url: 'configurations/getConfigParamFromTable',
                            extraParams:{
                                table_name: 'par_confirmations'
                            }
                        }
                    },
                    isLoad: true
                },
                change:function(cbo,newvalue, oldValue, eopts){
                    var frm = cbo.up('form'),
                    formula_rate  = frm.down('numberfield[name=formula_rate]'),
                    fieldcontainer  = frm.down('fieldcontainer[name=costsdefinations]')
                        if(newvalue == 1){
                            formula_rate.setHidden(false);
                            fieldcontainer.setHidden(true);
                        }else{
                            formula_rate.setHidden(true);
                            fieldcontainer.setHidden(false);
                        }
                }

            }
        }, {
            xtype: 'fieldcontainer',
            name: 'costsdefinations',
            layout: 'column',
            defaults: {
                labelAlign: 'top'
            },
            items: [{
                xtype: 'numberfield',
                fieldLabel: 'Costs',
                allowBlank: true,
                value: 0,
                columnWidth: 0.49,
                name: 'costs'
            },{
                xtype: 'combobox',
                forceSelection: true,
                name: 'currency_id',
                displayField: 'name',
                allowBlank: true,
                fieldLabel: 'Currency',
                valueField: 'id',
                columnWidth: 0.49,
                queryMode: 'local',
                listeners:{
                    afterrender: {
                        fn: 'setCompStore',
                        config:{
                            pageSize: 10000,
                            proxy:{
                                url: 'configurations/getConfigParamFromTable',
                                extraParams:{
                                    table_name: 'par_currencies',
                                    is_paying_currency: 1
                                }
                            }
                        },
                        isLoad: true
                    }
                }
            }]
        },{
            xtype: 'numberfield',
            fieldLabel: 'ForMula Rate(% or counter)',
            allowBlank: true,
            value: 0,margin: '0 20 20 0',
            hidden: true,
            name: 'formula_rate'
        },
        {
            xtype: 'combobox',
            forceSelection: true,
            name: 'gl_code_id',
            hidden: true,
            displayField: 'name',
            allowBlank: true,
            fieldLabel: 'GL Code',
            margin: '0 20 0 0',
            valueField: 'id',
            queryMode: 'local',
            listeners:{
                afterrender: {
                    fn: 'setCompStore',
                    config:{
                        pageSize: 10000,
                        proxy:{
                            url: 'configurations/getConfigParamFromTable',
                            extraParams:{
                                table_name: 'par_gl_accounts',
                                is_enabled: 1
                            }
                        }
                    },
                    isLoad: true
                }
            }
    },{
            xtype: 'textfield',
            fieldLabel: 'GL Code',
            margin: '0 20 20 0',
            name: 'gl_code',
            allowBlank: true
        },{
            xtype: 'combobox',
            fieldLabel: 'SAP Fee ITEM',
            allowBlank: true,
            margin: '0 20 20 0',
            name: 'sap_ref',
            queryMode: 'local',
            valueField: 'ItemCode',
            displayField: 'ItemName',
            listeners:
                {
                    afterrender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 10000,
                            proxy: {
                                url: 'sap/getItems',
                                extraParams: {
                                    table_name: ''
                                }
                            }
                        },
                        isLoad: true
                    }

                },

        },{
            xtype: 'checkbox',
            inputValue: 1,
            uncheckedValue: 0,
            value:0,
            fieldLabel: 'Exist on SAP',
            margin: '0 20 20 0',
            name: 'exist_sap',
            allowBlank: true
        }
    ],
    buttons: [ '->', {
        text: 'Save Details',
        iconCls: 'x-fa fa-save',
        action: 'save',
        table_name: 'tra_element_costs',
        storeID: 'elementscoststr',
        formBind: true,width: 150,
        height: 35,
        padding: '5 5 5 5',
        ui: 'soft-purple',
        action_url: 'configurations/saveConfigCommonData',
        handler: 'doCreateConfigParamWin'

    }, {
        text: 'Reset',
        ui: 'soft-purple',
        iconCls: 'x-fa fa-close',
        width: 15,
        height: 35,
        padding: '5 5 5 5',
        handler: function (btn) {
            btn.up('form').getForm().reset();
        }
    }]
});
