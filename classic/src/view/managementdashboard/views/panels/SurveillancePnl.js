Ext.define('Admin.view.managementdashboard.views.panels.SurveillancePnl', {
    extend: 'Ext.container.Container',
    xtype: 'SurveillancePnl',

    requires: [
        'Ext.ux.layout.ResponsiveColumn'
    ],

    controller: 'dashboardvctr',
    viewModel: {
        type: 'dashboard'
    },
    // listeners: {
    //     beforerender: 'loadUrl'
    // },
    items: [{
            xtype: 'component',
            autoEl: {
                tag: 'iframe',
                target:"_parent",
                style: 'height: 100%; width: 100%; overflow-x: auto;',
                src: 'iframes/Surveillance.html'
            }
        }
    ]
});