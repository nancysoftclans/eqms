/**
 * Created by Kip on 11/21/2018.
 */
Ext.define('Admin.store.premiseRegistration.PremisePersonnelDetailsOnlineStr', {
    extend: 'Ext.data.Store',
    storeId: 'premisepersonneldetailsonlinestr',
    alias: 'store.premisepersonneldetailsonlinestr',
    requires: [
        'Admin.model.premiseRegistration.PremiseRegMdl'
    ],
    model: 'Admin.model.premiseRegistration.PremiseRegMdl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'premiseregistration/getOnlineAppPremisePersonnelDetails',
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
