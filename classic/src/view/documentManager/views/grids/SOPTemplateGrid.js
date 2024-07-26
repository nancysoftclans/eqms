Ext.define('Admin.view.documentManager.views.grids.SOPTemplateGrid', {
    extend: 'Admin.view.commoninterfaces.grids.SOPTemplateDocUploadGrid',
    xtype: 'soptemplategrid',
    table_name: 'tra_documentmanager_application',
    viewModel: {
        type: 'documentcreationvm'
    }
});