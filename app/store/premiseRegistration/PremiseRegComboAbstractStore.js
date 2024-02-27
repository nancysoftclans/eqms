/**
 * Created by Kip on 9/22/2018.
 */
Ext.define('Admin.store.premiseRegistration.PremiseRegComboAbstractStore', {
    extend: 'Ext.data.Store',
    storeId: 'premiseregcomboabstractstore',
    alias: 'store.premiseregcomboabstractstore',
    requires:[
        'Admin.model.premiseRegistration.PremiseRegMdl'
    ],
    model: 'Admin.model.premiseRegistration.PremiseRegMdl',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'gmpapplications/getPremiseRegParamFromModel',
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
