Ext.define('Admin.view.configurations.views.forms.PromotionalAppFeeConfigFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'promotionalappfeeconfigfrm',
    controller: 'configurationsvctr',
    viewModel:'configurationsvm',

    autoScroll: true,
    height: Ext.Element.getViewportHeight() - 118,
    layout: 'column',
    itemId: 'promotionalappfeeconfigfrm',
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
        fieldLabel: 'module_id',
        margin:5,
        name: 'module_id',
        value: 14,
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
			allowBlank:true,
            queryMode: 'local',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            extraParams: {
                                table_name: 'par_sub_modules',
                                filters: JSON.stringify({'module_id':14}),
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },{
                allowBlank:false,
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Advertisement Category',
                name: 'advertisement_category_id',
                forceSelection: true,
                queryMode: 'local',
                valueField: 'id',
                displayField: 'name',
                listeners: {
                    afterrender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 10000,
                            proxy: {
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_advertisement_category'
                                }
                            }
                        },
                        isLoad: true
                    }
                }
            },
            {
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
                                extraParams: {
                                    table_name: 'par_applicationfee_types'
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
                fieldLabel: 'Is Enabled',
                margin:5,
                name: 'is_enabled',
                allowBlank: true
            },
            {
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
                        isLoad: true
                    },
                    select: function(combo, records){
                        var frm = combo.up('form'),
                            frmelementcosts = frm.down('form[name=frmelementcosts]');
                        frmelementcosts.loadRecord(records);
                    }
                }
            }
        ]
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
        items: [
            {
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
                allowBlank: false,
                margin:5,
                name: 'element_id',
                displayField: 'name',
                valueField: 'id',
                listeners:
                    {
                        afterrender: {//getConfigParamFromTable
                            fn: 'setCompStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    extraParams: {
                                        table_name: 'par_cost_elements'
                                    }
                                }
                            },
                            isLoad: false
                        }
                    }
            },
            {
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
            },
            {
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
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'ForMula Rate(% or counter)',
                allowBlank: true,readOnly: true,
                value: 0,margin:5,
                hidden: true,
                name: 'formula_rate'
            }
            ]
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
                    storeID: 'promotionalappfeeconfigstr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'configurations/saveModuleFeeConfigCommonData',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});