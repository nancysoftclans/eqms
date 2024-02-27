Ext.define('Admin.view.configurations.views.panels.ChecklistPnl', {
    extend: 'Ext.container.Container',
    xtype: 'checklists',
    controller: 'configurationsvctr',
    viewModel: 'configurationsvm',
    padding: '2 0 0 0',
    layout: 'border',
    height: Ext.Element.getViewportHeight() - 118,
    items: [
        {
            xtype: 'checklisttypesgrid',
            collapsible: true,
            split: true,
            region: 'west'
        },
        {
            xtype: 'checklistitemsgrid',
            region: 'center'
        }
    ]
});
