
Ext.define('Admin.view.configurations.views.grids.MainDetailsVariationGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'maindetailsvariationgrid',
    controller: 'configurationsvctr',
    useArrows: true,
    columnLines: true,
    rootVisible: false,
    height: Ext.Element.getViewportHeight() - 118,
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
        text: 'Add',
        ui: 'soft-blue',
        iconCls: 'x-fa fa-plus',
        action: 'add',
        winTitle: 'Main Details Variation form',
        winWidth: '60%',
        childXtype: 'maindetailsvariationfrm',
        handler: 'showAddConfigParamWinFrm',
        stores: '[]'
    },
    {
        xtype: 'exportbtn'
    },
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
                storeId: 'maindetailsvariationStr',
                proxy: {
                    url: 'configurations/getConfigParamFromTable',
                    extraParams: {
                        is_config: 1,
                        table_name: 'par_maindetails_variation_points'
                    }
                }
            },
            isLoad: true
        }
    },
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',

    }],
    columns: [
        {
            xtype: 'rownumberer',

        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'module_name',
            text: 'Modules',
            flex: 1

        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'sub_module_name',
            text: 'Submodule',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'section_name',
            text: 'Section',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'premise_type',
            text: 'Facility Type',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'section_category',
            text: 'Section Category',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'form_name',
            text: 'Form',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'field_name',
            text: 'Field',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'variation_type',
            text: 'Variation Type',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'is_enabled',
            text: 'Is_Enabled',
            renderer: function (value, metaData) {
                if (value) {
                    metaData.tdStyle = 'color:white;background-color:green';
                    return "True";
                }

                metaData.tdStyle = 'color:white;background-color:red';
                return "False";
            }
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
                        childXtype: 'maindetailsvariationfrm',
                        winTitle: 'Main Details Variation form',
                        bind: {
                            disabled: '{isReadOnly}'
                        },
                        winWidth: '40%',
                        handler: 'showEditConfigParamWinFrm', bind: {
                            disabled: '{isReadOnly}'
                        },
                        stores: '[]'
                    },
                    {
                        text: 'Disable',
                        iconCls: 'x-fa fa-repeat',
                        table_name: 'par_maindetails_variation_points',
                        storeID: 'maindetailsvariationStr',
                        action_url: 'configurations/softDeleteConfigRecord',
                        action: 'soft_delete', bind: {
                            disabled: '{isReadOnly}'
                        },

                        handler: 'doDeleteConfigWidgetParam'
                    },

                    {
                        text: 'Delete',
                        iconCls: 'x-fa fa-trash',
                        tooltip: 'Delete Record',
                        table_name: 'par_maindetails_variation_points',
                        storeID: 'maindetailsvariationStr',
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

                    },
                    {
                        text: 'Enable',
                        iconCls: 'x-fa fa-undo',
                        tooltip: 'Enable Record',
                        table_name: 'par_maindetails_variation_points',
                        storeID: 'maindetailsvariationStr',
                        bind: {
                            disabled: '{hideDeleteButton}'
                        },
                        action_url: 'configurations/undoConfigSoftDeletes',
                        action: 'enable',
                        disabled: true, bind: {
                            disabled: '{hideDeleteButton}'
                        },
                        handler: 'doDeleteConfigWidgetParam',
                    },

                    ]
                }
            },
            onWidgetAttach: function (col, widget, rec) {
                var is_enabled = rec.get(is_enabled);
                if (is_enabled === 0 || is_enabled == 0) {
                    widget.down('menu menuitem[action=enable]').setDisabled(false);
                    widget.down('menu menuitem[action=soft_delete').setDisabled(true);
                } else {
                    widget.down('menu menuitem[action=enable]').setDisabled(true);
                    widget.down('menu menuitem[action=enable]').setDisabled(false);
                }
            }

        }]
});
