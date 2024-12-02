Ext.define('Admin.view.dashboard.views.charts.DocumentLineChart', {
    extend: 'Ext.Panel',
    xtype: 'documentchart',
    scrollable: true,

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.series.Line',
        'Admin.store.dashboard.UserAnalysisStr'
    ],
    controller: 'dashboardvctr',

    width: 700,

    items: {
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 400,
        interactions: {
            type: 'panzoom',
            zoomOnPanGesture: true
        },
        animation: {
            duration: 200
        },
        innerPadding: {
            left: 40,
            right: 40
        },
        // captions: {
        //     title: 'User Analysis'
        // },
        axes: [
            {
                type: 'numeric',
                position: 'left',
                grid: true,
                minimum: 0
            },
            {
                type: 'category',
                position: 'bottom',
                grid: true,
                fields: ['date']
            }
        ],
        series: [
            {
                type: 'line',
                xField: 'date',
                yField: 'uniqueUsers',
                smooth: true,
                style: {
                    lineWidth: 2,
                    strokeStyle: '#999'
                },
                marker: {
                    radius: 4,
                    lineWidth: 2
                },
                // label: {
                //     field: 'totalLogins',
                //     display: 'over'
                // },
                highlight: {
                    fillStyle: '#000',
                    radius: 5,
                    lineWidth: 2,
                    strokeStyle: '#fff'
                },
                tooltip: {
                    renderer: function (tooltip, model, item) {
                        tooltip.setHtml(
                            `Date: ${model.get('date')}<br>Logged in Users: ${model.get('uniqueUsers')}`
                        );
                    }
                }
            }
        ],
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'dashboard/getUserAnalysis'
                    }
                },
                isLoad: true
            }
        }
    },

    tbar: [
        {
            xtype: 'combobox',
            fieldLabel: 'Select Year',
            reference:'yearFilter',
            labelAlign: 'right',
            store: Ext.create('Ext.data.Store', {
                fields: ['year'],
                data: (function () {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    for (let i = currentYear; i >= currentYear - 10; i--) {
                        years.push({ year: i });
                    }
                    return years;
                })()
            }),
            queryMode: 'local',
            displayField: 'year',
            valueField: 'year',
            default:'2024',
            listeners: {
                select: function (combo, record) {
                    const year = record.get('year');
                    const chart = combo.up('panel').down('cartesian');
                    const store = chart.getStore();
                    store.getProxy().setExtraParams({ year: year });
                    store.load();
                }
            },
            style:{
                height: '25px',
                width: '200px',
            }
        },
        {
            xtype: 'combobox',
            fieldLabel: 'Select Month',
            reference: 'monthFilter',
            labelAlign: 'right',
            store: Ext.create('Ext.data.Store', {
                fields: ['month', 'name'],
                data: [
                    { month: 1, name: 'January' },
                    { month: 2, name: 'February' },
                    { month: 3, name: 'March' },
                    { month: 4, name: 'April' },
                    { month: 5, name: 'May' },
                    { month: 6, name: 'June' },
                    { month: 7, name: 'July' },
                    { month: 8, name: 'August' },
                    { month: 9, name: 'September' },
                    { month: 10, name: 'October' },
                    { month: 11, name: 'November' },
                    { month: 12, name: 'December' }
                ]
            }),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'month',
            listeners: {
                select: function (combo, record) {
                    const month = record.get('month');
                    const chart = combo.up('panel').down('cartesian');
                    const store = chart.getStore();
                    store.getProxy().setExtraParams({ month: month });
                    store.load();
                }
            },
            style:{
                height: '25px',
                width: '200px',
            }
        },
        {
            xtype: 'datefield',
            fieldLabel: 'Start Date',
            reference: 'startDateFilter',
            labelAlign: 'right',
            format: 'Y-m-d',
            listeners: {
                change: function (field, newValue) {
                    const chart = field.up('panel').down('cartesian');
                    const store = chart.getStore();
                    const params = store.getProxy().getExtraParams();
                    params.start_date = Ext.Date.format(newValue, 'Y-m-d');
                    store.load();
                }
            },
            style:{
                height: '25px',
                width: '200px',
            }
        },
        {
            xtype: 'datefield',
            fieldLabel: 'End Date',
            reference: 'endDateFilter',
            labelAlign: 'right',
            format: 'Y-m-d',
            listeners: {
                change: function (field, newValue) {
                    const chart = field.up('panel').down('cartesian');
                    const store = chart.getStore();
                    const params = store.getProxy().getExtraParams();
                    params.end_date = Ext.Date.format(newValue, 'Y-m-d');
                    store.load();
                }
            },
            style:{
                height: '25px',
                width: '200px',
            }
        },
        {
            text: 'Clear',
            handler: function (btn) {
                const panel = btn.up('panel');
                const chart = panel.down('cartesian');
                const store = chart.getStore();

               
                panel.down('[reference=yearFilter]').reset();
                panel.down('[reference=monthFilter]').reset();
                panel.down('[reference=startDateFilter]').reset();
                panel.down('[reference=endDateFilter]').reset();

                store.getProxy().setExtraParams({});
                store.load();
            },
            style:{
                height: '25px',
                width: '100px',
                background: 'red'
            }
        },
        '->',
        {
            text: 'Preview',
            handler: 'onPreview'
        }
    ]
});




