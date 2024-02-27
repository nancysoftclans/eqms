/**
 */
Ext.define('Admin.view.commoninterfaces.grids.ApplicationPrevDocUploadsGrid', {
    extend: 'Ext.tree.Panel',
    controller: 'commoninterfacesVctr',
    xtype: 'applicationprevdocuploadsgrid',
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
            // console.log(file_type);
            if (file_type) {
                console.log(file_type);
                return 'valid-row';
            }else{
                return 'invalid-row';
            }
        }
    },
    tbar: [{
        xtype: 'hiddenfield',
        name: 'process_id'
    }, {
        xtype: 'hiddenfield',
        name: 'section_id'
    }, {
        xtype: 'hiddenfield',
        name: 'module_id'
    }, {
        xtype: 'hiddenfield',
        name: 'sub_module_id'
    }, {
        xtype: 'hiddenfield',
        name: 'workflow_stage_id'
    }, {
        xtype: 'hiddenfield',
        name: 'application_code'
    },{
        xtype: 'hiddenfield',
        name: 'prodclass_category_id'
    },{
        xtype: 'hiddenfield',
        name: 'importexport_permittype_id'
    },{
        xtype: 'hiddenfield',
        name: 'query_ref_id'
    }, {
        xtype: 'hiddenfield',
        name: 'variation_id'
    }, {
        xtype: 'hiddenfield',
        name: 'isOnline'
    }, {
        xtype: 'hiddenfield',
        name: 'is_original_dossier'
    },{
        xtype: 'exportbtn'
    }, {
        xtype: 'tbspacer',
        width: 20
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Applicable Documents',
        labelWidth: 150,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        name: 'applicable_documents',
        queryMode: 'local',
        width: 500,
        labelStyle: "font-weight:bold",
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'documentmanagement/getProcessApplicableDocTypes'
                    }
                },
                isLoad: false
            },
            afterrender: function (cmbo) {
                var grid = cmbo.up('treepanel'),
                    store = cmbo.getStore(),
                    portal_uploads = grid.portal_uploads,
                    section_id = grid.down('hiddenfield[name=section_id]').getValue(),
                    module_id = grid.down('hiddenfield[name=module_id]').getValue(),
                    sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
                    prodclass_category_id = grid.down('hiddenfield[name=prodclass_category_id]').getValue(),
                    workflow_stage = grid.down('hiddenfield[name=workflow_stage_id]').getValue();
                 
                store.removeAll();
                store.load();
            },
            change: function () {
                var grid = this.up('treepanel'),
                    store = grid.getStore();
                store.load();
            }
        },
        triggers: {
            clear: {
                type: 'clear',
                hideWhenEmpty: true,
                hideWhenMouseOut: false,
                clearOnEscape: true
            }
        }
    }
    ],
    autoScroll: true,
    listeners: {
        beforerender: {
            fn: 'setDynamicTreeGridStore',
            config: {
                storeId: 'previousDocumentsUploads',
                proxy: {
                    api: {
                         read: 'documentmanagement/LoadAllApplicationUploadedDocuments'
                    },
                },
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
            var store = this.getStore(),
                grid = this.up('treepanel'),
                table_name = grid.table_name,
                portal_uploads = grid.portal_uploads,

                win = grid.up('window'),
                process_id = grid.down('hiddenfield[name=process_id]').getValue(),
                section_id = grid.down('hiddenfield[name=section_id]').getValue(),
                module_id = grid.down('hiddenfield[name=module_id]').getValue(),
                sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
                workflow_stage = grid.down('hiddenfield[name=workflow_stage_id]').getValue(),
                query_ref_id = grid.down('hiddenfield[name=query_ref_id]').getValue(),
                prodclass_category_id = grid.down('hiddenfield[name=prodclass_category_id]').getValue(),
                importexport_permittype_id = grid.down('hiddenfield[name=importexport_permittype_id]').getValue(),
                application_code = grid.down('hiddenfield[name=application_code]').getValue(),
                is_original_dossier = grid.down('hiddenfield[name=is_original_dossier]').getValue(),
                document_type_id = grid.down('combo[name=applicable_documents]').getValue();
			

            store.getProxy().extraParams = {
                table_name: table_name,
                section_id: section_id,
                module_id: module_id,
                sub_module_id: sub_module_id,
                process_id: process_id,
                workflow_stage: workflow_stage,
                application_code: application_code,
                is_original_dossier: is_original_dossier,
                document_type_id: document_type_id,
                query_ref_id: query_ref_id,
                prodclass_category_id: prodclass_category_id,
                importexport_permittype_id:importexport_permittype_id,
                portal_uploads: portal_uploads
            }
        }
    }],
    
    // selModel:{
    //     selType: 'checkboxmodel',
    //     mode: 'SINGLE'
    // },
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'file_name',
        text: 'File Name',
        sortable: true,
        tdCls: 'wrap',
        width: 400
    },{
        xtype: 'gridcolumn',
        dataIndex: 'document_type',
        text: 'Document Type',
        hidden: true,
        tdCls: 'wrap',
        width: 200
    },{
        xtype: 'gridcolumn',
        dataIndex: 'document_requirement',
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
        // hidden: true,
        text: 'Initial File Name',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'uploaded_by',
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
                }, {
                    text: 'Preview Previous Version',
                    iconCls: 'x-fa fa-eye',
                    storeId: 'previousDocumentsUploads',
                    childXtype: 'previousDocumentVersionsGrid',
                    winTitle: 'Document Previous Versions',
                    action: 'prev_versions',
                    winWidth: '70%',
                    handler: 'previewPreviousUploadedDocument'
                },{
                    text: 'ZIP and Download',
                    iconCls: 'x-fa fa-download',
                    handler: 'downloadDirectoryasZip',
                    tooltip: 'download as zip',
                    action: 'download',
                    download: 0
                }]
            }
        },
        onWidgetAttach: function (col, widget, rec) {
            var leaf = rec.get('leaf'),
                is_directory = rec.get('is_directory');
            if(leaf){
                // widget.setVisible(true);
                widget.down('menu menuitem[action=preview]').setVisible(true);
                // widget.down('menu menuitem[action=actual_delete]').setVisible(true);
                widget.down('menu menuitem[action=prev_versions]').setVisible(true);
                // widget.down('menu menuitem[action=download]').setVisible(true);
            }else{
                // widget.setVisible(false);
                widget.down('menu menuitem[action=preview]').setVisible(false);
                // widget.down('menu menuitem[action=actual_delete]').setVisible(false);
                widget.down('menu menuitem[action=prev_versions]').setVisible(false);
                // widget.down('menu menuitem[action=download]').setVisible(true);
            }
            // if(is_directory == 1){
            //     widget.down('menu menuitem[action=download]').setVisible(true);
            // }else{
            //     widget.down('menu menuitem[action=download]').setVisible(false);
            // }
        }
    }]
});