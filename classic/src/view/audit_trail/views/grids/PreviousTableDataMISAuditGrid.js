Ext.define('Admin.view.audit_trail.view.grid.PreviousTableDataMISAuditGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'previousTableDataMISAuditGrid',
    controller: 'audit_trialViewCtr',
    title: 'Previous Table Data',
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                remoteFilter: true,
                pageSize: 100,
                storeId: 'previousTableDataMISAuditStr',
                enablePaging: true,
                reader: {
                    type: 'json',
                    rootProperty: 'results',
                    messageProperty: 'msg'
                },
                proxy: {
                    url: 'audittrail/getMISAuditTableData',
                    extraParams:{
                        in_db:'mis'
                    }
                }
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
     export_title: 'Previous Transaction Audit Trail',
    bbar: [{
        xtype: 'pagingtoolbar',
        hidden: true,
        width: '100%',
        beforeLoad: function () {
             var grid=this.up('grid'),
                 panel=grid.up('panel'),
                 valueID=panel.down('hiddenfield[name=id]').getValue(),
                 store=grid.getStore();
                 store.removeAll();
                 store.getProxy().extraParams = {
                        id:valueID,
                        type: 'previous'
                }
        }
            
    }], 
    
});