// Ext.define('Admin.view.dashboard.views.charts.DocumentLineChart', {
//     extend: 'Ext.panel.Panel',
//     xtype: 'documentchart',
//     scrollable: true,

//     requires: ['Ext.chart.CartesianChart', 'Ext.chart.axis.Category', 'Ext.chart.axis.Numeric', 'Ext.chart.interactions.PanZoom', 'Ext.chart.series.Line', 'Admin.store.dashboard.UserAnalysisStr'],
//     controller: 'dashboardvctr',
//     // getDataForChart: function () {
//     //     var data = {

//     //         "name": "Brand",
//     //         "value": 597,
//     //         "color": "#028D99",
//     //         "total": 1000,
//     //     };
//     //     console.log(data);
//     //     return this.updatePercentData(data);
//     // },
//     // updatePercentData: function (data) {
//     //     var dataVal = []

//     //     title = data.name
//     //     value = data.value
//     //     total = data.total

//     //     percent = value / total * 100;

//     //     dataVal.push({
//     //         GroupName: title,
//     //         GroupData: percent.toFixed(2)
//     //     })

//     //     return dataVal;


//     //},

//     items: [
//         {
//             xtype: 'container',
//             layout: 'fit',
//             width: '100%',
//             height: 350,
//             scrollable: 'x', // Enable horizontal scrolling
//             items: [{
//                 xtype: 'cartesian',
//                 width: '200%', // Set width to be larger than container to enable scrolling
//                 height: 300,
//                 padding: '10',
//                 insetPadding: '10 30 0 5',
//                 store: {
//                     type: 'useranalysisstore'
//                 },
//                 axes: [{
//                     type: 'numeric',
//                     position: 'left',
//                     grid: true,
//                     minimum: 0
//                 }, {
//                     type: 'category',
//                     position: 'bottom',
//                     grid: true,
//                     fields: ['date'],
//                     // label: {
//                     //     rotate: {
//                     //         degrees: -45 // Rotate labels for better readability
//                     //     }
//                     // }
//                 }],
//                 series: [
//                 //     {
//                 //     type: 'line',
//                 //     xField: 'date',
//                 //     yField: 'totalLogins',
//                 //     title: 'Total Logins',
//                 //     smooth: true,
//                 //     style: {
//                 //         lineWidth: 2,
//                 //         strokeStyle: '#666'
//                 //     },
//                 //     marker: {
//                 //         radius: 4,
//                 //         fillStyle: '#666',
//                 //     },
//                 //     tooltip:{
//                 //         renderer:function(tooltip, model, item){
//                 //             tooltip.setHtml(model.get(item.field) + ' total logins');
//                 //         }
//                 //     }, 

//                 // }, 
//                 {
//                     type: 'line',
//                     xField: 'date',
//                     yField: 'uniqueUsers',
//                     title: 'Unique Users',
//                     smooth: true,
//                     style: {
//                         lineWidth: 2,
//                         strokeStyle: '#999'
//                     },
//                     marker: {
//                         radius: 4,
//                         fillStyle: '#999'
//                     },
//                     tooltip:{
//                         renderer:function(tooltip, model, item){
//                             tooltip.setHtml(model.get(item.field) + ' Users logged in');
//                         }
//                     }, 
//                 }, 
//                 //{
//                 //     type: 'line',
//                 //     xField: 'date',
//                 //     yField: 'devicesUsed',
//                 //     title: 'Devices Used',
//                 //     smooth: true,
//                 //     style: {
//                 //         lineWidth: 2,
//                 //         strokeStyle: '#ccc'
//                 //     },
//                 //     marker: {
//                 //         radius: 4,
//                 //         fillStyle: '#ccc'
//                 //     }
//                 // }
//             ],
//                 interactions: 'panzoom', 
//                 scrollable: 'x',
//                 listeners: {
//                     afterrender: function(chart) {
                        
//                         chart.setHeight(300); 
//                     }
//                 }
//             }]
//         }
//     ]
    

// });

