Ext.define('Admin.view.dashboard.views.charts.DocumentLineChart', {
    extend: 'Ext.Panel',
    xtype: 'documentchart',
    scrollable: true,

    requires: ['Ext.chart.CartesianChart', 'Ext.chart.axis.Category', 'Ext.chart.axis.Numeric', 'Ext.chart.interactions.PanZoom', 'Ext.chart.series.Line', 'Admin.store.dashboard.UserAnalysisStr'],
    controller: 'dashboardvctr',

    width: 500,

    items: {
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 500,
        interactions: {
            type: 'panzoom',
            zoomOnPanGesture: true
        },
        animation: {
            duration: 200
        },
        // store: {
        //     type: 'useranalysisstore'
        // },
        innerPadding: {
            left: 40,
            right: 40
        },
        captions: {
            title: 'User Analysis',
            // credits: {
            //     text: 'Data: Browser Stats 2012\nSource: http://www.w3schools.com/',
            //     align: 'left'
            // }
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            grid: true,
            minimum: 0,
            //maximum: 24,
            //renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            position: 'bottom',
            grid: true,
            fields: ['date'],
            // label: {
            //     rotate: {
            //         degrees: -45
            //     }
            // }
        }],
        series: [{
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
            label: {
                field: 'total_documents',
                display: 'over'
            },
            highlight: {
                fillStyle: '#000',
                radius: 5,
                lineWidth: 2,
                strokeStyle: '#fff'
            },
            tooltip:{
                renderer:function(tooltip, model, item){
                    tooltip.setHtml(model.get(item.field) + ' Logged In');
                }
            }, 
            // tooltip: {
            //     trackMouse: true,
            //     showDelay: 0,
            //     dismissDelay: 0,
            //     hideDelay: 0,
            //     //renderer: 'onSeriesTooltipRender'
            // }
        }],
        listeners: {
            itemhighlight: 'onItemHighlight',
            
        },
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'dashboard/getUserAnalysis',
                        // extraParams :{
                        //     table_name:'wf_workflow_stages'
                        // }
                    }
                },
                isLoad: true
            },
        },
    },

    tbar: ['->', {
        text: 'Preview',
        handler: 'onPreview'
    }]

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

