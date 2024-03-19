Ext.define('Admin.view.documentsManagement.views.grids.Docdefinationrequirementgrid', {
    extend: 'Ext.tree.Panel',
    xtype: 'docdefinationrequirementgrid',
    itemId: 'docdefinationrequirementgrid',
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
        xtype: 'button',
        text: 'Add',
        iconCls: 'x-fa fa-plus',
        action: 'add',
        ui: 'soft-blue',
        hidden: true,
        childXtype: 'docdefinationrequirementfrm',
        winTitle: 'Documents requirements Defination',
        winWidth: '40%',
        handler: 'showAddConfigParamWinFrm',
        stores: '[]'
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
                var grid = cmbo.up('#docdefinationrequirementgrid'),
                    subModuleStore = grid.down('combo[name=sub_module_id]').getStore();
                    subModuleStore.removeAll();
                    subModuleStore.load({params: {module_id: newVal}});

                var store = this.up('#docdefinationrequirementgrid').getStore();
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
               var store = this.up('#docdefinationrequirementgrid').getStore();
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
               var store = this.up('#docdefinationrequirementgrid').getStore();
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
               var store = this.up('#docdefinationrequirementgrid').getStore();
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
                        read: 'documentmanagement/getdocdefinationrequirementDetails'
                    },
                },
            },
            isLoad: true
        },
        itemdblclick: 'onViewDocumentApplication'
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
                    store= this.getStore(),
                    module_id = grid.down('combo[name=module_id]').getValue(),
                    sub_module_id = grid.down('combo[name=sub_module_id]').getValue(),
                    section_id = grid.down('combo[name=section_id]').getValue(),
                    premise_type_id = grid.down('combo[name=premise_type_id]').getValue();
                    store.getProxy().extraParams = {
                        module_id: module_id,
                        sub_module_id: sub_module_id,
                        section_id: section_id,
                        premise_type_id:premise_type_id,
                        table_name:'tra_documentupload_requirements'
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
        dataIndex: 'name',
        text: 'Document Requirement',
        flex: 1,
        sortable: true
    },{
        xtype: 'gridcolumn',
        dataIndex: 'document_type',
        text: 'Document Type',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'parent_level',
        text: 'Has Parent',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'name',
        text: 'Parent Name',
        tdCls:'wrap-text',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'allowed_extensions',
        hidden: true,
        text: 'Allowed Extensions',
        tdCls:'wrap-text',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'module_name',
        hidden: true,
        text: 'Module Name',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'sub_module',
        hidden: true,
        text: 'Sub Module Name',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'prodclass_category',
        hidden: true,
        text: 'Product Class Category',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'importexport_permittype',
        hidden: true,
        text: 'Import/Export Permit Type',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'premise_type',
        hidden: true,
        text: 'Premises Type Type',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'description',
        text: 'Description',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'is_mandatory',
        hidden: true,
        text: 'Is Mandatory',
        flex: 0.5,
        renderer: function (value, metaData) {
                if(value) {
                    metaData.tdStyle = 'color:white;background-color:red';
                    return "Mandatory";
                }
                metaData.tdStyle = 'color:white;background-color:green';
                return "Optional";
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'has_document_template',
        hidden: true,
        text: 'Has Document Template',
        flex: 0.5,
        renderer: function (value, metaData) {
                if(value == 1) {
                    metaData.tdStyle = 'color:white;background-color:green';
                    return "Has Template";
                }
                metaData.tdStyle = 'color:white;background-color:red';
                return "No Template";
                
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'portal_uploadable',
        hidden: true,
        text: 'Portal Uploadable',
        flex: 0.5,
        renderer: function (value, metaData) {
            if(value==1||value===1) {
                return "YES";
            }
            return "NO";
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
                    text: 'Edit',
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'Edit Record',
                    action: 'edit',
                    childXtype: 'docdefinationrequirementfrm',
                    winTitle: 'Dcouments requirements Defination',
                    winWidth: '40%',
                    handler: 'showEditConfigParamWinFrm',
                    stores: '[]'
                }, {
                    text: 'Disable',
                    iconCls: 'x-fa fa-trash-o',
                    tooltip: 'Delete Record',
                    table_name: 'tra_documentupload_requirements',
                    storeId: 'docdefinationrequirementstr',
                    action_url: 'configurations/softDeleteConfigRecord',
                    action: 'soft_delete',
                    handler: 'doDeleteConfigWidgetParam'
                }, {
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete Record',
                    table_name: 'tra_documentupload_requirements',
                    storeId: 'docdefinationrequirementstr',
                    action_url: 'configurations/deleteConfigRecord',
                    action: 'actual_delete',
                    handler: 'doDeleteConfigWidgetParam',
                    // hidden: Admin.global.GlobalVars.checkForProcessVisibility('actual_delete')
                }, {
                    text: 'Enable',
                    iconCls: 'x-fa fa-undo',
                    tooltip: 'Enable Record',
                    table_name: 'tra_documentupload_requirements',
                    storeId: 'docdefinationrequirementstr',
                    action_url: 'configurations/undoWorkflowSoftDeletes',
                    action: 'enable',
                    disabled: true,
                    handler: 'doDeleteConfigWidgetParam'
                }, {
                    text: 'Download Template',
                    iconCls: 'x-fa fa-undo',
                    tooltip: 'Download Template',
                    table_name: 'tra_documentupload_requirements',
                    action_url: 'configurations/undoWorkflowSoftDeletes',
                    handler: 'downloadDocumentRequirementTemplate'
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
