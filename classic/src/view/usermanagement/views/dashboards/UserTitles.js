/**
 */
Ext.define('Admin.view.usermanagement.views.dashboards.UserTitles', {
    extend: 'Ext.container.Container',
    xtype: 'usertitles',
    controller: 'usermanagementvctr',
    viewModel: 'usermanagementvm',
    items: [
        {
            xtype: 'usertitlespnl'
        }
    ]
});
