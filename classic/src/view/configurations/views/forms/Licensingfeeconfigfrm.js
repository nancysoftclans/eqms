Ext.define('Admin.view.configurations.views.forms.Licensingfeeconfigfrm', {
    extend: 'Ext.form.Panel',
    xtype: 'licensingfeeconfigfrm',
    controller: 'configurationsvctr',
    autoScroll: true,
    height: Ext.Element.getViewportHeight() - 118,
    layout: 'column',
    itemId: 'licensingfeeconfigfrm',
    frame: true,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false,
        columnWidth: 1,
    },
    
    items: [{
        xtype: 'hiddenfield',
        margin:5,
        name: 'table_name',
        value: 'tra_appmodules_feesconfigurations',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        margin:5,
        name: '_token',
        value: token,
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'id',
        margin:5,
        name: 'id',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'module',
        margin:5,
        value: 2,
        name: 'module_id',
        allowBlank: true
    },{
        xtype: 'fieldset',
        title: 'Application Details',
        collapsible: true,
        layout: 'column',
        defaults: {
            labelAlign: 'top',
            allowBlank: false,
            columnWidth: 0.5,
        },
        items: [,{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Sub Module',
            margin:5,
            name: 'sub_module_id',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            // url: 'commonparam/getCommonParamFromTable',
                            extraParams: {
                                table_name: 'par_sub_modules',
                                filters: JSON.stringify({'module_id':2})
                            }
                        }
                    },
                    isLoad: true
                },
                change: function(combo, newVal, oldVal, eopts){
                    var form = combo.up('form'),
                        element_costs_str = form.down('combo[name=element_costs_id]').getStore(),
                        filters = JSON.stringify({sub_module_id: newVal});
                    element_costs_str.load({params: {filters:filters}});

                }
            }
        },{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Sections',
            margin:5,
            name: 'section_id',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            // url: 'commonparam/getCommonParamFromTable',
                            extraParams: {
                                table_name: 'par_sections'
                            }
                        }
                    },
                    isLoad: true
                },
                // change: function(combo, newVal, oldVal, eopts){
                //     var form = combo.up('form'),
                //         store = form.down('combo[name=prodclass_category_id]').getStore(),
                //         filters = JSON.stringify({'section_id': newVal});
                //     store.removeAll();
                //     store.load({params: {filters: filters}});
                // }
               
            }
        },{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Premise Type',
            margin:5,
            name: 'premise_type_id',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            allowBlank:true,
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            // url: 'commonparam/getCommonParamFromTable',
                            extraParams: {
                                table_name: 'par_premises_types'
                            }
                        }
                    },
                    isLoad: true
                },
                // change: function(combo, newVal, oldVal, eopts){
                //     var form = combo.up('form'),
                //         businesstype_class_id = form.down('combo[name=businesstype_class_id]'),
                //         retail_in_hospital = form.down('combo[name=retail_in_hospital]');

                //     //4 for retail 2 for agrovet
                //     if(newVal == 2){
                //         businesstype_class_id.setVisible(true);
                //         businesstype_class_id.allowBlank = false;
                //     }
                //     else{
                //         businesstype_class_id.setVisible(false);
                //         businesstype_class_id.allowBlank = true;
                //     }
                //     if(newVal == 4){
                //         retail_in_hospital.setVisible(true);
                //         retail_in_hospital.allowBlank = false;
                //     }
                //     else{
                //         retail_in_hospital.setVisible(false);
                //         retail_in_hospital.allowBlank = true;
                //     }
                //     businesstype_class_id.validate();
                //     retail_in_hospital.validate();
                // }
               
            }
        },{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Business Type Class',
            margin:5,
            name: 'businesstype_class_id',
            valueField: 'id',
            hidden: true,
            allowBlank: true,
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            // url: 'commonparam/getCommonParamFromTable',
                            extraParams: {
                                table_name: 'par_businesstype_class'
                            }
                        }
                    },
                    isLoad: true
                }
               
            }
        },{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Retail in Hospital',
            margin:5,
            hidden: true,
            allowBlank: true,
            name: 'retail_in_hospital',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            // url: 'commonparam/getCommonParamFromTable',
                            extraParams: {
                                table_name: 'par_confirmations'
                            }
                        }
                    },
                    isLoad: true
                }
               
            }
        },,{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Is Expedited',
            margin:5,
            allowBlank: true,
            name: 'is_expedited',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            extraParams: {
                                table_name: 'par_confirmations'
                            }
                        }
                    },
                    isLoad: true
                }
               
            }
        },{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Fee Type',
            margin:5,
            name: 'application_feetype_id',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            // url: 'commonparam/getCommonParamFromTable',
                            extraParams: {
                                table_name: 'par_applicationfee_types'
                            }
                        }
                    },
                    isLoad: true
                }
               
            }
        },{
            xtype: 'checkbox',
            inputValue: 1,
            fieldLabel: 'Is Enabled',
            margin:5,
            name: 'is_enabled',
            allowBlank: true
        },{
            xtype: 'combobox',
            fieldLabel: 'Elements Costs ',
            forceSelection: true,
            allowBlank: false,
            margin:5, columnWidth: 1,
            name: 'element_costs_id',
            queryMode: 'local',
            displayField: 'element_desc',
            valueField: 'id',
            editable : false,
            forceSelection : true,
            mode : 'local',
            triggerAction : 'all',
           
            listeners:{
                 afterrender: {
                    fn: 'setCompStore',
                    config:{
                        pageSize: 10000,
                        proxy:{
                            url: 'configurations/getelementcost',
                            extraParams:{
                                table_name: 'tra_element_costs'
                            }
                        }
                    },
                    isLoad: false
                },
                 select: function(combo, records){
                      var frm = combo.up('form');
                      frmelementcosts = frm.down('form[name=frmelementcosts]');
                      frmelementcosts.loadRecord(records);
                }
             }
        }]
    },{
        xtype: 'form',
        name:'frmelementcosts',
        title: 'Element Cost',
        layout: 'column',
        defaults: {
            labelAlign: 'top',
            allowBlank: false,
            columnWidth: 0.5,
        },
        collapsible: true,
        items: [{
            xtype: 'combobox',
            fieldLabel: 'Fee Type',
            forceSelection: true,
            allowBlank: false,
            margin:5,
            name: 'fee_type_id',readOnly: true,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            listeners:{
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
                          // cost_category = form.down('combo[name=cost_category_id]').getStore(),
                           element_id = form.down('combo[name=element_id]').getStore();
       
                        var filter = {'fee_type_id':newvalue};
                           filter = JSON.stringify(filter);
                           // cost_category.removeAll();
                           element_id.removeAll();
                           // cost_category.load({params:{filters: filter}});
                           element_id.load({params:{filters: filter}});
                }
               
             }
        },{
            
            xtype: 'combobox',
            fieldLabel: 'Cost Element',
            forceSelection: true,
            allowBlank: false,
            margin:5,
            name: 'element_id',readOnly: true,
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
                                table_name: 'par_cost_elements'
                            }
                        }
                    },
                    isLoad: true
                }
             },
         },{
            xtype: 'combobox',
            forceSelection: true,
            name: 'formula',
            displayField: 'name',
            allowBlank: false,
            fieldLabel: 'Is Formula',
            margin: '0 20 0 0',
            valueField: 'id',
            queryMode: 'local',readOnly: true,
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
        },{
            xtype: 'fieldcontainer',
            name: 'costsdefinations',
            layout: 'column',
            defaults: {
                labelAlign: 'top'
            },
            items: [{
                xtype: 'numberfield',
                fieldLabel: 'Costs',readOnly: true,
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
                columnWidth: 0.49,readOnly: true,
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
            readOnly: true,
            value: 0,
            margin:5,
            hidden: true,
            name: 'formula_rate'
        }]
    }],
    dockedItems:[
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            layout: 'vbox',
            items:['->',{
                    text: 'Save Details',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'tra_appmodules_feesconfigurations',
                    storeID: 'licensingfeeconfigstr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'configurations/saveModuleFeeConfigCommonData',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});