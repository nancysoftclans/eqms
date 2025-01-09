Ext.define('Admin.model.dashboard.UserAnalysisMdl', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'date', type: 'string'},
        {name: 'totalLogins', type: 'int'},
        {name: 'uniqueUsers', type: 'int'},
        {name: 'devicesUsed', type: 'int'},
        {name: 'uniqueIPs', type: 'int'},
    ]
});
