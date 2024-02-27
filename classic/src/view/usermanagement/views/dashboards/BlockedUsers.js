/**
 */
Ext.define('Admin.view.usermanagement.views.dashboards.BlockedUsers', {
    extend: 'Ext.container.Container',
    xtype: 'blockedusers',
    controller: 'usermanagementvctr',
    viewModel: 'usermanagementvm',
    items: [
        {
            xtype: 'panel',
            //title: 'Blocked Users',
            userCls: 'big-100 small-100',
            itemId: 'BlockedUsersDashboard',
            height: Ext.Element.getViewportHeight() - 118,
            layout:{
                type: 'fit'
            },
            items: [
                {
                    xtype: 'blockedusersgrid'
                }
            ]
        }
    ]
});
