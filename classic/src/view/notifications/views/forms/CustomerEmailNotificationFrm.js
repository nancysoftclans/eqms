Ext.define('Admin.view.notifications.views.forms.CustomerEmailNotificationFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'customeremailnotificationfrm',
    autoScroll: true,
    controller: 'notificationsvctr',
    //layout: 'form',
    bodyPadding: 8,
    layout: 'form',
    items: [
     {
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: '_token',
        value: token,
        allowBlank: true
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Send Email To',
        margin: '0 20 20 0',
        name: 'email_to',
        forceSelection: true,
        queryMode: 'local',
        allowBlank: false,
        displayField: 'email',
        valueField: 'email',
        listeners:{
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        extraParams: {
                            table_name: 'wb_trader_account'
                        }
                    }
                },
                isLoad: true
            }
        }
    },
    {
        xtype: 'tagfield',
        fieldLabel: 'CC emails',
        displayField: 'email',
        margin: '0 20 20 0',
        itemId: 'value_1-label',
        valueField: 'email',
        //name:'groups_id',
        name: 'email_cc',
        hidden: false,
        queryMode: 'local',
        filterPickList: true,
        encodeSubmitValue: true,
        listeners:{
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        extraParams: {
                            table_name: 'wb_trader_account'
                        }
                    }
                },
                isLoad: true
            }
        }
    },
    //  {
    //     fieldLabel: 'CC',
    //     emptyText: 'Include other receipient emails separated by a comma..',
    //     name: 'email_cc',
    //     xtype:'textfield'
    // },
    {
        xtype: 'textfield',
        emptyText: 'Subject..',
        allowBlank: false,
        name: 'email_subject',
        fieldLabel: 'Subject'
    },{
        xtype: 'htmleditor',
        allowBlank: false,
        fieldLabel: 'Message',
        height: 200,
        maxWidth: 800,
        name: 'email_body',
        placeHolder: 'Write...'
    }],
    buttons: [{
        text: 'Cancel',
        iconCls: 'x-fa fa-times',
        ui: 'soft-purple',
        handler: 'func_closeFormWin'
    },'->',{
        text: 'Send Email',
        iconCls: 'x-fa fa-send',
        url: 'notifications/SendTraderNotificationEmail',
        formBind: true,
        ui: 'soft-purple',
        store: 'traderemailnotificationStr',
        handler: 'funcSendTraderEmailNotification'
    }]
});