/**
 */
 Ext.define('Admin.view.commoninterfaces.grids.ApplicationSuspensionReasonsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'applicationsuspensionreasonsgrid',
    controller: 'commoninterfacesVctr',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    config: {
        isWin: 0
    },
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        getRowClass: function (record, rowIndex, rowParams, store) {
            var is_enabled = record.get('is_enabled');
            if (is_enabled == 0 || is_enabled === 0) {
                return 'invalid-row';
            }

        },
    },
    tbar: [{
        xtype: 'hiddenfield',
        name: 'isReadOnly'
    },{
        xtype: 'hiddenfield',
        name: 'application_code'
    },{
        xtype: 'hiddenfield',
        name: 'application_id'
    },{
        xtype: 'hiddenfield',
        name: 'sub_module_id'
    },{
        xtype: 'button',
        text: 'Add Reason',
        iconCls: 'x-fa fa-plus',
        ui: 'soft-blue',
        name: 'add_susp_reason',
        winTitle: 'Suspension Reason',
        childXtype: 'applicationsuspensionreasonsfrm',
        handler:'showReasonsWin',
        winWidth: '35%',
        stores: '[]'
    },
     {
        xtype: 'exportbtn'
    }],
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    export_title: 'Suspension Reasons',
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
    listeners: {
        beforerender: {
            fn: 'setCommonGridsStore',
            config: {
                pageSize: 1000,
                storeId: 'applicationwithdrawalreasonsstr',
                proxy: {
                    url: 'common/getApplicationSuspensionReasons'
                }
            },
            isLoad: true
        }
    },
    initComponent: function () {
        var defaultColumns = [
            {
                xtype: 'gridcolumn',
                dataIndex: 'reason',
                text: 'Reason',
                flex: 1
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'reason_for_suspension',
                text: 'Remark',
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
                            text: 'Edit Reason',
                            iconCls: 'x-fa fa-edit',
                            tooltip: 'Edit Record',
                            action: 'edit',
                            winTitle: 'Suspension Reason',
                            childXtype: 'applicationsuspensionreasonsfrm',
                            winTitle: 'Query',
                            winWidth: '35%',
                            handler: 'showEditCommonParamParamWinFrm',
                            stores: '[]'
                          },{
                            text: 'Delete ',
                            iconCls: 'x-fa fa-trash',
                            tooltip: 'Delete Record',
                            table_name: 'tra_application_suspensiondetails',
                            storeID: 'applicationwithdrawalreasonsstr',
                            action_url: 'common/deleteCommonRecord',
                            action: 'actual_delete',
                            handler: 'doDeleteCommonParamWidgetParam',
                           
                          }]
                    }
                }
            }
        ];
        this.columns = defaultColumns.concat(this.columns);
        this.callParent(arguments);
    }
});
