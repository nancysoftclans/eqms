Ext.define('Admin.view.dashboard.views.charts.line', {
    extend: 'Ext.Panel',
    xtype: 'line',
    scrollable: true,

    requires: ['Ext.chart.CartesianChart', 'Ext.chart.axis.Category', 'Ext.chart.axis.Numeric', 'Ext.chart.interactions.PanZoom', 'Ext.chart.series.Line', 'Admin.store.dashboard.UserAnalysisStr'],
    controller: 'dashboardvctr',

    width: 650,

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
            //title: 'Document Analysis',
            // credits: {
            //     text: '',
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
            fields: ['month'],
            // label: {
            //     rotate: {
            //         degrees: -45
            //     }
            // }
        }],
        series: [{
            type: 'line',
            xField: 'month',
            yField: 'total_documents',
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
                    tooltip.setHtml(model.get(item.field) + ' Documents waiting review');
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
                        url: 'dashboard/getDocumentAnalysis',
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