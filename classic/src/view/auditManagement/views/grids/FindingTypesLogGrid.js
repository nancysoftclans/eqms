Ext.define('Admin.view.auditManagement.views.grids.FindingTypeLogGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'findingtypeloggrid',
    itemId: 'findingtypeloggrid',
    controller: 'auditMgmntVctr',
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
    height: 600,
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
    },
    {
        xtype: 'textfield',
        name: "id",
        hidden:true

    }],

    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                storeId: 'findingtypestore',
                proxy: {
                    api: {
                        read: 'auditManagement/getFindingTypeLogs'  //getFindingTypeLogs url
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
            var formdata = Ext.ComponentQuery.query('#NewAuditDetails')[0];
            console.log(formdata)
             var refId = grid.down('textfield[name=id]').getValue();
            store.getProxy().extraParams = {
                table_name: 'par_finding_types_logs',
                //application_code: applicationCode,
                ref_id:refId
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
    {
        xtype: 'gridcolumn',
        dataIndex: 'ref_id',
        text: 'Ref Id',
        flex: 1,
        sortable: true
    },
        {xtype: 'gridcolumn',
        dataIndex: 'name',
        text: 'Name',
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
