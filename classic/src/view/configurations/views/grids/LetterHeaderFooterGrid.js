/**
 * Created by Softclans
 */
Ext.define('Admin.view.configurations.views.grids.LetterHeaderFooterGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'configurationsvctr',
    xtype: 'brimsreportheaderfootergrid',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    height: Ext.Element.getViewportHeight() - 118,
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display'
    },
    tbar: [{
        xtype: 'button',bind: {
            disabled: '{isReadOnly}'
        },
        text: 'Add Header and Footer',
        iconCls: 'x-fa fa-plus',
        action: 'add',
        ui: 'soft-blue',
        childXtype: 'letterheaderfooterfrm',
        winTitle: 'Header & Footer',
        winWidth: '50%',
        handler: 'showAddConfigParamWinFrm',
        stores: '[]'
    }, {
        xtype: 'exportbtn'
    }],
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    export_title: 'Letter Header and Footer',
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records'
    }],
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
                storeId: 'letterheaderfootersstr',
                proxy: {
                    extraParams:{
                        table_name: 'par_brimsletter_header_footer'
                    }
                }
            },
            isLoad: true
        }
    },
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'id',
        text: 'ID'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'header_name',
        text: 'Header',
        flex: 1,
        width: 200
    },{
        xtype: 'gridcolumn',
        dataIndex: 'footer_name',
        text: 'Footer',
        flex: 1,
        tdCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'is_current',
        text: 'Current Header/Footer',
        name: 'is_current',
        width: 150,
        renderer: function (value, metaData, record) {
            if(value == 1){
                metaData.tdStyle = 'color:white;background-color:green';
                return "Current";
            }else{
                metaData.tdStyle = 'color:white;background-color:red';
                return "Not Current";
            }
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
                items: [
                {
                    text: 'Preview Header',
                    iconCls: 'x-fa fa-eye',
                    handler: 'previewHeaderFooter',
                    preview: 1
                },{
                    text: 'Preview Footer',
                    iconCls: 'x-fa fa-eye',
                    handler: 'previewHeaderFooter',
                    preview: 0,
                },{
                    text: 'Disable',
                    iconCls: 'x-fa fa-redo',
                    table_name: 'par_brimsletter_header_footer',
                    storeID: 'letterheaderfootersstr',
                    action_url: 'configurations/softDeleteWorkflowRecord',
                    action: 'soft_delete',
                    handler: 'doDeleteConfigWidgetParam'
                }, {
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete Record',
                    table_name: 'par_brimsletter_header_footer',
                    storeID: 'letterheaderfootersstr',
                    action_url: 'configurations/deleteWorkflowRecord',
                    action: 'actual_delete',bind: {
                        disabled: '{hideDeleteButton}'
                    },
                    handler: 'doDeleteConfigWidgetParam'
                }, {
                    text: 'Enable',
                    iconCls: 'x-fa fa-undo',
                    tooltip: 'Enable Record',
                    table_name: 'par_brimsletter_header_footer',
                    storeID: 'letterheaderfootersstr',
                    action_url: 'configurations/undoWorkflowSoftDeletes',
                    action: 'enable',
                    disabled: true,
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
