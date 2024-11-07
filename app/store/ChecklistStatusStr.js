Ext.define('Admin.store.ChecklistStatusStr', {
    extend: 'Ext.data.Store',
    storeId: 'checkliststatusstr',
    autoLoad: true,
    sorters: {
        property: 'flag',
        direction: 'desc'
    },
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
            messageProperty: 'message'
        },
        extraParams: {
            table_name: 'par_checklist_status'
        }
    }
});