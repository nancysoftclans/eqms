
Ext.define('Admin.store.dashboard.InTrayStr', {
    extend: 'Ext.data.Store',
    storeId: 'intraystr',
    alias: 'store.intraystr',
    requires:[
        'Admin.model.dashboard.DashboardMdl'
    ],
    pageSize: 1000000,
    model: 'Admin.model.dashboard.DashboardMdl',
    autoLoad: false,
    remoteFilter: true,
    grouper: {
        groupFn: function (item) {
            if(item.get('is_receipting_stage') == 1){
                return item.get('process_id') + item.get('current_stage')+ item.get('application_status_id');
            }else{
                return item.get('process_id') + item.get('current_stage');
            }
        }
    },
    proxy: {
        type: 'ajax',
        url: 'dashboard/getInTrayItems',
        headers: {
            'Authorization':'Bearer '+access_token
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            rootProperty: 'results',
            messageProperty: 'msg',
            totalProperty: 'total'
        }
    },
    
});
