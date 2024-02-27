/**
 */
Ext.define('Admin.view.usermanagement.views.dashboards.ActingPosition_Setup', {
    extend: 'Ext.container.Container',
    xtype: 'actingposition_setup',
    controller: 'usermanagementvctr',
    viewModel: 'usermanagementvm',
    items: [
        {
            xtype: 'actingposition_setuppnl'
        }
    ]
});
