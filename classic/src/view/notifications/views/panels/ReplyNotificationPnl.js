Ext.define('Admin.view.notifications.views.panels.ReplyNotificationPnl', {
    extend: 'Ext.form.Panel',
    xtype: 'replyNotificationPnl',
    controller: 'notificationsvctr',
    title: 'Notifications Reply',
    autoScroll: true,
    frame: true,
    bodyPadding: 8,
    //layout: 'form',
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    }, 
   // layout:'form'
    tbar: [
        {
            iconCls: 'x-fa fa-angle-left',
            listeners: {
                click: 'func_closeFormWin'
            }
        },
        {
            iconCls: 'x-fa fa-trash'
        },
        {
            iconCls:'x-fa fa-print'
        },
    
    ],   
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
      },
      {
        xtype:'hiddenfield',
        name: 'recipient_id',
      },
      {
        xtype: 'container',
        height: 82,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [
            {
                xtype: 'image',
                name: 'user_photo',
                itemId: 'userImage',
                height: 82,
                width: 100,
                alt: 'profile-picture',
            },
        ]
        },
        {
            xtype: 'displayfield',
            name:'sender',
            flex: 1,
           },
           {
            xtype: 'displayfield',
            name:'subject',
           },
        {
            xtype: 'displayfield',
            name:'body',
        },
      
        {
        xtype: 'image',
        itemId: 'attachments',
        cls:'attachment-container',
        name: 'Attachments',
        height: 82,
        width: 100,
        data: null,
        alt: 'profile-picture',
        tpl: [
            '<tpl for=".">',
                '<img class="single-mail-attachment" src="resources/images/{.}" ',
                      'alt="profile image">',
            '</tpl>'
        ]
    },
    {
        xtype: 'displayfield',
        name:'reply',
    },
    {
        xtype: 'htmleditor',
        height: 200,
        fieldLabel: 'Reply',
        labelAlign: 'top',
        allowBlank: false ,
        name:'reply',
        labelSeparator: ''
    } , 

    {
        xtype: 'filefield',
        width: 400,
        labelWidth: 80,
        fieldLabel: ' Add Attachment',
        name:'Attachments',
        labelSeparator: '',
        buttonConfig: {
            xtype: 'filebutton',
            glyph:'',
            iconCls: 'x-fa fa-cloud-upload-alt',
            text: 'Upload file'
        }
    },
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: [
                '->', {
                    text: 'Send reply',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'par_notification_reply',
                    storeID: 'NotificationsStr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'notifications/saveReplyNotificationsData',
                    handler: 'doCreateConfigParamPanel'
                },   
            ]
        },
      
    ],
     
  
});
