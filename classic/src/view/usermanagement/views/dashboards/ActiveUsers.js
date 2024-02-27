/**
 */
Ext.define('Admin.view.usermanagement.views.dashboards.ActiveUsers', {
    extend: 'Ext.container.Container',
    xtype: 'activeusers',
    controller: 'usermanagementvctr',
    viewModel: 'usermanagementvm',
    items: [
        {
            xtype: 'activeuserspnl'
        }
    ]
});
