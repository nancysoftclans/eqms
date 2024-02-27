
Ext.define('Admin.view.configurations.views.grids.IncomingEnforcementGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'configurationsvctr',
    xtype: 'incomingEnforcementGrid',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    height: Ext.Element.getViewportHeight() - 118,
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        getRowClass: function (record, rowIndex, rowParams, store) {
            var is_enabled = record.get('is_enabled');
            if (is_enabled == 0 || is_enabled === 0) {
                return 'invalid-row';
            }
        }
    },
   
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    export_title: 'agegroups',
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records'
    }],
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 1000,
                storeId: 'agegroupsStr',
                proxy: {
                    url: 'configurations/getConfigParamFromTable',
                    extraParams:{
                    	is_config: 1,
                        table_name: 'tra_incoming_enforcement_reports'
                    }
                }
            },
            isLoad: true
        }
    },
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'id',
        text: 'Ref ID',
        width: 100
    },{
        xtype: 'gridcolumn',
        dataIndex: 'reporter_name',
        text: 'Reporter',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'contact_details',
        text: 'Contact Details',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'location',
        text: 'Reporter Location',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'age',
        text: 'Age',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'communicate_id',
        text: 'Willing to be contacted',
        flex: 1,
        renderer: function (value, metaData) {
            if (value == 'YES') {
                metaData.tdStyle = 'color:white;background-color:green';
                return "YES";
            }

            metaData.tdStyle = 'color:white;background-color:red';
            return "No";
        }
    },{
        text: 'Options',
        xtype: 'widgetcolumn',
        width: 90,
        widget: {
            width: 75,
            textAlign: 'left',
            xtype: 'splitbutton',
            iconCls: 'x-fa fa-th-list',
            ui: 'gray',
            menu: {
                xtype: 'menu',
                items: [{
                    text: 'View',
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'Edit Record',
                    action: 'edit',
                    childXtype: 'incomingEnforcementFrm',
                    winTitle: 'Report View',
                    winWidth: '80%',
                    handler: 'showEditConfigParamWinFrm',
                    bind: {
                        disabled: '{isReadOnly}'
                    },
                    stores: '[]'
                }
                ]
            }
        }
    }]
});
