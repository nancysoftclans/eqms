
Ext.define('Admin.store.administration.SystemMenusStr', {
    extend: 'Ext.data.TreeStore',
    storeId: 'systemmenusstr',
    alias: 'store.systemmenusstr',
    remoteSort: false,
    // requires:[
    //     'Admin.model.administration.AdministrationMdl'
    // ],
    // model: 'Admin.model.administration.AdministrationMdl',
    autoLoad: false,
    pageSize: 100000,
    remoteFilter: false,
    defaultRootId: 'root',
    proxy: {
        type: 'ajax',
        api: {
            read:  base_url+'administration/getSystemNavigationMenuItems'
        },
        headers: {
            'Authorization':'Bearer '+access_token,
            'Accept': 'application/json'
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            messageProperty: 'message'
        },
        extraParams: {
            strict_check: false
        }
    },
    
});