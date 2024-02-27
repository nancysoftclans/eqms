Ext.define('Admin.view.configurations.views.panels.AtcCodesDefinationPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'atcCodesDefinationPnl',
    userCls: 'big-100 small-100',
    controller: 'configurationsvctr',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
	
    items: [
        {
            xtype: 'atcCodeDefinationGrid'
        }
    ]
});