Ext.define('Admin.store.ComplianceRiskScaleStr', {
    extend: 'Ext.data.Store',
    storeId: 'complianceriskscalestr',
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
            table_name: 'par_compliance_risk_scale'
        }
    }
});