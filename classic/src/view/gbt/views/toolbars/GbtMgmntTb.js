Ext.define('Admin.view.gbt.views.toolbars.GbtMgmntTb.js', {
    extend: 'Ext.toolbar.Toolbar',
    xtype:'gbtDashTb',
    ui: 'footer', 
    defaults: {
        ui: 'soft-blue',
        iconAlign: 'top' 
    },
    requires: [
        'Ext.ux.BoxReorderer'
    ],
    plugins: 'boxreorderer',
    overflowHandler: 'scroller',
    items: [
        {
            text: 'Home',
            iconCls: 'x-fa fa-home',
            sec_dashboard:'gbtDashWrapperPnl',
            name: 'disposalpermitstbRegHomeBtn'
        },
        {
            text: 'Plan GBT',
            iconCls: 'x-fa fa-plus-square',
            handler: 'onInitiateGbt',
            app_type: 103
        },
    ]
});
