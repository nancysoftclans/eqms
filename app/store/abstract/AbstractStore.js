Ext.define('Admin.store.abstract.AbstractStore', {
    extend: 'Ext.data.Store',
    storeId: 'abstractstore',
    alias: 'store.abstractstore',
    // requires: [
    //     'Admin.model.configurations.ConfigurationsMdl'
    // ],
    //model: 'Admin.model.configurations.ConfigurationsMdl',
    autoLoad: false,
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
            messageProperty: 'message',
            totalProperty: 'total'
        }
    },
    // listeners: {
    //     load: function (store, records, success, operation) {
    //         var reader = store.getProxy().getReader(),
    //             response = operation.getResponse(),
    //             successID = reader.getResponseData(response).success,
    //             message = reader.getResponseData(response).message;
    //         if (!success || (successID == false || successID === false)) {
    //             toastr.warning(message, 'Warning Response');
    //         }
    //     }
    // }
});
