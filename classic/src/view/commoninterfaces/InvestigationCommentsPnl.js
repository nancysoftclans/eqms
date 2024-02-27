/**
 */
 Ext.define('Admin.view.commoninterfaces.InvestigationCommentsPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'investigationCommentsPnl',
    height: Ext.Element.getViewportHeight() - 118,
    controller: 'commoninterfacesVctr',
    frame: true,
    scrollable: true,
    // width: '100%',
    layout: 'fit',
    tbar: [{
        xtype: 'button',
        text: 'Add Comments',
        ui: 'soft-blue',
        iconCls: 'fa fa-clipboard-check',
        handler: 'AddInvestigationComment'
    }],
    items: [
        {
            xtype: 'investigationcommentsgrid',
			region:'center'
        },
        {
            xtype: 'hiddenfield',
            name: 'comment_type_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'application_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'application_code'
        },
    ]
});