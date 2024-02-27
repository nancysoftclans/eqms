Ext.define('Admin.view.notifications.views.grids.ModuleNotificationsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'moduleNotificationsGrid',
    controller: 'notificationsvctr',
    useArrows: true,
    columnLines: true,
    rootVisible: false,
    title:'Active Notifications',
    height: Ext.Element.getViewportHeight() - 118,
    width: '100%',
    tbar: [{

        xtype: 'displayfield',
        value: 'Double click to mark as read!!',
        fieldStyle: {
            'color': 'green',
            'font-weight': 'bold'
        }

    }
    ],
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
                url: 'notifications/getModuleNotificationFromTable'
            }
        },
        isLoad: true
    },
    itemdblclick:'markModuleNotificationClick'
    
},
    columns:[
        
        {
            xtype: 'rownumberer',
         
        },
        {
            xtype: 'gridcolumn',
            width: 50,
            renderer: function (val, meta, record) {
                var isRead = record.get('is_read');
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
            dataIndex: 'created_on',
            text: 'Notification Date',
            flex: 1
        },
    ]
});