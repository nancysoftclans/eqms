
Ext.define('Admin.view.administration.views.grids.SystemMenusGrid', {
    extend: 'Ext.tree.Panel',
    xtype: 'systemmenusgrid',
    store: 'systemmenusstr',
    useArrows: true,
    columnLines: true,
    rootVisible: false,
    height: Ext.Element.getViewportHeight() - 118,
    width: '100%',
    tbar: [{
        xtype: 'button',
        text: 'Add Menu',
        ui: 'soft-blue',
        iconCls: 'x-fa fa-plus',
        action: 'add',
        form: 'systemmenusfrm',
        handler: 'showSimpleAdminModuleTreeForm',
        stores: '[]'
    }, '->', {
        xtype: 'textfield',
        name: 'name_filter',
        margin: '0 0 0 0',
        emptyText: 'Search by name'
    },{
        xtype: 'button',
        // text: 'Add Menu',
        ui: 'soft-blue',
        margin: '0 0 0 0',
        iconCls: 'x-fa fa-search',
        action: 'add',
        handler: 'refreshBtnGrid',
    }],
    bbar: [{
        xtype: 'pagingtoolbar',
        store: 'systemmenusstr',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function() {
            var grid = this.up('panel'),
                name_filter = grid.down('textfield[name=name_filter]').getValue(),
                store = this.getStore();
            // store.filter([{
            //     property: 'text',
            //     value: name_filter
            // }]);
            store.getProxy().extraParams = {
                name_filter: name_filter
            }
        }
    }],
    listeners: {
        afterrender: function () {
            var store = this.store;
            store.removeAll();
            store.load();
        }
    },
    columns: [
        {
            xtype: 'treecolumn',
            text: 'Name',
            flex: 1,
            sortable: true,
            dataIndex: 'name'
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'viewType',
            text: 'ViewType',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'routeId',
            text: 'Route ID',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'iconCls',
            text: 'Icon',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'level',
            text: 'Level',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'order_no',
            text: 'Order No',
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
                        form: 'systemmenusfrm',
                        handler: 'showEditAdminParamTreeFrm',
                        stores: '[]'
                    },{
                        text: 'Workflow Stages',
                        iconCls: 'x-fa fa-cubes',
                        form: 'menusstagesfrm',
                        hidden: true,
                        handler: 'showMenuWorkflowStageLink',
                        stores: '[]'
                    },{
                        text: 'WorkFlows Setup',
                        iconCls: 'x-fa fa-cubes',
                        handler: 'showMenuWorkFlowsLink',
                        stores: '[]'
                    }, {
                        text: 'Delete',
                        iconCls: 'x-fa fa-trash',
                        tooltip: 'Delete Record',
                        table_name: 'par_menus',
                        storeID: 'systemmenusstr',
                        action_url: 'administration/deleteAdminRecord',
                        action: 'delete',
                        handler: 'doDeleteAdminWidgetParam'
                    }
                    ]
                }
            }
        }]
});
