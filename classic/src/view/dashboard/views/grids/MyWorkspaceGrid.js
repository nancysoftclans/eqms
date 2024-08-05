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
            region: 'north',
            // height: 00,
            layout: 'hbox',
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
                                value: 0.2,
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
                                value: 0.7,
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
                                value: 0.17,
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
                                value: 0.63,
                                text: '',
                                cls: 'cls-progress-bar'
                            }]
                        }],
                        listeners: {
                            afterrender: function (panel) {
                                // Set the custom style for the progress bar
                                var progresbars = panel.query('progressbar');
                                Ext.Array.each(progresbars, function (progresbar) {
                                    progresbar.setStyle({
                                        'background-color': '#e9ecef', // Background color for the bar
                                        'border-radius': '5px',
                                        // 'height': '20px',
                                    });
                                })

                            }
                        }
                    }]
                }, { // user details|licenses
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
                    items: [{
                        width: '100%',
                        flex: 1,
                        bodyPadding: 25,
                        items: [{
                            xtype: 'component',
                            html: '<div style="font-size: 14px; color: #666;">Total Users</div>'
                        }, {
                            xtype: 'component',
                            html: '<div style="font-size: 24px; color: #3b82f6;padding:10px 0;">84</div>'
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
                            html: '<div style="font-size: 24px; color: #333;padding:10px 0;">117</div>'
                        }]

                    }]
                }]
            }]

        }, {
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
                    xtype: 'linearchart',
                    width: '100%',
                    padding: '0 0 10 0'
                }, {
                    items: [{
                        xtype: 'component',
                        html: '<div style="font-size: 16px; text-align: left;">documents Released</div>',
                        margin: '4 30 0',
                        padding: '10 0 10 10',
                    }, {
                        xtype: 'component',
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
                        value: 0.2,
                        cls: 'cls-progress-bar'
                    }]

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
        }, {// tasks analysis
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
                    items: [{
                        width: '100%',
                        flex: 1,
                        bodyPadding: 25,
                        items: [{
                            xtype: 'component',
                            html: '<div style="font-size: 14px; color: #666;">Tasks Issued</div>'
                        }, {
                            xtype: 'component',
                            html: '<div style="font-size: 24px; color: #3b82f6;padding:10px 0;">600</div>'
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
                            html: '<div style="font-size: 24px; color: #333;padding:10px 0;">117</div>'
                        }]

                    }]
                }, {
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
                        value: 0.1,
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
                                store: {
                                    fields: ['user', 'tasks', 'percentage', 'activity'],
                                    data: [
                                        {
                                            user: 'Maregere, Nyasha',
                                            tasks: '1',
                                            percentage: 0.0,
                                            activity: 1408
                                        },
                                        {
                                            user: 'Wells, Simon',
                                            tasks: '10',
                                            percentage: 0.1,
                                            activity: 1192
                                        },
                                        {
                                            user: 'Wells, Simon',
                                            tasks: '10',
                                            percentage: 0.1,
                                            activity: 1192
                                        }
                                    ]
                                },
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
                                            return value + '<div class="display:flex;flex-direction:column;"><div class="font-size:14px;color:#444141;font-weight:600;">' + value + ' Tasks Completed (' + percentage + ' of all tasks)</div><div style="margin-top: 5px; background-color: #e9ecef; border-radius: 6px; height: 16px;"><div style="width: ' + percentage + '%; background-color: #3b82f6; border-radius: 6px; height: 100%;"></div></div></div>';
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