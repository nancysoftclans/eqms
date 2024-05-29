Ext.define('Admin.view.issuemanagement.views.grids.IssueManagementDocUploadsGrid', {
    extend: 'Admin.view.commoninterfaces.grids.ApplicationDocUploadsGrid',
    xtype: 'issuemanagementdocuploadsgrid',
    table_name: 'tra_issue_management_applications',
    viewModel: {
        type: 'issuemanagementvm'
    }
});
