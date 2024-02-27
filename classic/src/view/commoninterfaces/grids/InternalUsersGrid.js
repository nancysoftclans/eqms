
Ext.define('Admin.view.commoninterfaces.grids.InternalUsersGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'commoninterfacesVctr',
    xtype: 'internalusersgrid',
    //cls: 'dashboard-todo-list',
    //header: false,
    //store: 'usersstr',
    autoScroll: true,
    autoHeight: true,
    cls: 'dashboard-todo-list',
    frame: true,
    height: 550,
    width: '100%',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display'
    },
    tbar: [{
        xtype: 'exportbtn'
    },
    {
        xtype: 'displayfield',
        value: 'Double click to select!!',
        fieldStyle: {
            'color': 'green'
        }
    },
    {
        xtype: 'textfield',
        name: 'search_value',
        emptyText: 'Enter Search Value',
    },
    {
        xtype: 'combo', anyMatch: true,
        emptyText: 'Select Search Option',
        name: 'search_field',
        store: ['Email Address'],

    },
    {
        text: 'Search Details',
        iconCls: 'x-fa fa-search',
        ui: 'soft-blue',
        handler: 'funcUniformTradersearch'
    }
    ],
    // selModel:{
    //     selType: 'checkboxmodel'
    // },
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    export_title: 'Active System Users',
    bbar: [

        {
            xtype: 'pagingtoolbar',
            displayInfo: true,
            displayMsg: 'Showing {0} - {1} of {2} total records',
            emptyMsg: 'No Records',
        },

    ],
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 1000,
                storeId: 'setGridStore',
                proxy: {
                    url: 'usermanagement/getActiveSystemUsers',
                }
            },
            isLoad: true
        },
    },
    columns: [
        {
            xtype: 'gridcolumn',
            dataIndex: 'fullnames',
            text: 'Full Names',
            flex: 1
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'username',
            text: 'Username',
            flex: 1,
            hidden: true
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'email',
            text: 'Email Address',
            flex: 1,
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'gender',
            text: 'Gender',
            flex: 1,
            hidden: true
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'mobile',
            text: 'Telephone Number',
            flex: 1,
            hidden: true
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'department_name',
            text: 'Department',
            flex: 1
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'zone_name',
            text: 'Branch',
            flex: 1
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'id',
            text: 'id',
            hidden: true,
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'user_role_name',
            text: 'Role/Position',
            flex: 1,
            hidden: true
        },]
});
