Ext.define('Admin.view.issuemanagement.views.panels.IssueTypeCtn',  {
    extend: 'Ext.panel.Panel',
    xtype: 'issue_types',
    title: 'Issue Types',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'issuetypegrid'
        }
    ]
});
