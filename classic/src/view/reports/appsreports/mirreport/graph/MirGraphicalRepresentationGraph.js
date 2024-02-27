Ext.define('Admin.view.reports.appsreports.mirreport.graph.MirGraphicalRepresentationGraph', {
    extend: 'Ext.panel.Panel',
    controller: 'productreportctr',
    xtype: 'mirGraphicalRepresentationGraph',
    layout: 'fit',
    dockedItems: [{
        xtype: 'toolbar',
        items: [{
                    xtype: 'button',
                    ui: 'soft-blue',
                    text: 'Download Chart',
                    handler:'mirfunc_downloadgraph',
                    FileName: 'MIR Reports Summary Chart.png'
                }, {
                    xtype: 'button',
                    ui: 'soft-blue',
                    text: 'Reload chart',
                    handler:'reloadMirCartesianFilters', 
                }]
            }],
           items: [{
                    xtype: 'cartesian',
                    itemId:'mircartesian',
                    listeners: {
                        beforerender: {
                            fn: 'func_setStore',
                            config: {
                                pageSize: 1000,
                                storeId: 'mircartesianStr',
                                proxy: {
                                   url: 'newreports/getMirSummaryCartesianReport',
                                    extraParams: {
                                       module_id: 22
                                    }
                                }
                            },
                            isLoad:false
                          }
                   },

                    reference: 'chart',
                    requires: ['Ext.chart.theme.Muted'],

                    legend: {
                        type: 'sprite',
                        docked: 'right',
                        padding:4
                        
                    },
                    insetPadding: {
                        top: 40,
                        left: 5,
                        right: 5,
                        bottom: 10
                    },
                    sprites: [{
                        type: 'text',
                        text: 'Mir Applications Summary Report Chart',
                        fontSize: 16,
                        width: 100,
                        height: 30,
                        x: 40, // the sprite x position
                        y: 20  // the sprite y position
                    }],
                    axes: [{
                        type: 'numeric',
                        position: 'left',
                        adjustByMajorUnit: true,
                        grid: true,
                        fields: ['received_applications'],
                        renderer: 'onAxisLabelRender',
                        minimum: 0
                    }, {
                        type: 'category',
                        position: 'bottom',
                        grid: true,
                        fields: ['SubModule'],
                        label: {
                            display: 'middle',
                            'text-anchor': 'middle',
                            fontSize: 9,
                            orientation: 'horizontal'
                         },

                    }],
                   
                    series: [{
                        type: 'bar',
                        title: [ 'Brought Forward', 'Received ','Screened','Evaluated','Queried','Response of Request', 'Approved', 'Rejected', 'Carried Forward' ],
                        xField: ['SubModule'],
                        yField: ['brought_forward', 'received_applications','screened_applications','evaluated_applications','requested_for_additional_information', 'query_responses','approved_applications', 'rejected_applications', 'carried_forward'],
                        stacked: false,
                        style: {
                            opacity: 0.80,
                            minGapWidth: 20,
                            maxBarWidth: 300,
                        },
                        highlight: {
                            fillStyle: 'green',
                            opacity: 0.8
                        },

                        tooltip:{ 
                              trackMouse:true, 
                              scope: this, 
                              renderer:function(toolTip, storeItem, item){
                                toolTip.setHtml(storeItem.get(item.field).toFixed(1)+' '+item.field+ ' for '+storeItem.get('SubModule') );
                              }
                         }
                    }]
                }]
  
});