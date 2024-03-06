Ext.define('Admin.view.documentControl.views.dashboard.DocumentControlDashboard', {
    extend: 'Ext.Container',
    xtype: 'documentcontrolCtn',
    controller: 'documentcontrolvctr',
    layout: 'border',

    items: [
        {
            xtype: 'hiddenfield',
            value:26             
        },
        {
            xtype: 'documentControlDashWrapperPnl',
            region: 'center',
        },
        // {
        //     xtype: 'documentControlTb',
        //     region: 'south'
        // }

    ]
    
});