Ext.define('Admin.view.documentManager.views.grids.LogDatabasesGrid', {
    extend: 'Admin.view.commoninterfaces.grids.LogDatabasesDocUploadGrid',
    xtype: 'logdatabasesgrid',
    table_name: 'tra_documentmanager_application',
    viewModel: {
        type: 'documentcreationvm'
    }
});