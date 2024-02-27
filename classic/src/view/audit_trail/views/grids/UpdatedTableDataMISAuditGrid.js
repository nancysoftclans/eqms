Ext.define('Admin.view.audit_trail.view.grid.UpdatedTableDataMISAuditGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'updatedTableDataMISAuditGrid',
    controller: 'audit_trialViewCtr',
    title: 'Updated Table Data',
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                remoteFilter: true,
                pageSize: 100,
                storeId: 'updatedTableDataMISAuditStr',
                enablePaging: true,
                proxy: {
                    url: 'audittrail/getMISAuditTableData'
                }
            },
            isLoad: true
        },
        afterRender:'funct_loadColumns'    
    },
     export_title: 'Transaction Audit Trail',
    width: '100%',
    height: 300, 
    plugins: [{
                ptype: 'gridexporter'
             }],
    columns: [ 
        
    ],

    bbar: [{
        xtype: 'pagingtoolbar',
        hidden: true,
        width: '100%',
        beforeLoad: function () {
             var grid=this.up('grid'),
                 panel=grid.up('panel'),
                 valueID=panel.down('hiddenfield[name=id]').getValue(),
                 Store=grid.getStore();
                 Store.removeAll();
                 Store.getProxy().extraParams = {
                        type: 'updated',
                        id:valueID
                    }
                }
            }
        ]
});