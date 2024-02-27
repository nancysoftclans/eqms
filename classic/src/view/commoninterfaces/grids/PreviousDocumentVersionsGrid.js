/**
 * User robinson odhiambo
 * on 10/4/2018.
 */
Ext.define('Admin.view.commoninterfaces.grids.PreviousDocumentVersionsGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'commoninterfacesVctr',
    xtype: 'previousDocumentVersionsGrid',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    height: 400,
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
    listeners: {
        beforerender: {
            fn: 'setConfigGridsStore',
            config: {
                pageSize: 1000,
                storeId: 'previousDocumentsUploads',
                proxy: {
                    url: 'documentmanagement/getApplicationDocumentPreviousVersions',
                }
            },
            isLoad: true
        }
    },
    tbar: [{
        xtype: 'hiddenfield',
        name: 'document_id'
    }],
    export_title: 'Document uploads',
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function(me){
            var store = this.getStore(),
                grid = this.up('grid'),
                document_id = grid.down('hiddenfield[name =document_id]').getValue();
            store.getProxy().extraParams = {
                document_id: document_id
            };
        }
        
    }],
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
 
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'version_no',
        text: 'Document Version',
        // flex: 1
        width: 150,
        tdCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'document_type',
        text: 'Document Type',
        // flex: 1
        width: 150,
        tdCls: 'wrap'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'document_requirement',
        text: 'Required Document(s)',
        // flex: 1
        width: 150,
        tdCls: 'wrap'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'is_mandatory',
        text: 'Is Mandatory',
        flex: 0.7,
        width: 100,
        tdCls: 'wrap',
        renderer: function (value, metaData) {
            if (value == 1) {
                metaData.tdStyle = 'color:white;background-color:red';
                return "Is-Mandatory";
            }
            else {
                metaData.tdStyle = 'color:white;background-color:red';
                return "Not-Mandatory";
            }

        }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'file_name',
        text: 'File Name',
        // flex: 1
        width: 150,
        tdCls: 'wrap'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'initial_file_name',
        text: 'Initial File Name',
        // flex: 1
        width: 150,
        tdCls: 'wrap'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'uploaded_by',
        text: 'Upload By',
        // flex: 1,
        width: 150,
        tdCls: 'wrap'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'uploaded_on',
        text: 'Upload Date',
        // flex: 1,
        width: 150,
        tdCls: 'wrap',
        renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'file_type',
        text: 'File Type',
        // flex: 1
        width: 150,
        tdCls: 'wrap'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'remarks',
        text: 'Remarks',
        // flex: 1
        width: 150,
        tdCls: 'wrap'
    }, {
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
                    text: 'Preview/',
                    iconCls: 'x-fa fa-eye',
                    handler: 'previewUploadedDocument',
                    download: 0
                }]
            }
        }
    }]
});
