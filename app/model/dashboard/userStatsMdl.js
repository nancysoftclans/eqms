Ext.define('Admin.model.dashboard.userStatsMdl', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'totalUsers', type: 'int'},
        {name: 'loggedInToday', type: 'int'},
        {name: 'activeLast30Days', type: 'int'},
        {name: 'neverLoggedIn', type: 'int'},
    ]
});