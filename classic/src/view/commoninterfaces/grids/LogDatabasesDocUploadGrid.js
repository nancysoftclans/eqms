Ext.define('Admin.view.commoninterfaces.grids.LogDatabasesDocUploadGrid', {
    extend: 'Ext.tree.Panel',
    controller: 'commoninterfacesVctr',
    xtype: 'logdatabasesdocuploadgrid',
    useArrows: true,
    rootVisible: false,
    multiSelect: false,
    singleExpand: true,
    margin: '0 5 0 0',
    selType: 'cellmodel',
    requires: [
        'Ext.grid.*',
        'Ext.tree.*'
    ],
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        getRowClass: function (record, rowIndex, rowParams, store) {
            var file_type = record.get('file_type');
            if (file_type) {
                return 'valid-row';
            }else{
                return 'invalid-row';
            }
        }
    },
    tbar: [{
        xtype: 'hiddenfield',
        name: 'process_id'
    },{
        xtype: 'hiddenfield',
        name: 'module_id'
    },{
        xtype: 'hiddenfield',
        name: 'sub_module_id'
    },{
        xtype: 'hiddenfield',
        name: 'section_id'
    }, {
        xtype: 'hiddenfield',
        name: 'workflow_stage_id'
    }, {
        xtype: 'hiddenfield',
        name: 'application_code'
    },{
        xtype: 'hiddenfield',
        name: 'active_application_code'
    }, {
        xtype: 'hiddenfield',
        name: 'stage_category_id'
    },{
        xtype: 'button',
        text: 'Upload Databases Template',
        name: 'add_upload',
        iconCls: 'x-fa fa-upload',
        ui: 'soft-blue',         
        winTitle: 'Upload Databases',
        childXtype: 'applicationDocUploadsFrm',
        newTab: 'applicationDocUploadsFrm',
        winWidth: '35%',
       
        stores: '["applicationDocumentsUploadsStr"]',
        storeID: 'applicationDocumentsUploadsStr',
        bind: {
            hidden: '{isReadOnly}'
        }
    },{
        text: 'Log Databases Template',
        iconCls: 'x-fa fa-download',
        action: 'add',
        ui: 'soft-blue',
        name: 'download',
        winTitle: 'Log Databases Tempalate',
        winWidth: '80%',
        handler: 'downloadlogdatabasesTemplate',
        module_id : 26,
        stores: '[]'
    },
    '->',
    {
        xtype: 'textfield',
        name: 'recommendation_id',//authSignature
        columnWidth: 1,
        hidden: true,
        allowBlank: false
    }, {
        xtype: 'textfield',
        name: 'approval_id',//authSignature
        columnWidth: 1,
        hidden: true,
        allowBlank: false
    }],
    autoScroll: true,
    listeners: {
        beforerender: {
            fn: 'setDynamicTreeGridStore',
            config: {
                storeId: 'applicationDocumentsUploadsStr',
                proxy: {
                    api: {
                         read: 'documentmanagement/onLoadApplicationDocumentsUploads'
                    },
                }
            },
            isLoad: true
        },
        itemdblclick: 'onMenuItemTreeItemDblClick'
    },
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function () {
            this.up('logdatabasesdocuploadgrid').fireEvent('refresh', this);
        }
    }],
    autoScroll: true,
    selModel:{
        selType: 'checkboxmodel',
        //mode: 'SINGLE'
    },

    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'file_name',
        text: 'File Name',
        sortable: true,
        tdCls: 'wrap',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'document_type',
        hidden: true,
        text: 'Document Type',
        hidden: true,
        tdCls: 'wrap',
        width: 200
    },{
        xtype: 'gridcolumn',
        dataIndex: 'document_requirement',
        hidden: true,
        text: 'Required Document(s)',
        // hidden: true,
        tdCls: 'wrap',
        width: 200
    },  {
        xtype: 'gridcolumn',
        dataIndex: 'is_mandatory',
        hidden: true,
        text: 'Is Mandatory',
        flex: 0.7,
        renderer: function (value, metaData) {
            if (value == 1) {
                metaData.tdStyle = 'color:white;background-color:red';
                return "Is-Mandatory";
            } else {
                metaData.tdStyle = 'color:white;background-color:red';
                return "Not-Mandatory";
            }
        }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'initial_file_name',
        hidden: true,
        text: 'Initial File Name',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'uploaded_by',
        hidden: true,
        text: 'Upload By',
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
        hidden: true,
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
            ui: 'gray',
            menu: {
                xtype: 'menu',
                items: [{
                    text: 'Preview',
                    iconCls: 'x-fa fa-eye',
                    handler: 'previewUploadedDocument',
                    action: 'preview',
                    download: 0
                },{
                    text: 'ZIP and Download',
                    iconCls: 'x-fa fa-download',
                    handler: 'downloadDirectoryasZip',
                    tooltip: 'download as zip',
                    action: 'download',
                    download: 0
                }, {
                    text: 'Update Document',
                    iconCls: 'x-fa fa-upload',
                    winTitle: 'Update Document',
                    childXtype: 'applicationDocUploadsFrm',
                    winWidth: '35%',
                    handler: 'updateApplicationDocUploadWin',
                    stores: '[]',
                    action: 'update',
                    name: 'update',
                    bind: {
                        hidden: '{isReadOnly}'  // false
                    }

                }, {
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash',
                    name: 'delete',
                    tooltip: 'Delete Record',
                    table_name: 'tra_application_uploadeddocuments',
                    storeID: 'applicationDocumentsUploads',
                    action_url: 'productregistration/deleteProductiseRegRecord',
                    action: 'actual_delete',
                    handler: 'onDeleteApplicationDocument',
                    
                    bind: {
                        hidden: '{isReadOnly}'  // false
                    }
                }, {
                    text: 'Preview Previous Version',
                    iconCls: 'x-fa fa-eye',
                    hidden: true,
                    storeId: 'previousDocumentsUploads',
                    childXtype: 'previousDocumentVersionsGrid',
                    winTitle: 'Document Previous Versions',
                    winWidth: '70%',
                    action: 'prev_versions',
                    handler: 'previewPreviousUploadedDocument',
                    bind: {
                        hidden: '{isReadOnly}'  // false
                    }
                }]
            }
        },
        onWidgetAttach: function (col, widget, rec) {
            var leaf = rec.get('leaf'),
                is_directory = rec.get('is_directory');

            if(is_directory == 1){
                widget.down('menu menuitem[action=update]').setVisible(false);
                widget.down('menu menuitem[action=update]').setDisabled(true);
                widget.down('menu menuitem[action=prev_versions]').setDisabled(true);
                widget.down('menu menuitem[action=prev_versions]').setVisible(false);

                widget.down('menu menuitem[action=preview]').setVisible(false);
                widget.down('menu menuitem[action=download]').setVisible(true);
            }else{
                widget.down('menu menuitem[action=update]').setVisible(true);
                widget.down('menu menuitem[action=prev_versions]').setVisible(true);
                widget.down('menu menuitem[action=preview]').setVisible(true);
                widget.down('menu menuitem[action=download]').setVisible(false);
            }
        }
    }]
});
