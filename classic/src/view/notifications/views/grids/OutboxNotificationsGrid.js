
Ext.define('Admin.view.notifications.views.grids.OutboxNotificationsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'outboxNotificationsGrid',
    controller: 'notificationsvctr',
    useArrows: true,
    columnLines: true,
    rootVisible: false,
    height: Ext.Element.getViewportHeight() - 118,
    width: '100%',

    tbar: [{
        xtype: 'button',
        text: 'Compose Notification',
        ui: 'soft-blue',
        iconCls: 'fas fa-paper-plane',
        action: 'add',
        winTitle:'Notifications form',
        winWidth: '60%',
        childXtype: 'notificationsfrm',
        handler: 'showAddConfigParamWinFrm',
        stores: '[]'
    }, 
   
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
                url: 'notifications/getNotificationFromTable'
            }
        },
        isLoad: true
    }
    
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
                is_inbox: 2,
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
            xtype: 'rownumberer',
         
        },
        {
            dataIndex: 'favorite',
            menuDisabled: true,
            text: '<span class="x-fa fa-star-o"></span>',
            width: 40,
            renderer: function(value) {
                return '<span class="x-fa fa-star-o'+ (value ? '' : ' inactive') +'"></span>';
            }
        },
     
      {
            xtype: 'gridcolumn',
            dataIndex: 'group_name',
            text: 'Recepient ',
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
            text: 'Notifications',
            flex: 1
        },
      
        // {
        //     xtype: 'gridcolumn',
        //     dataIndex: 'reply',
        //     text: 'Reply',
        //     flex: 1
        // },
        {
            xtype: 'gridcolumn',
            dataIndex: 'created_on',
            text: 'Date ',
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
                    //     {
                    //     text: 'Edit',
                    //     iconCls: 'x-fa fa-edit',
                    //     tooltip: 'Edit Record',
                    //     action: 'edit',
                    //     childXtype:'notificationsfrm',
                    //     winTitle: 'Edit notifications',
                    //     winWidth:'40%',
                    //     handler: 'showEditConfigParamWinFrm',
                    //     stores: '[]'
                    // },
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
