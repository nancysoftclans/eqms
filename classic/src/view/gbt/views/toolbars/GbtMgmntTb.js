Ext.define('Admin.view.gbt.views.toolbars.GbtMgmntTb.js', {
    extend: 'Ext.toolbar.Toolbar',
    xtype:'gbtManagementDashTb',
    //controller: 'gbtMgmntVctr',
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
            sec_dashboard:'gbtManagementDashWrapperPnl',
            name: 'disposalpermitstbRegHomeBtn'
        },
        {
            text: 'Gbt Application',
            iconCls: 'x-fa fa-plus-square',
            handler: 'onInitiateGbt',
            wrapper_xtype: "gbtManagementDashWrapperPnl",
            app_type: 115,
        }
    ]
});
