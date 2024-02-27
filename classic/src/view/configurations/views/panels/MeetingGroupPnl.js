Ext.define('Admin.view.configurations.views.panels.MeetingGroupPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'meetingGroupPnl',
    title: 'Peer/Rc Meeting Groups',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    
    items: [
        {
            xtype: 'meetingGroupGrid'
        }
    ],

});