Ext.define('Admin.store.dashboard.UserAnalysisStr', {
    extend: 'Ext.data.Store',
    storeId: 'useranalysisstore',
    alias: 'store.useranalysisstore',
    requires:[
        'Admin.model.dashboard.UserAnalysisMdl'
    ],
    model: 'Admin.model.dashboard.UserAnalysisMdl',
    // data: [
    //     { date: '2024-01', totalLogins: 100, uniqueUsers: 50, devicesUsed: 10 },
    //     { date: '2024-02', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-03', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-04', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-05', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-06', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-07', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-08', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-09', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-10', totalLogins: 100, uniqueUsers: 50, devicesUsed: 10 },
    //     { date: '2024-11', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-12', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-13', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-14', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-15', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-16', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-17', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-18', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-19', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-20', totalLogins: 100, uniqueUsers: 50, devicesUsed: 10 },
    //     { date: '2024-21', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-22', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-23', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-24', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-25', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-26', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-27', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 },
    //     { date: '2024-28', totalLogins: 200, uniqueUsers: 75, devicesUsed: 15 }
    // ]
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'dashboard/getUserAnalysis',
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
