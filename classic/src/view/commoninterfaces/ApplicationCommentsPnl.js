/**
 */
Ext.define('Admin.view.commoninterfaces.ApplicationCommentsPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'applicationcommentspnl',
    height: Ext.Element.getViewportHeight() - 118,
    controller: 'commoninterfacesVctr',
    frame: true,
    scrollable: true,
    // width: '100%',
    layout: 'fit',
    tbar: [{
        xtype: 'button',
        text: 'Add Recommendation',
        ui: 'soft-blue',
        iconCls: 'fa fa-clipboard-check',
        handler: 'AddGeneralComment'
    }],
    items: [
        {
            xtype: 'applicationcommentsgrid',
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