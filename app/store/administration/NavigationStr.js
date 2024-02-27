Ext.define('Admin.store.administration.NavigationStr', {
    extend: 'Ext.data.TreeStore',
    storeId: 'navigationstr',
    alias: 'store.navigationstr',
    remoteSort: false,
    remoteFilter: false,
    
    requires: [
        'Admin.model.AdministrationMdl'
    ],
    model: 'Admin.model.AdministrationMdl',
    
    autoLoad: false,

    defaultRootId: 'root',
    proxy: {
        type: 'ajax',
        api: {
            read: base_url +'administration/getSystemNavigationMenuItems'
        },
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Accept': 'application/json'
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            messageProperty: 'msg'
        },
        extraParams: {
            strict_check: true
        }
    }
});
