Ext.define('Admin.view.issuemanagement.views.panels.IssueStatusGroupsPnl',  {
    extend: 'Ext.panel.Panel',
    xtype: 'issue_status_groups',
    title: 'Issue Status Groups',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'issuestatusgroupsgrid'
        }
    ]
});
