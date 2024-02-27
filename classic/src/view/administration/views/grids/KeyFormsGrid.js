
Ext.define('Admin.view.administration.views.grids.KeyFormsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'keyformsgrid',
    cls: 'dashboard-todo-list',
    header: false,
    autoScroll: true,
    autoHeight: true,
    width: '100%',
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
        text: 'Add Form',
        iconCls: 'x-fa fa-plus',
        action: 'add',
        ui: 'soft-blue',
        childXtype: 'keyformsfrm',
        winTitle: 'Add Form',
        winWidth: '35%',
        handler: 'showAddAdminParamWinFrm',
        stores: '[]'
    }, {
        xtype: 'exportbtn'
    }],
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records'
    }],
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    export_title: 'Key Forms',
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
    listeners: {
        beforerender: {
            fn: 'setAdminGridsStore',
            config: {
                pageSize: 100000,
                storeId: 'keyformsstr',
                proxy: {
                    extraParams: {
                        model_name: 'KeyForm'
                    }
                }
            },
            isLoad: true
        }
    },
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'name',
        text: 'Form Name',
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
                    childXtype: 'keyformsfrm',
                    winTitle: 'Edit Form',
                    winWidth: '35%',
                    handler: 'showEditAdminParamWinFrm',
                    stores: '[]'
                }, {
                    text: 'Fields',
                    iconCls: 'x-fa fa-list',
                    tooltip: 'Form Fields',
                    childWidget: 'formfieldsgrid',
                    handler: 'showFormFields',
                    stores: '[]'
                }, {
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete Record',
                    table_name: 'par_key_forms',
                    storeID: 'keyformsstr',
                    action_url: 'administration/deleteAdminRecord',
                    action: 'actual_delete',
                    handler: 'doDeleteAdminWidgetParam',
                   // hidden: Admin.global.GlobalVars.checkForProcessVisibility('actual_delete')
                }
                ]
            }
        }
    }]
});
