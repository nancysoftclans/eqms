Ext.define('Admin.view.notifications.views.panels.CustomerEmailNotificationPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'customeremailnotification',
    title: 'Customer Email Notification',
    userCls: 'big-100 small-100',
    margin: '2 0 2 0',
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'customeremailnotificationgrid'
        }
    ]
});