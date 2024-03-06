Ext.define('dmin.view.documentControl.views.panels.DocumentControlDashWrapperPnl', {
    extend: 'Ext.Container',
    xtype: 'documentControlDashWrapperPnl',
    itemId: 'documentControlDashWrapperPnl',
    layout: 'fit',

    items: [
        {
            xtype: 'documentControlDashPnl'
        }
    ]
});