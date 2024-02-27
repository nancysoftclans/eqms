Ext.define('Admin.view.configurations.views.panels.AgeAnalysisPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'ageAnalysisDaysSpan',
    controller: 'configurationsvctr',
    title: 'Age Analysis Days Span',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [{
        xtype: 'ageAnalysisGrid'
    }]
});