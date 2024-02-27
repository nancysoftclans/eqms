Ext.define('Admin.view.notifications.views.forms.NotificationsReplyfrm', {
    extend: 'Ext.form.Panel',
    xtype: 'notificationsreplyfrm',
    controller: 'notificationsvctr',
    layout: 'form',
    autoScroll: true,
    frame: true,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },          
    items: [
        {
           xtype: 'hiddenfield',
           margin: '0 20 20 0',
           name: '_token',
           value: token,
           allowBlank: true
       }, 
      {
        xtype:'hiddenfield',
        name: 'notification_id',
      } 
    ],


    
       buttons: [{
           text: 'Cancel',
           iconCls: 'x-fa fa-times',
           ui: 'soft-purple',
           handler: 'func_closeFormWin'
       },'->',{
           text: 'Send Email',
           iconCls: 'x-fa fa-send',
        //    url: 'notifications/SendTraderNotificationEmail',
           formBind: true,
           ui: 'soft-purple',
           store: 'traderemailnotificationStr',
           handler: 'funcSendTraderEmailNotification'
       }]     
          
        
         
    
  
});
