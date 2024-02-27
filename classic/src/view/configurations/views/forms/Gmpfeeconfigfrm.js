Ext.define('Admin.view.configurations.views.forms.Gmpfeeconfigfrm', {
    extend: 'Ext.form.Panel',
    xtype: 'gmpfeeconfigfrm',
    controller: 'configurationsvctr',
    autoScroll: true,
    height: Ext.Element.getViewportHeight() - 118,
    layout: 'column',
    itemId: 'gmpfeeconfigfrm',
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
        value: 3,
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
        items: [{
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
                                filters: JSON.stringify({'module_id':3})
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
                }
               
            }
        },{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'GMP Type',
            margin:5,
            columnWidth: 0.5,
            name: 'gmp_type_id',
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
                        //    / url: 'commonparam/getCommonParamFromTable',
                            extraParams: {
                                table_name: 'par_gmplicensetypes_details'
                            }
                        }
                    },
                    isLoad: true
                },  
                change: function(combo, newVal, oldval, eopts){
                    var form = combo.up('form'),
                        facility_location_id = form.down('combo[name=facility_location_id]');
                        manufacturing_type_id = form.down('combo[name=manufacturing_type_id]');
                        sterile_type_id = form.down('combo[name=sterile_type_id]');

                    if(newVal == 1){
                        facility_location_id.setVisible(true);
                        facility_location_id.allowBlank = false;
                        manufacturing_type_id.setVisible(false);
                        manufacturing_type_id.allowBlank = true;
                        sterile_type_id.setVisible(false);
                        sterile_type_id.allowBlank = true;
                    }
                    if(newVal == 2){
                        manufacturing_type_id.setVisible(true);
                        manufacturing_type_id.allowBlank = false;
                        sterile_type_id.setVisible(true);
                        sterile_type_id.allowBlank = false;
                        facility_location_id.setVisible(false);
                        facility_location_id.allowBlank = true;
                    }
                }
               
            }
        }, {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Type of Inspection Request',
            name: 'inspection_type_id',
            valueField: 'id',
            columnWidth: 0.5,
            displayField: 'name',
            queryMode: 'local',
            allowBlank: false,
            forceSelection: true,
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 100,
                        proxy: {
                            url: 'configurations/getConfigParamFromTable',
                            extraParams: {
                                table_name: 'par_gmp_inspection_types'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        }, {
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Facility Location',
                name: 'facility_location_id',
                valueField: 'id',
                columnWidth: 0.5,
                displayField: 'name',
                queryMode: 'local',
                allowBlank: true,
                forceSelection: true,
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 100,
                            proxy: {
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_facility_location'
                                }
                            }
                        },
                        isLoad: true
                    }
                }
            },
            {
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Manufacturing Type',
                name: 'manufacturing_type_id',
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                allowBlank: true,
                forceSelection: true,
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 100,
                            proxy: {
                                url: 'gmpapplications/getGmpBusinessTypes',
                                extraParams: {
                                    table_name: 'par_gmplicense_businesstypes'
                                }
                            }
                        },
                        isLoad: true
                    }
                }
            },
            {
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Is Sterile',
                name: 'sterile_type_id',
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                allowBlank: true,
                forceSelection: true,
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 100,
                            proxy: {
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_sterile_type'
                                }
                            }
                        },
                        isLoad: true
                    }
                }
            },
            {
            xtype: 'combo', anyMatch: true,
            columnWidth: 0.5,
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
            columnWidth: 0.5,
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
            // store:'elementscoststr',
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
                           element_id = form.down('combo[name=element_id]').getStore();
                        var filter = {'fee_type_id':newvalue};
                           filter = JSON.stringify(filter);
                           element_id.removeAll();
                           element_id.load({params:{filters: filter}});
                }
               
             }
        },
            {
            
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
            fieldLabel: 'Formula Rate(% or counter)',
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
                    storeID: 'gmpfeeconfigstr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'configurations/saveModuleFeeConfigCommonData',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});