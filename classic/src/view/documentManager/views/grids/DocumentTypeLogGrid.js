Ext.define('Admin.view.auditManagement.views.grids.DocumentTypeLogGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'documenttypeloggrid',
    controller: 'documentsManagementvctr',
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
    
    itemId: 'documenttypeloggrids',

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
        name: "id"

    }],

    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                storeId: 'audittypestore',
                proxy: {
                    api: {
                        read: 'documentmanagement/getDocumentTypeLogs'  
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
            //var formdata = Ext.ComponentQuery.query('#NewAuditDetails')[0];
            //console.log(formdata)
                //console.log(containerPnl);
            //  process_id = containerPnl.down('hiddenfield[name=process_id]').getValue(),
            //     moduleId = containerPnl.down('hiddenfield[name=module_id]').getValue(),
            //     submodule_id = containerPnl.down('hiddenfield[name=sub_module_id]').getValue(),
               // refId = containerPnl.down('hiddenfield[name=id]').getValue();
             var  refId = grid.down('textfield[name=id]').getValue();
             //var grid = this.up('grid'),
             console.log(refId);

                //applicationCode = containerPnl.down('hiddenfield[name=active_application_code]').getValue();
            store.getProxy().extraParams = {
                table_name: 'eqms_document_type_logs',
                //application_code: applicationCode,
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
    // }, 
    {
        xtype: 'gridcolumn',
        dataIndex: 'user_name',
        text: 'User ID',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'ref_id',
        text: 'Ref ID',
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
        dataIndex: 'review_period',
        text: 'Review Period',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'expiry_period',
        text: 'Expiry Period',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'disposition_instructions',
        text: 'Disposition Instruction',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'review_instructions',
        text: 'Review Instructions',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'owner',
        text: 'Owner',
        flex: 1,
        sortable: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'group',
        text: 'Owner Group',
        flex: 1,
        sortable: true
    },
    // {
    //     xtype: 'gridcolumn',
    //     dataIndex: 'application_status',
    //     text: 'Status',
    //     flex: 1,
    //     sortable: true
    // },
    // {
    //     xtype: 'gridcolumn',
    //     dataIndex: 'curr_stage_id',
    //     text: 'Stage id',
    //     flex: 1,
    //     sortable: true
    // },
    // {
    //     xtype: 'gridcolumn',
    //     dataIndex: 'application_status_id',
    //     text: 'Status id',
    //     flex: 1,
    //     sortable: true
    // },
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