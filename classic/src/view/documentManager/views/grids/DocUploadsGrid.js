Ext.define('Admin.view.documentManager.views.grids.DocUploadsGrid', {
    extend: 'Admin.view.commoninterfaces.grids.ApplicationDocUploadsGrid',
    xtype: 'docuploadsgrid',
    table_name: 'tra_documentmanager_application',
    viewModel: {
        type: 'documentcreationvm'
    }
});
