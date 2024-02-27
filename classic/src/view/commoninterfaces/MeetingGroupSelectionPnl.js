Ext.define('Admin.view.commoninterfaces.MeetingGroupSelectionPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'meetingGroupSelectionPnl',
    height: Ext.Element.getViewportHeight() - 118,
    controller: 'commoninterfacesVctr',
    frame: true,
    scrollable: true,
    layout: 'fit',
    items: [
        {
            xtype: 'meetingGroupSelectionGrid',
			region:'center'
        },
        {
            xtype: 'hiddenfield',
            name: 'meeting_id'
        },
    ]
});