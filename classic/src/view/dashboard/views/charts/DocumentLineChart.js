Ext.define('Admin.view.dashboard.views.charts.DocumentLineChart', {
    extend: 'Ext.panel.Panel',
    xtype: 'documentchart',
    scrollable: true,

    requires: ['Ext.chart.CartesianChart', 'Ext.chart.axis.Category', 'Ext.chart.axis.Numeric', 'Ext.chart.interactions.PanZoom', 'Ext.chart.series.Line'],

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


    // },

    items: [{
        xtype: 'cartesian',
        width: '100%',
        height: 300,
        padding: '10',
        insetPadding: '10 30 0 5',
        store: {
            fields: ['date', 'value1', 'value2', 'value3'],
            data: [

                { date: 'Dec 2020', value1: 5, value2: 6, value3: 1 },
                { date: 'Mar 2021', value1: 7, value2: 4, value3: 1 },
                { date: 'Jun 2021', value1: 8, value2: 3, value3: 1 },
                { date: 'Sep 2021', value1: 9, value2: 2, value3: 2 },
                { date: 'Dec 2021', value1: 10, value2: 5, value3: 1 },
                { date: 'Mar 2022', value1: 12, value2: 8, value3: 1 },
                { date: 'Jun 2022', value1: 6, value2: 1, value3: 3 },
                { date: 'Sep 2022', value1: 3, value2: 2, value3: 2 },
                { date: 'Dec 2022', value1: 13, value2: 2, value3: 1 }

            ]
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            grid: true,
            minimum: 0,
            // fields: [
            //     'value1',
            // ]

        }, {
            type: 'category',
            position: 'bottom',
            grid: true,
            fields: [
                'date'
            ]

        }],
        series: [{
            type: 'line',
            xField: 'date',
            yField: 'value1',
            smooth: true,
            style: {
                lineWidth: 2,
                strokeStyle: '#666'
            },
            marker: {
                radius: 4,
                fillStyle: '#666'
            }
        }, {
            type: 'line',
            xField: 'date',
            yField: 'value2',
            smooth: true,
            style: {
                lineWidth: 2,
                strokeStyle: '#999'
            },
            marker: {
                radius: 4,
                fillStyle: '#999'
            }
        }, {
            type: 'line',
            xField: 'date',
            yField: 'value3',
            smooth: true,
            style: {
                lineWidth: 2,
                strokeStyle: '#ccc'
            },
            marker: {
                radius: 4,
                fillStyle: '#ccc'
            }
        }],
        interactions: 'panzoom'


    }],

});

