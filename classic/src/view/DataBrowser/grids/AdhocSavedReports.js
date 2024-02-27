Ext.define('Admin.view.DataBrowser.grids.AdhocSavedReports', {
    extend: 'Ext.grid.Panel',
    controller: 'databrowserVCtr',
    xtype: 'adhocsavedreports',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    height: Ext.Element.getViewportHeight() - 118,
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display'
    },
    tbar: [
        {
            xtype: 'exportbtn'
        },{
            xtype: 'hiddenfield',
            name:'module_id'
        }
    ],
    plugins: [{
        ptype: 'gridexporter'
    }],
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function () {
                var store = this.getStore(),
                	grid = this.up('grid'),
                	module_id = grid.down('hiddenfield[name=module_id]').getValue();
               	store.getProxy().extraParams = {
                        module_id: module_id
                    }
            }
    }],
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
    listeners: {
        beforerender: {
            fn: 'setConfigGridsStore',
            config: {
                pageSize: 1000,
                proxy: {
                    url: 'summaryreport/getDataBrowserSavedReports'
                }
            },
            isLoad: true
        },
        staterestore: function(me, ev, eopts){
            var store = me.getStore();
            store.reload();
        }
    },
 columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'report_name',
        flex: 1,
        text: 'name',
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'category_type',
        width: 150,
        text: 'SubCategory',
        tbCls: 'wrap'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'is_public',
        tbCls: 'wrap',
        text: 'access_mode',
        width: 150,
        renderer: function (value, metaData) {
            if (value == 1) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "Public";
            }

            metaData.tdStyle = 'color:white;background-color:gray';
            return "Private";
        }
    },  {
        xtype: 'widgetcolumn',
        text: 'options',
        width: 90,
        widget: {
            textAlign: 'left',
            xtype: 'button',
            ui: 'soft-blue',
            iconCls: 'x-fa fa-edit',
            text: 'edit',
            handler: 'showEditReportWin',
            download: 0
        }
    }, {
        xtype: 'widgetcolumn',
        text: 'options',
        width: 130,
        widget: {
            textAlign: 'left',
            xtype: 'button',
            ui: 'soft-blue',
            iconCls: 'x-fa fa-eye',
            text: 'preview',
            handler: 'previewSavedReport',
            download: 0
        }
    }]
    });