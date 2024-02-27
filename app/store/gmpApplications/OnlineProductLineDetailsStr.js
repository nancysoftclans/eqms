Ext.define('Admin.store.gmpApplications.OnlineProductLineDetailsStr', {
    extend: 'Ext.data.Store',
    storeId: 'onlineproductlinedetailsstr',
    alias: 'store.onlineproductlinedetailsstr',
    requires: [
        'Admin.model.gmpApplications.GmpApplicationsMdl'
    ],
    model: 'Admin.model.gmpApplications.GmpApplicationsMdl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'gmpapplications/getOnlineProductLineDetails',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            rootProperty: 'results',
            messageProperty: 'msg'
        }
    },
    
});
