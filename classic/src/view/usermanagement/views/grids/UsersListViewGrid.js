
Ext.define('Admin.view.usermanagement.views.grids.UsersListViewGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'usermanagementvctr',
    xtype: 'usersListViewGrid',
    cls: 'dashboard-todo-list',
    header: false,
    autoScroll: true,
    height: Ext.Element.getViewportHeight() - 118,
    autoHeight: true,
    width: '100%',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
    },
    tbar: [ {
        xtype: 'exportbtn'
    }, {
        xtype: 'tbspacer',
        width: 60
    },{
        xtype: 'hiddenfield',
        name: 'filters',
    }],
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 1000,
                storeId: 'usersListviewstr',
                proxy: {
                    url: 'usermanagement/getActiveSystemUsers',
                }
            },
            isLoad: true
        }
    },
    export_title: 'Active System Users List',
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function(){
            var grid = this.up('grid'),
                store = grid.getStore(),
                filters = grid.down('hiddenfield[name=filters]').getValue();
            store.getProxy().extraParams = {
                filters: filters
            }
        }
    }],
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'saved_name',
        text: 'Photo',
        width: 100,
        renderer: function (val) {
            if (val) {
                return '<img src="' + base_url + '/resources/images/user-profile/' + val + '" width="75" height="50">';
            } else {
                return '<img src="' + base_url + '/resources/images/placeholder.png" width="75" height="50">';
            }
        }
    }, {
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
        renderer: function (value) {
            return Ext.String.format('<a href="mailto:{0}">{1}</a>', value, value);
        }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'gender',
        text: 'Gender',
        flex: 1,
        hidden: true
    }, {
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
        dataIndex: 'user_role_name',
        text: 'Role/Position',
        flex: 1,
        hidden: true
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'last_login_time',
        text: 'Last Login Time',
        flex: 1,
        renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
    },{
        xtype: 'gridcolumn',
        dataIndex: 'last_login_time',
        text: 'Active Since(Days)',
        flex: 1,
        renderer: function(value, metaData, record, rowIndex){
            if(record.get('has_expiry_exemption')){
                return "Permanent Ac";
            }
            var days =  Ext.Date.diff(new Date(value),new Date(),Ext.Date.DAY);
            if(days > 90){
                metaData.tdStyle = 'color:white;background-color:red';
            }
            return days;
        }
    }]
});
