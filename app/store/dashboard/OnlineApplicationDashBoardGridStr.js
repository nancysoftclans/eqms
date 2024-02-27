/**
 * Created by Kip on 10/16/2018.
 */
Ext.define('Admin.store.dashboard.OnlineApplicationDashBoardGridStr', {
    extend: 'Ext.data.Store',
    storeId: 'onlineapplicationdashboardgridstr',
    alias: 'store.onlineapplicationdashboardgridstr',
    requires:[
        'Admin.model.dashboard.DashboardMdl'
    ],
    pageSize: 1000000,
    model: 'Admin.model.dashboard.DashboardMdl',
    autoLoad: false,
    remoteFilter: true,
    grouper: {
        groupFn: function (item) {
            return item.get('process_id') + item.get('workflow_stage_id');
        }
    },
    proxy: {
        type: 'ajax',
        url: 'dashboard/getOnlineApplicationDashboard',
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
