Ext.define('Admin.view.notifications.views.panels.DirectMessagePnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'directMessagePnl',
    controller: 'notificationsvctr',
    title: 'Notifications',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    items: [
        {
            xtype: 'inboxNotificationsGrid',
        },
     ]
});