Ext.define('Admin.store.gmpApplications.GmpProductLineRecommendationStr', {
        extend: 'Ext.data.Store',
        alias: 'store.gmpproductlinerecommendationstr',
        storeId: 'gmpproductlinerecommendationstr',
        requires: [
            'Admin.model.gmpApplications.GmpApplicationsMdl'
        ],
        model: 'Admin.model.gmpApplications.GmpApplicationsMdl',
        autoLoad: false,
        defaultRootId: 'root',
        enablePaging: true,
        proxy: {
            type: 'ajax',
            url: 'gmpapplications/getGmpCommonParams',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            reader: {
                type: 'json',
                idProperty: 'id',
                rootProperty: 'results',
                messageProperty: 'message'
            }
        },
        listeners: {
            beforeload: function (store, op) {
                op.setParams(Ext.apply(op.getParams() || {}, {
                    model_name: 'GmpProductLineRecommendation'
                }));
            },
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
