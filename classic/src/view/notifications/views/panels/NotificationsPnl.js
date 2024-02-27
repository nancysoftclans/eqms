Ext.define('Admin.view.notifications.views.panels.NotificationsPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'notificationsPnl',
    controller: 'notificationsvctr',
    title: 'Notifications',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    items: [
        {
        xtype: 'outboxNotificationsGrid',
    }]
});