Ext.define('Admin.view.QMS.auditManagement.views.grids.AuditTypeMetaDataGrd',{
    extend: 'Ext.grid.Panel',
    xtype: 'auditTypeMetaDataGrd',
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
            childXtype: 'auditMetaDataDetailsFrm',
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
})