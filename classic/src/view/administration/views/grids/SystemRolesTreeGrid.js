Ext.define('Admin.view.administration.views.grids.SystemRolesTreeGrid', {
    extend: 'Ext.tree.Panel',
    xtype: 'systemrolestreegrid',
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

    autoScroll: true,
    listeners: {
        beforerender: {
            fn: 'setGridTreeStore',
            config: {
                storeId: 'systemrolestreestr',
                proxy: {
                    api: {
                        read: 'administration/getSystemRoles'
                    },
                },
            },
            isLoad: true
        },
        itemdblclick: 'onMenuItemTreeItemDblClick'
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
            beforeLoad: function () {
                var store = this.store,
                    grid = this.up('treepanel'),
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
            handler: 'updateSystemNavigationAccessRoles'
        }],
    columns: [{
        xtype: 'treecolumn', //this is so we know which column will show the tree
        text: 'Menu',
        flex: 1,
        sortable: true,
        dataIndex: 'menu_name'
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
                        storeId: 'systemaccesslevelsstr',
                        pageSize: 100,
                        proxy: {
                            extraParams:{
                                table_name: 'par_accesslevels'
                            }
                        }
                    },
                    isLoad: true
                }
            },
            valueField: 'id',
            displayField: 'name',
            queryMode: 'local',
            allowBlank: false,
        },
        renderer: function (val, meta, record, rowIndex, colIndex, store, view) {
            var textVal = 'None';
            if (view.grid.columns[colIndex].getEditor().getStore().getById(val)) {
                //textVal = view.grid.columns[colIndex].getEditor().getStore().getById(val).get('name');//data.name;
            }
            if (val === 1 || val === '1') {
                textVal='Read Only';
                meta.tdCls = 'read-only-cell';
            } else if(val === 2 || val === '2'){
                textVal='Write & Update';
                meta.tdCls = 'delete-cell';
            }else if(val === 3 || val === '3'){
                textVal='Full Access';
                meta.tdCls = 'full-access-cell';
            }else {
                meta.tdCls = 'none-cell';
            }
            return textVal;
        }
    }]
});
