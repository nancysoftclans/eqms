/**
 * Created by Kip on 11/9/2018.
 */
Ext.define('Admin.store.premiseRegistration.TraPersonnelQualificationsStr', {
    extend: 'Ext.data.Store',
    storeId: 'trapersonnelqualificationsstr',
    alias: 'store.trapersonnelqualificationsstr',
    requires: [
        'Admin.model.premiseRegistration.PremiseRegMdl'
    ],
    model: 'Admin.model.premiseRegistration.PremiseRegMdl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'premiseregistration/getPremisePersonnelQualifications',
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
