Ext.define('Admin.view.dashboard.views.panels.UIdashboardPnl', {
    extend: 'Ext.Panel',
    xtype: 'uidashboard',

     requires: [
        'Ext.ux.gauge.Gauge',
        'Ext.ux.gauge.needle.Diamond',
        'Ext.ux.gauge.needle.Arrow',
        'Ext.ux.gauge.needle.Wedge',
        'Ext.ux.gauge.needle.Spike'
    ],

    title: 'Gauges with various kinds of needles',
    width: 800,
    height: 600,
    layout: {
        type: 'vbox'
    },

    viewModel: {
        data: {
            value: 30
        }
    },

    tbar: [{
        xtype: 'sliderfield',
        width: 300,
        fieldLabel: 'Value',
        labelWidth: 60,
        bind: '{value}',
        publishOnComplete: false
    }],

    defaults: {
        xtype: 'container',
        width: '100%',
        flex: 1,
        margin: '10 0 10 0',
        layout: {
            type: 'hbox',
            align: 'stretch'
        }
    },

    items: [{
        items: [{
            xtype: 'gauge',
            flex: 1,
            bind: '{value}',
            valueStyle: {
                display: 'none'
            },
            needle: {
                outerRadius: '100%'
            },
            cls: ""
        }, {
            xtype: 'gauge',
            flex: 1,
            bind: '{value}',
            needle: 'wedge',
            cls: ""
        }]
    }, {
        items: [{
            xtype: 'gauge',
            flex: 1,
            bind: '{value}',
            needle: 'spike',
            cls: ""
        }, {
            xtype: 'gauge',
            flex: 1,
            bind: '{value}',
            textOffset: {
                dy: 45
            },
            needle: {
                type: 'arrow',
                innerRadius: 0
            },
            cls: ""
        }]
    }]
});