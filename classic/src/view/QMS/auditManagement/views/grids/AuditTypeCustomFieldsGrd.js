Ext.define('Admin.view.QMS.auditManagement.views.grids.AuditTypeCustomFormsGrd',{
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
    tbar: [
        {
            xtype: 'button',
            text: 'Add',
            iconCls: 'x-fa fa-plus',
            action: 'add',
            ui: 'soft-blue',
            childXtype: 'auditTypeCustomFieldsFrm',
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
        dataIndex: 'custom_field_title',
        flex: 1,
    },
    {
       xtype:'gridcolumn',
       text: 'Label',
       dataIndex: 'custom_field_label',
       flex: 1,
    }, 
    {
       xtype:'gridcolumn',
       text: 'Field Type',
       dataIndex: 'custom_field_type',
       flex: 1,
    }]
})