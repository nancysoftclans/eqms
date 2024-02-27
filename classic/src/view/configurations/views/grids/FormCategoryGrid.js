Ext.define('Admin.view.configurations.views.grids.FormCategoryGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'configurationsvctr',
    xtype: 'formCategoryGrid',
    viewModel: 'configurationsvm',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    height: Ext.Element.getViewportHeight() - 118,
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        getRowClass: function (record, rowIndex, rowParams, store) {
            var is_enabled = record.get('is_enabled');
            if (is_enabled == 0 || is_enabled === 0) {
                return 'invalid-row';
            }
        }
    },
    
dockedItems: [
    {
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                xtype: 'button',bind: {
                    disabled: '{isReadOnly}'
                },
                text: 'Add',
                iconCls: 'x-fa fa-plus',
                action: 'add',
                ui: 'soft-blue',
                childXtype: 'formCategoryFrm',
                winTitle: 'Form Category',
                winWidth: '40%',
                handler: 'showAddConfigParamWinFrm',
                stores: '[]'
            }, {
                xtype: 'exportbtn'
            },{
                xtype: 'displayfield',
                name: 'process_name',
                value:'Double Click to View/Add Columns Relations',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '11px'
                }
            }
          ],
          plugins: [
            {
                ptype: 'gridexporter'
            }
        ],
        export_title: 'formCategory',
    },
    {
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                xtype: 'combo', anyMatch: true,
                emptyText: 'MODULE',
                flex: 1,
                width: 150,
                valueField: 'id',
                displayField: 'name',
                forceSelection: true,
                name: 'module_id',
                queryMode: 'local',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold'
                },
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 100,
                            proxy: {
                                extraParams: {
                                    table_name: 'par_modules'
                                }
                            }
                        },
                        isLoad: true
                    },
                    change: function (cmbo, newVal) {
                        var grid = cmbo.up('grid'),
                        sub_module = grid.down('combo[name=sub_module_id]'),
                        sub_module_str = sub_module.getStore(),
                        filters = JSON.stringify({module_id: newVal});
                    sub_module_str.removeAll();
                    sub_module_str.load({params: {filters: filters}});

                    //    grid.getStore().load();
                    }
                },
                triggers: {
                    clear: {
                        type: 'clear',
                        hideWhenEmpty: true,
                        hideWhenMouseOut: false,
                        clearOnEscape: true
                    }
                }
            }, {
                xtype: 'combo', anyMatch: true,
                emptyText: 'SUB MODULE',
                flex: 1,
                width: 150,
                valueField: 'id',
                displayField: 'name',
                forceSelection: true,
                name: 'sub_module_id',
                queryMode: 'local',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold'
                },
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 1000,
                            proxy: {
                                extraParams: {
                                    table_name: 'par_sub_modules'
                                }
                            }
                        },
                        isLoad: false
                    },
                },
                triggers: {
                    clear: {
                        type: 'clear',
                        hideWhenEmpty: true,
                        hideWhenMouseOut: false,
                        clearOnEscape: true
                    }
                }
            }, {
                xtype: 'combo', anyMatch: true,
                emptyText: 'SECTION',
                flex: 1,
                width: 150,
                valueField: 'id',
                displayField: 'name',
                forceSelection: true,
                name: 'section_id',
                queryMode: 'local',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold'
                },
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 100,
                            proxy: {
                                extraParams: {
                                    table_name: 'par_sections'
                                }
                            }
                        },
                        isLoad: true
                    },
                    change: function (cmbo, newVal) { 
                            var grid = cmbo.up('grid'),
                            section_category = grid.down('combo[name=prodclass_category_id]'),
                            section_category_str = section_category.getStore(),
                            filters = JSON.stringify({section_id: newVal});
                        section_category_str.removeAll();
                        section_category_str.load({params: {filters: filters}});
                    }
                },
                triggers: {
                    clear: {
                        type: 'clear',
                        hideWhenEmpty: true,
                        hideWhenMouseOut: false,
                        clearOnEscape: true
                    }
                }
            }, {
                xtype: 'combo', anyMatch: true,
                emptyText: 'PRODUCT  CATEGORY',
                flex: 1,
                width: 150,
                valueField: 'id',
                displayField: 'name',
                forceSelection: true,
                name: 'prodclass_category_id',
                queryMode: 'local',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold'
                },
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 1000,
                            proxy: {
                                extraParams: {
                                    table_name: 'par_prodclass_categories'
                                }
                            }
                        },
                        isLoad: false
                    },
                },
                triggers: {
                    clear: {
                        type: 'clear',
                        hideWhenEmpty: true,
                        hideWhenMouseOut: false,
                        clearOnEscape: true
                    }
                }
            },
            {
                xtype: 'combo', anyMatch: true,
                emptyText: 'PREMISE CATEGORY',
                flex: 1,
                width: 150,
                valueField: 'id',
                displayField: 'name',
                forceSelection: true,
                name: 'premise_type_id',
                queryMode: 'local',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold'
                },
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 1000,
                            proxy: {
                                extraParams: {
                                    table_name: 'par_premises_types'
                                }
                            }
                        },
                        isLoad: false
                    },
                },
                triggers: {
                    clear: {
                        type: 'clear',
                        hideWhenEmpty: true,
                        hideWhenMouseOut: false,
                        clearOnEscape: true
                    }
                }
            },
            {
                xtype: 'combo', anyMatch: true,
                emptyText: 'Import Permit Type',
                flex: 1,
                width: 150,
                valueField: 'id',
                displayField: 'name',
                forceSelection: true,
                name: 'importexport_permittype_id',
                queryMode: 'local',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold'
                },
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 100,
                            proxy: {
                                extraParams: {
                                    table_name: 'par_importexport_permittypes'
                                }
                            }
                        },
                        isLoad: false
                    },
                },
                triggers: {
                    clear: {
                        type: 'clear',
                        hideWhenEmpty: true,
                        hideWhenMouseOut: false,
                        clearOnEscape: true
                    }
                }
            },{
                xtype: 'button',
                text: 'Filter',
                ui: 'soft-blue',
                iconCls: 'x-fa fa-search',
                handler: function(btn) {
                  var grid = btn.up('grid');
                      grid.getStore().load();
                },
            },{
                xtype: 'button',
                text: 'Clear',
                ui: 'soft-red',
                iconCls: 'x-fa fa-close',
                handler: function(btn) {
                  var grid = btn.up('grid'),
                        gridStr = grid.getStore();
                        grid.down('combo[name=module_id]').clearValue();
                        grid.down('combo[name=sub_module_id]').clearValue();
                        grid.down('combo[name=section_id]').clearValue();
                        grid.down('combo[name=prodclass_category_id]').clearValue();
                        grid.down('combo[name=premise_type_id]').clearValue();
                        grid.down('combo[name=importexport_permittype_id]').clearValue();
                        gridStr.load();
                },
            }
        ],
        plugins: [
            {
                ptype: 'gridexporter'
            }
        ],
        export_title: 'formCategory',
    },
    {
        xtype: 'toolbar',
        ui: 'footer',
        dock: 'bottom',
        items: [
            {
            xtype: 'pagingtoolbar',
            width: '100%',
            displayInfo: true,
            displayMsg: 'Showing {0} - {1} of {2} total records',
            emptyMsg: 'No Records',
            beforeLoad: function(){
                var grid = this.up('grid'),
                    module_id = grid.down('combo[name=module_id]').getValue(),
                    section_id=grid.down('combo[name=section_id]').getValue(),
                    sub_module_id=grid.down('combo[name=sub_module_id]').getValue(),
                    prodclass_category_id=grid.down('combo[name=prodclass_category_id]').getValue(),
                    premise_type_id=grid.down('combo[name=premise_type_id]').getValue(),
                    importexport_permittype_id=grid.down('combo[name=importexport_permittype_id]').getValue(),
                    filters = JSON.stringify({
                        't1.module_id': module_id,
                        't1.sub_module_id': sub_module_id,
                        't1.section_id':section_id,
                        't1.prodclass_category_id':prodclass_category_id,
                        'premise_type_id':premise_type_id,
                        'importexport_permittype_id': importexport_permittype_id

                    }),
                    store = grid.getStore();
                store.getProxy().extraParams = {
                    filters: filters,
                    is_config: 1,
                    table_name: 'par_form_categories'
                }
            }
                
            }
        ]
    }
],
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],

    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 1000,
                storeId: 'formCategoryStr',
                proxy: {
                    extraParams:{
                    	is_config: 1,
                        table_name: 'par_form_categories'
                    }
                }
            },
            isLoad: true
        },
        itemdblclick: 'onformcategoryDblClick'//formFieldRelationGrid
    },
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'id',
        text: 'Ref ID',
        hidden: true,
        width: 100
    },{
        xtype: 'rownumberer'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'name',
        text: 'Name',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'module_name',
        text: 'Module',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'sub_module_name',
        text: 'Sub Module',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'section_name',
        text: 'Section',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'section_category',
        text: 'Product Category',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'premise_type',
        text:'Premise Category',
        // hidden: true,
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'importexport_permittype',
        text:'Import Permit Type',
        // hidden: true,
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'description',
        text: 'Description',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'is_enabled',
        text: 'Enable',
        flex: 1,
        renderer: function (value, metaData) {
            if (value) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "True";
            }

            metaData.tdStyle = 'color:white;background-color:red';
            return "False";
        }
    },{
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
                    name: 'addfields',
                    text: 'Add Fields',
                    tooltip: 'Add Fields',
                    iconCls: 'x-fa fa-plus',
                    childXtype: 'formTypeFieldsGrid',
                    winTitle: 'Form Type Fields',
                    winWidth: '70%',
                    handler: 'AddFormTypeFields'
                },{
                    text: 'Edit',
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'Edit Record',
                    action: 'edit',
                    childXtype: 'formCategoryFrm',
                    winTitle: 'Form Category',
                    winWidth: '40%',
                    handler: 'showEditConfigParamWinFrm',bind: {
            disabled: '{isReadOnly}'
        },
                    stores: '[]'
                }, {
                    text: 'Disable',
                    iconCls: 'x-fa fa-repeat',
                    table_name: 'par_form_categories',
                    storeID: 'formCategoryStr',
                    action_url: 'configurations/softDeleteConfigRecord',
                    action: 'soft_delete',bind: {
            disabled: '{isReadOnly}'
        },
                    handler: 'doDeleteConfigWidgetParam'
                }, {
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete Record',
                    table_name: 'par_form_categories',
                    storeID: 'formCategoryStr',
                    action_url: 'configurations/deleteConfigRecord',  
                    action: 'actual_delete',bind: {
                        disabled: '{hideDeleteButton}'
                    },
                    handler: 'doDeleteConfigWidgetParam',bind: {
                        disabled: '{hideDeleteButton}'
                    },
                }, {
                    text: 'Enable',
                    iconCls: 'x-fa fa-undo',
                    tooltip: 'Enable Record',
                    table_name: 'par_form_categories',
                    storeID: 'formCategoryStr',
                    action_url: 'configurations/undoConfigSoftDeletes',
                    action: 'enable',
                    disabled: true,bind: {
            disabled: '{isReadOnly}'
        },
                    handler: 'doDeleteConfigWidgetParam'
                }
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
    }]
});
