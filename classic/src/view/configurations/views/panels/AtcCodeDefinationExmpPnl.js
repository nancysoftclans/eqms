Ext.define('Admin.view.configurations.views.panels.AtcCodeDefinationExmpPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'atcCodesDefinationExmpPnl',
    userCls: 'big-100 small-100',
    controller: 'configurationsvctr',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
	
    items: [
        {
            xtype: 'atcCodeDefinationExmpGrid'
        }
    ]
});