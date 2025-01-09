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
        'Ext.chart.series.Bar',  // Add Bar Series
        //'Admin.store.dashboard.UserAnalysisStr'
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
            duration: 100
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
                minimum: 0,
            
            },
            {
                type: 'category',
                position: 'bottom',
                grid: true,
                fields: ['date'],
                label: {
                    rotate: {
                    degrees: -45
                    }
                } 
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
                highlight: {
                    fillStyle: '#000',
                    radius: 5,
                    lineWidth: 2,
                    strokeStyle: '#fff'
                },
                label:{
                    field: 'uniqueUsers',
                    display: 'over'
                },
                tooltip: {
                    trackMouse: true,
                    renderer: function (tooltip, model, item) {
                        tooltip.setHtml(
                            `Logged in Users: ${model.get('uniqueUsers')}`
                        );
                    }
                }
            }
        ],
        
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                        url: 'dashboard/getUserAnalysis',
                        extraParams: {
                            year: new Date().getFullYear() 
                        }
                    },
                    autoLoad: true 
                }
                
                //isLoad: true,
                
            }
        },
    },

    tbar: [
        {
            xtype: 'combobox',
            fieldLabel: 'Select Year',
            reference: 'yearFilter',
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
            value: new Date().getFullYear(),
            listeners: {
                select: function (combo, record) {
                    const year = record.get('year');
                    const chart = combo.up('panel').down('cartesian');
                    const store = chart.getStore();
                    if (chart && store){
                        store.getProxy().setExtraParams({ year: year });
                        store.load();
                    } else{
                        console.warn('Chart or store not found');
                    }
                    
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
                    if (chart && store){
                        store.getProxy().setExtraParams({ month: month });
                    store.load();
                    } else {
                        console.warn('Chart or store not found');
                    }
                    
                }
            },
            style: {
                height: '25px',
                width: '200px',
            }
        },
        {
            xtype: 'datefield',
            fieldLabel: 'Select Day',
            reference: 'dayFilter',
            labelAlign: 'right',
            format: 'Y-m-d',
            listeners: {
                change: function (field, newValue) {
                    const chart = field.up('panel').down('cartesian');
                    const store = chart.getStore();
                    if (store && chart) {
                        store.getProxy().setExtraParams({ day: Ext.Date.format(newValue, 'Y-m-d') });
                        store.load();
                    } else {
                        console.warn('Chart or store not found');
                    }
                    
                }
            },
            style: {
                height: '25px',
                width: '200px',
            }
        },
        {
            text: 'Clear',
            handler: 'clearDashboardFilter',
            style: {
                height: '25px',
                width: '100px',
                background: '#e44959', 
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
                        handler: 'changeChartType'
                            
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




