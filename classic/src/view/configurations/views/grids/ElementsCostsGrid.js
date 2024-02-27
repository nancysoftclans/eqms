Ext.define('Admin.view.configurations.views.grids.ElementsCostGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.elementscostgrid',
    title: 'ElementCost',
    itemId: 'elementscost',
    controller: 'configurationsvctr',
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 1000,
                storeId: 'elementscoststr',
                proxy: {
                    url: 'configurations/getelementcost',
                    extraParams:{
                      is_config:1,
                        table_name: 'par_cost_elements'
                    }
                }
            },
            isLoad: true
        }
    },
    plugins: [{
        ptype: 'filterfield'
    },{
        ptype: 'gridexporter'
    }],
    tbar: [{
        xtype: "button",bind: {
            disabled: '{isReadOnly}'
        },
        text: "Add Element Cost",
        iconCls: 'x-fa fa-plus',
        margin: '0 0 5 0',
        action: 'add',
        form: 'elementscostfrm',
        ui: 'soft-blue',
        winTitle:'Element Cost form',
        winWidth:'40%',
        childXtype: 'elementscostfrm',
        stores: '[]',
        handler: 'showAddConfigParamWinFrm'
    },
      {
        xtype: 'exportbtn',
    }],
    columns: [
        {
                xtype: 'rownumberer'
        },
         {
            xtype: 'gridcolumn',
            dataIndex: 'feetype',
            text: 'Fee Type',
            width: 200,
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'fee_type_id',
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
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_fee_types'
                                }
                            }
                        },
                        isLoad: true
                    },
                    change: function(me){
                        this.up('grid').getStore().reload();
                    }
                   
                }
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'category',
            text: 'Category',
            name: 'category',
            hidden: true,
            width: 200,
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'cost_category_id',
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
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_cost_categories'
                                }
                            }
                        },
                        isLoad: true
                    },
                    change: function(me){
                        this.up('grid').getStore().reload();
                    }
                   
                }
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'sub_category',
            text: 'Sub Category',
            hidden: true,
            width: 200,
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'sub_cat_id',
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
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_cost_sub_categories'
                                }
                            }
                        },
                        isLoad: true
                    },
                    change: function(me){
                        this.up('grid').getStore().reload();
                    }
                   
                }
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'module_name',
            text: 'Module',
            name: 'module',
            width: 200,
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'module_id',
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
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_modules'
                                }
                            }
                        },
                        isLoad: true
                    },
                    change: function(me,newValue, oldVal, eopts){
                        var grid = this.up('grid'),
                            subStr = grid.down('combo[name=sub_module_id]').getStore(),
                            filters = JSON.stringify({module_id:newValue});
                        grid.getStore().reload();
                        subStr.load({params: {filters: filters}})
                    }
                   
                }
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'sub_module_name',
            text: 'Sub Module',
            width: 200,
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
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
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_sub_modules'
                                }
                            }
                        },
                        isLoad: false
                    },
                    change: function(me){
                        this.up('grid').getStore().reload();
                    }
                   
                }
            }
        },
         
        {
            xtype: 'gridcolumn',
            dataIndex: 'element',
            text: 'Cost Element',
            width: 200,
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'cost_item_id',
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
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_cost_elements'
                                }
                            }
                        },
                        isLoad: true
                    },
                    change: function(me){
                        this.up('grid').getStore().reload();
                    }
                   
                }
            }
        },  
        {
            xtype: 'gridcolumn',
            dataIndex: 'cost_type',
            text: 'Application Fee Type',
            width: 200,
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'applicationfee_types_id',
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
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_applicationfee_types'
                                }
                            }
                        },
                        isLoad: true
                    },
                    change: function(me){
                        this.up('grid').getStore().reload();
                    }
                   
                }
            }
        },
         {
            xtype: 'gridcolumn',
            dataIndex: 'costs',
            text: 'Cost',
            width: 200,
            tdCls: 'wrap'
        },
         {
            xtype: 'gridcolumn',
            dataIndex: 'currency_name',
            text: 'Currency',
            width: 200,
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'currency_id',
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
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_currencies',
                                    filters: JSON.stringify({'is_paying_currency': 1})
                                }
                            }
                        },
                        isLoad: true
                    },
                    change: function(me){
                        this.up('grid').getStore().reload();
                    }
                   
                }
            }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'formula',
            text: 'Is Formula',
            width: 100,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.tdStyle = 'color:white;background-color:green';
                    return "True";
                }
                else{
                    metaData.tdStyle = 'color:white;background-color:red';
                    return "False";
                }
            }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'formula_rate',
            text: 'Formular Rate(%)',
            width: 200,
            tdCls: 'wrap'
        },{
            xtype: 'gridcolumn',
            dataIndex: 'glcode',
            text: 'GL_Code',
            width: 200,
            tdCls: 'wrap'
        },{
            header: 'Exist on SAP',
            dataIndex: 'exist_sap',
            width: 200,
            filter: {
                xtype: 'textfield'
            }
        },{
            header: 'SAP REF',
            dataIndex: 'sap_ref',
            width: 200,
            filter: {
                xtype: 'textfield'
            }
        },
        {
            text: 'Options',
            xtype: 'widgetcolumn',
            width: 90,
            widget: {
                width: 75,
                textAlign: 'left',
                xtype: 'splitbutton',
                iconCls: 'x-fa fa-th-list',
                ui: 'gray',
                menu: {
                    xtype: 'menu',
                    items: [{
                        text: 'Edit',
                        iconCls: 'x-fa fa-edit',
                        tooltip: 'Edit Record',
                        action: 'edit',
                        childXtype: 'elementscostfrm',
                        winTitle: 'Element Cost Form',
                        bind: {
                            disabled: '{isReadOnly}'
                        },
                        winWidth: '40%',
                        handler: 'showEditConfigParamWinFrm',bind: {
                disabled: '{isReadOnly}'
            },
                        stores: '[]'
                    }, 
                    {
                        text: 'Disable',
                        iconCls: 'x-fa fa-repeat',
                        table_name: 'par_cost_elements',
                        storeID: 'elementscoststr',
                        bind: {
                            disabled: '{isReadOnly}'
                        },
                        action_url: 'configurations/softDeleteConfigRecord',
                        action: 'soft_delete',bind: {
                disabled: '{isReadOnly}'
            },
                        handler: 'doDeleteConfigWidgetParam'
                    },
                    {
                        text: 'Enable',
                        iconCls: 'x-fa fa-undo',
                        tooltip: 'Enable Record',
                        table_name: 'par_cost_elements',
                        storeID: 'elementscoststr',
                        bind: {
                            disabled: '{isReadOnly}'
                        },
                        action_url: 'configurations/undoConfigSoftDeletes',
                        action: 'enable',
                        disabled: true,bind: {
                disabled: '{isReadOnly}'
            },
                        handler: 'doDeleteConfigWidgetParam'
                    },
                    {
                        text: 'Delete',
                        iconCls: 'x-fa fa-trash',
                        tooltip: 'Delete Record',
                        table_name: 'par_cost_elements',
                        storeID: 'elementscoststr',
                        bind: {
                            disabled: '{hideDeleteButton}'
                        },
                        action_url: 'configurations/deleteConfigRecord',  
                        action: 'actual_delete',
                        bind: {
                            disabled: '{hideDeleteButton}'
                        },
                        handler: 'doDeleteConfigWidgetParam',
                        bind: {
                            disabled: '{hideDeleteButton}'
                        },
                        // hidden: Admin.global.GlobalVars.checkForProcessVisibility('actual_delete')
                    }, 
                    ]
                }
            }, onWidgetAttach: function (col, widget, rec) {
                var is_enabled = rec.get('is_enabled');
                if (is_enabled === 0 || is_enabled == 0) {
                    widget.down('menu menuitem[action=enable]').setDisabled(false);
                    widget.down('menu menuitem[action=soft_delete]').setDisabled(true);
                } else {
                    widget.down('menu menuitem[action=enable]').setDisabled(true);
                    widget.down('menu menuitem[action=soft_delete]').setDisabled(false);
                }
            }
        }],
        
 

    bbar: [{
        xtype: 'pagingtoolbar',
        storeId: 'elementscoststr',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function () {
                var store = this.getStore(),
                    grid = this.up('grid'),
                    fee_type_id = grid.down('combo[name=fee_type_id]').getValue(),
                    cost_category_id = grid.down('combo[name=cost_category_id]').getValue(),
                    sub_cat_id = grid.down('combo[name=sub_cat_id]').getValue(),
                    cost_item_id = grid.down('combo[name=cost_item_id]').getValue(),
                    module_id = grid.down('combo[name=module_id]').getValue(),
                    sub_module_id = grid.down('combo[name=sub_module_id]').getValue(),
                    applicationfee_types_id=grid.down('combo[name=applicationfee_types_id]').getValue(),
                    currency_id=grid.down('combo[name=currency_id]').getValue();
                store.getProxy().extraParams = {
                    fee_type_id: fee_type_id,
                    cost_category_id: cost_category_id,
                    sub_cat_id: sub_cat_id,
                    cost_item_id: cost_item_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    table_name: 'par_cost_elements',
                    is_config:1,
                    applicationfee_types_id:applicationfee_types_id,
                    currency_id:currency_id
                };
            }
    }],
   
});
