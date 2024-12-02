Ext.define('Admin.view.dashboard.views.charts.LineChart', {
    extend: 'Ext.panel.Panel',
    xtype: 'linechart',
    scrollable: true,

    requires: ['Ext.chart.CartesianChart', 'Ext.chart.axis.Category', 'Ext.chart.axis.Numeric', 'Ext.chart.interactions.PanZoom', 'Ext.chart.series.Line', 'Admin.store.dashboard.UserAnalysisStr'],
    controller: 'dashboardvctr',
    // getDataForChart: function () {
    //     var data = {

    //         "name": "Brand",
    //         "value": 597,
    //         "color": "#028D99",
    //         "total": 1000,
    //     };
    //     console.log(data);
    //     return this.updatePercentData(data);
    // },
    // updatePercentData: function (data) {
    //     var dataVal = []

    //     title = data.name
    //     value = data.value
    //     total = data.total

    //     percent = value / total * 100;

    //     dataVal.push({
    //         GroupName: title,
    //         GroupData: percent.toFixed(2)
    //     })

    //     return dataVal;


    //},

    items: [
        {
            xtype: 'container',
            layout: 'fit',
            width: '100%',
            height: 350,
            scrollable: 'x', 
            items: [{
                xtype: 'cartesian',
                width: '200%',
                height: 300,
                padding: '10',
                insetPadding: '10 30 0 5',
                // store: {
                //     type: 'useranalysisstore'
                // },
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    grid: true,
                    minimum: 0
                }, {
                    type: 'category',
                    position: 'bottom',
                    grid: true,
                    fields: ['month'],
                    // label: {
                    //     rotate: {
                    //         degrees: -45 // Rotate labels for better readability
                    //     }
                    // }
                }],
                series: [
                //     {
                //     type: 'line',
                //     xField: 'date',
                //     yField: 'totalLogins',
                //     title: 'Total Logins',
                //     smooth: true,
                //     style: {
                //         lineWidth: 2,
                //         strokeStyle: '#666'
                //     },
                //     marker: {
                //         radius: 4,
                //         fillStyle: '#666',
                //     },
                //     tooltip:{
                //         renderer:function(tooltip, model, item){
                //             tooltip.setHtml(model.get(item.field) + ' total logins');
                //         }
                //     }, 

                // }, 
                {
                    type: 'line',
                    xField: 'month',
                    yField: 'total_documents',
                    title: 'total_documents',
                    smooth: true,
                    style: {
                        lineWidth: 2,
                        strokeStyle: '#999'
                    },
                    marker: {
                        radius: 4,
                        fillStyle: '#999'
                    },
                    tooltip:{
                        renderer:function(tooltip, model, item){
                            tooltip.setHtml(model.get(item.field) + ' documents');
                        }
                    }, 
                }, 
                //{
                //     type: 'line',
                //     xField: 'date',
                //     yField: 'devicesUsed',
                //     title: 'Devices Used',
                //     smooth: true,
                //     style: {
                //         lineWidth: 2,
                //         strokeStyle: '#ccc'
                //     },
                //     marker: {
                //         radius: 4,
                //         fillStyle: '#ccc'
                //     }
                // }
            ],
                interactions: 'panzoom', 
                scrollable: 'x',
                
                listeners: {
                    afterrender: function(chart) {
                        
                        chart.setHeight(300);
                         
                    }
                },
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 10000,
                            proxy: {
                                url: 'dashboard/getDocumentAnalysis',
                                
                            }
                        },
                        isLoad: true
                    },
                },
            }]
        }
    ]
    

});

