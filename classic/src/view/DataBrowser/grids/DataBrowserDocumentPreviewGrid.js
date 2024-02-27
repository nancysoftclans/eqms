Ext.define('Admin.view.DataBrowser.grids.DataBrowserDocumentPreviewGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'databrowserVCtr',
    xtype: 'databrowserdocumentpreview',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    height: Ext.Element.getViewportHeight() - 118,
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display'
    },
    tbar: [{
	    	xtype: 'hiddenfield',
	    	name: 'application_code'
	    },{
	    	xtype: 'hiddenfield',
	    	name: 'record_id'
	    },{
            xtype: 'exportbtn'
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
                	record_id = grid.down('hiddenfield[name=record_id]').getValue(),
                	application_code = grid.down('hiddenfield[name=application_code]').getValue();
               	store.getProxy().extraParams = {
                        record_id: record_id,
                        application_code: application_code
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
                    url: 'summaryreport/getDataBrowserDocuments'
                }
            },
            isLoad: true
        }
    },
 columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'document_type',
        text: 'Document',
        flex: 1,
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'file_name',
        text: 'File Name',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'initial_file_name',
        text: 'Initial File Name',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'uploaded_by',
        text: 'Uploaded By',
        flex: 1,
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'uploaded_on',
        text: 'Upload Date',
        flex: 1,
        renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'file_type',
        text: 'File Type',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'remarks',
        text: 'Remarks',
        flex: 1
    }, {
        text: 'Options',
        xtype: 'widgetcolumn',
        width: 90,
        widget: {
            width: 75,
            textAlign: 'left',
            xtype: 'splitbutton',
            iconCls: 'x-fa fa-th-list',
            ui: 'soft-blue',
            menu: {
                xtype: 'menu',
                items: [{
                    text: 'preview',
                    iconCls: 'x-fa fa-eye',
                    handler: 'previewUploadedDocument',
                    download: 0
                }]
            }
        }
    }]
    });