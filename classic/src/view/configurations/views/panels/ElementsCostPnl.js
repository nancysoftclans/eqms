Ext.define('Admin.view.configurations.views.panels.ElementCostPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'elementscostpnl',
    controller: 'configurationsvctr',
    viewModel: 'locationvm',
    height: Ext.Element.getViewportHeight() - 118,
    layout:'fit',
    padding: '2 6 5 6',
    items: [
        {
            xtype: 'elementscostgrid',
        }
    ]

});