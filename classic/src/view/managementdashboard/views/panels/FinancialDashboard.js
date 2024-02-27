Ext.define('Admin.view.managementdashboard.views.panels.FinancialDashboard', {
    extend: 'Ext.container.Container',
    xtype: 'FinancialDashboard',

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
                src: 'iframes/finance_dash.html'
            }
        }
    ]
});