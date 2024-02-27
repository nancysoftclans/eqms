Ext.define('Admin.view.configurations.views.panels.ParameterViewPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'parameterView',
    controller: 'configurationsvctr',
    title: 'Parameter Config',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [{
        xtype: 'parameterdefinationGrid'
    }]
});