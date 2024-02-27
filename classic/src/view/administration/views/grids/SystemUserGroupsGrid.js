
Ext.define('Admin.view.administration.views.grids.SystemUserGroupsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'systemusergroupsgrid',
    autoScroll: true,
    width: '100%',
    requires: [
        'Ext.button.Button',
        'Ext.menu.Menu',
        'Ext.toolbar.Paging',
       // 'Admin.view.plugins.Searching',
        'Ext.grid.*'
    ],
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 10000,
                storeId: 'systemusergroupsstr',
                proxy: {
                    url: base_url+'administration/getSystemUserGroups',
                    extraParams: {
                        model_name: 'UserGroup'
                    }
                }
            },
            isLoad: true
        }
    },
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
    plugins: [
        {
            ptype: 'gridexporter'
        },
        {
            ptype: 'filterfield'
        }
    ],
    export_title: 'User Groups',
    tbar: [{
        xtype: 'button',
        text: 'Add Group',
        ui: 'soft-blue',
        iconCls: 'x-fa fa-plus',
        action: 'add',
        form: 'systemusergroupsfrm',
        handler: 'showSimpleAdminModuleGridForm',
        stores: '[]'
    }, {
        xtype: 'exportbtn'
    }, 
   ],
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
    }],
    
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'name',
        text: 'Name',
        flex: 1,
        filter: {
            xtype: 'textfield',
        
        },
    }, 
    {
        xtype: 'gridcolumn',
        dataIndex: 'institution',
        text: 'Institution',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'user_category',
        text: 'User Category',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'externaluser_category',
        text: 'External User Category',
        flex: 1
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'system_dashboard',
        text: 'System Dashboard',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'description',
        text: 'Description',
        flex: 1
    }, {
        text: 'Options',
        xtype: 'widgetcolumn',
        width: 90,
        widget: {
            textAlign: 'left',
            xtype: 'splitbutton',
            ui: 'gray',
            width: 75,
            iconCls: 'x-fa fa-th-list',
            menu: {
                xtype: 'menu',
                items: [{
                    text: 'Edit',
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'Edit Record',
                    action: 'edit',
                    form: 'systemusergroupsfrm',
                    handler: 'showEditAdminParamGridFrm',
                    stores: '[]'
                }, {
                    text: 'Users/Access Roles',
                    iconCls: 'x-fa fa-cubes',
                    handler: 'showGroupAllDetails',
                    stores: '[]'
                }, {
                    text: 'Delete (Soft)',
                    iconCls: 'x-fa fa-trash-o',
                    tooltip: 'Delete Record',
                    table_name: 'par_groups',
                    storeID: 'systemusergroupsstr',
                    action_url: base_url+'administration/softDeleteAdminRecord',
                    action: 'soft_delete',
                    handler: 'doDeleteAdminWidgetParam'
                }, {
                    text: 'Delete (Actual)',
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete Record',
                    table_name: 'par_groups',
                    storeID: 'systemusergroupsstr',
                    action_url: 'administration/deleteAdminRecord',
                    action: 'actual_delete',
                    handler: 'doDeleteAdminWidgetParam',
                    
                }, {
                    text: 'Enable',
                    iconCls: 'x-fa fa-undo',
                    tooltip: 'Enable Record',
                    table_name: 'par_groups',
                    storeID: 'systemusergroupsstr',
                    action_url: base_url+'administration/undoAdminSoftDeletes',
                    action: 'enable',
                    disabled: true,
                    handler: 'doDeleteAdminWidgetParam'
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
