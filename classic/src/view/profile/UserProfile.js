Ext.define('Admin.view.profile.UserProfile', {
    extend: 'Ext.panel.Panel',
    xtype: 'profile',
    //cls: 'userProfile-container',
    scrollable: 'y',
    requires: [
        'Ext.ux.layout.ResponsiveColumn'
    ],
    //layout: 'responsivecolumn',
    layout: 'hbox',
    padding: 2,
    items: [
        {
            xtype: 'panel',
            padding: 3,
            flex: 1,
            bodyStyle: 'background-color:#F1F1F1',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'profilenotifications',
            
                }
            ]
        },
        {
            xtype: 'panel',
            padding: 3,
            flex: 1,
            bodyStyle: 'background-color:#F1F1F1',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'messagecomposefrm',
            
                }
            ]
        },
    ]
    }
    );