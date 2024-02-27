    Ext.define('Admin.store.dashboard.DashboardGridAbstractStore', {
    extend: 'Ext.data.Store',
    storeId: 'dashboardgridabstractstore',
    alias: 'store.dashboardgridabstractstore',
    requires:[
        'Admin.model.dashboard.DashboardMdl'
    ],
    model: 'Admin.model.dashboard.DashboardMdl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'dashboard/getDashParamFromModel',
        headers: {
            'Authorization':'Bearer '+access_token
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            rootProperty: 'results',
            messageProperty: 'msg'
        },
        extraParams: {

        }
    },
    
});
