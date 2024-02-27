Ext.define('Admin.view.audit_trail.view.grid.MISAllTransRecordAuditGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'misalltransRecordAuditGrid',
    controller: 'audit_trialViewCtr',
    title: 'All Mis Transactions Table Data',
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                remoteFilter: true,
                pageSize: 100,
                storeId: 'alltransRecordAuditStr',
                enablePaging: true,
                reader: {
                    type: 'json',
                    rootProperty: 'results',
                    messageProperty: 'msg'
                },
                proxy: {
                    url: 'audittrail/getAllAuditTrans'
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
    columns: [
        {
            xtype: 'gridcolumn',
            dataIndex: 'record_id',
            name:'record_id',
            text: 'Record ID',
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'table_name',
            name:'table_name',
            text: 'Table Name',
        },
    ],

    bbar: [{
        xtype: 'pagingtoolbar',
        hidden: true,
        width: '100%',
        beforeLoad: function (btn) {
             var grid=this.up('grid'),
                 panel=grid.up('panel'),
                 record_id=panel.down('hiddenfield[name=record_id]').getValue(),
                 table_name=panel.down('hiddenfield[name=table_name]').getValue(),
                 store=grid.getStore();
                 store.removeAll();
            store.getProxy().extraParams = {
                        record_id:record_id,
                        table_name:table_name,
                        type: 'mis'
                }
        }
            
    },'->',{
        xtype: 'exportbtn',
        text: 'Export Above'
    }], 
    export_title: 'Record Transaction Audit',
});