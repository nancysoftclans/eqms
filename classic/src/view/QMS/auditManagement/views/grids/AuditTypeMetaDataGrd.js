Ext.define('Admin.view.QMS.auditManagement.views.grids.AuditTypeMetaDataGrd',{
    extend: 'Ext.grid.Panel',
    xtype: 'auditTypeMetadataGrd',
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
})