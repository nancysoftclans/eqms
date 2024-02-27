Ext.define('Admin.store.gmpApplications.GmpAppComboAbstractStore', {
        extend: 'Ext.data.Store',
        storeId: 'gmpappcomboabstractstore',
        alias: 'store.gmpappcomboabstractstore',
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
        listeners: {
            load: function (store, records, success, operation) {
                var reader = store.getProxy().getReader(),
                    response = operation.getResponse(),
                    successID = reader.getResponseData(response).success,
                    message = reader.getResponseData(response).message;
                if (!success || (successID == false || successID === false)) {
                    toastr.warning(message, 'Warning Response');
                }
            }
        }
    });
