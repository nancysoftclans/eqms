Ext.define('Admin.model.AdministrationMdl', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'name', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'text', type: 'string'},
        {name: 'iconCls', type: 'string'},
        {name: 'viewType', type: 'string'},
        {name: 'menu_id', type: 'string'},
        {name: 'routeId', type: 'string'}
    ]
});