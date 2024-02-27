Ext.define('Admin.view.commoninterfaces.grids.OnlineProductDocUploadsGrid', {
    //extend: 'Admin.view.commoninterfaces.grids.ApplicationDocUploadsGrid',
    extend: 'Admin.view.commoninterfaces.grids.ApplicationPrevDocUploadsGrid',
    xtype:'onlineproductdocuploadsgrid',
    upload_tab:'productDocUploadsGrid',
    table_name:'tra_product_applications',
    viewModel: {
        type: 'productregistrationvm'
    },
    portal_uploads: 1
});