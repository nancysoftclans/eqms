Ext.define('Admin.store.parameters.premiseregistration.PersonnelPositionsStr', {
    extend: 'Ext.data.Store',
    alias: 'store.personnelpositionsstr',
    storeId: 'personnelpositionsstr',
    requires: [
        'Admin.model.parameters.PersonnelQualificationMdl'
    ],
    model: 'Admin.model.parameters.PersonnelQualificationMdl',
    autoLoad: true,
    defaultRootId: 'root',
    enablePaging: true,
    proxy: {
        type: 'ajax',
        url: 'configurations/getConfigParamFromTable',
        headers: {
            'Authorization':'Bearer '+access_token
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            rootProperty: 'results',
            messageProperty: 'message'
        },
        extraParams: {
            table_name: 'par_personnel_positions'
        }
    }
});
