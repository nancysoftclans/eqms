/**
 * Created by Kip on 11/12/2018.
 */
Ext.define('Admin.store.premiseRegistration.DrugsPremiseRegistrationStr', {
    extend: 'Ext.data.Store',
    storeId: 'drugspremiseregistrationstr',
    alias: 'store.drugspremiseregistrationstr',
    requires: [
        'Admin.model.premiseRegistration.PremiseRegMdl'
    ],
    model: 'Admin.model.premiseRegistration.PremiseRegMdl',
    autoLoad: false,
    grouper: {
        groupFn: function (item) {
            return item.get('process_id') + item.get('workflow_stage_id');
        }
    },
    proxy: {
        type: 'ajax',
        url: 'premiseregistration/getPremiseApplications',
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
