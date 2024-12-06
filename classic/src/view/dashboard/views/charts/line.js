Ext.define('Admin.view.dashboard.views.charts.line', {
    extend: 'Ext.Panel',
    xtype: 'line',
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

    width: 650,
    

    items: {
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 400,
        interactions: {
            type: 'panzoom',
            zoomOnPanGesture: false
        },
        animation: {
            duration: 200
        },
        innerPadding: {
            left: 40,
            right: 40
        },
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
                fields: ['day'] 
            }
        ],
        series: [
            {
                type: 'line',
                xField: 'day',
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
                tooltip: {
                    trackMouse: true,
                    renderer: function (tooltip, model, item) {
                        tooltip.setHtml(
                            `${model.get(item.field)} Documents waiting review`
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
                        url: 'dashboard/getDocumentAnalysis'
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
            reference: 'yearFilter',
            listeners: {
                select: function (combo, record) {
                    const year = record.get('year');
                    const chart = combo.up('panel').down('cartesian');
                    const store = chart.getStore();
                    store.getProxy().setExtraParams({ year: year });
                    store.load();
                }
            },
            style: {
                height: '25px',
                width: '200px',
                
            }
        },
        {
            xtype: 'combobox',
            fieldLabel: 'Select Month',
            labelAlign: 'right',
            store: Ext.create('Ext.data.Store', {
                fields: ['month'],
                data: [
                    { month: 'January' },
                    { month: 'February' },
                    { month: 'March' },
                    { month: 'April' },
                    { month: 'May' },
                    { month: 'June' },
                    { month: 'July' },
                    { month: 'August' },
                    { month: 'September' },
                    { month: 'October' },
                    { month: 'November' },
                    { month: 'December' }
                ]
            }),
            queryMode: 'local',
            displayField: 'month',
            valueField: 'month',
            reference: 'monthFilter',
            listeners: {
                select: function (combo, record) {
                    const month = record.get('month');
                    const chart = combo.up('panel').down('cartesian');
                    const store = chart.getStore();
                    store.getProxy().setExtraParams({ month: month });
                    store.load();
                }
            },
            style: {
                height: '25px',
                width: '200px',
            }
        },
        {
            xtype: 'combobox',
            fieldLabel: 'Select Day',
            labelAlign: 'right',
            store: Ext.create('Ext.data.Store', {
                fields: ['day'],
                data: (function () {
                    const days = [];
                    for (let i = 1; i <= 31; i++) {
                        days.push({ day: i });
                    }
                    return days;
                })()
            }),
            queryMode: 'local',
            displayField: 'day',
            valueField: 'day',
            reference: 'dayFilter',
            listeners: {
                select: function (combo, record) {
                    const day = record.get('day');
                    const chart = combo.up('panel').down('cartesian');
                    const store = chart.getStore();
                    store.getProxy().setExtraParams({ day: day });
                    store.load();
                }
            },
            style: {
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
                panel.down('[reference=dayFilter]').reset();

                store.getProxy().setExtraParams({});
                store.load();
            },
            style:{
                height: '25px',
                width: '100px',
                backgroundColor: '#e44959',
                color:'red'
            }
        },
        '->',
        {
            xtype: 'button',
            hidden: false,
            text: 'Options',
            menu: {
                xtype: 'menu',
                items: [
                    {
                        text: 'Bar',
                        handler: 'DocumentChangeChartType'
                            
                    },
                    {
                        text: 'Preview',
                        handler: 'onPreview'
                    }
                ]
            }
        }
    ]
});




// Ext.define('Admin.view.dashboard.views.charts.line', {
//     extend: 'Ext.Panel',
//     xtype: 'line',
//     scrollable: true,

//     requires: ['Ext.chart.CartesianChart', 'Ext.chart.axis.Category', 'Ext.chart.axis.Numeric', 'Ext.chart.interactions.PanZoom', 'Ext.chart.series.Line', 'Admin.store.dashboard.UserAnalysisStr'],
//     controller: 'dashboardvctr',

//     width: 650,

//     items: {
//         xtype: 'cartesian',
//         reference: 'chart',
//         width: '100%',
//         height: 500,
//         interactions: {
//             type: 'panzoom',
//             zoomOnPanGesture: true
//         },
//         animation: {
//             duration: 200
//         },
//         // store: {
//         //     type: 'useranalysisstore'
//         // },
//         innerPadding: {
//             left: 40,
//             right: 40
//         },
//         captions: {
//             //title: 'Document Analysis',
//             // credits: {
//             //     text: '',
//             //     align: 'left'
//             // }
//         },
//         axes: [{
//             type: 'numeric',
//             position: 'left',
//             grid: true,
//             minimum: 0,
//             //maximum: 24,
//             //renderer: 'onAxisLabelRender'
//         }, {
//             type: 'category',
//             position: 'bottom',
//             grid: true,
//             fields: ['month'],
//             // label: {
//             //     rotate: {
//             //         degrees: -45
//             //     }
//             // }
//         }],
//         series: [{
//             type: 'line',
//             xField: 'month',
//             yField: 'total_documents',
//             smooth: true,
//             style: {
//                 lineWidth: 2,
//                 strokeStyle: '#999'
//             },
//             marker: {
//                 radius: 4,
//                 lineWidth: 2
//             },
//             label: {
//                 field: 'total_documents',
//                 display: 'over'
//             },
//             highlight: {
//                 fillStyle: '#000',
//                 radius: 5,
//                 lineWidth: 2,
//                 strokeStyle: '#fff'
//             },
//             tooltip:{
//                 renderer:function(tooltip, model, item){
//                     tooltip.setHtml(model.get(item.field) + ' Documents waiting review');
//                 }
//             }, 
//             // tooltip: {
//             //     trackMouse: true,
//             //     showDelay: 0,
//             //     dismissDelay: 0,
//             //     hideDelay: 0,
//             //     //renderer: 'onSeriesTooltipRender'
//             // }
//         }],
//         listeners: {
//             itemhighlight: 'onItemHighlight',
            
//         },
//         listeners: {
//             beforerender: {
//                 fn: 'setCompStore',
//                 config: {
//                     pageSize: 10000,
//                     proxy: {
//                         url: 'dashboard/getDocumentAnalysis',
//                         // extraParams :{
//                         //     table_name:'wf_workflow_stages'
//                         // }
//                     }
//                 },
//                 isLoad: true
//             },
//         },
//     },

//     tbar: ['->', {
//         text: 'Preview',
//         handler: 'onPreview'
//     }]

// });