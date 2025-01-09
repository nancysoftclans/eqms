Ext.define('Admin.store.dashboard.UserStatsStr', {
    extend: 'Ext.data.Store',
    storeId: 'userstatsstore',
    alias: 'store.userstatsstore',
    // requires:[
    //     'Admin.model.dashboard.userStatsMdl'
    // ],
    model: 'Admin.model.dashboard.userStatsMdl',
    
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'dashboard/getUserStats',
        headers: {
            'Authorization':'Bearer '+access_token
        },
        reader: {
            type: 'json',
            // idProperty: 'id',
            // rootProperty: 'results',
            // messageProperty: 'msg'
        },
        extraParams: {

        }
    },
    
});
