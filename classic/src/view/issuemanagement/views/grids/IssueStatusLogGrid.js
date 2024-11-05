Ext.define('Admin.view.issuemanagement.views.grids.IssueStatusLogGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'issueStatusLoggrid',
    itemId: 'issueStatusLoggrid',
    controller: 'issuemanagementvctr',
    //title: 'issue type categories',
    //layout: 'card',
    //collapsible: true,
    //collapseDirection: 'right',
    //collapsed: true, 
    //width: 200,
    //margin: '0 5 0 0',
    //selType: 'cellmodel',


    // plugins: [{
    //     ptype: 'cellediting',
    //     clicksToEdit: 1
    // }],


    tbar: [
        {
            xtype: 'textfield',
            name: 'id',
            hidden: true
        }
    ],

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
                storeId:'issuestatuslogstore',
                proxy: {
                    api: {
                        read: 'issuemanagement/getIssueStatusesLogs'
                    },
                    
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

                id = grid.down('textfield[name=id]').getValue(),
            store.getProxy().extraParams = {
                table_name: 'eqms_issue_types_logs',
                ref_id : id
            };
        }
    }],

    columns: [
        {
        xtype: 'gridcolumn',
        dataIndex: 'title',
        text: 'Title',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'issue_state_id',
        text: 'Issue State',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'user_name',
        text: 'User',
        flex: 1,
        sortable: true
    },
    // {   
    //     xtype: 'gridcolumn',
    //     dataIndex: 'form_id',
    //     text: 'Form Id',
    //     flex: 1,
    //     sortable: true
    // }, 
    {
        xtype: 'gridcolumn',
        dataIndex: 'action',
        text: 'Action',
        flex: 1,
        sortable: true
    },
    // {
    //     xtype: 'gridcolumn',
    //     dataIndex: 'status_group_id',
    //     text: 'status group id',
    //     flex: 1,
    //     sortable: true
    // },
    {
        xtype: 'gridcolumn',
        dataIndex: 'submitted_by',
        text: 'submitted By',
        flex: 1,
        sortable: true
    },
    // {
    //     xtype: 'gridcolumn',
    //     dataIndex: 'is_enabled',
    //     text: 'is enabled',
    //     flex: 1,
    //     sortable: true
    // },
    {
        xtype: 'gridcolumn',
        dataIndex: 'created_on',
        text: 'Created On',
        flex: 1,
        xtype: 'datecolumn',
        format: 'Y-m-d H:i:s'
    }]
});
