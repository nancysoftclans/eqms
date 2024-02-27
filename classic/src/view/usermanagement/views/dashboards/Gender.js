/**
 */
Ext.define('Admin.view.usermanagement.views.dashboards.Gender', {
    extend: 'Ext.container.Container',
    xtype: 'gender',
    controller: 'usermanagementvctr',
    viewModel: 'usermanagementvm',
    items: [
        {
            xtype: 'genderpnl'
        }
    ]
});
