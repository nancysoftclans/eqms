Ext.define('Admin.view.audit_trail.view.grid.SystemErrorLogsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'systemErrorLogsGrid',
    controller: 'audit_trialViewCtr',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        getRowClass: function (record, rowIndex, rowParams, store) {
            var error_level_id = record.get('error_level_id');
            var is_resolved = record.get('is_resolved');
            // console.log(rowParams);
            if ((error_level_id == 3 || error_level_id === 3) && is_resolved != 1) {
                return 'invalid-row';
            }
            if ((error_level_id == 2 || error_level_id === 2) && is_resolved != 1) {
                return 'medium-row';
            }
        }
    },
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                remoteFilter: true,
                pageSize: 100,
                storeId: 'systemErrorLogsGridStr',
                enablePaging: true,
                reader: {
                    type: 'json',
                    rootProperty: 'results',
                    messageProperty: 'msg',
                    totalProperty: 'total'
                },
                proxy: {
                    url: 'audittrail/getSystemErrorLogs'
                }
            },
            isLoad: true
        },
           
    },
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '80%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function () {
             var filters=this.up('grid'),
                 error_level_id=filters.down('combo[name=error_level_id]').getValue(),
                 originated_from_user_id=filters.down('combo[name=originated_from_user_id]').getValue(),
                 Store=filters.getStore();
            Store.getProxy().extraParams = {
                        error_level_id:error_level_id,
                        is_resolved:2,
                        originated_from_user_id: originated_from_user_id
                }
            }
    },'->',{
        xtype: 'button',
        name: 'export',
        text: 'Export Trail',
        type: 'mis',
        handler: 'export'
    }],
     export_title: 'System Error Logs',
    plugins: [{
                ptype: 'gridexporter'
             },{
                ptype: 'filterfield'
           }],
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
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
                    text: 'View Error',
                    iconCls: 'x-fa fa-eye',
                    action: 'view',
                    handler: 'func_viewErrorDetails'
                },{
                    text: 'Mark As Resolved',
                    iconCls: 'x-fa fa-check',
                    action: 'resolve',
                    handler: 'func_markErrorResolved'
                }]
            }
        },
        onWidgetAttach: function (col, widget, rec) {
            var is_resolved = rec.get('is_resolved');
            if (is_resolved == 1) {
                widget.down('menu menuitem[action=resolve]').setDisabled(true);
            } else {
                widget.down('menu menuitem[action=resolve]').setDisabled(false);
            }
        }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'id',
        text: 'ID',
        hidden: true
    },{
        xtype: 'gridcolumn',
        dataIndex: 'error_level_id',
        text: 'Error Level',
        width: 150,tbCls: 'wrap',
        renderer: function (value, metaData) {
            if (value == 1) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "Low Risk";
            }
            if (value == 2) {
                metaData.tdStyle = 'color:black;background-color:yellow';
                return "Medium Risk";
            }
            metaData.tdStyle = 'color:white;background-color:red';
            return "Critical";
        },
        filter: {
                xtype: 'combobox',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id',
                name: 'error_level_id',
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 1000,
                            proxy: {
                                extraParams: {
                                    table_name: 'par_error_levels'
                                }
                            }
                        },
                        isLoad: true
                    },
                    change: function(combo) {
                        var str=combo.up('grid').getStore();
                        str.reload();
                        
                    },
                   
                }
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'is_resolved',
        text: 'Is Resolved',
        width: 100,tbCls: 'wrap',
        renderer: function (value, metaData) {
            if (value == 1) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "True";
            }
            metaData.tdStyle = 'color:white;background-color:red';
            return "False";
        }
    },
   {
        xtype: 'gridcolumn',
        dataIndex: 'error',
        text: 'Error',
        flex: 1,
        tbCls: 'wrap',
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'originated_from_user',
        text: 'Originated from User',
        width: 150,tbCls: 'wrap',
        filter: {
               xtype: 'combobox',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id',
                name: 'originated_from_user_id',
                listeners:
                 {
                     beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 10000,
                            proxy: {
                                url: 'audittrail/getAllUsers/users',
                            }
                        },
                        isLoad: true
                    },
                    change: function(combo) {
                        var str=combo.up('grid').getStore();
                        str.reload();
                        
                    },
                     
                 }
                
           }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'error_origin',
        text: 'Error Origin',
        width: 200,tbCls: 'wrap',
    }]
    
});