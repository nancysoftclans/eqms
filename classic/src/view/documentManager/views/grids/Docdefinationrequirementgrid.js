Ext.define('Admin.view.documentManager.views.grids.Docdefinationrequirementgrid', {
    extend: 'Ext.tree.Panel',
    xtype: 'docdefinationrequirementgrid',
    itemId: 'docdefinationrequirementgrid',
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
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],

    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
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
    tbar: [{
        xtype: 'button',
        text: 'Add',
        iconCls: 'x-fa fa-plus',
        action: 'add',
        ui: 'soft-blue',
        hidden: true,
        childXtype: 'docdefinationrequirementfrm',
        winTitle: 'Documents requirements Defination',
        winWidth: '40%',
        handler: 'showAddConfigParamWinFrm',
        stores: '[]'
    } ],
    autoScroll: true,
    listeners: {
        beforerender: {
            fn: 'setGridTreeStore',
            config: {
                storeId: 'docdefinationrequirementstr',
                proxy: {
                    api: {
                        read: 'documentmanagement/getdocdefinationrequirementDetails'
                    },
                },
            },
            isLoad: true
        },
        itemdblclick: 'onViewDocumentApplication'
    },
   
    bbar: [
        {
            xtype: 'button',
            text: 'Back',
            hidden: true,
            ui: 'soft-blue',
            iconCls: 'x-fa fa-backward',
            handler: 'backFromGroupAllDetails'
        },
        {
            xtype: 'pagingtoolbar',
            // store: 'systemrolestreestr',
            displayInfo: true,
            displayMsg: 'Showing {0} - {1} of {2} total records',
            emptyMsg: 'No Records',
            beforeLoad: function() {
                var store = this.store,
                   grid = this.up('grid');
                    store.getProxy().extraParams = {
                        table_name:'tra_documentmanager_application'
                    };
            
            },
        },
        '->',
        {
            xtype: 'button',
            text: 'Sync Changes',
            hidden: true,
            ui: 'soft-blue',
            iconCls: 'x-fa fa-save',
            handler: 'updateSystemNavigationAccessRoles'
        }],
    columns: [
    {
        xtype: 'gridcolumn',
        dataIndex: 'tracking_no',
        text: 'ID',
        flex: 1
    },{
       // xtype: 'treecolumn',
        xtype: 'gridcolumn',
        dataIndex: 'doc_title',
        text: 'Title',
        flex: 1,
        sortable: true
    },{
        xtype: 'gridcolumn',
        dataIndex: 'doc_version',
        text: 'Version',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'status',
        text: 'Status',
        flex: 1
    }, {
      xtype: "gridcolumn",
      text: "Owner",
      flex: 1,
      tdCls: "wrap",
      renderer: function (value, metaData, record) {
        // Concatenate first_name and last_name
        var firstName = record.get("first_name");
        var lastName = record.get("last_name");
        return firstName + " " + lastName;
      },
    },

    {
        xtype: 'gridcolumn',
        dataIndex: 'document_type',
        text: 'Document Type',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'allowed_extensions',
        hidden: true,
        text: 'Allowed Extensions',
        tdCls:'wrap-text',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'created_on',
        text: 'Date Received',
        hidden: true,
        tdCls:'wrap-text',
        flex: 1
    },{
        xtype: 'gridcolumn',
        hidden: true,
        dataIndex: 'description',
        text: 'Description',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'is_mandatory',
        hidden: true,
        text: 'Is Mandatory',
        flex: 0.5,
        renderer: function (value, metaData) {
                if(value) {
                    metaData.tdStyle = 'color:white;background-color:red';
                    return "Mandatory";
                }
                metaData.tdStyle = 'color:white;background-color:green';
                return "Optional";
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'has_document_template',
        hidden: true,
        text: 'Has Document Template',
        flex: 0.5,
        renderer: function (value, metaData) {
                if(value == 1) {
                    metaData.tdStyle = 'color:white;background-color:green';
                    return "Has Template";
                }
                metaData.tdStyle = 'color:white;background-color:red';
                return "No Template";
                
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'portal_uploadable',
        hidden: true,
        text: 'Portal Uploadable',
        flex: 0.5,
        renderer: function (value, metaData) {
            if(value==1||value===1) {
                return "YES";
            }
            return "NO";
        }
    }
    // {
    //     text: 'Options',
    //     xtype: 'widgetcolumn',
    //     width: 90,
    //     widget: {
    //         width: 75,
    //         textAlign: 'left',
    //         xtype: 'splitbutton',
    //         iconCls: 'x-fa fa-th-list',
    //         ui: 'gray',
    //         menu: {
    //             xtype: 'menu',
    //             items: [{
    //                 text: 'Edit',
    //                 iconCls: 'x-fa fa-edit',
    //                 tooltip: 'Edit Record',
    //                 action: 'edit',
    //                 childXtype: 'docdefinationrequirementfrm',
    //                 winTitle: 'Dcouments requirements Defination',
    //                 winWidth: '40%',
    //                 handler: 'showEditConfigParamWinFrm',
    //                 stores: '[]'
    //             }, {
    //                 text: 'Disable',
    //                 iconCls: 'x-fa fa-trash-o',
    //                 tooltip: 'Delete Record',
    //                 table_name: 'tra_documentupload_requirements',
    //                 storeId: 'docdefinationrequirementstr',
    //                 action_url: 'configurations/softDeleteConfigRecord',
    //                 action: 'soft_delete',
    //                 handler: 'doDeleteConfigWidgetParam'
    //             }, {
    //                 text: 'Delete',
    //                 iconCls: 'x-fa fa-trash',
    //                 tooltip: 'Delete Record',
    //                 table_name: 'tra_documentupload_requirements',
    //                 storeId: 'docdefinationrequirementstr',
    //                 action_url: 'configurations/deleteConfigRecord',
    //                 action: 'actual_delete',
    //                 handler: 'doDeleteConfigWidgetParam',
    //                 // hidden: Admin.global.GlobalVars.checkForProcessVisibility('actual_delete')
    //             }, {
    //                 text: 'Enable',
    //                 iconCls: 'x-fa fa-undo',
    //                 tooltip: 'Enable Record',
    //                 table_name: 'tra_documentupload_requirements',
    //                 storeId: 'docdefinationrequirementstr',
    //                 action_url: 'configurations/undoWorkflowSoftDeletes',
    //                 action: 'enable',
    //                 disabled: true,
    //                 handler: 'doDeleteConfigWidgetParam'
    //             }, {
    //                 text: 'Download Template',
    //                 iconCls: 'x-fa fa-undo',
    //                 tooltip: 'Download Template',
    //                 table_name: 'tra_documentupload_requirements',
    //                 action_url: 'configurations/undoWorkflowSoftDeletes',
    //                 handler: 'downloadDocumentRequirementTemplate'
    //             }
    //             ]
    //         }
    //     }, onWidgetAttach: function (col, widget, rec) {
    //         var is_enabled = rec.get('is_enabled');
    //         if (is_enabled === 0 || is_enabled == 0) {
    //             widget.down('menu menuitem[action=enable]').setDisabled(false);
    //             widget.down('menu menuitem[action=soft_delete]').setDisabled(true);
    //         } else {
    //             widget.down('menu menuitem[action=enable]').setDisabled(true);
    //             widget.down('menu menuitem[action=soft_delete]').setDisabled(false);
    //         }
    //     }
    // }
    ]
});