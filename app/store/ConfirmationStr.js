Ext.define('Admin.store.ConfirmationStr', {
    extend: 'Ext.data.Store',
    storeId: 'confirmationstr',
    autoLoad: true,
    sorters: {
        property: 'flag',
        direction: 'desc'
    },
    proxy: {
        type: 'ajax',
        url: 'configurations/getConfigParamFromTable',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Accept': 'application/json'
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            rootProperty: 'results',
            messageProperty: 'message'
        },
        extraParams: {
            table_name: 'par_confirmations'
        }
    }
});