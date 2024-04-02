Ext.define('Admin.view.QMS.auditManagement.views.grids.AuditMgmntGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'AuditMgmntGrid',
    itemId: 'AuditMgmntGrid',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',

    tbar: [
        {
            xtype: 'exportbtn' 
        }, 
        {
            xtype: 'tbspacer',
            width: 50
        }
    ],
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    export_title: 'psur/pbrer applications',

    columns: [
        {
            xtype: 'gridcolumn',
            dataIndex: 'tracking_no',
            text: 'Audit No',
            flex: 1,
        },
        {
            xtype: 'gridcolumn',
            dataIndex:'title',
            text: 'Title'
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'status',
            text: 'findings',
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'start_date',
            text: 'Start Date', 
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'end_date',
            text: 'End Date', 
        }
    ]

})