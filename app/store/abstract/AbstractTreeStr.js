Ext.define('Admin.store.abstract.AbstractTreeStr', {
    extend: 'Ext.data.TreeStore',

    storeId: 'abstractTreeStr',
    alias: 'store.abstractTreeStr',
    remoteSort: false,
    requires:[
        'Admin.model.AdministrationMdl'
    ],
    model: 'Admin.model.AdministrationMdl',
    autoLoad: false,
    defaultRootId: 'root',
    proxy: {
        type: 'ajax',
        api: {
            read: 'administration/getSystemRoles'
        },
        headers: {
            'Authorization':'Bearer '+access_token
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            messageProperty: 'msg'
        }
    }
});
