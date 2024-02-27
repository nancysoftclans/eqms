/**
 */
 Ext.define('Admin.view.commoninterfaces.CaseDecisionPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'caseDecisionPnl',
    height: Ext.Element.getViewportHeight() - 118,
    controller: 'commoninterfacesVctr',
    frame: true,
    scrollable: true,
    // width: '100%',
    layout: 'fit',
    tbar: [{
        xtype: 'button',
        text: 'Add Decisions',
        ui: 'soft-blue',
        iconCls: 'fa fa-clipboard-check',
        handler: 'AddCaseDecision'
    }],
    items: [
        {
            xtype: 'caseDecisionsGrid',
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