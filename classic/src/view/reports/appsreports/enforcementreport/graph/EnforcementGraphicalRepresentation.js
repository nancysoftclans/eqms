Ext.define('Admin.view.reports.appsreports.enforcementreport.graph.EnforcementGraphicalRepresentation', {
    extend: 'Ext.panel.Panel',
    controller: 'productreportctr',
    xtype: 'enforcementGraphicalRepresentation',
    layout: 'fit',
    dockedItems: [{
        xtype: 'toolbar',
        items: [{
                    xtype: 'button',
                    ui: 'soft-blue',
                    text: 'Download Chart',
                    handler:'enforcementfunc_downloadgraph',
                    FileName: 'Enforcement Reports Summary Chart.png'
                }, {
                    xtype: 'button',
                    ui: 'soft-blue',
                    text: 'Reload chart',
                    handler:'reloadEnforcementCartesianFilters', 
                }]
            }],
           items: [{
                    xtype: 'cartesian',
                    itemId:'enforcementcartesian',
                    listeners: {
                        beforerender: {
                            fn: 'func_setStore',
                            config: {
                                pageSize: 1000,
                                storeId: 'enforcementReportCartesianStr',
                                proxy: {
                                   url: 'newreports/getEnforcementSummaryCartesianReport',
                                    extraParams: {
                                       module_id: 8
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
                        text: 'Enforcement Applications Summary Report Chart',
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
                        title: [ 'Brought Forward', 'Received ','Evaluated', 'Approved', 'Dropped Reports', 'Forward For Investigations','Closed Cases' ],
                        xField: ['SubModule'],
                        yField: ['brought_forward', 'received_applications', 'evaluated_applications', 'approved_applications', 'rejected_applications', 'carried_forward','closed_cases'],
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