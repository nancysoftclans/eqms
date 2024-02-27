Ext.define('Admin.view.dashboard.views.panels.Dashboard', {
    extend: 'Ext.container.Container',
    xtype: 'dashboard',

    requires: [
        'Ext.ux.layout.ResponsiveColumn'
    ],

    controller: 'dashboardvctr',
    viewModel: {
        type: 'dashboard'
    },

    
    listeners: {
        hide: 'onHideView'
    },

    items: [{
        xtype: 'box',
        html: 'Dashboard'
    }
    ]
});
