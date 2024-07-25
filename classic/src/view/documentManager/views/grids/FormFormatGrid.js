Ext.define('Admin.view.documentManager.views.grids.FormFormatGrid', {
    extend: 'Admin.view.commoninterfaces.grids.FormFormatDocUploadGrid',
    xtype: 'formformatgrid',
    table_name: 'tra_documentmanager_application',
    viewModel: {
        type: 'documentcreationvm'
    }
});