Ext.define('Admin.view.issuemanagement.views.grids.LogGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'issueloggrid',
    itemId: 'issueloggrid',
    controller: 'issuemanagementvctr',
    //title: 'Activity',
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

    height:600,

    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],

    viewConfig: {
        deferEmptyText: false,
        emptyText: 'No logs to display'
    },

    tbar: [ {
        xtype: "tbspacer",
        width: 100,
    },{
        xtype: 'textfield',
        name: 'id',
        hidden: true
    }],

    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                storeId:'issuelogstore',
                proxy: {
                    api: {
                        read: 'issuemanagement/getIssueLogs'
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

            var  refId = grid.down('textfield[name=id]').getValue();
             //var grid = this.up('grid'),

            store.getProxy().extraParams = {
                table_name: 'eqms_issue_management_logs',

                ref_id:refId
            };
        }
    }],

    columns: [
    //     {
    //     xtype: 'gridcolumn',
    //     dataIndex: 'id',
    //     text: 'Log ID',
    //     flex: 1,
    //     sortable: true
    // }, {
    //     xtype: 'gridcolumn',
    //     dataIndex: 'user_id',
    //     text: 'User ID',
    //     flex: 1,
    //     sortable: true
    // },
    {
        xtype: 'gridcolumn',
        dataIndex: 'user_name',
        text: 'User',
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
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'workflow_stage_id',
        text: 'Workflow stage',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'application_status_id',
        text: 'Application status',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'issue_status_id',
        text: 'Issue Status',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'issue_type_id',
        text: 'Issue Type',
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
