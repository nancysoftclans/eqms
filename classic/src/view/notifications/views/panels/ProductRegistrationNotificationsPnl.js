Ext.define('Admin.view.notifications.views.panels.ProductRegistrationNotificationsPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'productRegistrationNotificationsPnl',
    controller: 'notificationsvctr',
    title: 'Product Registration Notifications',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [{
        xtype: 'moduleNotificationsGrid',
        region:'center', 
        margin: 2,
        bbar: [{
            xtype: 'pagingtoolbar',
            width: '100%',
            displayInfo: true,
            displayMsg: 'Showing {0} - {1} of {2} total records',
            emptyMsg: 'No Records',
            beforeLoad: function(){
              var store = this.getStore();
              store.getProxy().extraParams = {
                table_name: 'par_notifications',
                mod_id: 1,
               
              }
            }
          
        }],

    }]
});