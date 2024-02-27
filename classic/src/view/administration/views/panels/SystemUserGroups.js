
Ext.define('Admin.view.administration.views.panels.SystemUserGroups', {
    extend: 'Ext.container.Container',
    xtype: 'systemusergroups',
    margin: 3,
    controller: 'administrationvctr',
    viewModel: 'administrationvm',
    items: [
        {
            xtype: 'systemusergroupspnl'
        }
    ]
});
