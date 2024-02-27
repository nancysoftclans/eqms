Ext.define('Admin.view.profile.Components.MessageComposeFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'messagecomposefrm',
    bodyPadding: 2,
    margin: '3 0 0 0',
    cls: 'share-panel',
    layout: 'form',
    controller: 'notificationsvctr',
    items: [
        {
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        },
        // {
        //     xtype: 'combo', anyMatch: true,
        //     emptyText: 'Recipient',
        //     allowBlank: false,
        //    // store: 'usersStore',
        //     valueField: 'id',
        //     displayField: 'fullnames',
        //     name: 'recipient',
        //     queryMode: 'local',
        //     forceSelection: true,
        //     listeners: {
        //         beforequery: function (record) {
        //             record.query = new RegExp(record.query, 'ig');
        //             record.forceAll = true;
        //         }
        //     }
        // },
        {
            xtype: 'textarea',
            emptyText: 'Message',
            allowBlank: false,
            name: 'message'
        }
    ],
    buttons: [
        {
            xtype: 'button',
            text: 'Send',
            formBind: true,
            iconCls: 'x-fa fa-paper-plane',
            iconAlign: 'right',
            handler: 'sendUserMessage'
        }
    ]
});
