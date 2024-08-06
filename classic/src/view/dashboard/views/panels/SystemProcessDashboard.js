Ext.define('Admin.view.dashboard.SystemProcessDashboard', {
    extend: 'Ext.panel.Panel',
    xtype: 'systemprocessdashboard',
    margin: 2,
    requires: [
        'Ext.ux.layout.ResponsiveColumn'
    ],
    controller: 'dashboardvctr',
    viewModel: {
        type: 'dashboard'
    },
    layout: 'border',
    listeners: {
        hide: 'onHideView',
    }, 
    items: [ {
            xtype: 'tabpanel',
            region: 'center',
            userCls: 'big-100 small-100',
            
            items: [
                {
                    title: 'My Workspace',
                    xtype: 'intraygrid',
                    // height: Ext.Element.getViewportHeight() - 161
                },
                // {
                //     title: 'Out-Tray',
                //     xtype: 'outtraygrid',
                //     // height: Ext.Element.getViewportHeight() - 161
                // },
                // {
                //     xtype:'panel',
                //     layout:'border',
                //     title: 'Online Application Receiving Dashboard',
                //     items:[{
                //         xtype: 'portalSubmissionReceivingPnl',
                //         region:'center'
                        
                //     }
                    // {
                    //     xtype: 'onlineapplicationdashboardgrid',
                    //     region:'center'
                        
                    // }
                    // ,{
                    //     xtype: 'onlineappssubmissioncountergrid',
                    //     title:'Online Application Submissions Counter(Summary Data)',
                    //     region: 'south',
                    //     collapsible: true,
                    //     collapsed: true,
                    //     height: 320,
                    //     autoScroll: true

                    // }
                  //  ]
                //}, 
                // {
                //     xtype:'panel',
                //     layout:'border',
                //     title: 'Application Queries Dashboard',
                //     items:[{
                //         xtype: 'dashboardQueriesPnl',
                //         region:'center'
                        
                //     }
                    ]
                }
                // ,{
                //     xtype:'controllleddocumentsaccessdashboard',
                //     title:'Shared Documents (Controlled Documents Dashboard)',
                //     layout:'fit'
                // }
            ]
        //}
		
    //]
});
