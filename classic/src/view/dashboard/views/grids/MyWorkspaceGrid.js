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


    // requires: ['Admin.view.dashboard.views.charts.CustomProgressBar'],
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
        
                                            // Update components data
                                            panel.down('#lasthourlogin').setHtml(`<div style="font-size: 24px; color: #666; padding: 10px 0;">${data.user_stats.loggedlasthour}</div>`);
                                            panel.down('#totalusers').setHtml(`<div style="font-size: 24px; color: #666; padding: 10px 0;">${data.user_stats.totalUsers}</div>`);
                                            panel.down('#groupedusers').setHtml(`<div style="font-size: 24px; color: #666; padding: 10px 0;">${data.user_stats.groupswithusers}</div>`);
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
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #666;">Users Logged in in last 1 hour</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'lasthourlogin',
                                                html: '<div style="font-size: 24px; color: #666; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            //'background': '#3b82f6',
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
                                                html: '<div style="font-size: 14px; color: #666;">Total Users</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'totalusers',
                                                html: '<div style="font-size: 24px; color: white; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            //'background': '#3b82f6',
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
                                                html: '<div style="font-size: 14px; color: #666;">Groups with users</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'groupedusers',
                                                html: '<div style="font-size: 24px; color: white; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            //'background': '#3b82f6',
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
                        items: [{ //each container resp card
                            
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
                                // Get the store instance (ensure the store is defined in your app)
                                // var userStatsStore = Ext.getStore('userstatsstore'); // Replace with your actual store ID
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
                                console.log(store);
                                // Load the store's data
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
                                                        console.log(data.neverLoggedIn);
                                                        break;
                                                    case 3: // Licensed Users
                                                        progressbar.setValue(data.user_stats.activeusers / data.user_stats.totalUsers);
                                                        break;
                                                }
                                            });
                        
                                            
                                            Ext.Array.each(progressbars, function (progressbar) {
                                                progressbar.setStyle({
                                                    'background-color': '#e9ecef',
                                                    'border-radius': '5px',
                                                });
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
                            console.log('Panel rendered.');
                    
                            // Create the store instance
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
                    
                            console.log('Store created:', store);
                    
                            // Load the store's data
                            store.load({
                                callback: function (records, operation, success) {
                                    console.log('Store loaded:', { records, success });
                    
                                    if (success && records.length > 0) {
                                        var data = records[0].data;
                    
                                        // Debugging the loaded data
                                        console.log('Loaded data:', data);
                    
                                        // Locate the components by itemId
                                        var totalUsersComponent = panel.down('#totalUsersDisplay');
                                        var totalLicensesComponent = panel.down('#totalLicensesDisplay');
                    
                                        // Debugging the located components
                                        console.log('Total Users Component:', totalUsersComponent);
                                        console.log('Total Licenses Component:', totalLicensesComponent);
                    
                                        // Update the components if found
                                        if (totalUsersComponent) {
                                            totalUsersComponent.setHtml(
                                                `<div style="font-size: 24px; color: #3b82f6;padding:10px 0;">${data.user_stats.totalUsers}</div>`
                                            );
                                        } else {
                                            console.warn('Total Users component not found!');
                                        }
                    
                                        if (totalLicensesComponent) {
                                            totalLicensesComponent.setHtml(
                                                `<div style="font-size: 24px; color: #333;padding:10px 0;">${data.user_stats.activeusers}</div>` // Same value as totalUsers
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
                    
                    items: [{
                        
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

                    }]
                }]
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
                        afterrender: function(panel){
                            console.log('Panel rendered.');
                    
                            // Create the store instance
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
                    
                            console.log('Store created:', store);
                    
                            // Load the store's data
                            store.load({
                                callback: function (records, operation, success) {
                                    console.log('Store loaded:', { records, success });
                    
                                    if (success && records.length > 0) {
                                        var data = records[0].data;
                    
                                        // Debugging the loaded data
                                        console.log('Loaded data:', data);
                                        var progressbars = panel.query('progressbar');
                        
                                            
                                            Ext.Array.each(progressbars, function (progressbar, index) {
                                                switch (index) {
                                                    case 0: // Active Last 30 Days
                                                    var percentage = data.document_analysis.released / data.document_analysis.total_documents
                                                        progressbar.setValue(percentage);
                                                        break;
                                                }
                                            })
                                        // Locate the components by itemId
                                        var releasedversion = panel.down('#releasedversion');
                                        console.log('released version:', releasedversion);
                                        if (releasedversion) {
                                            releasedversion.setHtml(
                                                `<div style="font-size: 16px; text-align: left;">${data.document_analysis.released} Version (${(data.document_analysis.released/data.document_analysis.total_documents)*100}%)</div>`
                                            );
                                        } else {
                                            console.warn('released version component not found!');
                                        }
                    
                                    } else {
                                        console.error('Failed to load data from the store.');
                                    }
                                }
                            })
                        }
                    },
                    items: [{
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
                        cls: 'cls-progress-bar'
                    }
                ]

                }],
                listeners: {
                    afterrender: function (panel) {
                        // Set the custom style for the progress bar
                        panel.down('progressbar').setStyle({
                            'background-color': '#e9ecef', // Background color for the bar
                            'border-radius': '10px',
                            'height': '20px',
                        });
                    }
                }

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
        
                                            // Update components data
                                            panel.down('#documentslive').setHtml(`<div style="font-size: 24px; color: #666; padding: 10px 0;">${data.documents_live}</div>`);
                                            panel.down('#overduedocuments').setHtml(`<div style="font-size: 24px; color: #666; padding: 10px 0;">${data.overdue_documents}</div>`);
                                            panel.down('#averagetime').setHtml(`<div style="font-size: 24px; color: #666; padding: 10px 0;">${data.average_acknowledgment_time} hours</div>`);
                                            panel.down('#overduedocumenttasks').setHtml(`<div style="font-size: 24px; color: #666; padding: 10px 0;">${data.overdue_document_tasks}</div>`);
                                            panel.down('#issued').setHtml(`<div style="font-size: 24px; color: #666; padding: 10px 0;">${data.issued_document_tasks}</div>`);
                                            panel.down('#completed').setHtml(`<div style="font-size: 24px; color: #666; padding: 10px 0;">${data.completed_document_tasks}</div>`);
                                            panel.down('#upcomingreviews').setHtml(`<div style="font-size: 24px; color: #666; padding: 10px 0;">${data.upcoming_document_reviews}</div>`);
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
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #666;">Documents Live</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'documentslive',
                                                html: '<div style="font-size: 24px; color: #666; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            //'background': '#3b82f6',
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
                                                html: '<div style="font-size: 14px; color: #666;">Overdue Documents</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'overduedocuments',
                                                html: '<div style="font-size: 24px; color: white; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            //'background': '#3b82f6',
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
                                                html: '<div style="font-size: 14px; color: #666;">Overdue Document Tasks</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'overduedocumenttasks',
                                                html: '<div style="font-size: 24px; color: white; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            //'background': '#3b82f6',
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
                                                html: '<div style="font-size: 14px; color: #666;">Issued Document Tasks</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'issued',
                                                html: '<div style="font-size: 24px; color: white; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            //'background': '#3b82f6',
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
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '<div style="font-size: 14px; color: #666;">Completed Document Tasks</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'completed',
                                                html: '<div style="font-size: 24px; color: white; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            //'background': '#3b82f6',
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
                                                html: '<div style="font-size: 14px; color: #666;">Upcoming Document Reviews</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'upcomingreviews',
                                                html: '<div style="font-size: 24px; color: white; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            //'background': '#3b82f6',
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
                                                html: '<div style="font-size: 14px; color: #666;">Average Time For Document Acknowledgement</div>'
                                            },
                                            {
                                                xtype: 'component',
                                                itemId: 'averagetime',
                                                html: '<div style="font-size: 24px; color: white; padding: 10px 0;">0</div>'
                                            }
                                        ],
                                        style: {
                                            'border': '1px solid #e9ecef',
                                            //'background': '#3b82f6',
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
                            console.log('Panel rendered.');
                    
                            // Create the store instance
                            var store = Ext.create('Ext.data.Store', {
                                //model: 'Admin.model.dashboard.userStatsMdl',
                                proxy: {
                                    type: 'ajax',
                                    url: 'dashboard/getDashboardStats',
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'data'
                                    }
                                }
                            });
                    
                            console.log('Store created:', store);
                    
                            // Load the store's data
                            store.load({
                                callback: function (records, operation, success) {
                                    console.log('Store loaded:', { records, success });
                    
                                    if (success && records.length > 0) {
                                        var data = records[0].data;
                    
                                        // Debugging the loaded data
                                        console.log('Loaded data:', data);
                        
                                        // Locate the components by itemId
                                        var tasksissued = panel.down('#tasksissued');
                                        var taskscompleted = panel.down('#taskscompleted');
                    
                                        // Debugging the located components
                                        //console.log('released version:', releasedversion);
                                        //console.log('Total Licenses Component:', totalLicensesComponent);
                    
                                        // Update the components if found
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
                    items: [{
                        xtype: 'component',
                        html: '<div style="font-size: 16px; text-align: left;">Tasks by Document</div>',
                        margin: '10 30 0',
                    },
                    {
                        xtype: 'progressbar',

                        text: '',
                        height: 20,
                        margin: '10 30 5',
                        // padding: 5,
                        // width: '80%',
                        flex: 1,
                        value: 0,
                        cls: 'cls-progress-bar',
                        style: {
                            'border-radius': '5px'
                        }
                    }]

                }, {// tasks clearers
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
                                                // extraParams :{
                                                //     table_name:'wf_workflow_stages'
                                                // }
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
                                        text: 'Total (%)',
                                        dataIndex: 'tasks',
                                        flex: 2,
                                        tdCls: 'wrap',
                                        padding: '4 0 4 0',
                                        renderer: function (value, metaData, record) {
                                            var percentage = record.get('percentage') * 100;
                                            return '<div class="display:flex;flex-direction:column;"><div class="font-size:14px;color:#444141;font-weight:600;">' + value + ' Tasks Completed (' + percentage + ' of all tasks)</div><div style="margin-top: 5px; background-color: #e9ecef; border-radius: 6px; height: 16px;"><div style="width: ' + percentage + '%; background-color: #3b82f6; border-radius: 6px; height: 100%;"></div></div></div>';
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        text: 'Activity',
                                        dataIndex: 'activity',
                                        flex: 1,
                                        tdCls: 'wrap',
                                        renderer: function (value) {
                                            return value + ' day(s) ago';
                                        }
                                    }

                                ]
                            }]

                        }]

                    }]

                }]
            }]

        }
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