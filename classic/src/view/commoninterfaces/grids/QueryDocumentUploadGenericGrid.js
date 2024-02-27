Ext.define('Admin.view.commoninterfaces.grids.QueryDocumentUploadGenericGrid', {
    extend: 'Admin.view.commoninterfaces.grids.ApplicationDocUploadsGrid',
    xtype: 'queryDocumentUploadGenericGrid',
    document_type_id: 39,
    table_name: 'tra_application_query_reftracker',
    listeners: {
        afterrender: function(grid){
            var pnl = grid.up('panel'),
                query_id = pnl.down('hiddenfield[name=query_id]').getValue();
            grid.down('hiddenfield[name=query_ref_id]').setValue(query_id);
            console.log(query_id);
        }
    }
});