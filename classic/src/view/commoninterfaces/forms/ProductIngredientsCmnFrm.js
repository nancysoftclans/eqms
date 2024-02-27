/**
 */
Ext.define('Admin.view.commoninterfaces.forms.ProductIngredientsCmnFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'productingredientscmnfrm',
    bodyPadding: 5,
    layout: 'column',
    defaults: {
        columnWidth: 1,
        margin: 5,
        allowBlank: false
    },
    items: [
        {
            xtype: 'hiddenfield',
            name: 'id'
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Ingredient',
            forceSelection: true,
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            name: 'ingredient_id',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        storeId: 'masteringredientsstr',
                        proxy: {
                            extraParams:{
                                table_name: 'par_ingredients'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Specification Type',
            forceSelection: true,
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            name: 'specification_id',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        storeId: 'ingrespecificationtypestr',
                        proxy: {
                            extraParams:{
                                table_name: 'par_ingredients_types'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: 'Strength',
            layout: 'column',
            items: [
                {
                    xtype: 'textfield',
                    columnWidth: 0.7,
                    name: 'strength'
                },
                {
                    xtype: 'combo', anyMatch: true,
                    forceSelection: true,
                    queryMode: 'local',
                    columnWidth: 0.3,
                    valueField: 'id',
                    displayField: 'name',
                    name: 'si_unit_id',
                    listeners: {
                        beforerender: {
                            fn: 'setCompStore',
                            config: {
                                pageSize: 1000,
                                storeId: 'siunitstr',
                                proxy: {
                                    extraParams:{
                                        table_name: 'par_si_units'
                                    }
                                }
                            },
                            isLoad: true
                        }
                    }
                }
            ]
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Reason for Inclusion',
            forceSelection: true,
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            name: 'inclusion_reason_id',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        storeId: 'impproductinclusionreasonstr',
                        proxy: {
                            extraParams:{
                                table_name: 'par_inclusions_reasons'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        }
    ]
});