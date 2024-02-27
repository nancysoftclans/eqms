
Ext.define('Admin.view.administration.views.panels.SystemAccessLevels', {
    extend: 'Ext.container.Container',
    xtype: 'systemaccesslevels',
    controller: 'administrationvctr',
    viewModel: 'administrationvm',
    items: [
        {
            xtype: 'systemaccesslevelspnl'
        }
    ]
});
