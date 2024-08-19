
Ext.create('Admin.view.dashboard.views.charts.CustomProgressBar', {
    extend: 'Ext.grid.Panel',
    // renderTo: Ext.getBody(),
    xtype: 'customprogressbar',
    width: 400,
    height: 100,
    bodyPadding: 10,

    requires: ['Ext.grid.Panel'],

    items: [{
        xtype: 'progressbar',
        store: {
            fields: ['name', 'count', 'progress'],
            data: [{
                name: 'No. of users',
                count: 20,
                progress: .20
            }, {
                name: 'No. of active users',
                count: 70,
                progress: .70
            }, {
                name: 'No. of inactive users',
                count: 10,
                progress: .10
            }, {
                name: 'logged in users',
                count: 40,
                progress: .40
            }]
        },
        columns: [{
            text: 'Title',
            dataIndex: 'name',
        }, {
            text: 'Count',
            dataIndex: 'count',
        }, {
            text: 'progress',
            xtype: 'widgetcolumn',
            width: 120,
            dataIndex: 'progress',
            widget: {
                xtype: 'progress'
            }
        }]


    }],




});

