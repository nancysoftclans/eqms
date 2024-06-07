Ext.define('Admin.view.documentManager.views.grids.NavigatorGrid', {
    extend: 'Ext.tree.Panel',
    xtype: 'navigatorgrid',
    itemId: 'navigatorgrid',
    controller: 'documentsManagementvctr',
    useArrows: true,
    rootVisible: false,
    multiSelect: false,
    singleExpand: true,
    margin: '0 5 0 0',
    selType: 'cellmodel',
    requires: [
        'Ext.grid.*',
        'Ext.tree.*'
    ],
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],

    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
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
    tbar: [{
      text: 'Create New Folder',
                iconCls: 'x-fa fa-plus',
                action: 'add',
                ui: 'soft-blue',
                childXtype: 'navigatorform',
                winTitle: 'Navigator',
                winWidth: '40%',
                handler: 'showAddConfigParamWinFrm',
                stores: '[]'
    },{
                    xtype: 'panel',
                    html: '<h2>Double Click Document To Preview</h2>'
                },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Module',
        name: 'module_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: false,
        hidden: true,
        width: 250,
        labelWidth: 80,
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
                var grid = cmbo.up('#navigatorgrid'),
                    subModuleStore = grid.down('combo[name=sub_module_id]').getStore();
                    subModuleStore.removeAll();
                    subModuleStore.load({params: {module_id: newVal}});

                var store = this.up('#navigatorgrid').getStore();
                store.reload();                 
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Sub Module',
        name: 'sub_module_id',
        valueField: 'id',
        hidden: true,
        displayField: 'name',
        forceSelection: true,
        width: 250,
        allowBlank: false,
        labelWidth: 80,
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
            },
            change: function (cmbo, newVal) {
               var store = this.up('#navigatorgrid').getStore();
                store.reload();
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Section',
        name: 'section_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        hidden: true,
        allowBlank: false,
        queryMode: 'local',
        width: 250,
        labelWidth: 80,
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
            },change: function (cmbo, newVal) {
               var store = this.up('#navigatorgrid').getStore();
                store.reload();
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Premise Type',
        name: 'premise_type_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: false,
        hidden: true,
        queryMode: 'local',
        width: 250,
        labelWidth: 80,
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
            },change: function (cmbo, newVal) {
               var store = this.up('#navigatorgrid').getStore();
                store.reload();
            }
        }
    }],
    autoScroll: true,
    listeners: {
        beforerender: {
            fn: 'setGridTreeStore',
            config: {
                storeId: 'docdefinationrequirementstr',
                proxy: {
                    api: {
                        read: 'documentmanagement/getNavigatorDetails'
                    },
                },
            },
            isLoad: true
        },
        itemdblclick: 'onViewDocumentDetails'
        //itemdblclick: 'onViewDocumentApplication'
    },
   
    bbar: [
        {
            xtype: 'button',
            text: 'Back',
            ui: 'soft-blue',
            iconCls: 'x-fa fa-backward',
            handler: 'backFromGroupAllDetails'
        },
         {
            xtype: 'pagingtoolbar',
            // store: 'systemrolestreestr',
            displayInfo: true,
            displayMsg: 'Showing {0} - {1} of {2} total records',
            emptyMsg: 'No Records',
            beforeLoad: function() {
                var grid = this.up('treepanel'),
                    store= this.getStore();
                    store.getProxy().extraParams = {
                        table_name:'par_navigator_folders'
                    };
            
            },
        },
        '->',
        {
            xtype: 'button',
            text: 'Sync Changes',
            ui: 'soft-blue',
            iconCls: 'x-fa fa-save',
            handler: 'updateSystemNavigationAccessRoles'
        }],
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'navigator_name',
        text: 'Title',
        flex: 1,
        sortable: true
    },{
        xtype: 'gridcolumn',
        dataIndex: 'doc_id',
        text: 'ID',
        flex: 1,
        renderer: function (value, metaData) {
            if (value === null || value === '') {
                metaData.tdStyle = 'color:grey;';
                return '<i> - </i>';
            }else {
                return value;
            }
        }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'attachments',
        text: 'Attachments',
        flex: 1
    },{  xtype: 'gridcolumn',
        dataIndex: 'navigator_version',
        text: 'Version',
        flex: 1
    },{  xtype: 'gridcolumn',
        dataIndex: 'dola',
        text: 'Issue Date',
        flex: 1
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
                    hidden: true,
                    iconCls: 'x-fa fa-plus',
                    childXtype: 'documenttypefieldgrid',
                    winTitle: 'Form Type Fields',
                    winWidth: '70%',
                    handler: 'AddFormTypeFields'
                },{
                    text: 'Edit',
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'Edit Record',
                    action: 'edit',
                    childXtype: 'navigatorform',
                    winTitle: 'Edit Document Type',
                    winWidth: '40%',
                    handler: 'showEditConfigParamWinFrm',bind: {
            disabled: '{isReadOnly}'
        }},{
                    text: 'Preview Document',
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'Preview Document',
                    //action: 'edit',
                    childXtype: 'documentsviewpnl',
                    winTitle: 'Edit Document Type',
                    winWidth: '40%',
                    handler: 'onViewDocumentDetails',bind: {
            disabled: '{isReadOnly}'
        },
                    stores: '[]'
                }, {
                    text: 'Copy/Move',
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'Copy/Move',
                    action: 'move',
                    childXtype: 'navigatormoveform',
                    winTitle: 'Copy/Move',
                    winWidth: '40%',
                    handler: 'showEditConfigParamWinFrm',bind: {
            disabled: '{isReadOnly}'
        },
                    stores: '[]'
                },{
                    text: 'Disable',
                    iconCls: 'x-fa fa-repeat',
                    hidden: true,
                    table_name: 'par_document_types',
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
                    hidden: true,
                    table_name: 'par_document_types',
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
                    hidden: true,
                    table_name: 'par_document_types',
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