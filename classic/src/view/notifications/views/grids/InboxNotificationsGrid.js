Ext.define('Admin.view.notifications.views.grids.InboxNotificationsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'inboxNotificationsGrid',
    controller: 'notificationsvctr',
    useArrows: true,
    columnLines: true,
    rootVisible: false,
    title:'Active Notifications',
    height: Ext.Element.getViewportHeight() - 118,
    width: '100%',
    table_name:'par_user_notifications',
    tbar: [
        {
            xtype: 'exportbtn'
        }, {
            xtype: 'tbspacer',
            width: 30
        },
        {
            xtype: 'button',
            text : 'Mark all as read',
            ui: 'soft-blue',
            handler:'markNotificationClick',
       },
//        {
//         xtype: 'button',
//         text : 'Test',
//         ui: 'soft-blue',
//         handler:'test',
//    },
    //    {
    //     xtype: 'button',
    //     text: 'Upload Excel documents',
    //     ui: 'soft-blue',
    //     iconCls: 'fas fa-paper-plane',
    //     action: 'add',
    //     winTitle:'Excel Upload form',
    //     winWidth: '60%',
    //     childXtype: 'excelImportFrm',
    //     handler: 'showAddConfigParamWinFrm',
    //     stores: '[]'
    // },
        {
        xtype: 'displayfield',
        value: 'Double click to view and reply!!',
        fieldStyle: {
            'color': 'green',
            'font-weight': 'bold'}
    },
    ],
    
    plugins: [{
        ptype: 'gridexporter'
    }, {
        ptype: 'rowexpander',
        rowBodyTpl: new Ext.XTemplate(
            '<p><b>Notifications Reply:</b> {groups_string}</p>'
        )
    }],
   features: [{
    ftype: 'searching',
    minChars: 2,
    mode: 'local'
}],

listeners: {
    beforerender: {
        fn: 'setGridStore',
        config: {
            pageSize: 1000,
            storeId: 'NotificationsStr',
            proxy: {
                url: 'notifications/getUserNotificationFromTable'
            }
        },
        isLoad: true
    },
    itemdblclick: 'onItemClick'//'onInboxNotificationItemClick'
    //cellclick: 'onItemClick'
    
},
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
            is_outbox: 2,
            is_config: 1
        }
    }
  
}],
selModel: {
    selType: 'checkboxmodel',
    checkOnly: true,
    showHeaderCheckbox: true
},

    columns: [
        {
            dataIndex: 'favorite',
            menuDisabled: true,
            text: '<span class="x-fa fa-star"></span>',
            width: 40,
            renderer: function(value) {
                return '<span class="x-fa fa-star'+ (value ? '' : ' inactive') +'"></span>';
            }
        },
        {
            xtype: 'gridcolumn',
            width: 40,
            renderer: function (val, meta, record) {
                var isRead = record.get('is_read');
               // var isReplied = record.get('is_replied');
                if (isRead == 1 || isRead === 1) {
                    //return '<img src="' + base_url + '/resources/images/new3.jpg">';
                } else {
                    return '<img src="' + base_url + '/resources/images/new3.jpg">';
                }
            }
        },
        {
            xtype: 'gridcolumn',
           dataIndex: 'sender',
            text: 'From',
            flex: 1
        },
        
        {
            xtype: 'gridcolumn',
           dataIndex: 'subject',
            text: 'Subject',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'body',
            text: 'Message',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'reply',
            text: 'Reply',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            //text: '<span class="x-fa fa-paperclip"></span>',
            width: 40,
            renderer: function (val, meta, record) {
                var HasAttachment = record.get('attachment_name');
                if (HasAttachment) {
                    return '<span class="x-fa fa-paperclip"></span>';
                } else {
            
                }
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'created_on',
            text: 'Notification Date ',
            flex: 1
        },
        {
            text: 'Options',
            xtype: 'widgetcolumn',
            width: 90,
            widget: {
                textAlign: 'left',
                xtype: 'splitbutton',
                ui: 'gray',
                width: 75,
                iconCls: 'x-fa fa-th-list',
                menu: {
                    xtype: 'menu',
                    items: [
                    {
                        text: 'Delete',
                        iconCls: 'x-fa fa-trash',
                        tooltip: 'Delete Record',
                        table_name: 'par_notifications',
                        storeID: 'NotificationsStr',
                        action_url: 'configurations/deleteConfigRecord',
                        action: 'actual_delete',
                        handler: 'doDeleteConfigWidgetParam',
                    },
                    ]
                }
            },
        }
    
      
    ]
});
