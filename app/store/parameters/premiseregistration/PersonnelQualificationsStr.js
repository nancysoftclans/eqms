Ext.define('Admin.store.parameters.premiseregistration.PersonnelQualificationsStr', {
    extend: 'Ext.data.Store',
    alias: 'store.personnelqualificationsstr',
    storeId: 'personnelqualificationsstr',
    requires: [
        'Admin.model.parameters.PersonnelQualificationMdl'
    ],
    model: 'Admin.model.parameters.PersonnelQualificationMdl',
    autoLoad: false,
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
            table_name: 'par_personnel_qualifications'
        }
    }
});
