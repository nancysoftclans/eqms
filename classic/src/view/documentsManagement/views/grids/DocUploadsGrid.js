Ext.define('Admin.view.documentsManagement.views.grids.DocUploadsGrid', {
    extend: 'Admin.view.commoninterfaces.grids.ApplicationDocUploadsGrid',
    xtype: 'docuploadsgrid',
    table_name: 'tra_documentupload_requirements',
    viewModel: {
        type: 'documentcreationvm'
    }
});
