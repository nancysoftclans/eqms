Ext.define('Admin.view.documentControl.views.dashboard.documentControlDashboard', {
    extend: 'Ext.Container',
    xtype: 'documentcontrolCtn',
    controller: 'documentcontrolvctr',
    layout: 'border',

    items: [
        {
            xtype: 'hiddenField',
            value:26             
        },
        // {
        //     xtype: 'documentControlDashWrapperPnl',
        //     region: 'center',
        // },
        // {
        //     xtype: 'documentControlTb',
        //     region: 'south'
        // }

    ]
    
});