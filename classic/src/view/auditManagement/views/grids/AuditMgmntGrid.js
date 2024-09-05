Ext.define('Admin.view.auditManagement.views.grids.AuditMgmntGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'AuditMgmntGrid',
    itemId: 'AuditMgmntGrid',
    useArrows: true,
    rootVisible: false,
    multiSelect: false,
    singleExpand: true,
    margin: '0 5 0 0',
    selType: 'cellmodel',
    cls: "dashboard-todo-list",
      autoScroll: true,
      autoHeight: true,
      width: "100%",

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
    tbar: [
       {
                    xtype: 'panel',
                    html: '<h2>Double Click To View Audit Details</h2>'
                },
    {
      xtype: "tbspacer",
      hidden: true,
      width: 100,
    }],
    autoScroll: true,
    listeners: {
        beforerender: {
            fn: 'setGridTreeStore',
            config: {
                storeId: 'docdefinationrequirementstr',
                proxy: {
                    api: {
                        read: 'auditManagement/getAuditManagementDetails'
                    },
                },
            },
            isLoad: true
        },
         beforeLoad: function () {
              var grid = this.up("grid"),
                pnl = grid.up("auditMgmntDashPnl"),
                wrapper = pnl.up("auditManagementDashWrapperPnl"),
                cnt = wrapper.up(),
                store = this.store,
                grid = this.up("grid");
                store.getProxy().extraParams = {
                table_name: "tra_auditsmanager_application",
              };
            },
        itemdblclick: 'onViewAuditApplication'
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

            beforeLoad: function () {
              var grid = this.up("grid"),
                pnl = grid.up("auditMgmntDashPnl"),
                wrapper = pnl.up("auditManagementDashWrapperPnl"),
                cnt = wrapper.up(),
                store = this.store,
                grid = this.up("grid");
                store.getProxy().extraParams = {
                table_name: "tra_auditsmanager_application",
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
        xtype: 'widgetcolumn',
        width: 120,
        widget: {
            width: 120,
            textAlign: 'left',
            xtype: 'button',
            itemId: 'prints',
            ui: 'soft-blue',
            text: 'Audit Report',
            iconCls: 'x-fa fa-certificate',
            handler: 'generateDocumentPermit',
            bind: {
                disabled: '{record.application_status_id == 9}'
                //disabled: '{record.decision_id !== 1}'
            }
        }
    },
        {
        xtype: 'gridcolumn',
        dataIndex: 'tracking_no',
        text: 'ID',
        flex: 1,
        },
        {
        xtype: 'gridcolumn',
        dataIndex: 'audit_reference',
        text: 'Ref.',
        flex: 1,
        },
        {
            xtype: 'gridcolumn',
            dataIndex:'audit_title',
            text: 'Title',
            flex: 1,
        },
        {
            xtype: "gridcolumn",
            text: "Owner",
            flex: 1,
            tdCls: "wrap",
            renderer: function (value, metaData, record) {
                // Concatenate first_name and last_name
                var firstName = record.get("first_name");
                var lastName = record.get("last_name");
                var groupOwner = record.get("group_owner");
                var fullName = firstName + " " + lastName;
                 
                if (fullName && groupOwner) {
                    return fullName + ', ' + groupOwner;
                } else {
                    return fullName || groupOwner;
                } 
            },
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'audit_type_name',
            text: 'Type',
            flex: 1,
        },
        {
        xtype: 'gridcolumn',
        dataIndex: 'application_status',
        text: 'Status',
        flex: 1,
        renderer: function(value, metaData) {//#000000
            metaData.style = 'text-align: center; font-weight: bold;'; 
            if (value === 'In Progress') {
                metaData.style += ' background-color: #0000FF; color: #FFFFFF;'; 
            }else if (value === 'Completed') {
                metaData.style += ' background-color: #00FF00; color: #FFFFFF;'; 
            }else if (value === 'Scheduled') {
                metaData.style += ' background-color: #FFA500; color: #FFFFFF;'; 
            }else if (value === 'closed') {
                metaData.style += ' background-color: #808080; color: #FFFFFF;'; 
            }else if (value === 'Planned') {
                metaData.style += ' background-color: #87CEEB; color: #FFFFFF;'; 
            }
            return value;
            }
        },

        {
            xtype: 'gridcolumn',
            dataIndex: 'findings',
            text: 'Findings',
            flex: 0.5,
            renderer: function(value, metaData) {
            metaData.style = 'text-align: center;font-weight: bold;';
            return value;
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'audit_start_date',
            text: 'Start Date', 
            flex: 1,
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'audit_end_date',
            text: 'End Date', 
            flex: 1,
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