
Ext.define('Admin.view.administration.views.panels.SystemMenus', {
    extend: 'Ext.container.Container',
    xtype: 'systemmenus',
    controller: 'administrationvctr',
    viewModel: 'administrationvm',
    
    items: [
        {
            xtype: 'systemmenuspnl'
        }
    ]
});
