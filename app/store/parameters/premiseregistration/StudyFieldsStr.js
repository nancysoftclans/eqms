Ext.define('Admin.store.parameters.premiseregistration.StudyFieldsStr', {
    extend: 'Ext.data.Store',
    alias: 'store.studyfieldsstr',
    storeId: 'studyfieldsstr',
    requires: [
        'Admin.model.parameters.ParametersMdl'
    ],
    model: 'Admin.model.parameters.ParametersMdl',
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
            table_name: 'par_personnel_studyfield'
        }
    }
});
