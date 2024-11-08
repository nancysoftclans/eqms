Ext.define('Admin.view.auditManagement.views.grids.AuditTypesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'audittypesgrid',
    itemId: 'audittypesgrid',
    controller: 'auditMgmntVctr',
    useArrows: true,
    rootVisible: false,
    multiSelect: false,
    singleExpand: true,
    margin: '0 5 0 0',
    selType: 'cellmodel',
    // requires: [
    //     'Ext.grid.*',
    //     'Ext.tree.*'
    // ],

    
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],

    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
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
      text: 'Create Audit Type',
                iconCls: 'x-fa fa-plus',
                action: 'add',
                ui: 'soft-blue',
                childXtype: 'newAuditTypeDetailsFrm',
                winTitle: 'Create Audit Type',
                winWidth: '80%',
                handler: 'showAddConfigParamWinFrm',
                stores: '[]'
    },{
      xtype: "tbspacer",
      width: 100,
    }],
    autoScroll: true,
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                storeId: 'audittypesstr',
                proxy: {
                    api: {
                        read: 'auditManagement/getAuditTypes'
                    }
                },
            },
            isLoad: true
        },
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
            beforeLoad: function() {
                var store = this.store,
                   grid = this.up('grid');
                    store.getProxy().extraParams = {
                        table_name:'par_qms_audit_types'
                    };
            
            },
        },
        '->',
        {
            xtype: 'button',
            text: 'Sync Changes',
            ui: 'soft-blue',
            iconCls: 'x-fa fa-save',
            handler: 'updateSystemNavigationAccessRoles'
        }],
    columns: [
        {
        xtype: 'gridcolumn',
        dataIndex: 'code',
        text: 'Code',
        flex: 1,
        sortable: true
    },{
        xtype: 'gridcolumn',
        dataIndex: 'audit_type_name',
        text: 'Title',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'is_enabled',
        text: 'Active',
        flex: 1,
        renderer: function (value, metaData) {
             if (value) {
                metaData.tdStyle = 'color:green;';
                return '<i class="fas fa-check"></i>';
               }
             metaData.tdStyle = 'color:green;';
             return '<i class="fas fa-times"></i>';
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
                    text: 'Edit',
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'Edit Record',
                    action: 'edit',
                    childXtype: 'newAuditTypeDetailsFrm',
                    winTitle: 'Edit Audit Type',
                    winWidth: '80%',
                    handler: 'showEditAuditTypeConfigParamWinFrm',bind: {
            disabled: '{isReadOnly}'
        },
                    stores: '[]'
                },
                 {
                    text: 'Disable',
                    iconCls: 'x-fa fa-repeat',
                    table_name: 'par_qms_audit_types',
                    storeID: 'formCategoryStr',
                    hidden: true,
                    action_url: 'configurations/softDeleteConfigRecord',
                    action: 'soft_delete',bind: {
            disabled: '{isReadOnly}'
        },
                    handler: 'doDeleteConfigWidgetParam'
                }, {
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete Record',
                    table_name: 'par_qms_audit_types',
                    storeID: 'formCategoryStr',
                    hidden: true,
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
                    table_name: 'par_qms_audit_types',
                    hidden: true,
                    storeID: 'formCategoryStr',
                    action_url: 'configurations/undoConfigSoftDeletes',
                    action: 'enable',
                    disabled: true,bind: {
            disabled: '{isReadOnly}'
        },
                    handler: 'doDeleteConfigWidgetParam'
                },
                {
                    text: 'Logs',
                    iconCls: 'x-fa fa-list',
                    tooltip: 'View Logs',
                    action: 'logs',
                    childXtype: 'audittypeloggrid',
                    winTitle: 'Logs',
                    winWidth: '100%',
                    handler: 'showLogConfigwin',
                    // bind: {
                    //     disabled: '{isReadOnly}'
                    // },
                    stores: '[]'
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
    }
]
})