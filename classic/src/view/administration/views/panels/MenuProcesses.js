
Ext.define('Admin.view.administration.views.panels.MenuProcesses', {
    extend: 'Ext.container.Container',
    xtype: 'menuprocesses',
    controller: 'administrationvctr',
    viewModel: 'administrationvm',
    items: [
        {
            xtype: 'menuprocessespnl'
        }
    ]
});
