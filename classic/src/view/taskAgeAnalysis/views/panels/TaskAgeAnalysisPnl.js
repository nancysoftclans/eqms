Ext.define('Admin.view.taskAgeAnalysis.views.panels.TaskAgeAnalysisPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'taskageanalysisPnl',
    margin: 2,
    height: Ext.Element.getViewportHeight() - 161,
    userCls: 'big-100 small-100',
    controller: 'taskAgeAnalysisVctr',
    layout:{
        type: 'border'
    },
    defaults:{
        split: true,
        margin:1
    },
    tbar:[{
        xtype: 'hiddenfield',
        name: 'group_id'
    }],
    items:[
    {
        xtype: 'taskageanalysisgrid',
        region:'center'
   }],
});
