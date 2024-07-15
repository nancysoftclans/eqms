Ext.define('Admin.view.documentManager.views.grids.DocReleaseGrid', {
    extend: 'Admin.view.commoninterfaces.grids.ApplicationDocReleaseGrid',
    xtype: 'docreleasegrid',
    table_name: 'tra_documentmanager_application',
    viewModel: {
        type: 'documentcreationvm'
    }
});
