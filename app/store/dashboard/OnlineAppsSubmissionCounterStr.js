/**
 * Created by Kip on 10/16/2018.
 */
Ext.define('Admin.store.dashboard.OnlineAppsSubmissionCounterStr', {
    extend: 'Ext.data.Store',
    storeId: 'onlineappssubmissioncounterstr',
    alias: 'store.onlineappssubmissioncounterstr',
    requires:[
        'Admin.model.dashboard.DashboardMdl'
    ],
    pageSize: 1000000,
    model: 'Admin.model.dashboard.DashboardMdl',
    autoLoad: false,
    remoteFilter: true,
    
    proxy: {
        type: 'ajax',
        url: 'dashboard/getOnlineAppsSubmissionCounter',
        headers: {
            'Authorization':'Bearer '+access_token
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            rootProperty: 'results',
            messageProperty: 'msg'
        }
    },
    
});
