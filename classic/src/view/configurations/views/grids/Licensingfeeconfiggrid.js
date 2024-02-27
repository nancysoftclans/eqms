
Ext.define('Admin.view.configurations.views.grids.Licensingfeeconfiggrid', {
    extend: 'Ext.grid.Panel',
    controller: 'configurationsvctr',
    xtype: 'licensingfeeconfiggrid',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    layout: 'fit',
    height: Ext.Element.getViewportHeight() - 118,
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
        xtype: 'button',bind: {
            disabled: '{isReadOnly}'
        },
        text: 'Add',
        iconCls: 'x-fa fa-plus',
        action: 'add',
        ui: 'soft-blue',
        childXtype: 'licensingfeeconfigfrm',
        winTitle: 'Licensing Fee Configurations',
        winWidth: '70%',
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
    export_title: 'Module Fee Configurations',
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
    },{
        ftype: 'grouping',
        startCollapsed: false
    }],
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 100,
                storeId: 'licensingfeeconfigstr',
                groupField:'fee_type',
                proxy: {
                    url: 'configurations/getAppModuleFeeConfig',
                    extraParams:{
                    	is_config: 1,
                        module_id: 2,
                        table_name: 'tra_appmodules_feesconfigurations'
                    }
                }
            },
            isLoad: true
        }
    },
    columns: [{
        xtype: 'rownumberer'
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
                    childXtype: 'licensingfeeconfigfrm',
                    winTitle: 'Licensing Fee Configurations',
                    winWidth: '70%',
                    handler: 'showEditConfigParamWinFrm',
                    stores: '[]'
                }, {
                    text: 'Disable',
                    iconCls: 'x-fa fa-repeat',
                    table_name: 'tra_appmodules_feesconfigurations',
                    storeID: 'licensingfeeconfigstr',
                    action_url: 'configurations/softDeleteConfigRecord',
                    action: 'soft_delete',
                    bind: {
                        disabled: '{isReadOnly}'
                    },
                    handler: 'doDeleteConfigWidgetParam'
                }, {
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete Record',
                    table_name: 'tra_appmodules_feesconfigurations',
                    storeID: 'licensingfeeconfigstr',
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
                    table_name: 'tra_appmodules_feesconfigurations',
                    storeID: 'licensingfeeconfigstr',
                    action_url: 'configurations/undoConfigSoftDeletes',
                    action: 'enable',
                    disabled: true,
                    bind: {
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
    },{
        xtype: 'gridcolumn',
        dataIndex: 'module',
        text: 'Module',
        tdCls: 'wrap',
        width: 100
    },{
        xtype: 'gridcolumn',
        dataIndex: 'sub_module',
        text: 'Sub Module',
        tdCls: 'wrap',
        width: 100
    },{
        xtype: 'gridcolumn',
        dataIndex: 'section',
        text: 'Section',
        tdCls: 'wrap',
        width: 100
    },{
        xtype: 'gridcolumn',
        dataIndex: 'premise_type',
        text: 'Premise Type',
        tdCls: 'wrap',
        width: 100
    },{
        xtype: 'gridcolumn',
        dataIndex: 'business_type_class',
        text: 'Business Type Class',
        tdCls: 'wrap',
        width: 100
    },{
        xtype: 'gridcolumn',
        dataIndex: 'retail_in_hospital',
        text: 'Is Retail Pharmacy',
        tdCls: 'wrap',
        width: 100,
        renderer: function (value, metaData) {
            if (value == 1 || value == 2) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "Yes";
            }

            metaData.tdStyle = 'color:white;background-color:red';
            return "No";
        }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'retail_in_hospital ',
        text: 'Retail in Hospital',
        tdCls: 'wrap',
        width: 100,
        renderer: function (value, metaData) {
            if (value == 1) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "Yes";
            }else if(value == 2){
                metaData.tdStyle = 'color:white;background-color:red';
                return "No";
            }else{
               return "N/A"; 
           }
        }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'applicationfeetype',
        text: 'Application Fee Type',
        tdCls: 'wrap',
        width: 100
    },{
        xtype: 'gridcolumn',
        dataIndex: 'fee_type',
        text: 'Fee Type',
        tdCls: 'wrap',
        width: 100,
    },{
        xtype: 'gridcolumn',
        dataIndex: 'cost_element',
        text: 'Cost Element',
        tdCls: 'wrap',
        width: 100,
    },{
        xtype: 'gridcolumn',
        dataIndex: 'element_cost',
        text: 'Element Cost',
        tdCls: 'wrap',
        width: 100,
    },{
        xtype: 'gridcolumn',
        dataIndex: 'description',
        text: 'Description',
        tdCls: 'wrap',
        width: 100
    }]
});
