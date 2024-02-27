Ext.define('Admin.view.configurations.views.panels.MeetingSchedulesPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'meetingschedulespnl',
    controller: 'configurationsvctr',
    title: 'Meeting Schedules',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [{
        xtype: 'meetingschedulesgrid'
    }]
});