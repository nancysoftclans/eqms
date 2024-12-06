Ext.define('Admin.view.dashboard.views.grids.MyWorkspaceGrid', {
    extend: 'Ext.container.Container',
    xtype: 'myworkspacedashboardgrid',
    controller: 'dashboardvctr',

    // autoScroll: true,
    scrollable: true,
    width: '100%',
    layout: {
        type: 'vbox',
        align: 'stretch',
        padding: 2
    },
    defaults: {
        labelAlign: 'top',
        allowBlank: false,
        columnWidth: 1,
    },
    height: '100%',

    bodyPadding: 5,


    //requires: ['Admin.view.dashboard.views.charts.CustomProgressBar'],
    items: [
        
        {
            region: 'center',
            layout: 'hbox',
            items: [{
                xtype: 'fieldset',
                columnWidth: 1,
                collapsible: false,
                flex: 1,
                margin: 10,
                items: [
                    {
                        xtype: 'container',
                        width: '100%',
                        bodyPadding: 30,
                        layout: {
                            type: 'vbox',
                            align: 'stretch',
                        },
                        style: {
                            'text-align': 'center',
                            'border-bottom': '1px solid #e9ecef'
                        },
                        listeners: {
                            beforerender: function (panel) {
                                var store = Ext.create('Ext.data.Store', {
                                    proxy: {
                                        type: 'ajax',
                                        url: 'dashboard/getDashboardStats',
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'data'
                                        }
                                    }
                                });
        
                                store.load({
                                    callback: function (records, operation, success) {
                                        if (success && records.length > 0) {
                                            var data = records[0].data;
        
                                            panel.down('#lasthourlogin').setHtml(`<div 
                                                style="font-size: 24px; 
                                                color: #ffffff; 
                                                padding: 10px 0;
                                                background: #35baf6;
                                                ">
                                                ${data.user_stats.loggedlasthour}
                                                </div>`);
                                            panel.down('#totalusers').setHtml(`<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">${data.user_stats.totalUsers}</div>`);
                                            panel.down('#groupedusers').setHtml(`<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">${data.user_stats.groupswithusers}</div>`);
                                        } else {
                                            console.error('Failed to load data from the store.');
                                        }
                                    }
                                });
                            }
                        },
                        items: [
                            // Row 1
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '10 0',
                                items: [
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        padding: 15,
                                        margin: '0 10 0 0', 
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #ffffff; background:#35baf6">Users Logged in the last 1 hour</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'lasthourlogin',
                                                html: '<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            'background': '#35baf6',
                                            'border-radius': '5px',
                                        }
                                    },
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        padding: 15,
                                        margin: '0 10 0 0', 
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #ffffff;">Total Users</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'totalusers',
                                                html: '<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            'background': '#35baf6',
                                            'border-radius': '5px',
                                        }
                                    },
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        padding: 15,
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #ffffff;">Groups with users</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'groupedusers',
                                                html: '<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            'background': '#35baf6',
                                            'border-radius': '5px',
                                        }
                                    },
                                    
                                ]
                            }

                            
                        ]
                    }
                ]
            }]
        },


        {
            region: 'north',
            // height: 00,
            layout: 'hbox',
            //user login analysis
            items: [{
                xtype: 'fieldset',
                columnWidth: 1,
                collapsible: false,
                title: 'User Analysis',
                margin: 10,
                flex: 1,
                layout: 'container',
                items: [{
                    padding: '0 0 10 0',
                    width: '100%',
                    // height: '100%',
                    xtype: 'documentchart'
                }, {
                    items: [{
                        xtype: 'container',
                        width: '100%',
                        margin: '10 5',
                        flex: 1,
                        layout: {
                            type: 'hbox',
                            align: 'stretch',
                        },

                        //active users last 30 days
                        items: [{ 
                            
                            xtype: 'container',
                            margin: 10,
                            padding: 10,
                            flex: 1,
                            
                            items: [{
                                xtype: 'component',
                                html: '<div style="font-size: 16px; text-align: center;">Active Last 30 Days</div>',
                                padding: '10 10 0',
                                
                            }, {
                                xtype: 'progressbar',
                                text: '',
                                height: 16,
                                margin: '10 0 10',
                                // padding: 5,
                                // width: '100%',
                                value: '',
                                cls: 'cls-progress-bar'
                            }]
                        }, { //each container resp card
                            xtype: 'container',
                            margin: 10,
                            padding: 10,
                            flex: 1,
                            items: [{
                                xtype: 'component',
                                html: '<div style="font-size: 16px; text-align: center;">Logged In Today</div>',
                                padding: '10 10 0',
                            }, {
                                xtype: 'progressbar',
                                text: '',
                                height: 16,
                                margin: '10 0 10',
                                style: {
                                    'color': 'green'
                                },
                                value: '',
                                cls: 'cls-progress-bar'
                            }]
                        }, { //each container resp card
                            xtype: 'container',
                            margin: 10,
                            padding: 10,
                            flex: 1,
                            items: [{
                                xtype: 'component',
                                html: '<div style="font-size: 16px; text-align: center;">Never Logged In</div>',
                                padding: '10 10 0',
                            }, {
                                xtype: 'progressbar',
                                text: '',
                                height: 16,
                                margin: '10 0 10',
                                // padding: 5,
                                // width: '100%',
                                value: '',
                                cls: 'cls-progress-bar'
                            }]
                        }, { //each container resp card
                            xtype: 'container',
                            margin: 10,
                            padding: 10,
                            flex: 1,
                            // width: '100%',
                            items: [{
                                xtype: 'component',
                                html: '<div style="font-size: 16px; text-align: center;">Licensed users</div>',
                                padding: '10 10 0',
                            }, {
                                xtype: 'progressbar',
                                height: 16,
                                margin: '10 0 10',
                                color: 'green',
                                // padding: 5,
                                // width: '100%',
                                value: '',
                                text: '',
                                cls: 'cls-progress-bar'
                            }]
                        }],
                        listeners: {
                            afterrender: function (panel) {
                                // var userStatsStore = Ext.getStore('userstatsstore'); 
                                // var store = Ext.ComponentQuery.query('Admin.store.dashboard.UserStatsStr')[0];
                                var store = Ext.create('Ext.data.Store', {
                                    model: 'Admin.model.dashboard.userStatsMdl',
                                    proxy: {
                                        type: 'ajax',
                                        url: 'dashboard/getDashboardStats',
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'data'
                                        }
                                    }
                                });

                                
                                store.load({
                                    callback: function (records, operation, success) {
                                        if (success && records.length > 0) {
                                            
                                            var data = records[0].data;
                        
                                          
                                            var progressbars = panel.query('progressbar');
                        
                                            
                                            Ext.Array.each(progressbars, function (progressbar, index) {
                                                switch (index) {
                                                    case 0: // Active Last 30 Days
                                                        progressbar.setValue(data.user_stats.activeLast30Days / data.user_stats.totalUsers);
                                                        break;
                                                    case 1: // Logged In Today
                                                        progressbar.setValue(data.user_stats.loggedInToday / data.user_stats.totalUsers);
                                                        break;
                                                    case 2: // Never Logged In
                                                        progressbar.setValue(data.user_stats.neverLoggedIn / data.user_stats.totalUsers);
                                                       
                                                        break;
                                                    case 3: // Licensed Users
                                                        progressbar.setValue(data.user_stats.activeusers / data.user_stats.totalUsers);
                                                        break;
                                                }
                                            });
                        
                                            
                                            Ext.Array.each(progressbars, function (progressbar) {
                                                var value = progressbar.getValue();

                                                if(value < 0.3){
                                                    color = 'red';
                                                } else if( value <= 0.7){
                                                    color = 'orange';
                                                } else {
                                                    color = 'green';
                                                }
                                                //var color = value < 0.3 ? 'red' : (value < 0.8 ? 'orange' : 'green');
                                                if (progressbar && progressbar.bar) {
                                                    var bar = progressbar.bar; 
                                                    
                                                        Ext.get(bar.dom).setStyle({
                                                            'background-color': color,  
                                                            'border-radius': '20px',   
                                                            'height': '20px'          
                                                        });
                                                    
                                                } else {
                                                    console.error('Progress bar or its inner bar element is not available.');
                                                }
                                                // progressbar.setStyle({
                                                //     'background-color': '#e9ecef',
                                                //     'border-radius': '5px',
                                                // });
                                            });
                                        } else {
                                            console.error('Failed to load data from the store.');
                                        }
                                    }
                                });
                            }
                        }
                        
                    }]
                }, 
                { // user details|licenses
                    xtype: 'container',
                    width: '100%',
                    bodyPadding: 30,
                    flex: 1,
                    height: '100%',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                    },
                    style: {
                        'text-align': 'center',
                        'border-top': '1px solid #e9ecef'
                    },

                    listeners: {
                        afterrender: function (panel) {
                    
                       
                            var store = Ext.create('Ext.data.Store', {
                                
                                proxy: {
                                    type: 'ajax',
                                    url: 'dashboard/getDashboardStats',
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'data'
                                    }
                                }
                            });
                    
                         
                            store.load({
                                callback: function (records, operation, success) {
                    
                                    if (success && records.length > 0) {
                                        var data = records[0].data;
                                        var totalUsersComponent = panel.down('#totalUsersDisplay');
                                        var totalLicensesComponent = panel.down('#totalLicensesDisplay');
            
                                        if (totalUsersComponent) {
                                            totalUsersComponent.setHtml(
                                                `<div style="font-size: 24px; color: #3b82f6;padding:10px 0;">${data.user_stats.totalUsers}</div>`
                                            );
                                        } else {
                                            console.warn('Total Users component not found!');
                                        }
                    
                                        if (totalLicensesComponent) {
                                            totalLicensesComponent.setHtml(
                                                `<div style="font-size: 24px; color: #333;padding:10px 0;">${data.user_stats.activeusers}</div>` 
                                            );
                                        } else {
                                            console.warn('Total Licenses component not found!');
                                        }
                                    } else {
                                        console.error('Failed to load data from the store.');
                                    }
                                }
                            });
                        }
                    },
                    
                    items: [
                        
                        {
                        
                            width: '100%',
                            flex: 1,
                            bodyPadding: 25,
                            items: [{
                                xtype: 'component',
                                html: '<div style="font-size: 14px; color: #666;">Total Users</div>'
                            }, {
                                xtype: 'component',
                                itemId: 'totalUsersDisplay',
                                html: '<div style="font-size: 24px; color: #3b82f6;padding:10px 0;">0</div>'
                            }],
                            style: {
                                'border-right': '1px solid #e9ecef'
                            },
                        },
                        {
                            width: '100%',
                            flex: 1,
                            bodyPadding: 25,
                            items: [{
                                xtype: 'component',
                                html: '<div style="font-size: 14px; color: #666;">Total Licenses</div>'
                            }, {
                                xtype: 'component',
                                itemId: 'totalLicensesDisplay',
                                html: '<div style="font-size: 24px; color: #333;padding:10px 0;">0</div>'
                            }]

                        }
                    
                    ],

                    
                },
                { // licenses details
                    xtype: 'container',
                    width: '100%',
                    bodyPadding: 30,
                    flex: 1,
                    height: '100%',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    style: {
                        'text-align': 'center',
                        'border-top': '1px solid #e9ecef'
                    },

                    listeners: {
                        afterrender: function (panel) {
                    
                       
                            var store = Ext.create('Ext.data.Store', {
                                
                                proxy: {
                                    type: 'ajax',
                                    url: 'dashboard/getDashboardStats',
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'data'
                                    }
                                }
                            });
                    
                         
                            store.load({
                                callback: function (records, operation, success) {
                    
                                    if (success && records.length > 0) {
                                        var data = records[0].data;
                                        var totalUsersComponent = panel.down('#totalUsersDisplay');
                                        var totalLicensesComponent = panel.down('#totalLicensesDisplay');
            
                                        if (totalUsersComponent) {
                                            totalUsersComponent.setHtml(
                                                `<div style="font-size: 24px; color: #3b82f6;padding:10px 0;">${data.user_stats.totalUsers}</div>`
                                            );
                                        } else {
                                            console.warn('Total Users component not found!');
                                        }
                    
                                        if (totalLicensesComponent) {
                                            totalLicensesComponent.setHtml(
                                                `<div style="font-size: 24px; color: #333;padding:10px 0;">${data.user_stats.activeusers}</div>` 
                                            );
                                        } else {
                                            console.warn('Total Licenses component not found!');
                                        }
                                    } else {
                                        console.error('Failed to load data from the store.');
                                    }
                                }
                            });
                        }
                    },
                    
                    items: [
                        {
                        xtype: 'component',
                        html: '<div style="font-size: 16px; text-align: left;">System Licenses</div>',
                        margin: '4 30 0',
                        padding: '10 0 10 10',
                    }, 
                    {
                        xtype: 'progressbar',
                        text: '',
                        height: 20,
                        margin: '10 30 10',
                        // padding: 5,
                        // width: '80%',
                        flex: 1,
                        value: 0,
                        cls: 'cls-progress-bar'
                    },
                    {
                        xtype: 'component',
                        html: '<div style="font-size: 16px; text-align: left;">Document Licenses</div>',
                        margin: '4 30 0',
                        padding: '10 0 10 10',
                    }, 
                    {
                        xtype: 'progressbar',
                        text: '',
                        height: 20,
                        margin: '10 30 10',
                        // padding: 5,
                        // width: '80%',
                        flex: 1,
                        value: 0,
                        cls: 'cls-progress-bar'
                    }
                ]

                    
                }
            ]
            }]

        }, 
        {
            // documents analysis
            region: 'center',
            // height: 400, 
            layout: 'hbox',

            items: [{
                
                xtype: 'fieldset',
                columnWidth: 1,
                collapsible: false,
                title: 'Document Analysis',
                flex: 1,
                margin: 10,
                items: [{
                    xtype: 'line',
                    width: '100%',
                    padding: '0 0 10 0'
                }, {
                    listeners: {
                        afterrender: function (panel) {
                            var store = Ext.create('Ext.data.Store', {
                                proxy: {
                                    type: 'ajax',
                                    url: 'dashboard/getDashboardStats',
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'data'
                                    }
                                }
                            });
                    
                            store.load({
                                callback: function (records, operation, success) {
                                    if (success && records.length > 0) {
                                        var data = records[0].data;
                    
                                        // Retrieve progress bars from the panel
                                        var progressbars = panel.query('progressbar');
                    
                                        Ext.Array.each(progressbars, function (progressbar, index) {
                                            var percentage = 0;
                    
                                            switch (index) {
                                                case 0: // Released documents
                                                    percentage = data.document_analysis.released / data.document_analysis.total_documents;
                                                    progressbar.setValue(percentage);
                    
                                                    var releasedVersion = panel.down('#releasedversion');
                                                    if (releasedVersion) {
                                                        releasedVersion.setHtml(
                                                            `<div style="font-size: 16px; text-align: left;">
                                                            ${data.document_analysis.released} Version (${Math.round(percentage * 100)}%)
                                                            </div>`
                                                        );
                                                    } else {
                                                        console.warn('Released version component not found!');
                                                    }
                                                    break;
                    
                                                case 1: // Refused documents
                                                    percentage = data.refused / data.document_analysis.total_documents;
                                                    progressbar.setValue(percentage);
                    
                                                    var refused = panel.down('#refused');
                                                    if (refused) {
                                                        refused.setHtml(
                                                            `<div style="font-size: 16px; text-align: left;">
                                                            ${data.refused} Version (${Math.round(percentage * 100)}%)
                                                            </div>`
                                                        );
                                                    } else {
                                                        console.warn('Refused component not found!');
                                                    }
                                                    break;
                                            }
                    
                                            // Apply dynamic colors to the progress bar based on value
                                            var color = percentage < 0.3 ? 'red' : percentage <= 0.7 ? 'orange' : 'green';
                    
                                            if (progressbar && progressbar.bar) {
                                                var bar = progressbar.bar;
                                                Ext.get(bar.dom).setStyle({
                                                    'background-color': color,
                                                    'border-radius': '20px',
                                                    'height': '20px'
                                                });
                                            } else {
                                                console.error('Progress bar or its inner bar element is not available.');
                                            }
                                        });
                                    } else {
                                        console.error('Failed to load data from the store.');
                                    }
                                }
                            });
                        }
                    },
                    
                    items: [
                        {
                        xtype: 'component',
                        html: '<div style="font-size: 16px; text-align: left;">Documents Released</div>',
                        margin: '4 30 0',
                        padding: '10 0 10 10',
                    }, {
                        xtype: 'component',
                        itemId: 'releasedversion',
                        html: '<div style="font-size: 16px; text-align: left;">2 Versions (2%)</div>',
                        margin: '4 30 0',
                        padding: '0 10',
                    },
                    {
                        xtype: 'progressbar',
                        text: '',
                        height: 20,
                        margin: '10 30 10',
                        // padding: 5,
                        // width: '80%',
                        flex: 1,
                        value: 0,
                        cls: 'cls-progress-bar',
                    },
                    {
                        xtype: 'component',
                        html: '<div style="font-size: 16px; text-align: left;">Refused</div>',
                        margin: '4 30 0',
                        padding: '10 0 10 10',
                    }, {
                        xtype: 'component',
                        itemId: 'refused',
                        html: '<div style="font-size: 16px; text-align: left;">2 Versions (2%)</div>',
                        margin: '4 30 0',
                        padding: '0 10',
                    },
                    {
                        xtype: 'progressbar',
                        itemId: 'progress',
                        text: '',
                        height: 20,
                        margin: '10 30 10',
                        // padding: 5,
                        // width: '80%',
                        flex: 1,
                        value: 0.81,
                        cls: 'cls-progress-bar',
                        
                    },
                    
                    
                ]

                }],
                listeners: {
                    afterrender: function (panel) {
                        //var progressBar = panel.query('progressbar');
                        var progressBars = panel.query('progressbar');
                        Ext.Array.each(progressBars, function (progressBar) {
                            var value = progressBar.getValue();

                            if(value < 0.3){
                                color = 'red';
                            } else if( value <= 0.7){
                                color = 'orange';
                            } else {
                                color = 'green';
                            }
                            //var color = value < 0.3 ? 'red' : (value < 0.8 ? 'orange' : 'green');
                            if (progressBar && progressBar.bar) {
                                var bar = progressBar.bar; 
                                
                                    Ext.get(bar.dom).setStyle({
                                        'background-color': color,  
                                        'border-radius': '20px',   
                                        'height': '20px'          
                                    });
                                
                            } else {
                                console.error('Progress bar or its inner bar element is not available.');
                            }
                        });
                    }
                }
                
                
                
                // listeners: {
                //     afterrender: function (panel) {
                //         var progressBar = panel.down('progressbar');
                //         if (progressBar) {
                //             progressBar.getEl().down('.x-progressbar-bar').setStyle({
                //                 'background-color': 'red', // Change bar color
                //                 'border-radius': '20px',  // Rounded corners
                //                 'height': '20px',         // Adjust height if needed
                //             });
                //         }
                //         // panel.down('progressbar').down('x-progressbar-inner').setStyle({
                //         //     'background': 'red',
                //         //     'border-radius': '20px',
                //         //     'height': '20px',
                            
                //         // });
                //         // // panel.down('progressbar').setStyle({
                //         // //     'backgroundColor': 'green',  // Color of the changing bar
                //         // // });
                //         // var bar = Ext.ComponentQuery.query('#progress')[0]; 
                //         // bar.setStyle({
                //         //     'background-color': 'green',  // Color of the changing bar
                //         // });
                //         // bar
                        
                //     }
                // }

            }]
        },  



        //Document analysis
        {
            region: 'center',
            layout: 'hbox',
            items: [{
                xtype: 'fieldset',
                columnWidth: 1,
                collapsible: false,
                title: 'Documents Analysis',
                flex: 1,
                margin: 10,
                items: [
                    {
                        xtype: 'container',
                        width: '100%',
                        bodyPadding: 30,
                        layout: {
                            type: 'vbox',
                            align: 'stretch',
                        },
                        style: {
                            'text-align': 'center',
                            'border-bottom': '1px solid #e9ecef'
                        },
                        listeners: {
                            afterrender: function (panel) {
                                var store = Ext.create('Ext.data.Store', {
                                    proxy: {
                                        type: 'ajax',
                                        url: 'dashboard/getDashboardStats',
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'data'
                                        }
                                    }
                                });
        
                                store.load({
                                    callback: function (records, operation, success) {
                                        if (success && records.length > 0) {
                                            var data = records[0].data;
        
                                            panel.down('#documentslive').setHtml(`<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">${data.documents_live}</div>`);
                                            panel.down('#overduedocuments').setHtml(`<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">${data.overdue_documents}</div>`);

                                            var time = data.average_acknowledgment_time;
                                            if (time < 60) {
                                                label = 'seconds';
                                            } else if (time < 3600) {
                                                label = 'minutes';
                                                time = Math.floor(time / 60); 
                                            } else if (time < 86400) {
                                                label = 'hours';
                                                time = Math.floor(time / 3600);
                                            } else {
                                                label = 'days';
                                                time = Math.floor(time / 86400); 
                                            }
                                            
                                            panel.down('#averagetime').setHtml(`
                                                <div style="font-size: 24px; color: #ffffff; padding: 10px 0;">
                                                    ${time} ${label}
                                                </div>
                                            `);

                                            panel.down('#overduedocumenttasks').setHtml(`<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">${data.overdue_document_tasks}</div>`);
                                            panel.down('#issued').setHtml(`<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">${data.issued_document_tasks}</div>`);
                                            panel.down('#completed').setHtml(`<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">${data.completed_document_tasks}</div>`);
                                            panel.down('#upcomingreviews').setHtml(`<div style="font-size: 24px; color:#ffffff; padding: 10px 0;">${data.upcoming_document_reviews}</div>`);
                                        } else {
                                            console.error('Failed to load data from the store.');
                                        }
                                    }
                                });
                            }
                        },
                        items: [
                            // Row 1
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '10 0',
                                items: [
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        padding: 15,
                                        margin: '0 10 0 10', 
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #ffffff;">Documents Live</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'documentslive',
                                                html: '<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            'background': '#35baf6',
                                            'border-radius': '5px',
                                        }
                                    },
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        padding: 15,
                                        margin: '0 10 0 10', 
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #ffffff;">Overdue Documents</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'overduedocuments',
                                                html: '<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            'background': '#35baf6',
                                            'border-radius': '5px',
                                        }
                                    },
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        padding: 15,
                                        margin: '0 10 0 10', 
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #ffffff;">Overdue Document Tasks</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'overduedocumenttasks',
                                                html: '<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            'background': '#35baf6',
                                            'border-radius': '5px',
                                        }
                                    },
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        padding: 15,
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #ffffff;">Issued Document Tasks</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'issued',
                                                html: '<div style="font-size: 24px; color: white; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            'background': '#35baf6',
                                            'border-radius': '5px',
                                        }
                                    }
                                ]
                            },
                            // Row 2
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '10 0',
                                items: [
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        padding: 15,
                                        margin: '0 10 0 0', 
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #ffffff;">Completed Document Tasks</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'completed',
                                                html: '<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            'background': '#35baf6',
                                            'border-radius': '5px',
                                        }
                                    },
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        padding: 15,
                                        margin: '0 10 0 0', 
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #ffffff;">Upcoming Document Reviews</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'upcomingreviews',
                                                html: '<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            'background': '#35baf6',
                                            'border-radius': '5px',
                                        }
                                    },
                                    {
                                        xtype: 'container',
                                        flex: 1,
                                        padding: 15,
                                        margin: '0 0 0 0', 
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #ffffff;">Average Time For Document Acknowledgement</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'averagetime',
                                                html: '<div style="font-size: 24px; color: #ffffff; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            'background': '#35baf6',
                                            'border-radius': '5px',
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }]
        },
        
        

        {// tasks analysis
            region: 'center',
            layout: 'hbox',
            items: [{
                xtype: 'fieldset',
                columnWidth: 1,
                collapsible: false,
                title: 'Tasks Analysis',
                flex: 1,
                margin: 10,
                items: [{
                    xtype: 'container',
                    width: '100%',
                    bodyPadding: 30,
                    flex: 1,
                    height: '100%',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                    },
                    style: {
                        'text-align': 'center',
                        'border-bottom': '1px solid #e9ecef'
                    },
                    //tasks issued
                    
                    listeners: {
                        afterrender: function(panel){
                            var store = Ext.create('Ext.data.Store', {
                                proxy: {
                                    type: 'ajax',
                                    url: 'dashboard/getDashboardStats',
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'data'
                                    }
                                }
                            });
                    
                    
                            store.load({
                                callback: function (records, operation, success) {
                    
                                    if (success && records.length > 0) {
                                        var data = records[0].data;

                                        var progressbars = panel.query('progressbar');
                        
                                            
                                            Ext.Array.each(progressbars, function (progressbar, index) {
                                                switch (index) {
                                                    case 0: 
                                                    var percentage = data.tasks_by_document / data.total_tasks
                                                        progressbar.setValue(percentage);
                                                        break;
                                                };
                                                
                                            });
                    
                                        var tasksissued = panel.down('#tasksissued');
                                        var taskscompleted = panel.down('#taskscompleted');
                    
                                
                                        if (tasksissued) {
                                            tasksissued.setHtml(
                                                `<div style="font-size: 24px; color: #3b82f6;padding:10px 0;">${data.total_tasks}</div>`
                                            );
                                        } else {
                                            console.warn('released version component not found!');
                                        }
                    
                                        if (taskscompleted) {
                                            taskscompleted.setHtml(
                                                `<div style="font-size: 24px; color: #333;padding:10px 0;">${data.completed_tasks}</div>` 
                                            );
                                        } else {
                                            console.warn('Total Licenses component not found!');
                                        }
                                    } else {
                                        console.error('Failed to load data from the store.');
                                    }
                                }
                            })
                        }
                    },
                    items: [{
                        width: '100%',
                        flex: 1,
                        bodyPadding: 25,
                        items: [{
                            xtype: 'component',
                            html: '<div style="font-size: 14px; color: #666;">Tasks Issued</div>'
                        }, {
                            xtype: 'component',
                            itemId: 'tasksissued',
                            html: '<div style="font-size: 24px; color: #3b82f6;padding:10px 0;">0</div>'
                        }],
                        style: {
                            'border-right': '1px solid #e9ecef'
                        },
                    },
                    {
                        width: '100%',
                        flex: 1,
                        bodyPadding: 25,
                        items: [{
                            xtype: 'component',
                            html: '<div style="font-size: 14px; color: #666;">Completed</div>'
                        }, {
                            xtype: 'component',
                            itemId: 'taskscompleted',
                            html: '<div style="font-size: 24px; color: #333;padding:10px 0;">0</div>'
                        }]

                    }]
                }, 
                {
                    items: [
                        {
                        listeners: {
                            afterrender: function (panel) {
                                
                                var store = Ext.create('Ext.data.Store', {
                                    proxy: {
                                        type: 'ajax',
                                        url: 'dashboard/getDashboardStats',
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'data',
                                        },
                                    },
                                });
                
                
                                store.load({
                                    callback: function (records, operation, success) {
                
                                        if (success && records.length > 0) {
                                            var data = records[0].data;
                
                                            var progressbars = panel.up().query('progressbar');
                
                                            Ext.Array.each(progressbars, function (progressbar, index) {
                                                switch (index) {
                                                    case 0:
                                                        var percentage = data.tasks_by_document / data.total_tasks;
                                                        progressbar.setValue(percentage);
                                                        // progressbar.setText(
                                                        //     `${Math.round(percentage * 100)}% Completed`
                                                        // ); // Optionally set progress text
                                                        break;
                                                    case 1:
                                                        var percentage = data.tasks_by_issue / data.total_tasks;
                                                        progressbar.setValue(percentage);
                                                        // progressbar.setText(
                                                        //     `${Math.round(percentage * 100)}% Completed`
                                                        // ); // Optionally set progress text
                                                        break;
                                                    case 2:
                                                        var percentage = data.tasks_by_audit / data.total_tasks;
                                                        progressbar.setValue(percentage); 
                                                        // progressbar.setText(
                                                        //     `${Math.round(percentage * 100)}% Completed`
                                                        // ); // Optionally set progress text
                                                        break;

                                                }

                                                var value = progressbar.getValue();

                                                        if(value < 0.3){
                                                            color = 'red';
                                                        } else if( value <= 0.7){
                                                            color = 'orange';
                                                        } else {
                                                            color = 'green';
                                                        }
                                                        //var color = value < 0.3 ? 'red' : (value < 0.8 ? 'orange' : 'green');
                                                        if (progressbar && progressbar.bar) {
                                                            var bar = progressbar.bar; 
                                                            
                                                                Ext.get(bar.dom).setStyle({
                                                                    'background-color': color,  
                                                                    'border-radius': '20px',   
                                                                    'height': '20px'          
                                                                });
                                                            
                                                        } else {
                                                            console.error('Progress bar or its inner bar element is not available.');
                                                        }
                                            });

                                            // var tasksbydocument = panel.down('#tasksbydocument');
                                            // tasksbydocument.setText(
                                            //     `<div style="font-size: 24px; color: #3b82f6;padding:10px 0;">${Math.round(percentage * 100)} % completed</div>`
                                            // );
                                        } else {
                                            console.error('Failed to load data from the store.');
                                        }
                                    },
                                });
                            },
                        }, 
                    },
                    {
                        xtype: 'component',
                        html: '<div style="font-size: 16px; text-align: left;">Tasks by Document</div>',
                        margin: '10 30 0',
                        
                    },
                    {
                        xtype: 'progressbar',
                        itemId: 'tasksbydocument',
                        text: '',
                        height: 20,
                        margin: '10 30 5',
                        flex: 1,
                        value: 0,
                        cls: 'cls-progress-bar',
                        style: {
                            'border-radius': '5px',
                            
                        },
                    },
                    // {
                    //     xtype: 'component',
                    //     html: '<div style="font-size: 16px; text-align: left;">Tasks by Issue</div>',
                    //     margin: '10 30 0',
                        
                    // },
                    // {
                    //     xtype: 'progressbar',
                    //     itemId: 'tasksbyissue',
                    //     text: '',
                    //     height: 20,
                    //     margin: '10 30 5',
                    //     flex: 1,
                    //     value: 0,
                    //     cls: 'cls-progress-bar',
                    //     style: {
                    //         'border-radius': '5px',
                    //     },
                    // },
                    // {
                    //     xtype: 'component',
                    //     html: '<div style="font-size: 16px; text-align: left;">Tasks by Audit</div>',
                    //     margin: '10 30 0',
                        
                    // },
                    // {
                    //     xtype: 'progressbar',
                    //     itemId: 'tasksbyaudit',
                    //     text: '',
                    //     height: 20,
                    //     margin: '10 30 5',
                    //     flex: 1,
                    //     value: 0,
                    //     cls: 'cls-progress-bar',
                    //     style: {
                    //         'border-radius': '5px',
                    //     },
                    // },

                       
                ],
                },

                {// tasks clearers
                    items: [{
                        xtype: 'container',
                        width: '100%',
                        bodyPadding: 30,
                        flex: 1,
                        height: '100%',
                        items: [{
                            xtype: 'component',
                            html: '<div style="font-size: 16px; text-align: left;">Top 5 - Task Clearers</div>',
                            margin: '10 30 0',
                            padding: '30 0 30 0',
                            style: {
                                'text-align': 'start',
                                'border-bottom': '1px solid #e2e3e4'
                            },
                        }, {
                            items: [{
                                xtype: 'grid',
                                // width: '100%',
                                flex: 1,
                                margin: '10 30 0',
                                padding: '30 0 30 0',
                                listeners: {
                                    beforerender: {
                                        fn: 'setCompStore',
                                        config: {
                                            proxy: {
                                                url: 'dashboard/getTopClearers',
                                    
                                            }
                                        },
                                        isLoad: true
                                    },
                                },
                                // store: {
                                //     fields: ['user', 'tasks', 'percentage', 'activity'],
                                //     data: [
                                //         {
                                //             user: 'Maregere, Nyasha',
                                //             tasks: '1',
                                //             percentage: 0.0,
                                //             activity: 1408
                                //         },
                                //         {
                                //             user: 'Wells, Simon',
                                //             tasks: '10',
                                //             percentage: 0.1,
                                //             activity: 1192
                                //         },
                                //         {
                                //             user: 'Wells, Simon',
                                //             tasks: '10',
                                //             percentage: 0.1,
                                //             activity: 1192
                                //         }
                                //     ]
                                // },
                                columns: [
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Users',
                                        dataIndex: 'user',
                                        flex: 1,
                                        tdCls: 'wrap',
                                        
                                        renderer: function (value) {
                                            return '<div style="display: flex; align-items: center;"><div style="width: 24px; height: 24px; background-color: #666; border-radius: 50%; margin-right: 10px; display: flex; align-items: center; justify-content: center;"><i class="x-fa fa-user" style="color: #fff;"></i></div>' + value + '</div>';
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        //text: 'Users',
                                        dataIndex: 'last_name',
                                        flex: 1,
                                        //tdCls: 'wrap',
                                        renderer: function (value) {
                                            return '<div style="display: flex; align-items: left;"><div style="width: 24px; height: 24px; border-radius: 50%; margin-right: 10px; display: flex; align-items: left; justify-content: left;"></div>' + value + '</div>';
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Total (%)',
                                        dataIndex: 'tasks',
                                        flex: 2,
                                        tdCls: 'wrap',
                                        padding: '4 0 4 0',
                                        renderer: function (value, metaData, record) {
                                            var percentage = record.get('percentage') * 100;
                                            return '<div class="display:flex;flex-direction:column;"><div class="font-size:14px;color:#444141;font-weight:600;">' + value + ' Tasks Completed (' + (Math.round(percentage)) + '% of all tasks)</div><div style="margin-top: 5px; background-color: #e9ecef; border-radius: 6px; height: 16px;"><div style="width: ' + (Math.round(percentage)) + '%; background-color: #3b82f6; border-radius: 6px; height: 100%;"></div></div></div>';
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Activity',
                                        dataIndex: 'activity',
                                        flex: 1,
                                        tdCls: 'wrap',
                                        renderer: function (value) {
                                            if (value < 1){
                                                return ' Today';
                                            } else{
                                                return value + ' day(s) ago';
                                            }
                                            
                                        }
                                    }

                                ]
                            }]

                        }]

                    }]

                }]
            }]

        },
    ],
    
    bbar: [{
        xtype: 'pagingtoolbar',
        displayInfo: true,
        width: '85%',
        displayMsg: 'version 1.1.0',
        emptyMsg: 'No Records',
        beforeLoad: function () {
            return;
        }
    },
    {
        xtype: 'exportbtn'
    }]
});