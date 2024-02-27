/**
 * Created by Kip on 9/27/2018.
 */
Ext.define('Admin.store.premiseRegistration.PremisesInspectionDashGridStr', {
    extend: 'Ext.data.Store',
    storeId: 'premisesinspectiondashgridstr',
    alias: 'store.premisesinspectiondashgridstr',
    requires: [
        'Admin.model.premiseRegistration.PremiseRegMdl'
    ],
    model: 'Admin.model.premiseRegistration.PremiseRegMdl',
    autoLoad: false,
    remoteFilter: true,
    grouper: {
        groupFn: function (item) {
            return item.get('process_id') + item.get('workflow_stage_id') + item.get('inspection_id');
        }
    },
    proxy: {
        type: 'ajax',
        url: 'premiseregistration/getPremisesInspectionDetails',
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
