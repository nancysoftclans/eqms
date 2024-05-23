Ext.define('Admin.view.issuemanagement.views.dashboards.IssueManagementWrapper', {
    extend: 'Ext.Container',
    xtype: 'issuemanagementwrapper',
    itemId: 'issuemanagementwrapper',
    layout: 'fit',
    items: [
        {
            xtype: 'issuemanagementdashboard'
        }
    ]
});