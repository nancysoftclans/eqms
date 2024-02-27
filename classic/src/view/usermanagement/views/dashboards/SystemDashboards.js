/**
 */
Ext.define('Admin.view.usermanagement.views.dashboards.SystemDashboards', {
    extend: 'Ext.container.Container',
    xtype: 'systemdashboards',
    controller: 'usermanagementvctr',
    viewModel: 'usermanagementvm',
    items: [
        {
            xtype: 'systemdashboardspnl'
        }
    ]
});
