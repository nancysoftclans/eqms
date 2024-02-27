
Ext.define('Admin.view.administration.views.grids.MenuProcessesRolesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'menuprocessesrolesgrid',
    cls: 'dashboard-todo-list',
    header: false,
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display'
    },
    selType: 'cellmodel',
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],
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
            displayInfo: true,
            displayMsg: 'Showing {0} - {1} of {2} total records',
            emptyMsg: 'No Records',
            beforeLoad: function () {
                var store = this.store,
                    grid = this.up('grid'),
                    tabPnl = grid.up('tabpanel'),
                    group_id = tabPnl.down('hiddenfield[name=active_group_id]').getValue();
                store.getProxy().extraParams = {
                    user_group: group_id
                };
            }
        },
        '->',
        {
            xtype: 'button',
            text: 'Sync Changes',
            ui: 'soft-blue',
            iconCls: 'x-fa fa-save',
            handler: 'updateSystemPermissionsAccessRoles'
        }],
    
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 100000,
                storeId: 'menuprocessesstr',
                proxy: {
                    url: 'administration/getMenuProcessesRoles'
                }
            },
            isLoad: true
        }
    },
    //url: 'administration/getMenuProcessesRoles',
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'name',
        text: 'Permission Name',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'id',
        text: 'Process ID',
        flex: 1,
        hidden: true
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'identifier',
        text: 'Permission Identifier',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'description',
        text: 'Description',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        width: 200,
        text: 'Accessibility',
        dataIndex: 'level_id',
        editor: {
            xtype: 'combo', anyMatch: true,
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        storeId: 'menuprocessesaccesslevelsstr',
                        pageSize: 100,
                        proxy: {
                            extraParams:{
                                table_name: 'par_accesslevels'
                            }
                        }
                    }
                }
            },
            valueField: 'id',
            displayField: 'name',
            queryMode: 'local',
            allowBlank: false
        },
        renderer: function (val, meta, record, rowIndex, colIndex, store, view) {
            var textVal = 'Allow',
                process_id = record.get('id');
            if (process_id == 1 || process_id === 1 || process_id == '1' || process_id === '1') {
                textVal = 'Deny';
            }
            if (view.grid.columns[colIndex].getEditor().getStore().getById(val)) {
                textVal = view.grid.columns[colIndex].getEditor().getStore().getById(val).get('name');//data.name;
            }
            if (val === 2 || val === '2') {
                meta.tdCls = 'full-access-cell';
            } else if (val === 1 || val === '1') {
                meta.tdCls = 'none-cell';
            } else {
                if (process_id == 1 || process_id === 1 || process_id == '1' || process_id === '1') {
                    meta.tdCls = 'none-cell';
                } else {
                    meta.tdCls = 'full-access-cell';
                }
            }
            return textVal;
        }
    }]
});
