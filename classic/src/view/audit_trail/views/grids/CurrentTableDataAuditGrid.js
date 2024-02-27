Ext.define('Admin.view.audit_trail.view.grid.CurrentTableDataAuditGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'currentTableDataAuditGrid',
    controller: 'audit_trialViewCtr',
    title: 'Current Table Data',
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                remoteFilter: true,
                pageSize: 100,
                storeId: 'currentTableDataAuditStr'
            },
            isLoad: true
        },
         afterRender:'funct_loadColumns'    
    },
    height: 300,
    
    plugins: [{
                ptype: 'gridexporter'
             }],
    columns: [],
    bbar: [{
        xtype: 'pagingtoolbar',
        hidden: true,
        width: '100%',
        beforeLoad: function () {
             var grid=this.up('grid'),
                 panel=grid.up('panel'),
                 table_name=panel.down('hiddenfield[name=table_name]').getValue(),
                 ID=panel.down('hiddenfield[name=record_id]').getValue(),
                 store=grid.getStore();
                 var filter = JSON.stringify({'id':ID});
                 store.removeAll();
                 store.getProxy().extraParams = {
                        table_name: table_name,
                        filters:filter,
                        is_config: 1
                }
        }
    }],
       
    
    
});