Ext.define('Admin.view.auditManagement.views.grids.LogGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'loggrid',
    itemId: 'loggrid',
    controller: 'auditMgmntVctr',


    // plugins: [{
    //     ptype: 'cellediting',
    //     clicksToEdit: 1
    // }],

    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],

    viewConfig: {
        deferEmptyText: false,
        emptyText: 'No logs to display'
    },

    // tbar: [ {
    //     xtype: "tbspacer",
    //     width: 100,
    // }],

    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                storeId: 'logstore',
                proxy: {
                    api: {
                        read: 'auditManagement/getAuditLogs' 
                    },
                    // headers: {
                    //     'Record-ID': response.data.record_id // Pass the record ID in the header
                    // }
                    
                },
            },
            isLoad: true
        }
    },

    bbar: [{
        xtype: 'pagingtoolbar',
        displayInfo: false,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function() {
            var store = this.store,
                grid = this.up('grid');

            var mainTabPnl = Ext.ComponentQuery.query('#contentPanel')[0], // Get the main panel
                containerPnl = mainTabPnl.getActiveTab();

                applicationCode = containerPnl.down('hiddenfield[name=active_application_code]').getValue();
            store.getProxy().extraParams = {
                table_name: 'eqms_audit_management_logs',
                application_code: applicationCode,
                //ref_id:refId
            };
        }
    }],

    columns: [
    
    {
        xtype: 'gridcolumn',
        dataIndex: 'user_id',
        text: 'User ID',
        flex: 1,
        sortable: true
    },
        {xtype: 'gridcolumn',
        dataIndex: 'application_code',
        text: 'Application Code',
        flex: 1,
        sortable: true
    }, 
    {
        xtype: 'gridcolumn',
        dataIndex: 'action',
        text: 'Action',
        flex: 2,
        sortable: true
    },

    {
        xtype: 'gridcolumn',
        dataIndex: 'responsible_user',
        text: 'User responsible',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'current_stage_name',
        text: 'Stage',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'application_status',
        text: 'Status',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'curr_stage_id',
        text: 'Stage id',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'application_status_id',
        text: 'Status id',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'submitted_by',
        text: 'Submitted by',
        flex: 1,
        sortable: true
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'created_on',
        text: 'Created On',
        flex: 1,
        xtype: 'datecolumn',
        format: 'Y-m-d H:i:s'
    }]
});
