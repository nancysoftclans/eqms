Ext.define('Admin.view.auditManagement.views.grids.AuditTypeCustomFormsGrd',{
    extend: 'Ext.grid.Panel',
    xtype: 'auditTypeCustomFieldsGrd',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display'
    },
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 100,
                // remoteFilter: true,
                // enablePaging: true,
                proxy: {
                    url: 'auditManagement/getAuditTypesMetadata', 
                }
            },
            isLoad: true,
        },
    },
    tbar: [
        {
            xtype: 'button',
            text: 'Add',
            iconCls: 'x-fa fa-plus',
            action: 'add',
            ui: 'soft-blue',
            childXtype: 'auditTypeCustomFieldsFrm',
            winWidth: '60%',
            handler: 'showAddAuditMetaDataDetailsFrm',

        },
        {
            xtype: 'exportbtn' 
        }, 
        {
            xtype: 'tbspacer',
            width: 50
        },

    ],

    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    bbar: [
        {
            xtype: 'pagingtoolbar',
            width: '100%',
            displayInfo: true,
            displayMsg: 'Showing {0} - {1} of {2} total records',
            emptyMsg: 'No Records',
        }
       
    ],
    columns: [{
        xtype: 'gridcolumn',
        text: 'Title',
        dataIndex: 'field_name',
        flex: 1,
    },
    {
       xtype:'gridcolumn',
       text: 'Label',
       dataIndex: 'label',
       flex: 1,
    }, 
    {
       xtype:'gridcolumn',
       text: 'Field Type',
       dataIndex: 'field_type',
       flex: 1,
    }]
})