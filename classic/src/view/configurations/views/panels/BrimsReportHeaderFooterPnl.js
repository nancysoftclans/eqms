Ext.define('Admin.view.configurations.views.panels.BrimsReportHeaderFooterPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'letterheaderfooterPnl',
    title: 'Letter Header & Footer Images',
    userCls: 'big-100 small-100',
    controller: 'configurationsvctr',
    viewModel: 'configurationsvm',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'brimsreportheaderfootergrid'
        }
    ]
});
