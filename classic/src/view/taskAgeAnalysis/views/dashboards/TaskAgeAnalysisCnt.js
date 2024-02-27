Ext.define('Admin.view.taskAgeAnalysis.views.dashboards.TaskAgeAnalysisCnt', {
    extend: 'Ext.Container',
    xtype: 'taskageanalysisCnt',
    controller: 'taskAgeAnalysisVctr',
    layout: 'border',
    items: [
        {
            xtype: 'taskageanalysisPnl',
            region: 'center'
        },
    ]
});